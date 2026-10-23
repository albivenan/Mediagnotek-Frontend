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
  Sparkles,
  Image as ImageIcon,
  Camera,
  FileSpreadsheet,
  ShieldAlert
} from 'lucide-react';

interface AttachedFile {
  name: string;
  type: 'image' | 'pdf' | 'docx' | 'camera';
  size?: string;
  dataUrl?: string;
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

  // Active Patient Information
  const [activePatient, setActivePatient] = useState({
    id: '#4102',
    name: 'Tn. Budi Santoso',
    age: '45 Th',
    gender: 'Pria',
    bloodPressure: '135/85 mmHg',
    symptoms: 'Demam 38.5°C, batuk berdahak pekat, napas berat'
  });

  // Current Active Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: 'Halo dr. Anita! Saya adalah **MediagnoTek AI Medical Assistant** v2.4.\n\nSesi diagnosa untuk **Tn. Budi Santoso (#4102)** telah aktif. Anda dapat menanyakan estimasi diagnosa berdasarkan kombinasi gejala, mencari referensi obat, atau meminta analisis data klinis pasien.',
      timestamp: '12:45 PM'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Modal State for Viewing Detailed History Session
  const [selectedHistoryModal, setSelectedHistoryModal] = useState<HistorySession | null>(null);

  // Search & Filter State for Riwayat Tab
  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Terverifikasi' | 'Tindak Lanjut Lab' | 'Arsip Rekam Medis'>('Semua');

  // Consultation History Data
  const [historyList, setHistoryList] = useState<HistorySession[]>([
    {
      id: 's1',
      sessionCode: 'SESI-2026-081',
      patientId: '#4102',
      patientName: 'Tn. Budi Santoso',
      patientAge: '45 Th',
      patientGender: 'Pria',
      bloodPressure: '135/85 mmHg',
      chiefComplaint: 'Demam tinggi 38.5°C, batuk berdahak kuning pekat, sesak napas ringan',
      date: '19 Okt 2026',
      time: '12:45 WIB',
      primaryDiagnosis: 'Pneumonia Bakterial',
      icdCode: 'ICD-10 J18',
      confidence: '94.2%',
      status: 'Terverifikasi',
      doctorNote: 'Disarankan rontgen thorax PA, cek leukosit darah lengkap, serta terapi antibiotik spektrum luas.',
      messages: [
        {
          id: 'm1',
          sender: 'ai',
          text: 'Halo dr. Anita! Saya adalah MediagnoTek AI Medical Assistant v2.4. Sesi diagnosa aktif.',
          timestamp: '12:45 PM'
        },
        {
          id: 'm2',
          sender: 'user',
          text: 'Analisis gejala demam 38.5°C + batuk berdahak pekat pada pasien usia 45 tahun.',
          timestamp: '12:46 PM'
        },
        {
          id: 'm3',
          sender: 'ai',
          text: 'Berdasarkan gejala Demam (38.5°C) dan Batuk Berdahak Pekat, terdapat probabilitas tinggi indikasi Pneumonia Bakterial (ICD-10 J18).\n\nRekomendasi Tindakan Medis:\n1. Pemeriksaan Foto Rontgen Thorax PA/Lateral.\n2. Pemeriksaan Darah Lengkap & Kultur Dahak.\n3. Terapi antibiotik spektrum luas serta antipiretik.',
          timestamp: '12:46 PM',
          icdCode: 'ICD-10 J18',
          confidence: '94.2%'
        }
      ]
    },
    {
      id: 's2',
      sessionCode: 'SESI-2026-080',
      patientId: '#3890',
      patientName: 'Ny. Siti Rahmawati',
      patientAge: '52 Th',
      patientGender: 'Wanita',
      bloodPressure: '140/90 mmHg',
      chiefComplaint: 'Gula darah puasa 215 mg/dL, poliuria, polidipsia, lemas berkepanjangan',
      date: '18 Okt 2026',
      time: '15:20 WIB',
      primaryDiagnosis: 'Diabetes Mellitus Tipe 2',
      icdCode: 'ICD-10 E11',
      confidence: '97.8%',
      status: 'Tindak Lanjut Lab',
      doctorNote: 'Jadwalkan uji HbA1c serial dan panel fungsi ginjal. Terapi lini pertama Metformin 500mg 2x/hari.',
      messages: [
        {
          id: 'm4',
          sender: 'user',
          text: 'Penjelasan faktor risiko & evaluasi penanganan Diabetes Mellitus Tipe 2 dengan GDP 215 mg/dL.',
          timestamp: '15:20 WIB'
        },
        {
          id: 'm5',
          sender: 'ai',
          text: 'Untuk Diabetes Mellitus Tipe 2 (ICD-10 E11), faktor risiko utama mencakup resistensi insulin dan obesitas metabolik.\n\nPenanganan Standar:\n- Terapi lini pertama: Metformin 500mg 2x/hari saat makan.\n- Perubahan pola makan rendah indeks glikemik & aktivitas aerobik rutin.',
          timestamp: '15:21 WIB',
          icdCode: 'ICD-10 E11',
          confidence: '97.8%'
        }
      ]
    },
    {
      id: 's3',
      sessionCode: 'SESI-2026-079',
      patientId: '#4055',
      patientName: 'Tn. Hendra Wijaya',
      patientAge: '58 Th',
      patientGender: 'Pria',
      bloodPressure: '155/95 mmHg',
      chiefComplaint: 'Sakit kepala oksipital menjalar, tengkuk terasa kaku dan tegang',
      date: '17 Okt 2026',
      time: '09:15 WIB',
      primaryDiagnosis: 'Hipertensi Primer Esensial',
      icdCode: 'ICD-10 I10',
      confidence: '95.1%',
      status: 'Terverifikasi',
      doctorNote: 'Tekanan darah target <130/80 mmHg. Evaluasi EKG dan profil lipid darah lengkap.',
      messages: [
        {
          id: 'm6',
          sender: 'user',
          text: 'Evaluasi dosis & efek samping antihipertensi Amlodipine untuk TD 155/95 mmHg.',
          timestamp: '09:15 WIB'
        },
        {
          id: 'm7',
          sender: 'ai',
          text: 'Hipertensi Primer Grade 1-2 (ICD-10 I10) dapat dimulai dengan monoterapi Amlodipine 5mg sekali sehari. Waspadai efek edema perifer.',
          timestamp: '09:16 WIB',
          icdCode: 'ICD-10 I10',
          confidence: '95.1%'
        }
      ]
    },
    {
      id: 's4',
      sessionCode: 'SESI-2026-078',
      patientId: '#3921',
      patientName: 'Nn. Dewi Sartika',
      patientAge: '28 Th',
      patientGender: 'Wanita',
      bloodPressure: '115/75 mmHg',
      chiefComplaint: 'Nyeri menelan akut, demam subfebris 37.8°C, amandel hiperemis',
      date: '16 Okt 2026',
      time: '14:00 WIB',
      primaryDiagnosis: 'Faringitis Akut',
      icdCode: 'ICD-10 J02',
      confidence: '91.0%',
      status: 'Arsip Rekam Medis',
      doctorNote: 'Terapi suportif: antipiretik analgetik, hidrasi cukup, dan evaluasi Centor Score.',
      messages: [
        {
          id: 'm8',
          sender: 'user',
          text: 'Bandingkan gejala Faringitis Akut vs Tonsilitis dengan demam 37.8°C dan odinofagia.',
          timestamp: '14:00 WIB'
        },
        {
          id: 'm9',
          sender: 'ai',
          text: 'Faringitis Akut (ICD-10 J02) ditandai eritema dinding faring posterior tanpa eksudat folikular tonsil yang masif. Direkomendasikan simtomatik.',
          timestamp: '14:01 WIB',
          icdCode: 'ICD-10 J02',
          confidence: '91.0%'
        }
      ]
    }
  ]);

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

  // Handle file selection from input
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'pdf' | 'docx') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = () => {
        setStagedAttachment({
          name: file.name,
          type: 'image',
          size: sizeStr,
          dataUrl: reader.result as string
        });
        triggerToast(`Foto medis "${file.name}" berhasil dilampirkan.`);
      };
      reader.readAsDataURL(file);
    } else {
      setStagedAttachment({
        name: file.name,
        type: fileType,
        size: sizeStr
      });
      triggerToast(`Dokumen "${file.name}" berhasil dilampirkan.`);
    }

    setIsAttachMenuOpen(false);
    // Reset file input value so same file can be selected again
    e.target.value = '';
  }, [triggerToast]);

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

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const photoName = `Foto_Klinis_${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}.jpg`;
      setStagedAttachment({
        name: photoName,
        type: 'camera',
        size: '120 KB',
        dataUrl
      });
      triggerToast('Hasil foto kamera berhasil dilampirkan ke pesan.');
    }
    stopCamera();
  }, [stopCamera, triggerToast]);

  const handleSendMessage = useCallback((textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() && !stagedAttachment) return;

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

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setStagedAttachment(null);
    setIsTyping(true);

    // Simulate AI medical response with Clinical Context Lock
    setTimeout(() => {
      let responseText = '';
      let icd = '';
      let conf = '';

      const lowerQ = query.toLowerCase().trim();

      // Clinical Context Validation Guard: Check if query is out-of-context
      const outOfContextPatterns = [
        'koding', 'coding', 'program', 'python', 'javascript', 'html', 'css', 'sql', 'buatkan kode', 'script',
        'politik', 'pemilu', 'presiden', 'menteri', 'partai', 'pilkada', 'dpr',
        'resep masakan', 'memasak', 'bikin kue', 'resep makanan', 'kuliner', 'restoran',
        'game', 'main game', 'film', 'sinopsis', 'lagu', 'chord', 'lirik', 'musik',
        'cuaca besok', 'ramalan', 'zodiak', 'horoskop', 'crypto', 'bitcoin', 'saham', 'trading',
        'siapa kamu', 'ceritakan lelucon', 'bikin puisi', 'cerpen', 'dongeng'
      ];

      const medicalKeywords = [
        'demam', 'batuk', 'sesak', 'nyeri', 'sakit', 'pusing', 'mual', 'muntah', 'diare',
        'gula darah', 'tekanan darah', 'tensi', 'jantung', 'paru', 'infeksi', 'alergi',
        'obat', 'dosis', 'resep', 'gejala', 'diagnosa', 'diagnosis', 'pasien', 'klinis',
        'darah', 'rontgen', 'lab', 'laboratorium', 'terapi', 'icd', 'hba1c', 'kolesterol',
        'diabetes', 'hipertensi', 'pneumonia', 'faringitis', 'asma', 'bronkitis', 'dispepsia',
        'stroke', 'anemia', 'ginjal', 'hati', 'kulit', 'mata', 'telinga', 'lambung',
        'analisa', 'analisis', 'periksa', 'cek', 'hasil', 'lampiran', 'file', 'unggah', 'baca', 'terlampir', 'dokumen', 'foto'
      ];

      const isExplicitlyOutOfContext = outOfContextPatterns.some(pattern => lowerQ.includes(pattern));
      const hasMedicalKeyword = medicalKeywords.some(keyword => lowerQ.includes(keyword)) || !!currentAttachment;

      if (isExplicitlyOutOfContext || (!hasMedicalKeyword && lowerQ.length > 3 && !lowerQ.includes('halo') && !lowerQ.includes('hi') && !lowerQ.includes('pagi') && !lowerQ.includes('siang') && !lowerQ.includes('malam'))) {
        // Out of Context Rejection Response
        responseText = `⚠️ **Pemberitahuan Pembatasan Konteks (Context Lock Active)**\n\nSaya adalah **MediagnoTek AI Medical Diagnostic Assistant** yang diprogram secara khusus hanya untuk membantu evaluasi medis klinis, estimasi diagnosa penyakit, analisis gejala pasien, serta referensi farmakologis.\n\nPertanyaan Anda berada **di luar lingkup medis dan diagnostik kesehatan**. Silakan ajukan pertanyaan seputar:\n- Gejala klinis pasien & keluhan fisik\n- Estimasi diagnosa diferensial & kode ICD-10\n- Evaluasi dosis obat & kontraindikasi/interaksi\n- Interpretasi lampiran foto rontgen, hasil lab, atau rekam medis`;
        icd = 'Pedoman Klinis';
        conf = 'Akses Dibatasi';
      } else if (currentAttachment) {
        // High-Precision Multi-Modal Clinical Attachment Analysis
        const fName = (currentAttachment.name || '').toLowerCase();
        const fType = currentAttachment.type;
        const combined = `${fName} ${lowerQ} ${fType}`.toLowerCase();
        const noteContext = lowerQ && !lowerQ.includes('lampiran') && !lowerQ.includes('analisa') && !lowerQ.includes('kirim') ? `Catatan Anamnesis Dokter: "${query}"\n\n` : '';

        // 1. Thorax / Chest X-Ray / Radiologi Paru
        if (combined.includes('thorax') || combined.includes('rontgen') || combined.includes('xray') || combined.includes('x-ray') || combined.includes('chest') || combined.includes('paru') || combined.includes('dada') || combined.includes('sesak') || combined.includes('infiltrat') || combined.includes('pneumonia') || combined.includes('batuk') || combined.includes('tbc') || combined.includes('tb')) {
          responseText = `${noteContext}Hasil Analisis Citra Radiologis: **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Utama:**\n**Pneumonia Lobaris Dextra (ICD-10 J18.1)** — Tingkat Keyakinan AI: 96.4%\n\n**📖 Penjelasan Penyakit & Patofisiologi:**\nPasien terindikasi mengalami penyakit **Pneumonia Lobaris**, yaitu infeksi saluran pernapasan bawah akut di mana satu atau beberapa lobus paru (pada citra ini: lobus inferior dextra / bawah kanan) mengalami peradangan hebat dan rongga alveolinya terisi eksudat cairan purulen (nanah/lendir kental). Penyakit ini umumnya disebabkan oleh invasi bakteri patogen *Streptococcus pneumoniae*. Hal ini mengganggu difusi oksigen darah, sehingga pasien biasanya mengeluhkan demam tinggi menggigil, batuk produktif dengan sputum kental, sesak napas progresif, dan nyeri dada pleuritik saat bernapas.\n\n**🔍 Bukti Temuan Citra Radiologis (Computer Vision):**\n- Ditemukan peningkatan corakan bronkovaskular dengan densitas konsolidasi inhomogen berawan pada lobus inferior dextra.\n- Tampak gambaran *air bronchogram* fokal pada lapang paru kanan bawah.\n- Sinus kostofrenikus sinistra tajam normal, dextra tampak sedikit terselubung efusi parapneumonik minimal.\n- Cor: Rasio CTR < 50% (ukuran jantung dalam batas normal).\n\n**📋 Diagnosa Banding (Penyakit Pembanding):**\n1. **Bronkopneumonia Terkomplikasi (ICD-10 J18.0)**\n2. **Tuberkulosis Paru Aktif Dupleks (ICD-10 A15.0)**\n\n**💊 Rekomendasi Terapi Medis & Rencana Dokter:**\n- **Antibiotik Empiris Lini Pertama**: Ceftriaxone 1g IV tiap 24 jam + Azitromisin 500mg PO 1x/hari selama 5-7 hari.\n- **Simtomatik**: Parasetamol 500-1000mg PO tiap 6-8 jam bila demam > 38°C, Mukolitik N-Asetilsistein 200mg 3x/hari.\n- **Pemeriksaan Lanjutan**: Sputum BTA serial & kultur mikrobiologi uji sensitivitas antibiotik.\n- **Evaluasi**: Foto rontgen toraks evaluatif dalam 7-10 hari pasca terapi.`;
          icd = 'Pneumonia (J18.1)';
          conf = '96.4%';
        }
        // 2. EKG / Elektrokardiografi / Jantung
        else if (combined.includes('ekg') || combined.includes('ecg') || combined.includes('jantung') || combined.includes('cardio') || combined.includes('stemi') || combined.includes('aritmia') || combined.includes('infark') || combined.includes('iskemia') || combined.includes('irama')) {
          responseText = `${noteContext}Hasil Analisis Elektrokardiogram (EKG 12-Lead): **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Utama:**\n**STEMI Inferior Akut / Infark Miokard Akut Dinding Bawah (ICD-10 I21.1)** — Tingkat Keyakinan AI: 97.2%\n\n**📖 Penjelasan Penyakit & Patofisiologi:**\nPasien mengalami penyakit **Infark Miokard Akut dengan Elevasi Segmen ST (STEMI)**, yaitu sindrom koroner akut emergensi di mana terjadi sumbatan total mendadak pada arteri koroner (arteri koroner kanan / RCA) akibat ruptur plak aterosklerotik dan pembentukan trombus. Akibatnya, jaringan otot jantung dinding bawah (miokard inferior) mengalami iskemia berat dan nekrosis jaringan selular karena terhentinya suplai darah beroksigen. Pasien biasanya mengeluhkan nyeri dada retrosternal seperti dihantam benda berat yang menjalar ke leher atau lengan kiri disertai keringat dingin.\n\n**🔍 Bukti Temuan Elektrokardiografi (EKG):**\n- Ditemukan elevasi segmen ST konveks > 1.5mm pada sadapan inferior (Lead II, III, dan aVF).\n- Depresi segmen ST resiprokal pada lead I dan aVL.\n- Irama: Sinus Rhythm, Laju QRS ~98 bpm, aksis normoaksis (0° hingga +90°).\n- Interval PR 0.16s (normal), Durasi QRS 0.08s (sempit normal).\n\n**📋 Diagnosa Banding (Penyakit Pembanding):**\n1. **Angina Pektoris Tak Stabil / UAP (ICD-10 I20.0)**\n2. **Perikarditis Akut (ICD-10 I30.9)**\n\n**💊 Tindakan Emergensi Kardiologi (CITO):**\n- Oksigenasi nasal 3-4 L/menit bila saturasi SpO2 < 90%.\n- **Dual Antiplatelet Loading**: Aspilet 160-320mg kunyah + Clopidogrel 300-600mg PO.\n- ISDN 5mg sublingual (bila tensi sistolik > 100 mmHg).\n- Cek enzim biomarker jantung serial (Troponin I/T kuantitatif & CK-MB).\n- Segera konsul CITO Spesialis Jantung untuk persiapan Percutaneous Coronary Intervention (PCI).`;
          icd = 'STEMI Akut (I21.1)';
          conf = '97.2%';
        }
        // 3. CT-Scan / MRI Kepala & Neuro
        else if (combined.includes('ct') || combined.includes('mri') || combined.includes('head') || combined.includes('otak') || combined.includes('brain') || combined.includes('kepala') || combined.includes('stroke') || combined.includes('neuro')) {
          responseText = `${noteContext}Hasil Analisis Tomografi Multislice (CT-Scan): **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Utama:**\n**Stroke Iskemik Akut / Infark Serebri Non-Hemoragik (ICD-10 I63.9)** — Tingkat Keyakinan AI: 95.8%\n\n**📖 Penjelasan Penyakit & Patofisiologi:**\nPasien terdiagnosa menderita **Stroke Iskemik Akut**, yaitu gangguan peredaran darah otak fokal akibat penyumbatan tromboemboli pada pembuluh darah arteri serebri media (MCA). Sumbatan ini menghentikan pasokan darah dan nutrisi glukosa ke parenkim otak, menyebabkan hilangnya fungsi neuron secara mendadak. Manifestasi klinis umumnya berupa kelemahan separuh badan (hemiparesis), pelo (disartria), atau penurunan kesadaran.\n\n**🔍 Bukti Temuan Neuro-Radiologi:**\n- Area fokal hipodens (densitas rendah) berbatas tegas pada teritori arteri serebri media (MCA) sinistra.\n- Tidak ditemukan hiperdensitas tanda perdarahan intrakranial aktif (stroke hemoragik disingkirkan).\n- Midline shift < 2mm, ventrikel lateralis simetris intak.\n\n**📋 Diagnosa Banding (Penyakit Pembanding):**\n1. **Transient Ischemic Attack / TIA (ICD-10 G45.9)**\n2. **Hematoma Subdural Kronis (ICD-10 I62.0)**\n\n**💊 Rencana Tindakan Penanganan Medis:**\n- Evaluasi onset defisit neurologis (Golden Period trombolisis IV rt-PA < 4.5 jam).\n- Kendalikan tekanan darah secara terukur & pertahankan perfusi serebral (posisi kepala elevasi 30°).\n- Pasang infus NaCl 0.9% dan siapkan evaluasi skor NIHSS bersama dokter spesialis saraf.`;
          icd = 'Stroke Iskemik (I63.9)';
          conf = '95.8%';
        }
        // 4. USG Abdomen / Ginekologi / Hepar
        else if (combined.includes('usg') || combined.includes('abdomen') || combined.includes('perut') || combined.includes('liver') || combined.includes('hepar') || combined.includes('empedu') || combined.includes('batu') || combined.includes('kolelitiasis') || combined.includes('ginjal')) {
          responseText = `${noteContext}Hasil Analisis Sonografi Ultrasonografi (USG): **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Utama:**\n**Kolelitiasis Simtomatik / Batu Kandung Empedu (ICD-10 K80.2)** — Tingkat Keyakinan AI: 94.8%\n\n**📖 Penjelasan Penyakit & Patofisiologi:**\nPasien mengalami penyakit **Kolelitiasis (Batu Empedu)**, yaitu terbentuknya endapan keras kristal kolesterol atau pigmen bilirubin di dalam kantung empedu (*vesika fellea*). Ketika kantung empedu berkontraksi saat mencerna makanan berlemak, batu menyumbat saluran duktus sistikus sehingga memicu kolik bilier—nyeri hebat mendadak pada kuadran kanan atas perut atau ulu hati yang menjalar ke punggung dan bahu kanan, sering disertai mual dan muntah.\n\n**🔍 Bukti Temuan Sonopatologi Abdomen:**\n- Tampak bentukan hiperekoik multiple berdiameter 4-6mm di dalam lumen vesika fellea dengan *acoustic shadow* (bayangan akustik posterior) yang khas.\n- Dinding vesika fellea dalam batas normal (< 3mm, belum menunjukkan kolesistitis akut berat).\n- Hepar berukuran normal, parenkim homogen, dan ginjal bilateral intak.\n\n**📋 Diagnosa Banding (Penyakit Pembanding):**\n1. **Kolesistitis Akut Kalkulus (ICD-10 K81.0)**\n2. **Dispepsia Fungsional / Gastritis Erosif (ICD-10 K29.7)**\n\n**💊 Rekomendasi Terapi & Rencana Dokter:**\n- Terapi antispasmodik & analgetik: Hiosin Butilbromid 20mg PO/IV bila nyeri kolik menyerang.\n- Diet ketat rendah lemak jenuh (hindari santan, jeroan, dan gorengan).\n- Cek profil fungsi hati (SGOT, SGPT, Bilirubin Total/Direk).\n- Pertimbangkan konsultasi spesialis bedah digestif untuk rencana kolesistektomi elektif.`;
          icd = 'Kolelitiasis (K80.2)';
          conf = '94.8%';
        }
        // 5. Hasil Laboratorium Darah Rutin / Kimia Darah / Urin (PDF/Docx/Gambar)
        else if (combined.includes('lab') || combined.includes('darah') || combined.includes('hematologi') || combined.includes('urine') || combined.includes('hba1c') || combined.includes('kolesterol') || combined.includes('leukosit') || combined.includes('trombosit') || combined.includes('hb') || combined.includes('gds') || combined.includes('crp')) {
          responseText = `${noteContext}Hasil Ekstraksi & Verifikasi Nilai Kritis Laboratorium: **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Utama:**\n**Sindrom Respon Inflamasi Sistemik / Infeksi Bakterial Akut (ICD-10 R65.1) disertai Anemia Ringan (ICD-10 D64.9)** — Tingkat Keyakinan AI: 96.8%\n\n**📖 Penjelasan Penyakit & Patofisiologi:**\nData hasil laboratorium mengindikasikan penyakit **Infeksi Bakterial Akut Sistemik**. Adanya respon leukositosis tinggi (14.800 /uL) disertai peningkatan tajam protein fase akut (CRP 32 mg/L) menandakan sistem kekebalan tubuh sedang aktif melawan serbuan infeksi bakteri patogen. Sitokin inflamasi menekan proses pembentukan sel darah merah di sumsum tulang, mengakibatkan penurunan kadar hemoglobin (anemia ringan 10.2 g/dL).\n\n**🔍 Hasil Interpretasi Parameter Kritis:**\n- **Leukosit**: 14.800 /uL (Tinggi — Nilai Rujukan: 4.500 - 11.000 /uL) -> Respon Reaksi Inflamasi / Infeksi Bakterial\n- **C-Reactive Protein (CRP)**: 32 mg/L (Meningkat Signifikan — Nilai Rujukan: < 5 mg/L)\n- **Hemoglobin (Hb)**: 10.2 g/dL (Rendah — Nilai Rujukan: 13.0 - 17.5 g/dL) -> Anemia Derajat Ringan\n- **Gula Darah Sewaktu (GDS)**: 178 mg/dL -> Hiperglikemia Reaktif terhadap Stress Infeksi\n- **Trombosit**: 285.000 /uL -> Normal\n\n**📋 Diagnosa Banding (Penyakit Pembanding):**\n1. **Sepsis Bakterial Dini (ICD-10 A41.9)**\n2. **Infeksi Saluran Kemih Terkomplikasi (ICD-10 N39.0)**\n\n**💊 Rekomendasi Terapi & Tindak Lanjut:**\n- Lakukan pelacakan fokal infeksi (fokus paru, saluran kemih, atau gastrointestinal).\n- Mulai antibiotik spektrum luas sesuai fokus infeksi.\n- Cek Ferritin serum, TIBC, dan hitung jenis leukosit (diff count) untuk penajaman etiologi anemia.`;
          icd = 'Infeksi Bakterial (R65.1)';
          conf = '96.8%';
        }
        // 6. Foto Klinis Dermatologi / Kamera Langsung / Lesi Kulit
        else if (fType === 'camera' || combined.includes('kulit') || combined.includes('luka') || combined.includes('foto_klinis') || combined.includes('mata') || combined.includes('lesi') || combined.includes('ruam') || combined.includes('gatal')) {
          responseText = `${noteContext}Hasil Analisis Citra Klinis Dermatologi: **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Utama:**\n**Dermatitis Kontak Alergi / Iritan Eksaserbasi Akut (ICD-10 L23.9)** — Tingkat Keyakinan AI: 93.7%\n\n**📖 Penjelasan Penyakit & Patofisiologi:**\nPasien terindikasi menderita **Dermatitis Kontak Alergi (DKA)**, yaitu penyakit peradangan kulit non-menular yang timbul akibat reaksi hipersensitivitas tipe lambat (tipe IV) setelah kulit berkontak dengan zat alergen atau bahan kimia iritatif (seperti deterjen keras, logam nikel, kosmetik, atau getah tanaman). Sel T tersensitisasi melepaskan histamin dan mediator peradangan yang memicu vasodilatasi pembuluh darah kulit, menimbulkan bercak kemerahan, edema dermal, serta rasa gatal (*pruritus*) yang intens.\n\n**🔍 Bukti Temuan Lesi Makroskopis:**\n- Ditemukan plak makulopapular eritematosa batas tegas dengan skuama halus dan edema dermal superfisial.\n- Terdapat ekskoriasi (goresan akibat garukan) pada area lesi fokal.\n- Tidak ditemukan bula nekrotik jaringan dalam ataupun pus purulen berat.\n\n**📋 Diagnosa Banding (Penyakit Pembanding):**\n1. **Dermatitis Atopik Eksaserbasi Akut (ICD-10 L20.9)**\n2. **Tinea Korporis / Infeksi Jamur Kulit (ICD-10 B35.4)**\n\n**💊 Rekomendasi Terapi & Anjuran Dokter:**\n- **Kortikosteroid Topikal**: Krim Hidrokortison 2.5% atau Desonide dioleskan tipis 2x sehari selama 5-7 hari.\n- **Antihistamin Oral**: Cetirizine 10mg 1x malam hari untuk meredakan rasa gatal dan mencegah garukan.\n- Kompres dingin bila terasa perih dan hindari kontak dengan sabun antiseptik keras.`;
          icd = 'Dermatitis Kontak (L23.9)';
          conf = '93.7%';
        }
        // 7. Dokumen Resume Medis / Rujukan Pasien (PDF / DOCX)
        else if (combined.includes('resume') || combined.includes('rujukan') || combined.includes('rekam') || combined.includes('pasien') || combined.includes('surat') || combined.includes('discharge')) {
          responseText = `${noteContext}Hasil Analisis Rekam Medis Terstruktur: **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Terdeteksi:**\n**Hipertensi Primer Grade 2 disertai Dislipidemia Campuran (ICD-10 I10 & E78.5)** — Tingkat Keyakinan AI: 94.5%\n\n**📖 Penjelasan Penyakit & Patofisiologi:**\nBerdasarkan resume rekam medis, penyakit utama pasien adalah **Hipertensi Primer Esensial (Tekanan Darah Tinggi)** kronis dengan komorbiditas **Dislipidemia**. Hipertensi menyebabkan penebalan dinding arteri perifer dan meningkatkan beban kerja ventrikel kiri jantung. Tanpa kontrol tensi yang ketat, kondisi ini dapat mempercepat aterosklerosis pembuluh darah dan memicu komplikasi infark jantung, stroke, serta gagal ginjal kronis.\n\n**🔍 Rangkuman Profil Klinis Pasien:**\n- Profil Tensi Terakhir: Rata-rata 150/95 mmHg (Hipertensi Grade 2 terkontrol sebagian).\n- Riwayat Terapi Terakhir: Candesartan 8mg 1x/hari, Atorvastatin 20mg 1x/malam.\n- Profil Kolesterol: LDL meningkat moderat, riwayat alergi obat tidak tercatat.\n\n**📋 Rekomendasi Penanganan Dokter:**\n- Optimasi titrasi dosis antihipertensi target tekanan darah klinis < 130/80 mmHg.\n- Lanjutkan Atorvastatin 20mg pada malam hari untuk perlindungan kardiovaskular.\n- Jadwalkan skrining profil fungsi ginjal berkala (eGFR dan Ureum/Kreatinin serum).`;
          icd = 'Hipertensi (I10)';
          conf = '94.5%';
        }
        // 8. Citra Medis Gambar Apapun (Generic Image Analysis: selalu menjelaskan diagnosa penyakit secara komprehensif)
        else if (fType === 'image') {
          responseText = `${noteContext}Hasil Analisis Citra Diagnostik Medis (Multi-Modal Vision Engine): **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Utama:**\n**Pneumonia Bakterial Akut dengan Konsolidasi Infiltrat Paru (ICD-10 J18.9)** — Tingkat Keyakinan AI: 95.8%\n\n**📖 Penjelasan Penyakit & Patofisiologi:**\nBerdasarkan segmentasi computer vision terhadap citra medis yang dilampirkan, penyakit yang terdeteksi adalah **Pneumonia Bakterial Akut**. Penyakit ini merupakan infeksi mikroba pada parenkim paru-paru di mana kantung udara (alveolus) mengalami peradangan akut dan terisi cairan eksudat inflamatori. Penyebab tersering adalah invasi bakteri patogen seperti *Streptococcus pneumoniae* atau *Klebsiella pneumoniae*. Kondisi ini mengganggu pertukaran oksigen, sehingga pasien umumnya mengeluhkan demam tinggi menggigil, batuk produktif berdahak kuning/kehijauan, napas cepat dan dangkal, serta rasa sesak atau nyeri dada.\n\n**🔍 Bukti Temuan Citra Visual AI:**\n- **Densitas Citra**: Ditemukan opasitas konsolidasi fokal dengan peningkatan densitas pada lapang jaringan parenkim.\n- **Pola Vaskularitas**: Peningkatan corakan vaskular fokal yang konsisten dengan respon inflamasi aktif.\n- **Integritas Struktur**: Tidak ditemukan tanda fraktur korteks tulang ataupun bayangan kavitasi tuberkulosis kronis (menunjukkan infeksi akut).\n\n**📋 Diagnosa Banding (Penyakit Pembanding):**\n1. **Bronkopneumonia Infiltratif (ICD-10 J18.0)**\n2. **Efusi Pleura Parapneumonik (ICD-10 J90)**\n3. **Tuberkulosis Paru Kasus Baru (ICD-10 A15.0)**\n\n**💊 Rekomendasi Terapi Medis & Tindakan Dokter:**\n- **Antibiotik Empiris**: Ceftriaxone 1g IV tiap 24 jam + Azitromisin 500mg PO 1x/hari selama 5-7 hari.\n- **Simtomatik**: Parasetamol 500-1000mg tiap 6 jam bila suhu tubuh > 38°C, Mukolitik N-Asetilsistein 200mg 3x/hari.\n- **Pemeriksaan Laboratorium**: Dianjurkan pemeriksaan Darah Lengkap (DPL), C-Reactive Protein (CRP), dan kultur dahak.\n- **Monitoring**: Pantau saturasi oksigen (SpO2) berkala dan jadwalkan evaluasi citra 1 minggu pasca pengobatan.`;
          icd = 'Pneumonia (J18.9)';
          conf = '95.8%';
        }
        // 9. Berkas Dokumen PDF / DOCX Apapun (Generic Document Extraction)
        else {
          responseText = `${noteContext}Hasil Analisis & Ekstraksi Dokumen Klinis: **${currentAttachment.name}**\n\n**🩺 Diagnosa Penyakit Terdeteksi:**\n**Pemeriksaan Klinis Pasien: Evaluasi Penyakit Kronis & Tanda Vital (ICD-10 Z00.0)** — Tingkat Keyakinan AI: 94.2%\n\n**📖 Penjelasan Penyakit & Konteks Klinis:**\nDokumen yang dilampirkan mencatat resume evaluasi kesehatan berkala pasien terkait pemantauan penyakit kronis (faktor risiko kardiovaskular dan metabolisme). Penilaian rutin penting untuk mendeteksi komplikasi dini pada organ target (jantung, otak, dan ginjal) sebelum timbul gejala klinis berat.\n\n**🔍 Rangkuman Berkas Klinis:**\n- Berkas dokumen berhasil diproses ke dalam arsip rekam medis terintegrasi.\n- Parameter klinis dan riwayat pengobatan sebelumnya terindeks dengan validitas tinggi.\n\n**💊 Rencana Tindak Lanjut Dokter:**\n- Lakukan verifikasi resume rekam medis bersama dokter penanggung jawab pelayanan (DPJP).\n- Simpan riwayat konsultasi ke dalam arsip rekam medis elektronik pasien.`;
          icd = 'Evaluasi Medis (Z00.0)';
          conf = '94.2%';
        }
      } else if (lowerQ.includes('demam') || lowerQ.includes('batuk')) {
        responseText = 'Berdasarkan gejala **Demam (38.5°C)** dan **Batuk Berdahak Pekat**, terdapat probabilitas tinggi indikasi **Pneumonia Bakterial (ICD-10 J18)**.\n\n**Rekomendasi Tindakan Medis:**\n1. Pemeriksaan Foto Rontgen Thorax PA/Lateral.\n2. Pemeriksaan Darah Lengkap & Kultur Dahak.\n3. Pertimbangkan terapi antibiotik spektrum luas serta antipiretik.';
        icd = 'ICD-10 J18';
        conf = '94.2%';
      } else if (lowerQ.includes('diabetes')) {
        responseText = 'Untuk **Diabetes Mellitus Tipe 2 (ICD-10 E11)**, faktor risiko utama mencakup resistensi insulin dan obesitas.\n\n**Penanganan Standar:**\n- Terapi lini pertama: **Metformin** (500mg 2x/hari saat makan).\n- Perubahan pola makan (rendah indeks glikemik) & olahraga teratur.';
        icd = 'ICD-10 E11';
        conf = '97.8%';
      } else if (lowerQ.includes('hipertensi') || lowerQ.includes('amlodipine')) {
        responseText = 'Untuk indikasi **Hipertensi Primer Esensial (ICD-10 I10)**, pemberian **Amlodipine** (5-10 mg 1x/hari) efektif sebagai calcium channel blocker perifer.\n\n**Monitoring:**\n- Evaluasi tekanan darah serial pagi & malam.\n- Waspadai efek edema tungkai dan pusing ortostatik.';
        icd = 'ICD-10 I10';
        conf = '95.1%';
      } else if (lowerQ.includes('halo') || lowerQ.includes('hi') || lowerQ.includes('pagi') || lowerQ.includes('siang') || lowerQ.includes('malam')) {
        responseText = 'Halo dr. Anita! Saya siap membantu analisa diagnostik pasien. Silakan masukkan deskripsi gejala, parameter vitalitas klinis, atau lampirkan berkas penunjang.';
        conf = '99.0%';
      } else {
        responseText = `Terima kasih atas query klinis: "${query}".\n\nAnalisis algoritma kami mendeteksi indikasi perlu tindak lanjut komprehensif. Disarankan melakukan anamnesis tambahan terkait durasi gejala dan riwayat alergi obat pasien.`;
        conf = '91.5%';
      }

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now().toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icdCode: icd,
        confidence: conf
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  }, [inputQuery, stagedAttachment]);

  // Save current active chat session to history
  const handleSaveToHistory = useCallback(() => {
    // Find the latest AI diagnosis
    const latestAiMsg = [...messages].reverse().find(m => m.sender === 'ai' && m.icdCode);
    const timeNow = new Date();
    const sessionNum = Math.floor(100 + Math.random() * 900);
    const newSession: HistorySession = {
      id: 's_' + Date.now().toString(),
      sessionCode: `SESI-2026-${sessionNum}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientAge: activePatient.age,
      patientGender: activePatient.gender,
      bloodPressure: activePatient.bloodPressure,
      chiefComplaint: activePatient.symptoms,
      date: timeNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: timeNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      primaryDiagnosis: latestAiMsg?.icdCode === 'ICD-10 J18' ? 'Pneumonia Bakterial' :
                         latestAiMsg?.icdCode === 'ICD-10 E11' ? 'Diabetes Mellitus Tipe 2' :
                         latestAiMsg?.icdCode === 'ICD-10 I10' ? 'Hipertensi Primer' : 'Evaluasi Diagnostik Klinis',
      icdCode: latestAiMsg?.icdCode || 'ICD-10 R69',
      confidence: latestAiMsg?.confidence || '92.0%',
      status: 'Terverifikasi',
      doctorNote: 'Sesi konsultasi disimpan dari Sesi Chat aktif oleh dr. Anita R.',
      messages: [...messages]
    };

    setHistoryList((prev) => [newSession, ...prev]);
    triggerToast(`Sesi konsultasi ${newSession.sessionCode} (${activePatient.name}) berhasil disimpan ke Riwayat!`);
  }, [activePatient, messages, triggerToast]);

  // Start new clean chat session
  const handleNewSession = useCallback((patientPreset?: { id: string; name: string; age: string; gender: string; bloodPressure: string; symptoms: string }) => {
    const randomId = Math.floor(4000 + Math.random() * 900);
    const p = patientPreset || {
      id: `#${randomId}`,
      name: 'Pasien Rawat Jalan Baru',
      age: '35 Th',
      gender: 'Pria',
      bloodPressure: '120/80 mmHg',
      symptoms: 'Belum ada keluhan tercatat'
    };

    setActivePatient(p);
    setMessages([
      {
        id: 'msg_new_1',
        sender: 'ai',
        text: `Sesi diagnosa baru dimulai untuk **${p.name} (${p.id})**.\n\nSilakan masukkan keluhan utama, parameter klinis, atau pilih contoh pertanyaan cepat di bawah.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveTab('chat');
    triggerToast(`Sesi baru untuk ${p.name} siap digunakan.`);
  }, [triggerToast]);

  // Load a session from History into the interactive chat
  const handleLoadSessionIntoChat = useCallback((session: HistorySession) => {
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
      setHistoryList(prev => prev.filter(item => item.id !== id));
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 'calc(100vh - 130px)' }}>
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

      {/* Header Banner: Title & Controls */}
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

          <div style={{
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
          }}>
            ● Medical LLM v2.4 Active
          </div>
        </div>
      </div>

      {/* Two-Tab Navigation Bar (Sesi Chat vs Riwayat) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #1E1E1E',
        paddingBottom: '2px',
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
              title="Simpan percakapan saat ini ke Riwayat"
              className="neo-btn-primary"
              style={{ padding: '7px 16px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldCheck size={16} strokeWidth={2.2} />
              <span>Simpan ke Riwayat</span>
            </button>
          ) : (
            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 600 }}>
              Menampilkan {filteredHistory.length} dari {historyList.length} sesi
            </span>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SESI CHAT                                         */}
      {/* ========================================================= */}
      {activeTab === 'chat' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: isFullscreen ? '100vh' : '620px',
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? 0 : 'auto',
          left: isFullscreen ? 0 : 'auto',
          right: isFullscreen ? 0 : 'auto',
          bottom: isFullscreen ? 0 : 'auto',
          zIndex: isFullscreen ? 99999 : 'auto',
          backgroundColor: isFullscreen ? '#FAF8F4' : 'transparent',
          padding: isFullscreen ? '20px' : 0
        }}>
          {/* Main Chat Conversation Container */}
          <div className="neo-card" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            boxShadow: isFullscreen ? '0 10px 40px rgba(0,0,0,0.2)' : '3px 4px 0px #1E1E1E',
            border: '2px solid #1E1E1E',
            borderRadius: '20px',
            height: isFullscreen ? 'calc(100vh - 40px)' : 'auto'
          }}>
            {/* Head Chat AI: Title, Status & Fullscreen Button */}
            <div style={{
              padding: '14px 24px',
              borderBottom: '1.8px solid #1E1E1E',
              backgroundColor: '#FAF8F4',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {/* Left Head: Chat Title & Online Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF3D6',
                  border: '1.5px solid #1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#92400E',
                  boxShadow: '1.5px 1.5px 0px #1E1E1E'
                }}>
                  <Bot size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.3px', margin: 0 }}>
                      Sesi Percakapan Asisten AI Diagnostik
                    </h3>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #1E1E1E',
                      color: '#166534',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      ● Online (v2.4)
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: '2px 0 0 0' }}>
                    Penalaran klinis instan berbasis ICD-10 & Panduan Medis Global
                  </p>
                </div>
              </div>

              {/* Right Head: Actions including Fullscreen Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Reset Chat Button */}
                <button
                  onClick={() => handleNewSession()}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#18181B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '1px 1.5px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                  title="Mulai sesi percakapan baru"
                >
                  <RotateCcw size={14} />
                  <span>Sesi Baru</span>
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(prev => !prev)}
                  style={{
                    backgroundColor: isFullscreen ? '#FEF3D6' : '#FFFFFF',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#18181B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '1.5px 2px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                  title={isFullscreen ? 'Keluar dari mode layar penuh' : 'Tampilkan mode layar penuh'}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 size={15} strokeWidth={2.2} />
                      <span>Keluar Layar Penuh</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 size={15} strokeWidth={2.2} />
                      <span>Layar Penuh</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Chat Messages Feed Area */}
            <div style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              backgroundColor: '#FAF8F4',
              minHeight: isFullscreen ? 'auto' : '420px',
              maxHeight: isFullscreen ? 'none' : '560px'
            }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: msg.sender === 'user' ? '#DCFCE7' : '#FEF3D6',
                    border: '1.5px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: msg.sender === 'user' ? '#166534' : '#92400E',
                    boxShadow: '1px 1px 0px #1E1E1E',
                    flexShrink: 0
                  }}>
                    {msg.sender === 'user' ? <User size={18} strokeWidth={2} /> : <Bot size={20} strokeWidth={2} />}
                  </div>

                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: '80%',
                    backgroundColor: '#FFFFFF',
                    border: '1.8px solid #1E1E1E',
                    padding: '16px 20px',
                    borderRadius: '18px',
                    color: '#18181B',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    boxShadow: msg.sender === 'user' ? '2.5px 3px 0px #1E1E1E' : '2px 2.5px 0px #1E1E1E'
                  }}>
                    {msg.icdCode && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                        <span className="tag-yellow" style={{ fontWeight: 800 }}>{msg.icdCode}</span>
                        {msg.confidence && <span className="tag-cyan" style={{ fontWeight: 700 }}>Keyakinan: {msg.confidence}</span>}
                      </div>
                    )}

                    {/* Attachment preview if present */}
                    {msg.attachment && (
                      <div style={{
                        marginBottom: '10px',
                        padding: '10px 12px',
                        borderRadius: '12px',
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
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            backgroundColor: msg.attachment.type === 'pdf' ? '#FEE2E2' : msg.attachment.type === 'docx' ? '#DBEAFE' : '#FEF3D6',
                            color: msg.attachment.type === 'pdf' ? '#991B1B' : msg.attachment.type === 'docx' ? '#1E40AF' : '#92400E',
                            border: '1px solid #1E1E1E'
                          }}>
                            {msg.attachment.type.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#18181B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {msg.attachment.name}
                          </span>
                          {msg.attachment.size && (
                            <span style={{ fontSize: '0.74rem', color: '#6B7280', marginLeft: 'auto' }}>
                              {msg.attachment.size}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      {renderFormattedMedicalText(msg.text)}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '8px', textAlign: 'right' }}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF3D6',
                    border: '1.5px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: '#92400E'
                  }}>
                    <Bot size={20} strokeWidth={2} />
                  </div>
                  <div style={{
                    padding: '12px 18px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '14px',
                    color: '#52525B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    boxShadow: '1.5px 2px 0px #1E1E1E'
                  }}>
                    <span>MediagnoTek AI sedang menganalisis data klinis pasien...</span>
                  </div>
                </div>
              )}
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
                    <Sparkles size={14} style={{ color: '#92400E' }} />
                    <span>Rekomendasi Pertanyaan Klinis Cepat</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#92400E',
                      backgroundColor: '#FEF3D6',
                      padding: '1px 7px',
                      borderRadius: '9999px',
                      border: '1px solid #FDE68A'
                    }}>
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
                    <Sparkles size={13} />
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
            <div style={{ padding: '16px 24px', borderTop: '1.8px solid #1E1E1E', backgroundColor: '#FFFFFF', position: 'relative' }}>
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                {/* Paperclip Button with Toggle Menu */}
                <button
                  type="button"
                  title="Lampirkan File Medis (Gambar, PDF, DOCX, Kamera)"
                  onClick={() => setIsAttachMenuOpen(prev => !prev)}
                  style={{
                    backgroundColor: isAttachMenuOpen ? '#FEF3D6' : '#FAF8F4',
                    border: '1.5px solid #1E1E1E',
                    color: isAttachMenuOpen ? '#92400E' : '#18181B',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '1px 1.5px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Paperclip size={18} strokeWidth={2.2} />
                </button>

                <input
                  type="text"
                  className="form-input-neo"
                  placeholder={stagedAttachment ? `Ketik catatan atau pertanyaan untuk lampiran "${stagedAttachment.name}"...` : "Ketik keluhan, parameter vital, atau kombinasi gejala pasien di sini..."}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  style={{ flex: 1, padding: '12px 18px' }}
                />

                <button
                  type="submit"
                  disabled={(!inputQuery.trim() && !stagedAttachment) || isTyping}
                  className="neo-btn-primary"
                  style={{
                    padding: '12px 24px',
                    opacity: (!inputQuery.trim() && !stagedAttachment) || isTyping ? 0.6 : 1,
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Kirim</span>
                  <Send size={15} strokeWidth={2.2} />
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
                94.5%
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
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Pneumonia (J18)
              </div>
              <div style={{ fontSize: '0.76rem', color: '#92400E', marginTop: '4px', fontWeight: 600 }}>
                Diikuti Diabetes Tipe 2 (E11)
              </div>
            </div>

            <div className="neo-card" style={{ padding: '18px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                <ShieldCheck size={16} />
                <span>Status Verifikasi Dokter</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#18181B' }}>
                {historyList.filter(h => h.status === 'Terverifikasi').length} / {historyList.length}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#166534', marginTop: '4px', fontWeight: 600 }}>
                Disetujui dr. Anita R.
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
                        <strong>Keluhan:</strong> {item.chiefComplaint}
                      </div>
                    </div>

                    {/* Right: AI Diagnostic Result */}
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Hasil Diagnosa AI & ICD-10
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#18181B' }}>
                          {item.primaryDiagnosis}
                        </span>
                        <span className="tag-yellow" style={{ fontWeight: 800 }}>{item.icdCode}</span>
                        <span className="tag-cyan" style={{ fontWeight: 700 }}>Keyakinan: {item.confidence}</span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#4B5563', lineHeight: 1.45 }}>
                        <strong>Catatan Klinis:</strong> {item.doctorNote}
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
                  Transkrip Percakapan Sesi ({selectedHistoryModal.messages.length} Pesan):
                </h4>
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: '#FAF8F4', borderRadius: '12px', border: '1.2px solid #1E1E1E' }}>
                  {selectedHistoryModal.messages.map((m) => (
                    <div key={m.id} style={{ fontSize: '0.82rem', padding: '8px 10px', backgroundColor: '#FFFFFF', border: '1px solid #1E1E1E', borderRadius: '8px' }}>
                      <strong style={{ color: m.sender === 'user' ? '#166534' : '#92400E' }}>
                        {m.sender === 'user' ? 'Dokter' : 'MediagnoTek AI'}:
                      </strong>
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
