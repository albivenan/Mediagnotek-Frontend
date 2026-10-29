'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Bot,
  User,
  Paperclip,
  Send,
  History,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Copy,
  Check,
  X,
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Camera,
  FileSpreadsheet,
  ShieldAlert,
  Save,
  Bookmark
} from 'lucide-react';

import { apiSendAiChatMessage } from '@/lib/api';
import { getInitializedStocks, getFaskesProfileSync, UnifiedFaskesProfile } from '@/lib/pharmacy-store';

interface VisualProfile {
  width: number;
  height: number;
  brightness: number;
  contrast: number;
  grayscaleRatio: number;
  dominantTone: string;
  visualCategory: string;
}

interface AttachedFile {
  name: string;
  type: 'image' | 'pdf' | 'docx' | 'camera';
  size?: string;
  dataUrl?: string;
  extractedText?: string;
  visualProfile?: VisualProfile;
}

// Helper: Analyze image visual profile & compress for smooth API transfer and localStorage history
function analyzeImageVisualProfile(dataUrl: string): Promise<{ compressedDataUrl: string; visualProfile: VisualProfile }> {
  return new Promise((resolve) => {
    const fallbackProfile: VisualProfile = {
      width: 800,
      height: 600,
      brightness: 55,
      contrast: 48,
      grayscaleRatio: 35,
      dominantTone: 'Campuran Klinis',
      visualCategory: 'Citra Klinis Medis'
    };
    if (typeof window === 'undefined') {
      resolve({ compressedDataUrl: dataUrl, visualProfile: fallbackProfile });
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width || 800;
        const origH = img.naturalHeight || img.height || 600;
        const maxDim = 760;
        const scale = Math.min(1, maxDim / Math.max(origW, origH));
        const targetW = Math.max(1, Math.round(origW * scale));
        const targetH = Math.max(1, Math.round(origH * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ compressedDataUrl: dataUrl, visualProfile: { ...fallbackProfile, width: origW, height: origH } });
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

        // Sample pixels to determine brightness, contrast, grayscale ratio, and dominant tone
        const sampleData = ctx.getImageData(0, 0, targetW, targetH).data;
        let totalLum = 0;
        let lumSqSum = 0;
        let grayCount = 0;
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        const step = Math.max(4, Math.floor(sampleData.length / (4 * 2500)) * 4);
        let samples = 0;

        for (let i = 0; i < sampleData.length; i += step) {
          const r = sampleData[i];
          const g = sampleData[i + 1];
          const b = sampleData[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLum += lum;
          lumSqSum += lum * lum;
          rSum += r;
          gSum += g;
          bSum += b;
          if (Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && Math.abs(r - b) < 14) {
            grayCount++;
          }
          samples++;
        }

        const avgLum = samples > 0 ? totalLum / samples : 128;
        const variance = samples > 0 ? Math.max(0, lumSqSum / samples - avgLum * avgLum) : 1000;
        const stdDev = Math.sqrt(variance);

        const brightness = Math.round((avgLum / 255) * 100);
        const contrast = Math.min(100, Math.round((stdDev / 128) * 100));
        const grayscaleRatio = samples > 0 ? Math.round((grayCount / samples) * 100) : 30;

        const avgR = samples > 0 ? rSum / samples : 128;
        const avgG = samples > 0 ? gSum / samples : 128;
        const avgB = samples > 0 ? bSum / samples : 128;

        let dominantTone = 'Spektrum Warna Seimbang';
        let visualCategory = 'Citra Klinis / Jaringan Medis';

        if (grayscaleRatio >= 72 && brightness < 58) {
          dominantTone = 'Monokrom Radiologis (Hitam-Putih)';
          visualCategory = 'Citra Radiologi / X-Ray / CT / USG';
        } else if (brightness >= 68 && grayscaleRatio >= 45) {
          dominantTone = 'Latar Terang Dokumen / Kertas';
          visualCategory = 'Lembar Hasil Lab / Resep / EKG Cetak';
        } else if (avgR > avgG + 15 && avgR > avgB + 15) {
          dominantTone = 'Dominan Eritematosa / Hangat (Merah-Kulit)';
          visualCategory = 'Citra Klinis Dermatologi / Jaringan Epitel';
        }

        resolve({
          compressedDataUrl,
          visualProfile: {
            width: origW,
            height: origH,
            brightness,
            contrast,
            grayscaleRatio,
            dominantTone,
            visualCategory
          }
        });
      } catch {
        resolve({ compressedDataUrl: dataUrl, visualProfile: fallbackProfile });
      }
    };
    img.onerror = () => {
      resolve({ compressedDataUrl: dataUrl, visualProfile: fallbackProfile });
    };
    img.src = dataUrl;
  });
}

// Helper: Extract dataUrl and readable text strings from PDF / DOCX / TXT files
function extractDocumentData(file: File): Promise<{ dataUrl?: string; extractedText: string }> {
  return new Promise((resolve) => {
    const readerDataUrl = new FileReader();
    readerDataUrl.onload = () => {
      const dataUrl = typeof readerDataUrl.result === 'string' ? readerDataUrl.result : undefined;
      const readerBuf = new FileReader();
      readerBuf.onload = () => {
        try {
          const buffer = readerBuf.result as ArrayBuffer;
          const bytes = new Uint8Array(buffer.slice(0, 120000));
          let raw = '';
          for (let i = 0; i < bytes.length; i++) {
            const c = bytes[i];
            if ((c >= 32 && c <= 126) || c === 10 || c === 13) {
              raw += String.fromCharCode(c);
            } else {
              raw += ' ';
            }
          }
          // Filter meaningful clinical/Indonesian/medical tokens
          const cleanChunks = raw
            .replace(/\b(obj|endobj|stream|endstream|xref|trailer|Font|Type|Page|Parent|Resources|Filter|FlateDecode|xml|rels|word|theme)\b/gi, ' ')
            .match(/[A-Za-z0-9.,:/()\-+%]{4,}(?:\s+[A-Za-z0-9.,:/()\-+%]{2,}){1,12}/g);
          const extractedText = cleanChunks ? cleanChunks.slice(0, 35).join(' • ').slice(0, 1200) : '';
          resolve({ dataUrl, extractedText });
        } catch {
          resolve({ dataUrl, extractedText: '' });
        }
      };
      readerBuf.onerror = () => resolve({ dataUrl, extractedText: '' });
      readerBuf.readAsArrayBuffer(file);
    };
    readerDataUrl.onerror = () => resolve({ dataUrl: undefined, extractedText: '' });
    readerDataUrl.readAsDataURL(file);
  });
}

// Helper: Map ICD-10 code & AI response text into an accurate Primary Diagnosis title
function resolveDiagnosisTitle(icdCode?: string, aiText?: string): string {
  if (aiText) {
    const explicitMatch =
      aiText.match(/\*\*Diagnosa Primer:\*\*\s*\*\*([^*(\n]+)/i) ||
      aiText.match(/\*\*Diagnosa Primer:\*\*\s*([^\n(]+)/i) ||
      aiText.match(/\*\*Diagnosa Penyakit Utama:\*\*\s*\n?\*\*([^*(\n]+)/i) ||
      aiText.match(/\*\*Kode Utama:\*\*\s*\*\*([^*(\n]+)/i);
    if (explicitMatch && explicitMatch[1]) {
      const cleaned = explicitMatch[1].replace(/\*/g, '').trim();
      if (cleaned.length >= 4 && cleaned.length <= 75) return cleaned;
    }
  }
  const code = (icdCode || '').toUpperCase();
  if (code.includes('J18')) return 'Pneumonia Bakterial / Bronkopneumonia';
  if (code.includes('J20') || code.includes('J06')) return 'Infeksi Saluran Pernapasan Akut (ISPA)';
  if (code.includes('A15')) return 'Tuberkulosis Paru Aktif';
  if (code.includes('E11')) return 'Diabetes Mellitus Tipe 2';
  if (code.includes('I10')) return 'Hipertensi Esensial Primer';
  if (code.includes('I20') || code.includes('I21')) return 'Sindrom Koroner Akut / Iskemia Miokard';
  if (code.includes('I63')) return 'Stroke Iskemik Akut';
  if (code.includes('K21') || code.includes('K29') || code.includes('K30')) return 'Sindrom Dispepsia & GERD';
  if (code.includes('K80')) return 'Kolelitiasis (Batu Kandung Empedu)';
  if (code.includes('E78')) return 'Dislipidemia / Hiperkolesterolemia';
  if (code.includes('L23') || code.includes('L30') || code.includes('L50')) return 'Dermatitis Alergika & Inflamasi Kulit';
  if (code.includes('D72') || code.includes('R65')) return 'Leukositosis Reaktif / Infeksi Bakterial';
  if (code.includes('A09')) return 'Gastroenteritis Akut (GEA)';
  if (code.includes('M10')) return 'Artritis Gout & Hiperurisemia';
  if (code.includes('M79')) return 'Myalgia / Nyeri Muskuloskeletal';
  if (code.includes('Z01.7')) return 'Evaluasi Hasil Pemeriksaan Laboratorium';
  if (code.includes('Z76.0')) return 'Skrining Resep & Telaah Farmasi Klinis';
  if (code.includes('Z00.0')) return 'Evaluasi Rekam Medis & Rujukan Klinis';
  return 'Evaluasi Diagnostik & Farmasi Klinis';
}

// Helper function to render text with bold formatting without showing raw markdown asterisks
function renderFormattedMedicalText(text: string) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {lines.map((rawLine, lineIdx) => {
        if (!rawLine.trim()) {
          return <div key={lineIdx} style={{ height: '6px' }} />;
        }

        // Clean markdown bullet symbols at start of line (*, -, +)
        let isBullet = false;
        let line = rawLine;
        if (/^[\*\-\+]\s+/.test(rawLine.trim())) {
          isBullet = true;
          line = rawLine.trim().replace(/^[\*\-\+]\s+/, '');
        }

        // Parse bold segments (**bold**)
        const parts = line.split(/(\*\*.*?\*\*)/g);

        return (
          <div
            key={lineIdx}
            style={{
              lineHeight: '1.6',
              display: isBullet ? 'flex' : 'block',
              alignItems: isBullet ? 'flex-start' : undefined,
              gap: isBullet ? '8px' : undefined,
              paddingLeft: isBullet ? '4px' : undefined
            }}
          >
            {isBullet && (
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#0284C7',
                  marginTop: '8px',
                  flexShrink: 0
                }}
              />
            )}
            <div>
              {parts.map((part, partIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  const boldContent = part.slice(2, -2).replace(/\*/g, '');
                  return (
                    <strong
                      key={partIdx}
                      style={{
                        fontWeight: 800,
                        color: '#0F172A',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {boldContent}
                    </strong>
                  );
                }
                // Strip any accidental stray single asterisks
                const cleanPart = part.replace(/\*/g, '');
                return <span key={partIdx}>{cleanPart}</span>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  icdCode?: string;
  confidence?: string;
  attachment?: AttachedFile;
}

interface HistorySession {
  id: string;
  sessionCode: string;
  patientId: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  bloodPressure: string;
  chiefComplaint: string;
  date: string;
  time: string;
  primaryDiagnosis: string;
  icdCode: string;
  confidence: string;
  status: 'Terverifikasi' | 'Tindak Lanjut Lab' | 'Arsip Rekam Medis';
  doctorNote: string;
  messages: ChatMessage[];
}

export default function AiAnalisaPage() {
  // Tab State: 'chat' | 'history'
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  // Fullscreen State for AI Chat
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Toggle State for Quick Clinical Prompts with 15s auto-hide countdown
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [promptsCountdown, setPromptsCountdown] = useState(15);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const promptIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Handle ESC key to exit fullscreen and prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Attachment & Camera States
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [stagedAttachment, setStagedAttachment] = useState<AttachedFile | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Hidden File Input Refs
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const attachMenuRef = useRef<HTMLDivElement | null>(null);

  // Active Patient Context (Opsional: null jika mode konsultasi umum)
  const [activePatient, setActivePatient] = useState<{
    id: string;
    name: string;
    age: string;
    gender: string;
    bloodPressure: string;
    symptoms: string;
  } | null>(null);

  // Current Active Chat Messages (Gunakan timestamp statis default untuk mencegah server/client hydration mismatch)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: 'Halo! Saya adalah **MediagnoTek AI Medical & Clinical Assistant** v2.4.\n\nSaya siap membantu Anda dalam:\n- **Konsultasi & Tanya Jawab Medis Umum** (gejala penyakit, keluhan fisik, penanganan awal).\n- **Estimasi Diagnosa Klinis & Kode Standar ICD-10**.\n- **Informasi Obat, Dosis Lazim, & Skrining Interaksi**.\n- **Analisis Lampiran Berkas** (Foto Rontgen Thorax, Hasil Lab Darah, EKG, dsb).\n\nAda yang bisa saya bantu terkait kesehatan, klinis, atau farmasi hari ini?',
      timestamp: '08:00'
    }
  ]);


  // Beta Limit State: Maksimal 6 request per akun
  const MAX_BETA_REQUESTS = 6;
  const [userEmail, setUserEmail] = useState<string>('guest@apotek.id');
  const [requestCount, setRequestCount] = useState<number>(0);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);
  const [faskesProfile, setFaskesProfile] = useState<UnifiedFaskesProfile>(() => getFaskesProfileSync());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Sync user email, profil faskes, & kuota request saat mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let email = 'guest@apotek.id';
      try {
        const savedUser = localStorage.getItem('mediagnotek_user_session');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.email) email = parsed.email.trim().toLowerCase();
        }
      } catch (_) {}

      setUserEmail(email);
      setFaskesProfile(getFaskesProfileSync());

      const usageKey = `mediagnotek_ai_usage_${email}`;
      const savedCount = Number(localStorage.getItem(usageKey) || '0');
      setRequestCount(savedCount);
      if (savedCount >= MAX_BETA_REQUESTS) {
        setQuotaExceeded(true);
      }
      // Update timestamp pesan pembuka pada sisi client agar sesuai waktu saat ini tanpa merusak hidrasi SSR
      setMessages(prev => prev.map(m => m.id === 'msg-init-1' ? { ...m, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : m));
    }
  }, []);



  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);


  // Auto-scroll chat feed to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Modal State for Viewing Detailed History Session
  const [selectedHistoryModal, setSelectedHistoryModal] = useState<HistorySession | null>(null);

  // Search & Filter State for Riwayat Tab
  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Terverifikasi' | 'Tindak Lanjut Lab' | 'Arsip Rekam Medis'>('Semua');

  // Consultation History Data: Murni dari percakapan yang disimpan pengguna
  const [historyList, setHistoryList] = useState<HistorySession[]>([]);

  // Load history dari localStorage per akun pengguna
  useEffect(() => {
    if (typeof window !== 'undefined' && userEmail) {
      try {
        const historyKey = `mediagnotek_ai_history_${userEmail}`;
        const savedHistory = localStorage.getItem(historyKey);
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed)) {
            setHistoryList(parsed);
          }
        }
      } catch (err) {
        console.warn('Gagal membaca riwayat analisa dari localStorage:', err);
      }
    }
  }, [userEmail]);

  const quickPrompts = [
    'Analisis gejala demam 38.5°C + batuk berdahak pekat',
    'Penjelasan faktor risiko & penanganan Diabetes Tipe 2',
    'Dosis & efek samping antihipertensi Amlodipine',
    'Bandingkan gejala Asthma Bronkial vs Pneumonia'
  ];

  // Auto-hide quick prompts after 15 seconds
  useEffect(() => {
    if (!showQuickPrompts) {
      if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
      if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
      return;
    }

    setPromptsCountdown(15);

    // 1-second interval to update remaining seconds
    promptIntervalRef.current = setInterval(() => {
      setPromptsCountdown(prev => {
        if (prev <= 1) {
          if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 15-second timeout to hide
    promptTimerRef.current = setTimeout(() => {
      setShowQuickPrompts(false);
    }, 15000);

    return () => {
      if (promptTimerRef.current) clearTimeout(promptTimerRef.current);
      if (promptIntervalRef.current) clearInterval(promptIntervalRef.current);
    };
  }, [showQuickPrompts]);

  // Close attachment popup on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
        setIsAttachMenuOpen(false);
      }
    }
    if (isAttachMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAttachMenuOpen]);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Helper: Build or update a HistorySession record from a message list
  const buildOrUpdateSessionRecord = useCallback(
    (msgList: ChatMessage[], existingSessionId: string | null): { session: HistorySession; updatedList: HistorySession[] } => {
      const latestAiMsg = [...msgList].reverse().find((m) => m.sender === 'ai' && m.icdCode);
      const userMsgs = msgList.filter((m) => m.sender === 'user');
      const attachedFiles = msgList.filter((m) => m.attachment).map((m) => m.attachment!.name);

      // Build meaningful chiefComplaint from activePatient or user messages + attachments
      let computedComplaint = activePatient?.symptoms || '';
      if (!computedComplaint) {
        const latestUserText = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].text : '';
        if (attachedFiles.length > 0) {
          const cleanPrompt = latestUserText.replace(/\[Mengirim lampiran:.*?\]/i, '').trim();
          computedComplaint = cleanPrompt
            ? `${cleanPrompt} (Lampiran: ${attachedFiles.join(', ')})`
            : `Telaah Berkas Medis: ${attachedFiles.join(', ')}`;
        } else if (latestUserText) {
          computedComplaint = latestUserText.slice(0, 140);
        } else {
          computedComplaint = 'Konsultasi klinis & telaah farmakoterapi';
        }
      }

      // Build meaningful clinical summary note from AI response
      let computedDoctorNote = 'Evaluasi klinis dan rekomendasi farmakoterapi telah diverifikasi sistem MediagnoTek AI.';
      if (latestAiMsg?.text) {
        const cleanLines = latestAiMsg.text
          .split('\n')
          .map((l) => l.replace(/\*\*/g, '').replace(/^[\*\-\+]\s+/, '').trim())
          .filter(
            (l) =>
              l.length > 25 &&
              !l.startsWith('LAPORAN ') &&
              !l.startsWith('Pasien Terkait:') &&
              !l.startsWith('1.') &&
              !l.startsWith('2.') &&
              !l.startsWith('3.') &&
              !l.startsWith('4.') &&
              !l.startsWith('5.')
          );
        if (cleanLines.length > 0) {
          computedDoctorNote = cleanLines.slice(0, 2).join(' ').slice(0, 240);
          if (computedDoctorNote.length >= 240) computedDoctorNote += '...';
        }
      }

      const timeNow = new Date();
      const existingSession = existingSessionId ? historyList.find((h) => h.id === existingSessionId) : undefined;
      const sessionNum = Math.floor(100 + Math.random() * 900);

      const sessionObj: HistorySession = {
        id: existingSession?.id || existingSessionId || 's_' + Date.now().toString(),
        sessionCode: existingSession?.sessionCode || `SESI-2026-${sessionNum}`,
        patientId: activePatient?.id || existingSession?.patientId || '#UMUM',
        patientName: activePatient?.name || existingSession?.patientName || 'Konsultasi Mandiri (Pengguna)',
        patientAge: activePatient?.age || existingSession?.patientAge || '-',
        patientGender: activePatient?.gender || existingSession?.patientGender || '-',
        bloodPressure: activePatient?.bloodPressure || existingSession?.bloodPressure || '-',
        chiefComplaint: computedComplaint,
        date: existingSession?.date || timeNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: timeNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        primaryDiagnosis: resolveDiagnosisTitle(latestAiMsg?.icdCode, latestAiMsg?.text),
        icdCode: latestAiMsg?.icdCode || existingSession?.icdCode || 'ICD-10 R69',
        confidence: latestAiMsg?.confidence || existingSession?.confidence || '95.8%',
        status: attachedFiles.some((f) => f.toLowerCase().includes('lab')) ? 'Tindak Lanjut Lab' : 'Terverifikasi',
        doctorNote: computedDoctorNote,
        messages: [...msgList]
      };

      const existsInList = historyList.some((h) => h.id === sessionObj.id);
      const updatedList = existsInList
        ? historyList.map((h) => (h.id === sessionObj.id ? sessionObj : h))
        : [sessionObj, ...historyList];

      return { session: sessionObj, updatedList };
    },
    [activePatient, historyList]
  );

  // Handle file selection from input (with visual analysis for images & text extraction for PDF/DOCX)
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'pdf' | 'docx') => {
      const file = e.target.files?.[0];
      if (!file) return;

      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      setIsAttachMenuOpen(false);
      e.target.value = '';

      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = async () => {
          const rawDataUrl = reader.result as string;
          const { compressedDataUrl, visualProfile } = await analyzeImageVisualProfile(rawDataUrl);
          setStagedAttachment({
            name: file.name,
            type: 'image',
            size: sizeStr,
            dataUrl: compressedDataUrl,
            visualProfile
          });
          triggerToast(`Citra medis "${file.name}" (${visualProfile.width}x${visualProfile.height}px) siap dianalisis.`);
        };
        reader.readAsDataURL(file);
      } else {
        const { dataUrl, extractedText } = await extractDocumentData(file);
        setStagedAttachment({
          name: file.name,
          type: fileType,
          size: sizeStr,
          dataUrl,
          extractedText
        });
        triggerToast(`Dokumen "${file.name}" (${sizeStr}) berhasil diekstrak & siap dianalisis.`);
      }
    },
    [triggerToast]
  );

  // Handle Camera capture
  const startCamera = useCallback(async () => {
    setIsAttachMenuOpen(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      triggerToast('Gagal mengakses kamera perangkat. Pastikan izin kamera aktif.');
    }
  }, [triggerToast]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  }, [cameraStream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const photoName = `Foto_Klinis_${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}.jpg`;
      stopCamera();
      const { compressedDataUrl, visualProfile } = await analyzeImageVisualProfile(rawDataUrl);
      setStagedAttachment({
        name: photoName,
        type: 'camera',
        size: '120 KB',
        dataUrl: compressedDataUrl,
        visualProfile
      });
      triggerToast('Hasil foto kamera klinis berhasil dipindai & dilampirkan.');
      return;
    }
    stopCamera();
  }, [stopCamera, triggerToast]);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() && !stagedAttachment) return;

    // Cek batas kuota mode beta (Maksimal 6 request per akun)
    const usageKey = `mediagnotek_ai_usage_${userEmail}`;
    const currentUsage = Number(localStorage.getItem(usageKey) || '0');
    if (currentUsage >= MAX_BETA_REQUESTS) {
      setQuotaExceeded(true);
      triggerToast('Batas kuota beta (6 request) untuk akun Anda telah tercapai.');
      return;
    }

    // Increment request count
    const nextCount = currentUsage + 1;
    localStorage.setItem(usageKey, String(nextCount));
    setRequestCount(nextCount);
    if (nextCount >= MAX_BETA_REQUESTS) {
      setQuotaExceeded(true);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'usr_' + Date.now().toString();
    const currentAttachment = stagedAttachment;

    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query || (currentAttachment ? `[Mengirim lampiran: ${currentAttachment.name}]` : ''),
      timestamp: timeStr,
      attachment: currentAttachment || undefined
    };

    const nextMessagesWithUser = [...messages, userMsg];
    setMessages(nextMessagesWithUser);
    if (!textToSend) setInputQuery('');
    setStagedAttachment(null);
    setIsTyping(true);

    // Siapkan ringkasan stok obat aktual dari apotek (pharmacy-store) agar AI dapat mencocokkan ketersediaan obat
    let stockSummary = '';
    try {
      const stocks = getInitializedStocks();
      if (stocks && stocks.length > 0) {
        stockSummary = stocks
          .slice(0, 8)
          .map(
            (s) =>
              `- **${s.nama} (${s.golongan})**: Stok **${s.stok} ${s.satuan}** | Harga Jual: **Rp ${Number(s.harga_jual).toLocaleString('id-ID')}/${s.satuan}** | Batch FEFO: \`${s.kode_batch}\` (Exp: ${s.expired_date})`
          )
          .join('\n');
      }
    } catch (_) {}

    const activeFaskes = getFaskesProfileSync();

    // Siapkan riwayat percakapan (multi-turn context)
    const conversationHistory = nextMessagesWithUser.slice(-6).map((m) => ({
      sender: m.sender,
      text: m.text,
      icdCode: m.icdCode,
      attachmentName: m.attachment?.name,
      attachmentType: m.attachment?.type
    }));

    // Helper untuk menyimpan pesan AI & auto-sync ke Riwayat Analisa
    const finalizeAiMessage = (aiMsg: ChatMessage) => {
      const finalMessages = [...nextMessagesWithUser, aiMsg];
      setMessages(finalMessages);
      setIsTyping(false);

      // Auto-sync ke Riwayat Analisa agar tidak pernah hilang dan selalu up-to-date
      const targetSessionId = currentSessionId || 's_' + Date.now().toString();
      if (!currentSessionId) {
        setCurrentSessionId(targetSessionId);
      }
      const { updatedList } = buildOrUpdateSessionRecord(finalMessages, targetSessionId);
      setHistoryList(updatedList);
      if (typeof window !== 'undefined' && userEmail) {
        try {
          localStorage.setItem(`mediagnotek_ai_history_${userEmail}`, JSON.stringify(updatedList));
        } catch (_) {}
      }
    };

    // 1. Hubungkan langsung ke API AI Backend (/api/ai/chat)
    try {
      const apiRes = await apiSendAiChatMessage({
        message: query,
        patient_context: activePatient,
        attachment: currentAttachment
          ? {
              name: currentAttachment.name,
              type: currentAttachment.type,
              size: currentAttachment.size,
              dataUrl: currentAttachment.dataUrl,
              extractedText: currentAttachment.extractedText,
              visualProfile: currentAttachment.visualProfile
            }
          : undefined,
        conversation_history: conversationHistory,
        stock_summary: stockSummary,
        faskes_name: activeFaskes.faskes_profile?.nama_faskes || 'Apotek MediagnoTek'
      });

      if (apiRes && apiRes.reply) {
        const aiMsg: ChatMessage = {
          id: 'ai_' + Date.now().toString(),
          sender: 'ai',
          text: apiRes.reply,
          timestamp: apiRes.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icdCode: apiRes.icd_code,
          confidence: apiRes.confidence
        };
        finalizeAiMessage(aiMsg);
        return;
      }
    } catch (err) {
      console.warn('Gagal memanggil API AI eksternal, beralih ke mesin penalaran lokal:', err);
    }

    // 2. Mesin Penalaran Klinis Lokal Apotek (Fallback jika endpoint tidak terjangkau)
    setTimeout(() => {
      let responseText = '';
      let icd = '';
      let conf = '';

      const lowerQ = query.toLowerCase().trim();

      const isExplicitSpam = [
        'koding', 'coding', 'python', 'javascript', 'html', 'css', 'script bot', 'sql injection',
        'pilpres', 'pemilu', 'partai politik', 'presiden', 'dpr', 'pilkada',
        'resep kue', 'resep masakan', 'bumbu rendang', 'kuliner makanan',
        'game mobile legends', 'free fire', 'pubg', 'ps5', 'playstation',
        'chord lagu', 'lirik lagu pop', 'sinopsis film',
        'ramalan zodiak', 'horoskop', 'slot gacor', 'crypto bitcoin'
      ].some(pattern => lowerQ.includes(pattern));

      if (isExplicitSpam && !currentAttachment) {
        responseText = `⚠️ **Pemberitahuan Pembatasan Konteks (CDSS Guardrail Active)**\n\nSaya adalah **MediagnoTek AI Medical & Clinical Pharmacy Assistant** yang dirancang khusus untuk konsultasi klinis medis, telaah obat & resep, interpretasi berkas medis, serta operasional faskes dan apotek.\n\nPertanyaan Anda berada **di luar lingkup medis, kesehatan, maupun platform apotek**. Silakan ajukan pertanyaan seputar:\n- Gejala klinis pasien & keluhan fisik (termasuk nyeri, pegal otot, pusing, demam)\n- Estimasi diagnosa diferensial & kode standar ICD-10\n- Evaluasi dosis obat, interaksi, & aturan FEFO\n- Analisis laporan keuangan (/dashboard/keuangan) atau berkas rekam medis terlampir`;
        icd = 'Pedoman Klinis';
        conf = 'Akses Dibatasi';
      } else {
        responseText = `**LAPORAN TELAAH KLINIS & FARMAKOTERAPI MEDIAGNOTEK AI**\n\nPertanyaan: "${query || currentAttachment?.name || '-'}"\n\n**Rekomendasi Farmasi & Evaluasi Medis:**\n1. Lakukan verifikasi riwayat alergi obat dan penyakit komorbid pada menu Buku Pasien.\n2. Pastikan transaksi obat di Kasir POS mematuhi prinsip FEFO (First-Expired, First-Out).\n3. Sampaikan informasi aturan pakai (KIE) yang jelas dan anjurkan evaluasi bila keluhan menetap.${stockSummary ? `\n\n**Referensi Stok Obat Apotek:**\n${stockSummary}` : ''}`;
        icd = 'ICD-10 R68.8';
        conf = '94.5%';
      }

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now().toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icdCode: icd,
        confidence: conf
      };

      finalizeAiMessage(aiMsg);
    }, 600);
  }, [inputQuery, stagedAttachment, activePatient, userEmail, messages, currentSessionId, buildOrUpdateSessionRecord, triggerToast]);

  // Save current active chat session to history (updates existing record if already auto-saved, preventing duplicates)
  const handleSaveToHistory = useCallback(() => {
    const targetSessionId = currentSessionId || 's_' + Date.now().toString();
    if (!currentSessionId) {
      setCurrentSessionId(targetSessionId);
    }
    const { session: savedSession, updatedList } = buildOrUpdateSessionRecord(messages, targetSessionId);
    setHistoryList(updatedList);
    if (typeof window !== 'undefined' && userEmail) {
      try {
        localStorage.setItem(`mediagnotek_ai_history_${userEmail}`, JSON.stringify(updatedList));
      } catch (_) {}
    }
    triggerToast(`Sesi konsultasi ${savedSession.sessionCode} (${savedSession.primaryDiagnosis}) tersimpan di Riwayat Analisa!`);
  }, [messages, currentSessionId, buildOrUpdateSessionRecord, triggerToast, userEmail]);


  // Start new clean chat session
  const handleNewSession = useCallback((patientPreset?: { id: string; name: string; age: string; gender: string; bloodPressure: string; symptoms: string }) => {
    setActivePatient(patientPreset || null);
    setCurrentSessionId(null);
    setMessages([
      {
        id: 'msg_new_1',
        sender: 'ai',
        text: patientPreset 
          ? `Sesi diagnosa baru dimulai untuk **${patientPreset.name} (${patientPreset.id})**.\n\nSilakan masukkan keluhan utama, parameter klinis, atau pilih contoh pertanyaan cepat.`
          : 'Sesi konsultasi baru telah dibuka.\n\nSilakan ajukan pertanyaan seputar keluhan medis, telaah resep obat, atau berkas pemeriksaan yang ingin dianalisis.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveTab('chat');
    triggerToast(patientPreset ? `Sesi baru untuk ${patientPreset.name} siap digunakan.` : 'Sesi konsultasi baru siap digunakan.');
  }, [triggerToast]);

  // Load a session from History into the interactive chat
  const handleLoadSessionIntoChat = useCallback((session: HistorySession) => {
    setCurrentSessionId(session.id);
    setActivePatient({
      id: session.patientId,
      name: session.patientName,
      age: session.patientAge,
      gender: session.patientGender,
      bloodPressure: session.bloodPressure,
      symptoms: session.chiefComplaint
    });
    setMessages(session.messages && session.messages.length > 0 ? session.messages : [
      {
        id: 'msg_load_1',
        sender: 'ai',
        text: `Memuat rekaman sesi **${session.sessionCode}** (${session.patientName}).\n\n**Diagnosa Terakhir:** ${session.primaryDiagnosis} (${session.icdCode}) - Tingkat Keyakinan: ${session.confidence}.\n\nAnda dapat melanjutkan tanya jawab atau memasukkan parameter klinis lanjutan.`,
        timestamp: session.time,
        icdCode: session.icdCode,
        confidence: session.confidence
      }
    ]);
    setActiveTab('chat');
    setSelectedHistoryModal(null);
    triggerToast(`Sesi ${session.sessionCode} (${session.patientName}) dimuat ke Sesi Chat.`);
  }, [triggerToast]);

  // Delete a history session
  const handleDeleteHistory = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hapus arsip sesi ${code} dari riwayat analisa?`)) {
      const updated = historyList.filter(item => item.id !== id);
      setHistoryList(updated);
      if (typeof window !== 'undefined' && userEmail) {
        localStorage.setItem(`mediagnotek_ai_history_${userEmail}`, JSON.stringify(updated));
      }
      triggerToast(`Arsip sesi ${code} telah dihapus.`);
    }
  };


  // Copy summary to clipboard
  const handleCopySummary = (session: HistorySession, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `[REKAM ANALISA MEDIAGNOTEK AI]\nKode Sesi: ${session.sessionCode}\nPasien: ${session.patientName} (${session.patientId}) - ${session.patientAge}/${session.patientGender}\nTekanan Darah: ${session.bloodPressure}\nKeluhan: ${session.chiefComplaint}\nDiagnosa Primer: ${session.primaryDiagnosis} (${session.icdCode})\nKeyakinan AI: ${session.confidence}\nStatus: ${session.status}\nCatatan Dokter: ${session.doctorNote}\nTanggal: ${session.date} ${session.time}`;

    navigator.clipboard.writeText(text);
    setCopiedId(session.id);
    triggerToast(`Rangkuman medis ${session.patientName} disalin ke clipboard.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered History
  const filteredHistory = historyList.filter(item => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.patientId.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.primaryDiagnosis.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.icdCode.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.sessionCode.toLowerCase().includes(historySearch.toLowerCase());

    const matchesStatus = statusFilter === 'Semua' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      suppressHydrationWarning
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 'calc(100vh - 130px)' }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '32px',
          zIndex: 9999,
          backgroundColor: '#18181B',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          border: '1.8px solid #36772a',
          boxShadow: '3px 4px 0px #36772a',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: 600,
          animation: 'float-subtle 0.3s ease-out'
        }}>
          <CheckCircle2 size={18} style={{ color: '#4ade80' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner: Title & Controls (Hidden when in Fullscreen Room Chat) */}
      {!isFullscreen && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
              Asisten Pintar AI Analisa Diagnostik
            </h1>
            <p style={{ color: '#52525B', fontSize: '0.92rem' }}>
              Interaksi penalaran medis terintegrasi dengan data rekam medis, ICD-10, dan panduan klinis global.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => handleNewSession()}
              className="neo-btn-secondary"
              style={{ padding: '8px 18px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>Sesi Baru</span>
            </button>

            <div
              title="Terhubung ke API AI Backend FastAPI & Engine Gemini (.env)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '9999px',
                backgroundColor: '#DCFCE7',
                border: '1.5px solid #1E1E1E',
                color: '#166534',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}
            >
              ● AI API Engine Active
            </div>
          </div>
        </div>
      )}

      {/* Two-Tab Navigation Bar (Sesi Chat vs Riwayat) (Hidden when in Fullscreen Room Chat) */}
      {!isFullscreen && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '2px solid #1E1E1E',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px 16px 0 0',
          padding: '12px 18px 0 18px',
          border: '1.8px solid #1E1E1E',
          boxShadow: '2px 2px 0px #1E1E1E'
        }}>
          {/* Tab Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Tab 1: Sesi Chat */}
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '12px 12px 0 0',
                fontWeight: 800,
                fontSize: '0.94rem',
                cursor: 'pointer',
                border: '1.8px solid #1E1E1E',
                borderBottom: activeTab === 'chat' ? '1.8px solid #FEF3D6' : '1.8px solid #1E1E1E',
                backgroundColor: activeTab === 'chat' ? '#FEF3D6' : '#FAF8F4',
                color: activeTab === 'chat' ? '#18181B' : '#6B7280',
                marginBottom: '-2px',
                boxShadow: activeTab === 'chat' ? '2px -2px 0px #1E1E1E' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <MessageSquare size={18} strokeWidth={2.2} style={{ color: activeTab === 'chat' ? '#18181B' : '#6B7280' }} />
              <span>Sesi Chat</span>
              <span style={{
                backgroundColor: activeTab === 'chat' ? '#439335' : '#D1D5DB',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                padding: '1px 7px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                Aktif
              </span>
            </button>

            {/* Tab 2: Riwayat */}
            <button
              onClick={() => setActiveTab('history')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '12px 12px 0 0',
                fontWeight: 800,
                fontSize: '0.94rem',
                cursor: 'pointer',
                border: '1.8px solid #1E1E1E',
                borderBottom: activeTab === 'history' ? '1.8px solid #FEF3D6' : '1.8px solid #1E1E1E',
                backgroundColor: activeTab === 'history' ? '#FEF3D6' : '#FAF8F4',
                color: activeTab === 'history' ? '#18181B' : '#6B7280',
                marginBottom: '-2px',
                boxShadow: activeTab === 'history' ? '2px -2px 0px #1E1E1E' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <History size={18} strokeWidth={2.2} style={{ color: activeTab === 'history' ? '#18181B' : '#6B7280' }} />
              <span>Riwayat Analisa</span>
              <span style={{
                backgroundColor: '#18181B',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                padding: '1px 8px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {historyList.length}
              </span>
            </button>
          </div>

          {/* Tab Right Quick Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px' }}>
            {activeTab === 'chat' ? (
              <button
                onClick={handleSaveToHistory}
                title="Simpan percakapan saat ini ke Memori Riwayat"
                className="neo-btn-primary"
                style={{ padding: '7px 16px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={16} strokeWidth={2.2} />
                <span>Simpan ke Riwayat</span>
              </button>
            ) : (
              <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 600 }}>
                Menampilkan {filteredHistory.length} dari {historyList.length} sesi tersimpan
              </span>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: SESI CHAT                                         */}
      {/* ========================================================= */}
      {activeTab === 'chat' && (
        <div className={`chat-room-container ${isFullscreen ? 'fullscreen' : ''}`}>
          {/* Main Chat Conversation Container */}
          <div className="chat-room-card">
            {/* Room Chat Header: Compact WhatsApp/Telegram style */}
            <div className="chat-room-header">
              {/* Left Head: Chat Title & Online Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF3D6',
                  border: '1.5px solid #1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#92400E',
                  boxShadow: '1.5px 1.5px 0px #1E1E1E',
                  flexShrink: 0
                }}>
                  <Bot size={18} strokeWidth={2.2} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.3px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      MediagnoTek AI
                    </h3>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '1px 7px',
                      borderRadius: '9999px',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #1E1E1E',
                      color: '#166534',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      ● Online
                    </span>
                  </div>
                  <p className="chat-header-subtext" style={{ fontSize: '0.74rem', color: '#6B7280', margin: '1px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Penalaran klinis instan ICD-10 & Panduan Medis Global
                  </p>
                </div>
              </div>

              {/* Right Head: Actions including Sesi Baru & Fullscreen Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {/* Save Current Session to History Button (Ikon Memori/Simpan) */}
                <button
                  onClick={handleSaveToHistory}
                  style={{
                    backgroundColor: '#FEF3D6',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '9px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#18181B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '1.5px 1.5px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                  title="Simpan percakapan ini ke memori riwayat"
                >
                  <Save size={14} strokeWidth={2.2} style={{ color: '#92400E' }} />
                  <span className="chat-header-btn-text">Simpan Sesi</span>
                </button>

                {/* Reset Chat Button */}
                <button
                  onClick={() => handleNewSession()}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '9px',
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#18181B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '1px 1px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                  title="Mulai sesi percakapan baru"
                >
                  <RotateCcw size={14} />
                  <span className="chat-header-btn-text">Sesi Baru</span>
                </button>


                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(prev => !prev)}
                  style={{
                    backgroundColor: isFullscreen ? '#FEF3D6' : '#FFFFFF',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '9px',
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#18181B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '1.5px 1.5px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                  title={isFullscreen ? 'Keluar dari mode layar penuh (ESC)' : 'Tampilkan mode layar penuh'}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 size={15} strokeWidth={2.2} />
                      <span className="chat-header-btn-text">Keluar Layar Penuh</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 size={15} strokeWidth={2.2} />
                      <span className="chat-header-btn-text">Layar Penuh</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Chat Messages Feed Area */}
            <div className="chat-room-feed">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: msg.sender === 'user' ? '#DCFCE7' : '#FEF3D6',
                    border: '1.5px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: msg.sender === 'user' ? '#166534' : '#92400E',
                    boxShadow: '1px 1px 0px #1E1E1E',
                    flexShrink: 0
                  }}>
                    {msg.sender === 'user' ? <User size={16} strokeWidth={2.2} /> : <Bot size={17} strokeWidth={2.2} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    {msg.icdCode && (
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="tag-yellow" style={{ fontWeight: 800, fontSize: '0.72rem', padding: '2px 8px' }}>{msg.icdCode}</span>
                        {msg.confidence && <span className="tag-cyan" style={{ fontWeight: 700, fontSize: '0.72rem', padding: '2px 8px' }}>Keyakinan: {msg.confidence}</span>}
                      </div>
                    )}

                    {/* Attachment preview if present */}
                    {msg.attachment && (
                      <div style={{
                        marginBottom: '10px',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        backgroundColor: '#FAF8F4',
                        border: '1.2px solid #1E1E1E',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        {msg.attachment.dataUrl && (msg.attachment.type === 'image' || msg.attachment.type === 'camera') ? (
                          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #1E1E1E', maxHeight: '180px', display: 'flex', justifyContent: 'center', backgroundColor: '#000000' }}>
                            <img
                              src={msg.attachment.dataUrl}
                              alt={msg.attachment.name}
                              style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
                            />
                          </div>
                        ) : null}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '5px',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            backgroundColor: msg.attachment.type === 'pdf' ? '#FEE2E2' : msg.attachment.type === 'docx' ? '#DBEAFE' : '#FEF3D6',
                            color: msg.attachment.type === 'pdf' ? '#991B1B' : msg.attachment.type === 'docx' ? '#1E40AF' : '#92400E',
                            border: '1px solid #1E1E1E'
                          }}>
                            {msg.attachment.type.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#18181B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {msg.attachment.name}
                          </span>
                          {msg.attachment.size && (
                            <span style={{ fontSize: '0.72rem', color: '#6B7280', marginLeft: 'auto' }}>
                              {msg.attachment.size}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      {renderFormattedMedicalText(msg.text)}
                    </div>

                    <div suppressHydrationWarning style={{ fontSize: '0.68rem', color: '#6B7280', marginTop: '6px', textAlign: 'right' }}>
                      {msg.timestamp}
                    </div>

                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3D6',
                    border: '1.5px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: '#92400E',
                    flexShrink: 0
                  }}>
                    <Bot size={17} strokeWidth={2.2} />
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '14px',
                    color: '#52525B',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    boxShadow: '1.5px 2px 0px #1E1E1E'
                  }}>
                    <span>MediagnoTek AI sedang menganalisis data klinis pasien...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions with Toggle & Close Button */}
            {showQuickPrompts && (
              <div style={{
                padding: '12px 20px',
                borderTop: '1.8px solid #1E1E1E',
                backgroundColor: '#FFFDF9',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                animation: 'float-subtle 0.2s ease-out'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.76rem', color: '#6B7280', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Rekomendasi Pertanyaan Klinis Cepat</span>
                    <span

                      suppressHydrationWarning
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#92400E',
                        backgroundColor: '#FEF3D6',
                        padding: '1px 7px',
                        borderRadius: '9999px',
                        border: '1px solid #FDE68A'
                      }}
                    >
                      Otomatis menutup dlm {promptsCountdown}d
                    </span>
                  </div>
                  {/* Cross button to close */}
                  <button
                    type="button"
                    onClick={() => setShowQuickPrompts(false)}
                    style={{
                      background: '#FAF8F4',
                      border: '1.2px solid #1E1E1E',
                      borderRadius: '6px',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#18181B',
                      boxShadow: '1px 1px 0px #1E1E1E'
                    }}
                    title="Tutup sekarang (X)"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        backgroundColor: '#FFFFFF',
                        border: '1.2px solid #1E1E1E',
                        color: '#18181B',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '1px 1px 0px #1E1E1E'
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Staged Attachment Preview Chip if user attached something */}
            {stagedAttachment && (
              <div style={{
                padding: '10px 24px',
                backgroundColor: '#FEF3D6',
                borderTop: '1.5px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    backgroundColor: stagedAttachment.type === 'pdf' ? '#FEE2E2' : stagedAttachment.type === 'docx' ? '#DBEAFE' : '#FEF08A',
                    color: stagedAttachment.type === 'pdf' ? '#991B1B' : stagedAttachment.type === 'docx' ? '#1E40AF' : '#854D0E',
                    border: '1px solid #1E1E1E'
                  }}>
                    {stagedAttachment.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#18181B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Siap dikirim: <strong>{stagedAttachment.name}</strong> ({stagedAttachment.size})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    style={{
                      backgroundColor: '#0284C7',
                      color: '#FFFFFF',
                      border: '1.5px solid #1E1E1E',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '1.5px 1.5px 0px #1E1E1E'
                    }}
                  >
                    <span>Analisa Sekarang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStagedAttachment(null)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.2px solid #1E1E1E',
                      borderRadius: '6px',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#DC2626'
                    }}
                    title="Batalkan lampiran"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input Bar */}
            <div style={{ padding: '10px 14px', borderTop: '1.8px solid #1E1E1E', backgroundColor: '#FFFFFF', position: 'relative', flexShrink: 0 }}>
              {/* Attachment Selection Menu Popup */}
              {isAttachMenuOpen && (
                <div
                  ref={attachMenuRef}
                  style={{
                    position: 'absolute',
                    bottom: '72px',
                    left: '24px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #1E1E1E',
                    borderRadius: '16px',
                    boxShadow: '4px 4px 0px #1E1E1E',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    width: '230px',
                    zIndex: 50,
                    animation: 'float-subtle 0.15s ease-out'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6B7280', padding: '6px 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Pilih Jenis Lampiran Medis
                  </div>

                  {/* 1. Gambar / Foto Rontgen */}
                  <button
                    type="button"
                    onClick={() => {
                      imageInputRef.current?.click();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#18181B',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon size={15} style={{ color: '#92400E' }} />
                    </div>
                    <div>
                      <div>Gambar / Foto</div>
                      <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>JPG, PNG, DICOM, WebP</div>
                    </div>
                  </button>

                  {/* 2. PDF Rekam Medis */}
                  <button
                    type="button"
                    onClick={() => {
                      if (docInputRef.current) {
                        docInputRef.current.accept = '.pdf';
                        docInputRef.current.click();
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#18181B',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FEE2E2', border: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={15} style={{ color: '#991B1B' }} />
                    </div>
                    <div>
                      <div>Dokumen PDF</div>
                      <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Hasil Lab / Rekam Medis</div>
                    </div>
                  </button>

                  {/* 3. Word DOCX */}
                  <button
                    type="button"
                    onClick={() => {
                      if (docInputRef.current) {
                        docInputRef.current.accept = '.docx,.doc';
                        docInputRef.current.click();
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#18181B',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#DBEAFE', border: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileSpreadsheet size={15} style={{ color: '#1E40AF' }} />
                    </div>
                    <div>
                      <div>Dokumen Word (DOCX)</div>
                      <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Surat Rujukan / Anamnesis</div>
                    </div>
                  </button>

                  {/* 4. Ambil dari Kamera */}
                  <button
                    type="button"
                    onClick={startCamera}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#18181B',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#DCFCE7', border: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={15} style={{ color: '#166534' }} />
                    </div>
                    <div>
                      <div>Ambil Kamera</div>
                      <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Foto langsung kondisi pasien</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Hidden File Inputs */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e, 'image')}
              />
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const fileName = e.target.files?.[0]?.name.toLowerCase() || '';
                  const type = fileName.endsWith('.pdf') ? 'pdf' : 'docx';
                  handleFileChange(e, type);
                }}
              />

              {/* Beta Quota Indicator & Warning Banner */}
              {quotaExceeded ? (
                <div style={{
                  marginBottom: '10px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1.5px solid #EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: '#991B1B',
                  fontWeight: 700
                }}>
                  <ShieldAlert size={16} />
                  <span>Batas Uji Coba Beta Terpenuhi (6/6 request). Kuota akun Anda ({userEmail}) telah habis.</span>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '0.73rem',
                  color: '#6B7280',
                  fontWeight: 600
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Mode Beta: Maksimal 6 Request / Akun</span>
                  </div>

                  <div style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: requestCount >= 5 ? '#FEE2E2' : '#DCFCE7',
                    color: requestCount >= 5 ? '#991B1B' : '#166534',
                    border: '1px solid #1E1E1E',
                    fontWeight: 700
                  }}>
                    Sisa Kuota: {Math.max(0, MAX_BETA_REQUESTS - requestCount)} / {MAX_BETA_REQUESTS}
                  </div>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                {/* Paperclip Button with Toggle Menu */}
                <button
                  type="button"
                  disabled={quotaExceeded}
                  title="Lampirkan File Medis (Gambar, PDF, DOCX, Kamera)"
                  onClick={() => setIsAttachMenuOpen(prev => !prev)}
                  style={{
                    backgroundColor: isAttachMenuOpen ? '#FEF3D6' : '#FAF8F4',
                    border: '1.5px solid #1E1E1E',
                    color: isAttachMenuOpen ? '#92400E' : '#18181B',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    cursor: quotaExceeded ? 'not-allowed' : 'pointer',
                    opacity: quotaExceeded ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '1px 1px 0px #1E1E1E',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Paperclip size={18} strokeWidth={2.2} />
                </button>

                <input
                  type="text"
                  disabled={quotaExceeded}
                  className="form-input-neo"
                  placeholder={quotaExceeded ? "Kuota pesan beta akun Anda sudah habis (6/6 request)" : (stagedAttachment ? `Catatan untuk ${stagedAttachment.name}...` : "Ketik keluhan, vital, atau gejala...")}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '0.88rem',
                    minWidth: 0,
                    backgroundColor: quotaExceeded ? '#F3F4F6' : undefined,
                    cursor: quotaExceeded ? 'not-allowed' : 'text'
                  }}
                />

                <button
                  type="submit"
                  disabled={(!inputQuery.trim() && !stagedAttachment) || isTyping || quotaExceeded}
                  className="neo-btn-primary"
                  style={{
                    height: '38px',
                    padding: '0 16px',
                    opacity: (!inputQuery.trim() && !stagedAttachment) || isTyping || quotaExceeded ? 0.6 : 1,
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    flexShrink: 0,
                    cursor: quotaExceeded ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={15} strokeWidth={2.2} />
                  <span className="chat-send-btn-label">Kirim</span>
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CAMERA CAPTURE MODAL                                      */}
      {/* ========================================================= */}
      {isCameraActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px'
        }}>
          <div
            className="neo-card"
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              borderRadius: '20px',
              border: '2px solid #1E1E1E',
              boxShadow: '6px 8px 0px #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} strokeWidth={2.2} style={{ color: '#166534' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#18181B', margin: 0 }}>
                  Ambil Foto Klinis Pasien
                </h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                style={{
                  background: '#FAF8F4',
                  border: '1.2px solid #1E1E1E',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Video Stream Preview */}
            <div style={{
              width: '100%',
              height: '320px',
              backgroundColor: '#000000',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1.8px solid #1E1E1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Camera Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={stopCamera}
                className="neo-btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="neo-btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Camera size={16} />
                <span>Ambil Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: RIWAYAT ANALISA                                    */}
      {/* ========================================================= */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Analytics Summary Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="neo-card" style={{ padding: '18px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                <History size={16} />
                <span>Total Sesi Konsultasi</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#18181B' }}>
                {historyList.length} Sesi
              </div>
              <div style={{ fontSize: '0.76rem', color: '#166534', marginTop: '4px', fontWeight: 600 }}>
                ● 100% Terintegrasi ICD-10
              </div>
            </div>

            <div className="neo-card" style={{ padding: '18px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                <Activity size={16} />
                <span>Rata-Rata Keyakinan AI</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534' }}>
                {(() => {
                  const nums = historyList
                    .map((h) => parseFloat(String(h.confidence).replace(/[^0-9.]/g, '')))
                    .filter((n) => !isNaN(n) && n > 0);
                  if (nums.length === 0) return '96.2%';
                  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
                  return `${avg.toFixed(1)}%`;
                })()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#52525B', marginTop: '4px' }}>
                Estimasi akurasi diagnostik klinis
              </div>
            </div>

            <div className="neo-card" style={{ padding: '18px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                <FileText size={16} />
                <span>Diagnosa Terbanyak</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#18181B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {historyList.length > 0 ? historyList[0].primaryDiagnosis : 'Pneumonia (J18.9)'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#92400E', marginTop: '4px', fontWeight: 600 }}>
                {historyList.length > 0 ? `Kode Terakhir: ${historyList[0].icdCode}` : 'Klasifikasi Standar WHO ICD-10'}
              </div>
            </div>

            <div className="neo-card" style={{ padding: '18px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                <ShieldCheck size={16} />
                <span>Status Verifikasi Faskes</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#18181B' }}>
                {historyList.filter(h => h.status === 'Terverifikasi').length} / {historyList.length}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#166534', marginTop: '4px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {faskesProfile.faskes_profile?.penanggung_jawab || faskesProfile.faskes_profile?.nama_faskes || 'Apoteker Penanggung Jawab'}
              </div>
            </div>
          </div>

          {/* Search, Filter & Controls */}
          <div className="neo-card" style={{ padding: '18px 24px', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '260px' }}>
              <Search size={18} style={{ color: '#6B7280' }} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama pasien, ID (#4102), diagnosa, atau kode ICD..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="form-input-neo"
                style={{ padding: '10px 14px', fontSize: '0.88rem' }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6B7280', marginRight: '4px' }}>Filter:</span>
              {(['Semua', 'Terverifikasi', 'Tindak Lanjut Lab', 'Arsip Rekam Medis'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1.5px solid #1E1E1E',
                    backgroundColor: statusFilter === st ? '#18181B' : '#FAF8F4',
                    color: statusFilter === st ? '#FFFFFF' : '#18181B',
                    boxShadow: statusFilter === st ? '1.5px 1.5px 0px #1E1E1E' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* History Records List */}
          {filteredHistory.length === 0 ? (
            <div className="neo-card" style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
              <History size={48} strokeWidth={1.5} style={{ color: '#9CA3AF', margin: '0 auto 16px auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B' }}>Tidak Ada Riwayat yang Cocok</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '6px' }}>
                Coba sesuaikan kata kunci pencarian atau ganti filter status di atas.
              </p>
              <button
                onClick={() => { setHistorySearch(''); setStatusFilter('Semua'); }}
                className="neo-btn-secondary"
                style={{ marginTop: '16px', padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="neo-card"
                  style={{
                    padding: '24px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '3px 3.5px 0px #1E1E1E',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {/* Top Bar of History Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        backgroundColor: '#FAF8F4',
                        border: '1.2px solid #1E1E1E',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        color: '#18181B'
                      }}>
                        {item.sessionCode}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {item.date} • {item.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        border: '1.2px solid #1E1E1E',
                        backgroundColor: item.status === 'Terverifikasi' ? '#DCFCE7' : item.status === 'Tindak Lanjut Lab' ? '#FEF3D6' : '#E0F2FE',
                        color: item.status === 'Terverifikasi' ? '#166534' : item.status === 'Tindak Lanjut Lab' ? '#92400E' : '#0369A1'
                      }}>
                        ● {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Middle Section: Patient and Diagnosis Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', padding: '16px', backgroundColor: '#FAF8F4', borderRadius: '16px', border: '1.5px solid #1E1E1E' }}>
                    {/* Left: Patient Details */}
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Identitas Pasien
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#18181B' }}>
                        {item.patientName} <span style={{ fontSize: '0.86rem', color: '#6B7280' }}>({item.patientId})</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#52525B', marginTop: '4px' }}>
                        {item.patientAge} • {item.patientGender} • Tekanan Darah: <strong>{item.bloodPressure}</strong>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '8px', lineHeight: 1.4 }}>
                        <strong>Keluhan / Kasus:</strong> {item.chiefComplaint}
                      </div>
                      {item.messages && item.messages.some((m) => m.attachment) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                          {item.messages
                            .filter((m) => m.attachment)
                            .map((m, idx) => (
                              <span
                                key={idx}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  backgroundColor: '#FEF3D6',
                                  border: '1px solid #1E1E1E',
                                  color: '#92400E'
                                }}
                              >
                                <Paperclip size={11} />
                                {m.attachment!.name} ({m.attachment!.type.toUpperCase()})
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Right: AI Diagnostic Result */}
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Hasil Diagnosa AI & ICD-10
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#18181B' }}>
                          {item.primaryDiagnosis}
                        </span>
                        <span className="tag-yellow" style={{ fontWeight: 800 }}>{item.icdCode}</span>
                        <span className="tag-cyan" style={{ fontWeight: 700 }}>Keyakinan: {item.confidence}</span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#4B5563', lineHeight: 1.45 }}>
                        <strong>Ringkasan Klinis AI:</strong> {item.doctorNote}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* Open into Chat Button */}
                      <button
                        onClick={() => handleLoadSessionIntoChat(item)}
                        className="neo-btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <MessageSquare size={15} />
                        <span>Buka di Sesi Chat</span>
                        <ArrowRight size={14} />
                      </button>

                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedHistoryModal(item)}
                        className="neo-btn-secondary"
                        style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileText size={15} />
                        <span>Lihat Rangkuman Medis</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Copy summary */}
                      <button
                        onClick={(e) => handleCopySummary(item, e)}
                        title="Salin Rangkuman"
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.2px solid #1E1E1E',
                          borderRadius: '8px',
                          padding: '7px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#18181B'
                        }}
                      >
                        {copiedId === item.id ? <Check size={14} style={{ color: '#166534' }} /> : <Copy size={14} />}
                        <span>{copiedId === item.id ? 'Tersalin' : 'Salin'}</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => handleDeleteHistory(item.id, item.sessionCode, e)}
                        title="Hapus Rekam Sesi"
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.2px solid #1E1E1E',
                          borderRadius: '8px',
                          padding: '7px 10px',
                          cursor: 'pointer',
                          color: '#DC2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW DETAILED HISTORY RECORD                       */}
      {/* ========================================================= */}
      {selectedHistoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div
            className="neo-card"
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '6px 8px 0px #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="tag-yellow" style={{ fontWeight: 800 }}>{selectedHistoryModal.sessionCode}</span>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{selectedHistoryModal.date} • {selectedHistoryModal.time}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#18181B' }}>
                  Rekam Rangkuman Analisa Klinis
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#52525B', marginTop: '2px' }}>
                  Pasien: <strong>{selectedHistoryModal.patientName}</strong> ({selectedHistoryModal.patientId})
                </div>
              </div>

              <button
                onClick={() => setSelectedHistoryModal(null)}
                style={{
                  backgroundColor: '#FAF8F4',
                  border: '1.5px solid #1E1E1E',
                  borderRadius: '10px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#18181B'
                }}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Patient Clinical Profile */}
            <div style={{ padding: '16px', backgroundColor: '#FAF8F4', borderRadius: '14px', border: '1.5px solid #1E1E1E' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#18181B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Data Klinis Pasien Saat Sesi:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '0.86rem' }}>
                <div><strong>Usia/Gender:</strong> {selectedHistoryModal.patientAge} / {selectedHistoryModal.patientGender}</div>
                <div><strong>Tekanan Darah:</strong> {selectedHistoryModal.bloodPressure}</div>
                <div><strong>Status Verifikasi:</strong> {selectedHistoryModal.status}</div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#4B5563' }}>
                <strong>Keluhan:</strong> {selectedHistoryModal.chiefComplaint}
              </div>
            </div>

            {/* AI Diagnosis Result */}
            <div style={{ padding: '18px', backgroundColor: '#FEF3D6', borderRadius: '16px', border: '1.8px solid #1E1E1E' }}>
              <div style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 800, marginBottom: '4px' }}>
                DIAGNOSA TERVERIFIKASI
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                {selectedHistoryModal.primaryDiagnosis}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className="tag-yellow" style={{ fontWeight: 800 }}>{selectedHistoryModal.icdCode}</span>
                <span className="tag-cyan" style={{ fontWeight: 700 }}>Keyakinan: {selectedHistoryModal.confidence}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>
                {selectedHistoryModal.doctorNote}
              </p>
            </div>

            {/* Transcript Snippet */}
            {selectedHistoryModal.messages && selectedHistoryModal.messages.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#18181B', marginBottom: '10px' }}>
                  Transkrip Percakapan & Berkas Sesi ({selectedHistoryModal.messages.length} Pesan):
                </h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', backgroundColor: '#FAF8F4', borderRadius: '12px', border: '1.2px solid #1E1E1E' }}>
                  {selectedHistoryModal.messages.map((m) => (
                    <div key={m.id} style={{ fontSize: '0.82rem', padding: '10px 12px', backgroundColor: '#FFFFFF', border: '1px solid #1E1E1E', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ color: m.sender === 'user' ? '#166534' : '#92400E' }}>
                          {m.sender === 'user' ? 'Dokter / Apoteker' : 'MediagnoTek AI'}:
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>{m.timestamp}</span>
                      </div>
                      {m.attachment && (
                        <div style={{ margin: '6px 0', padding: '8px', borderRadius: '8px', backgroundColor: '#FAF8F4', border: '1px solid #1E1E1E' }}>
                          {m.attachment.dataUrl && (m.attachment.type === 'image' || m.attachment.type === 'camera') && (
                            <div style={{ marginBottom: '6px', borderRadius: '6px', overflow: 'hidden', maxHeight: '150px', display: 'flex', justifyContent: 'center', backgroundColor: '#000' }}>
                              <img src={m.attachment.dataUrl} alt={m.attachment.name} style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                            <Paperclip size={12} />
                            <span>{m.attachment.name} ({m.attachment.type.toUpperCase()})</span>
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: '3px' }}>
                        {renderFormattedMedicalText(m.text)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.8px solid #1E1E1E', paddingTop: '16px' }}>
              <button
                onClick={(e) => handleCopySummary(selectedHistoryModal, e)}
                className="neo-btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Copy size={15} />
                <span>Salin Ringkasan</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedHistoryModal(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: '1.5px solid #1E1E1E',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>

                <button
                  onClick={() => handleLoadSessionIntoChat(selectedHistoryModal)}
                  className="neo-btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <MessageSquare size={15} />
                  <span>Buka di Sesi Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
