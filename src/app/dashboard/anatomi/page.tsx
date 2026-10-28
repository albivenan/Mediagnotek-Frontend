'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Activity,
  Heart,
  Brain,
  Wind,
  Layers,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Info,
  Pill,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Flame,
  Stethoscope,
  Eye,
  Maximize2,
  Search,
  X,
  MapPin,
  BookOpen,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface OrganData {
  id: string;
  name: string;
  system: 'Saraf' | 'Kardiovaskular' | 'Respirasi' | 'Pencernaan' | 'Ekskresi' | 'Muskuloskeletal';
  description: string;
  whatIs: string;
  location: string;
  position: [number, number, number];
  color: number;
  highlightColor: string;
  imageUrl?: string;
  commonDiseases: {
    nama: string;
    gejala: string;
    rekomendasiObat: string[];
    penyembuhan: string;
    pencegahan: string;
    estimasiPemulihan: string;
  }[];
  clinicalNotes: string;
}

const ORGANS: OrganData[] = [
  {
    id: 'brain',
    name: 'Otak (Encephalon) & Kepala',
    system: 'Saraf',
    description: 'Pusat kendali sistem saraf pusat yang mengatur seluruh fungsi kognitif, motorik, sensorik, memori, emosi, dan regulasi otonom tubuh.',
    whatIs: 'Otak adalah organ terpenting dan paling kompleks dalam tubuh manusia, tersusun atas lebih dari 86 miliar sel saraf (neuron) dan miliaran sel glia. Otak terbagi menjadi cerebrum (otak besar), cerebellum (otak kecil), dan batang otak (brainstem). Bertindak sebagai "prosesor pusat" yang memproses sinyal sensorik dari pancaindra, mengkoordinasi gerakan otot volunter, serta mengontrol fungsi vital seperti pernapasan dan detak jantung.',
    location: 'Terletak di dalam rongga tengkorak kepala (cavum cranii), terlindungi oleh tulang kranium yang kokoh, tiga lapisan selaput meninges (duramater, arachnoid, piamater), dan terendam dalam cairan serebrospinal (CSF).',
    position: [0, 4.4, 0],
    color: 0xE879F9,
    highlightColor: '#C026D3',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Brain_human_sagittal_section.svg/500px-Brain_human_sagittal_section.svg.png',
    commonDiseases: [
      {
        nama: 'Cephalea / Tension Headache',
        gejala: 'Nyeri kepala tegang seperti diikat atau ditekan beban berat, kekakuan otot leher dan pundak.',
        rekomendasiObat: ['Paracetamol 500mg', 'Ibuprofen 400mg', 'Kombinasi Paracetamol + Kafein'],
        penyembuhan: 'Istirahat di ruangan tenang dengan pencahayaan redup, kompres hangat/dingin di area tengkuk dan pelipis, pemijatan otot trapezius, teknik pernapasan dalam, dan hidrasi air putih minimal 2 liter/hari.',
        pencegahan: 'Menjaga postur ergonomis saat bekerja di depan layar komputer, peregangan leher setiap 45 menit, mengelola stres emosional, dan jadwal tidur teratur 7-8 jam.',
        estimasiPemulihan: '2 hingga 6 jam pasca analgesik & relaksasi'
      },
      {
        nama: 'Migrain Vaskular Akut',
        gejala: 'Nyeri kepala berdenyut unilateral (sebelah), fotofobia, fonofobia, mual dan muntah.',
        rekomendasiObat: ['Sumatriptan 50mg', 'Paracetamol + Metoclopramide', 'Ergotamine Tartrate + Kafein'],
        penyembuhan: 'Tidur di kamar yang gelap dan hening tanpa suara, kompres es di dahi atau pangkal leher, konsumsi obat pereda migrain segera pada fase awal aura, hindari konsumsi kafein berlebih.',
        pencegahan: 'Menghindari makanan pemicu (keju tua, cokelat, MSG, pemanis buatan), hindari telat makan, batasi paparan cahaya menyilaukan, dan catat pemicu dalam buku harian migrain.',
        estimasiPemulihan: '12 hingga 24 jam dengan penanganan adekuat'
      },
      {
        nama: 'Stroke Iskemik Akut / TIA (Pencegahan Sekunder)',
        gejala: 'Hemiparesis mendadak (kelemahan sebelah anggota gerak), pelo/bicara cadel, wajah perot.',
        rekomendasiObat: ['Aspirin (Asam Asetilsalisilat) 80mg', 'Clopidogrel 75mg', 'Citicoline 500mg / 1000mg', 'Atorvastatin 40mg'],
        penyembuhan: 'Tindakan gawat darurat medis Golden Period (< 4.5 jam), terapi trombolisis, rehabilitasi fisioterapi motorik rutin, terapi wicara, dan neurorestorasi jangka panjang.',
        pencegahan: 'Kontrol ketat tekanan darah (< 130/80 mmHg), kadar LDL kolesterol (< 70 mg/dL), stop merokok, diet rendah natrium DASH, dan kepatuhan antiplatelet seumur hidup.',
        estimasiPemulihan: '3 hingga 6 bulan rehabilitasi intensif'
      },
      {
        nama: 'Epilepsi & Kejang Parsial / Umum',
        gejala: 'Kejang berulang, penurunan kesadaran tiba-tiba, sentakan ritmis ekstremitas.',
        rekomendasiObat: ['Asam Valproat 250mg/500mg', 'Karbamazepin 200mg', 'Fenitoin Natrium 100mg'],
        penyembuhan: 'Saat serangan: baringkan pasien menyamping (posisi pemulihan), jauhkan benda tajam, longgarkan pakaian leher, jangan masukkan benda apapun ke mulut, amati durasi kejang.',
        pencegahan: 'Konsumsi rutin OAE (Obat Anti-Epilepsi) tanpa jeda dosis, hindari kurang tidur (sleep deprivation), hindari paparan lampu strobo/kelap-kelip cepat, dan hindari konsumsi alkohol.',
        estimasiPemulihan: 'Remisi bebas kejang dengan kepatuhan terapi 2-3 tahun'
      }
    ],
    clinicalNotes: 'Skrining kontraindikasi ergotamine/triptan pada pasien dengan riwayat penyakit vaskular perifer, PJK, atau hipertensi tidak terkontrol. Pada terapi antikonvulsan, pantau fungsi hepar dan interaksi enzim CYP450.'
  },
  {
    id: 'lungs',
    name: 'Paru-paru (Pulmo Dextra & Sinistra)',
    system: 'Respirasi',
    description: 'Organ respirasi utama penukar oksigen dan karbon dioksida melalui alveoli mikroskopis.',
    whatIs: 'Paru-paru adalah organ pernapasan vital spons yang menyerap oksigen dari udara yang dihirup ke dalam aliran darah dan melepaskan karbon dioksida sisa metabolisme keluar dari tubuh. Memiliki luas permukaan pertukaran gas setara lapangan tenis berkat sekitar 300-500 juta kantung alveoli.',
    location: 'Terletak di dalam rongga dada (cavum thoracis), mengapit jantung, dilindungi oleh tulang sangkar iga (costae), dan dilapisi oleh membran serosa ganda bernama pleura.',
    position: [0, 2.7, 0.15],
    color: 0x38BDF8,
    highlightColor: '#0284C7',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Lungs_diagram_detailed.svg/500px-Lungs_diagram_detailed.svg.png',
    commonDiseases: [
      {
        nama: 'Asma Bronkial',
        gejala: 'Mengi (wheezing), sesak napas saat malam/dingin, batuk kering.',
        rekomendasiObat: ['Salbutamol Inhaler 100mcg', 'Budesonide Inhaler', 'Kombinasi Salmeterol + Fluticasone'],
        penyembuhan: 'Gunakan bronkodilator inhalasi kerja cepat (SABA), posisi duduk tegak, latihan pernapasan bibir terkatup (pursed-lip breathing), inhalasi uap hangat bila perlu.',
        pencegahan: 'Hindari alergen tungau debu rumah, bulu hewan, udara dingin ekstrem, gunakan sprei hypoallergenic, dan bersihkan filter AC secara berkala.',
        estimasiPemulihan: 'Mereda 15-30 menit pasca inhaler controller'
      },
      {
        nama: 'PPOK (Penyakit Paru Obstruktif Kronis)',
        gejala: 'Batuk produktif kronis, sesak bertahap, riwayat paparan polusi/rokok.',
        rekomendasiObat: ['Tiotropium Bromide', 'Ipratropium Bromide', 'Mukolitik N-Asetilsistein'],
        penyembuhan: 'Program rehabilitasi paru, terapi oksigen jangka panjang (LTOT) jika hipoksemia, fisioterapi dada untuk pembersihan sputum lendir.',
        pencegahan: 'Berhenti merokok total (smoking cessation), hindari paparan polusi asap biomassa/industri, vaksinasi influenza tahunan dan pneumokokus.',
        estimasiPemulihan: 'Manajemen stabilisasi gejala jangka panjang kronis'
      }
    ],
    clinicalNotes: 'Cek riwayat alergi aerosol inhaler dan edukasi cara penggunaan MDI (Metered Dose Inhaler) yang benar kepada pasien.'
  },
  {
    id: 'heart',
    name: 'Jantung (Cor)',
    system: 'Kardiovaskular',
    description: 'Pompa muskular 4 ruang yang memompa darah teroksigenasi ke sirkulasi sistemik dan darah deoksigenasi ke paru.',
    whatIs: 'Jantung adalah organ muskular berongga berukuran sekitar kepalan tangan yang berdetak sekitar 100.000 kali per hari untuk mendistribusikan darah kaya nutrisi dan oksigen ke seluruh sel tubuh tanpa henti seumur hidup.',
    location: 'Terletak di mediastinum tengah rongga dada, di antara kedua paru-paru, tepat di belakang tulang dada (sternum), dengan apeks (ujung bawah) mengarah sedikit ke kiri rongga dada.',
    position: [-0.28, 2.45, 0.45],
    color: 0xEF4444,
    highlightColor: '#DC2626',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Heart_diagram-en.svg/500px-Heart_diagram-en.svg.png',
    commonDiseases: [
      {
        nama: 'Hipertensi Primer Esensial',
        gejala: 'Tekanan darah ≥ 140/90 mmHg, rasa pegal di tengkuk, pusing.',
        rekomendasiObat: ['Amlodipine Besylate 5mg/10mg', 'Candesartan Cilexetil 8mg', 'Bisoprolol Fumarate 5mg'],
        penyembuhan: 'Diet DASH (rendah garam natrium < 2 gram/hari), olahraga aerobik kardio sedang (jalan cepat 30 menit 5x seminggu), penurunan berat badan menuju IMT ideal.',
        pencegahan: 'Batasi konsumsi garam dan makanan olahan instan, hindari rokok & alkohol, kelola stres, dan monitor tensi berkala di rumah (HBPM).',
        estimasiPemulihan: 'Terkontrol stabil dalam 2-4 minggu terapi'
      },
      {
        nama: 'Angina Pektoris Stabil',
        gejala: 'Nyeri dada retrosternal menjalar ke lengan kiri atau rahang saat aktivitas fisik.',
        rekomendasiObat: ['Isosorbide Dinitrate (ISDN) 5mg Sublingual', 'Aspirin 80mg', 'Atorvastatin 20mg'],
        penyembuhan: 'Segera hentikan seluruh aktivitas dan duduk istirahat, letakkan 1 tablet ISDN di bawah lidah (sublingual), bernapas perlahan dan tenang.',
        pencegahan: 'Kontrol kadar kolesterol LDL, hindari aktivitas fisik mendadak yang berat tanpa pemanasan, hindari makan terlalu kenyang, kelola emosi.',
        estimasiPemulihan: 'Nyeri mereda 3-5 menit setelah nitrat sublingual'
      }
    ],
    clinicalNotes: 'Perhatikan skrining interaksi obat CCB (Amlodipine) dengan inhibitor CYP3A4 kuat dan pantau profil lipid berkala.'
  },
  {
    id: 'liver',
    name: 'Hati (Hepar)',
    system: 'Pencernaan',
    description: 'Kelenjar terbesar tubuh yang bertanggung jawab atas detoksifikasi racun, sintesis protein plasma, dan metabolisme obat (sitokrom P450).',
    whatIs: 'Hati adalah "pabrik biokimia" tubuh seberat 1.5 kg yang menjalankan lebih dari 500 fungsi penting, termasuk memetabolisme karbohidrat, lemak, dan protein, memproduksi cairan empedu untuk mencerna lemak, serta menyaring racun dan sisa metabolit obat.',
    location: 'Terletak di kuadran kanan atas rongga perut (hipokondrium dextra), tepat di bawah diafragma dan dilindungi oleh lengkung iga bawah.',
    position: [0.45, 1.6, 0.35],
    color: 0xEA580C,
    highlightColor: '#C2410C',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Liver_Diagram.svg/500px-Liver_Diagram.svg.png',
    commonDiseases: [
      {
        nama: 'Fatty Liver Disease (NAFLD)',
        gejala: 'Kelelahan, rasa tidak nyaman di perut kanan atas, peningkatan enzim SGOT/SGPT.',
        rekomendasiObat: ['Curcuma Extract / Hepatoprotektor', 'Vitamin E 400 IU', 'Metformin (jika ada resistensi insulin)'],
        penyembuhan: 'Penurunan berat badan bertahap 7-10%, pola makan diet Mediterania tinggi serat, olahraga teratur membakar cadangan trigliserida hati.',
        pencegahan: 'Hindari konsumsi fruktosa tinggi dan minuman berpemanis kemasan, batasi makanan tinggi lemak jenuh/gorengan, hindari alkohol.',
        estimasiPemulihan: 'Perbaikan enzim hati dalam 3-6 bulan gaya hidup sehat'
      },
      {
        nama: 'Hepatitis Medikamentosa (DILI)',
        gejala: 'Ikterus ringan, mual, riwayat pemakaian hepatotoksik jangka panjang.',
        rekomendasiObat: ['N-Acetylcysteine (NAC)', 'Penghentian obat hepatotoksik', 'Asam Ursodeoksikolat (UDCA)'],
        penyembuhan: 'Hentikan segera seluruh obat atau suplemen pemicu hepatotoksisitas, hidrasi cairan cukup, tirah baring hingga enzim hepar menurun.',
        pencegahan: 'Tidak mengonsumsi obat tanpa indikasi dokter/apoteker, hindari kombinasi paracetamol dengan alkohol, cek berkala SGOT/SGPT.',
        estimasiPemulihan: '1 hingga 3 bulan pasca penghentian obat pemicu'
      }
    ],
    clinicalNotes: 'Waspadai dosis kumulatif paracetamol > 4 gram/hari pada pasien dengan gangguan hepar kronis.'
  },
  {
    id: 'stomach',
    name: 'Lambung (Gaster)',
    system: 'Pencernaan',
    description: 'Organ muskular berongga berbentuk huruf J yang mensekresi asam lambung (HCl) dan pepsin untuk pencernaan bolus makanan.',
    whatIs: 'Lambung adalah reservoar makanan elastis yang mengolah makanan secara mekanik (gerakan peristaltik) dan kimiawi (asam lambung dan enzim proteolitik pepsinogen) menjadi kimus semi-cair sebelum disalurkan ke usus halus.',
    location: 'Terletak di kuadran kiri atas rongga abdomen (regio epigastrium dan hipokondrium sinistra), tepat di bawah diafragma dan bersebelahan dengan limpa.',
    position: [-0.35, 1.5, 0.35],
    color: 0xF59E0B,
    highlightColor: '#D97706',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Stomach_diagram.svg/500px-Stomach_diagram.svg.png',
    commonDiseases: [
      {
        nama: 'GERD (Gastroesophageal Reflux Disease)',
        gejala: 'Rasa terbakar di dada (heartburn), regurgitasi asam, rasa pahit di lidah.',
        rekomendasiObat: ['Omeprazole 20mg', 'Lansoprazole 30mg', 'Antasida Suspensi (kombinasi MgOH + AlOH)'],
        penyembuhan: 'Tinggikan posisi kepala saat tidur 15-20 cm, hindari langsung berbaring setelah makan (tunggu minimal 2-3 jam), makan porsi kecil tapi sering.',
        pencegahan: 'Hindari konsumsi kopi, teh pekat, cokelat, makanan pedas, asam, dan bersantan tinggi, hindari pakaian yang menekan perut.',
        estimasiPemulihan: '2 hingga 4 minggu terapi PPI rutin'
      },
      {
        nama: 'Dispepsia Fungsional & Tukak Lambung',
        gejala: 'Nyeri epigastrium / ulu hati, kembung cepat kenyang, mual muntah.',
        rekomendasiObat: ['Sukralfat Suspensi', 'Domperidone 10mg', 'Famotidine 20mg'],
        penyembuhan: 'Minum air hangat, konsumsi makanan lunak mudah cerna (bubur/oatmeal), hindari perut kosong berkepanjangan, kelola kecemasan.',
        pencegahan: 'Jadwal makan teratur, hindari penggunaan obat NSAID (seperti Asam Mefenamat/Natrium Diklofenak) tanpa pelindung lambung, hindari rokok.',
        estimasiPemulihan: '1 hingga 2 minggu penyesuaian diet dan sitoprotektor'
      }
    ],
    clinicalNotes: 'Edukasi konsumsi obat PPI 30-60 menit sebelum makan pagi untuk bioavailabilitas dan efektivitas optimal.'
  },
  {
    id: 'kidneys',
    name: 'Ginjal (Ren Sinistra & Dextra)',
    system: 'Ekskresi',
    description: 'Sepasang organ penyaring darah retroperitoneal yang menjaga keseimbangan elektrolit, osmolalitas cairan, dan tekanan darah via sistem RAAS.',
    whatIs: 'Ginjal adalah organ berbentuk kacang merah yang menyaring sekitar 180 liter darah per hari untuk membuang zat sisa metabolisme (urea, kreatinin, asam urat), mengatur volume cairan dan tekanan darah, serta memproduksi hormon eritropoietin dan kalsitriol (vitamin D aktif).',
    location: 'Terletak di dinding posterior rongga perut di ruang retroperitoneal (di belakang peritoneum), setinggi vertebra T12 hingga L3. Ginjal kanan berada sedikit lebih rendah dari ginjal kiri karena terdesak oleh hati.',
    position: [0, 1.25, -0.35],
    color: 0x8B5CF6,
    highlightColor: '#7C3AED',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/KidneyStructures.svg/500px-KidneyStructures.svg.png',
    commonDiseases: [
      {
        nama: 'Nefrolitiasis (Batu Ginjal)',
        gejala: 'Nyeri kolik pinggang menjalar ke selangkangan, disuria, hematuria.',
        rekomendasiObat: ['Asam Mefenamat / Ketorolac (analgesik kolik)', 'Kalium Sitrat', 'Tamsulosin 0.4mg'],
        penyembuhan: 'Hidrasi cairan intensif (2.5 - 3 liter air putih per hari untuk membantu pengeluaran batu kecil < 5mm), kompres hangat pinggang untuk meredakan spasme.',
        pencegahan: 'Batasi konsumsi makanan tinggi oksalat (bayam, kacang-kacangan), kurangi asupan purin/asam urat, jangan menahan buang air kecil.',
        estimasiPemulihan: '1 hingga 2 minggu pasca pengeluaran fragmen batu'
      },
      {
        nama: 'Infeksi Saluran Kemih (ISK / Pielonefritis)',
        gejala: 'Demam menggigil, nyeri sudut kostovertebra, urgensi berkemih.',
        rekomendasiObat: ['Ciprofloxacin 500mg', 'Levofloxacin 500mg', 'Cefixime 200mg'],
        penyembuhan: 'Habiskan antibiotik sesuai resep dokter tanpa putus, minum banyak air putih untuk membilas bakteri dari saluran kemih, istirahat cukup.',
        pencegahan: 'Bersihkan area genital dari depan ke belakang, segera berkemih setelah berhubungan seksual, hindari penggunaan pembersih kewanitaan berpewangi keras.',
        estimasiPemulihan: '3 hingga 7 hari terapi antibiotik sensitif'
      }
    ],
    clinicalNotes: 'Wajib melakukan penyesuaian dosis obat antibiotik / NSAID berdasarkan estimasi nilai laju filtrasi glomerulus (eGFR).'
  }
];

export default function AnatomiPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData>(ORGANS[2]); // Default Jantung
  const [activeSystemFilter, setActiveSystemFilter] = useState<string>('ALL');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'hologram' | 'solid' | 'xray'>('hologram');
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [diseaseSearchTerm, setDiseaseSearchTerm] = useState<string>('');
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const organMeshesRef = useRef<{ [key: string]: THREE.Mesh | THREE.Group }>({});
  const bodyGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0F1D);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 8.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights (Dioptimalkan untuk Background Putih Medis Bersih)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0284C7, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xC026D3, 1.4);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xF59E0B, 1.5, 10);
    pointLight.position.set(0, 2.5, 3);
    scene.add(pointLight);

    // 5. Grid Ground & Pedestal (Warna Halus untuk Background Putih)
    const gridHelper = new THREE.GridHelper(10, 20, 0x0284C7, 0xCBD5E1);
    gridHelper.position.y = -2.8;
    scene.add(gridHelper);

    // 6. Root Body Group
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = -0.6;
    scene.add(bodyGroup);
    bodyGroupRef.current = bodyGroup;

    // Helper: Material Creator
    const createBodyMaterial = (color: number, opacity: number, wireframe = false) => {
      return new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity,
        roughness: 0.2,
        metalness: 0.1,
        transmission: 0.7,
        ior: 1.3,
        thickness: 0.8,
        wireframe,
        emissive: color,
        emissiveIntensity: 0.15
      });
    };

    // 7. Human Silhouette Geometry
    // Head
    const headGeo = new THREE.SphereGeometry(0.72, 32, 32);
    headGeo.scale(1, 1.25, 1.05);
    const headMesh = new THREE.Mesh(headGeo, createBodyMaterial(0x38BDF8, 0.22));
    headMesh.position.set(0, 4.4, 0);
    bodyGroup.add(headMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.32, 0.38, 0.6, 24);
    const neckMesh = new THREE.Mesh(neckGeo, createBodyMaterial(0x38BDF8, 0.2));
    neckMesh.position.set(0, 3.4, 0);
    bodyGroup.add(neckMesh);

    // Torso / Chest
    const chestGeo = new THREE.CylinderGeometry(1.2, 0.95, 1.7, 32);
    chestGeo.scale(1.25, 1, 0.82);
    const chestMesh = new THREE.Mesh(chestGeo, createBodyMaterial(0x38BDF8, 0.18));
    chestMesh.position.set(0, 2.3, 0);
    bodyGroup.add(chestMesh);

    // Abdomen / Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.95, 1.05, 1.4, 32);
    pelvisGeo.scale(1.15, 1, 0.8);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, createBodyMaterial(0x38BDF8, 0.18));
    pelvisMesh.position.set(0, 0.9, 0);
    bodyGroup.add(pelvisMesh);

    // Arms
    const createArm = (isLeft: boolean) => {
      const armGroup = new THREE.Group();
      const x = isLeft ? -1.65 : 1.65;
      const angle = isLeft ? 0.15 : -0.15;

      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 1.5, 20), createBodyMaterial(0x38BDF8, 0.2));
      upperArm.position.set(x, 2.1, 0);
      upperArm.rotation.z = angle;
      armGroup.add(upperArm);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 1.4, 20), createBodyMaterial(0x38BDF8, 0.2));
      forearm.position.set(x * 1.15, 0.75, 0.05);
      forearm.rotation.z = angle * 0.7;
      armGroup.add(forearm);
      return armGroup;
    };
    bodyGroup.add(createArm(true));
    bodyGroup.add(createArm(false));

    // Legs
    const createLeg = (isLeft: boolean) => {
      const legGroup = new THREE.Group();
      const x = isLeft ? -0.55 : 0.55;

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.32, 1.8, 24), createBodyMaterial(0x38BDF8, 0.2));
      thigh.position.set(x, -0.65, 0);
      legGroup.add(thigh);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 1.9, 24), createBodyMaterial(0x38BDF8, 0.2));
      shin.position.set(x, -2.4, 0);
      legGroup.add(shin);

      return legGroup;
    };
    bodyGroup.add(createLeg(true));
    bodyGroup.add(createLeg(false));

    // Outer Body Wireframe Halo
    const outerWireframeGeo = new THREE.CapsuleGeometry(1.4, 4.4, 16, 24);
    const outerWireframeMat = new THREE.MeshBasicMaterial({
      color: 0x0284C7,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const outerHalo = new THREE.Mesh(outerWireframeGeo, outerWireframeMat);
    outerHalo.position.y = 1.4;
    bodyGroup.add(outerHalo);

    // 8. Interactive 3D Organs
    const organMeshes: { [key: string]: THREE.Mesh | THREE.Group } = {};

    // A. Brain Mesh
    const brainGeo = new THREE.SphereGeometry(0.48, 24, 24);
    brainGeo.scale(1, 1.15, 1.25);
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0xE879F9,
      emissive: 0x701A75,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.2
    });
    const brainMesh = new THREE.Mesh(brainGeo, brainMat);
    brainMesh.position.set(0, 4.4, 0);
    brainMesh.name = 'brain';
    bodyGroup.add(brainMesh);
    organMeshes['brain'] = brainMesh;

    // B. Lungs (Dextra & Sinistra)
    const lungsGroup = new THREE.Group();
    lungsGroup.position.set(0, 2.65, 0.1);
    lungsGroup.name = 'lungs';

    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      emissive: 0x0369A1,
      emissiveIntensity: 0.55,
      roughness: 0.4
    });

    const leftLungGeo = new THREE.CapsuleGeometry(0.36, 0.8, 16, 16);
    leftLungGeo.scale(1.1, 1, 0.7);
    const leftLung = new THREE.Mesh(leftLungGeo, lungMat);
    leftLung.position.set(-0.55, 0, 0);
    leftLung.rotation.z = -0.15;
    lungsGroup.add(leftLung);

    const rightLungGeo = new THREE.CapsuleGeometry(0.38, 0.82, 16, 16);
    rightLungGeo.scale(1.15, 1, 0.7);
    const rightLung = new THREE.Mesh(rightLungGeo, lungMat);
    rightLung.position.set(0.55, 0, 0);
    rightLung.rotation.z = 0.15;
    lungsGroup.add(rightLung);

    bodyGroup.add(lungsGroup);
    organMeshes['lungs'] = lungsGroup;

    // C. Heart (Cor) with Pulsing Glow
    const heartGeo = new THREE.DodecahedronGeometry(0.35, 2);
    heartGeo.scale(1.1, 1.25, 0.95);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xEF4444,
      emissive: 0xB91C1C,
      emissiveIntensity: 0.9,
      roughness: 0.25,
      metalness: 0.3
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(-0.25, 2.45, 0.38);
    heartMesh.rotation.z = 0.25;
    heartMesh.name = 'heart';
    bodyGroup.add(heartMesh);
    organMeshes['heart'] = heartMesh;

    // D. Liver (Hepar)
    const liverGeo = new THREE.ConeGeometry(0.65, 0.7, 24);
    liverGeo.scale(1.3, 0.8, 0.9);
    const liverMat = new THREE.MeshStandardMaterial({
      color: 0xEA580C,
      emissive: 0x9A3412,
      emissiveIntensity: 0.55,
      roughness: 0.4
    });
    const liverMesh = new THREE.Mesh(liverGeo, liverMat);
    liverMesh.position.set(0.42, 1.6, 0.3);
    liverMesh.rotation.z = -1.2;
    liverMesh.rotation.y = 0.4;
    liverMesh.name = 'liver';
    bodyGroup.add(liverMesh);
    organMeshes['liver'] = liverMesh;

    // E. Stomach (Gaster)
    const stomachGeo = new THREE.TorusGeometry(0.32, 0.18, 16, 32, Math.PI * 1.3);
    const stomachMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      emissive: 0xB45309,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const stomachMesh = new THREE.Mesh(stomachGeo, stomachMat);
    stomachMesh.position.set(-0.35, 1.48, 0.32);
    stomachMesh.rotation.z = 0.6;
    stomachMesh.rotation.x = 0.2;
    stomachMesh.name = 'stomach';
    bodyGroup.add(stomachMesh);
    organMeshes['stomach'] = stomachMesh;

    // F. Kidneys (Ren Sinistra & Dextra)
    const kidneyGroup = new THREE.Group();
    kidneyGroup.position.set(0, 1.25, -0.28);
    kidneyGroup.name = 'kidneys';

    const kidneyMat = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6,
      emissive: 0x5B21B6,
      emissiveIntensity: 0.6,
      roughness: 0.35
    });

    const kidneyGeo = new THREE.SphereGeometry(0.22, 16, 16);
    kidneyGeo.scale(0.8, 1.3, 0.8);

    const leftKidney = new THREE.Mesh(kidneyGeo, kidneyMat);
    leftKidney.position.set(-0.48, 0, 0);
    leftKidney.rotation.z = -0.2;
    kidneyGroup.add(leftKidney);

    const rightKidney = new THREE.Mesh(kidneyGeo, kidneyMat);
    rightKidney.position.set(0.48, 0, 0);
    rightKidney.rotation.z = 0.2;
    kidneyGroup.add(rightKidney);

    bodyGroup.add(kidneyGroup);
    organMeshes['kidneys'] = kidneyGroup;

    organMeshesRef.current = organMeshes;

    // 9. Interactive Hotspot Rings (Pulse Indicators)
    const ringsGroup = new THREE.Group();
    bodyGroup.add(ringsGroup);

    ORGANS.forEach((org) => {
      const ringGeo = new THREE.RingGeometry(0.15, 0.22, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: org.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(org.position[0], org.position[1], org.position[2] + 0.35);
      ringsGroup.add(ring);
    });

    // 10. Mouse Interaction (Orbit Dragging & Raycasting)
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!bodyGroupRef.current) return;
      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        bodyGroupRef.current.rotation.y += deltaX * 0.008;
        bodyGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, bodyGroupRef.current.rotation.x + deltaY * 0.005));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      // Raycasting for Hover Detection
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const clickableMeshes: THREE.Object3D[] = [];
      Object.values(organMeshesRef.current).forEach((obj) => {
        if (obj instanceof THREE.Mesh) clickableMeshes.push(obj);
        if (obj instanceof THREE.Group) clickableMeshes.push(...obj.children);
      });

      const intersects = raycaster.intersectObjects(clickableMeshes, true);
      if (intersects.length > 0) {
        const first = intersects[0].object;
        let foundId: string | null = null;
        Object.entries(organMeshesRef.current).forEach(([id, mesh]) => {
          if (mesh === first || (mesh instanceof THREE.Group && mesh.children.includes(first as THREE.Mesh))) {
            foundId = id;
          }
        });
        setHoveredOrgan(foundId);
        container.style.cursor = 'pointer';
      } else {
        setHoveredOrgan(null);
        container.style.cursor = 'grab';
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const clickableMeshes: THREE.Object3D[] = [];
      Object.values(organMeshesRef.current).forEach((obj) => {
        if (obj instanceof THREE.Mesh) clickableMeshes.push(obj);
        if (obj instanceof THREE.Group) clickableMeshes.push(...obj.children);
      });

      const intersects = raycaster.intersectObjects(clickableMeshes, true);
      if (intersects.length > 0) {
        const first = intersects[0].object;
        Object.entries(organMeshesRef.current).forEach(([id, mesh]) => {
          if (mesh === first || (mesh instanceof THREE.Group && mesh.children.includes(first as THREE.Mesh))) {
            const org = ORGANS.find((o) => o.id === id);
            if (org) setSelectedOrgan(org);
          }
        });
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(4.5, Math.min(12, cameraRef.current.position.z + e.deltaY * 0.005));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow Auto-rotation if enabled
      if (isRotating && !isMouseDown && bodyGroupRef.current) {
        bodyGroupRef.current.rotation.y += 0.004;
      }

      // Heart Pulsing (Systole & Diastole simulation)
      if (organMeshesRef.current['heart']) {
        const pulse = 1 + Math.sin(elapsed * 4.5) * 0.06;
        organMeshesRef.current['heart'].scale.set(pulse * 1.1, pulse * 1.25, pulse * 0.95);
      }

      // Lungs Breathing (Inhalation & Exhalation)
      if (organMeshesRef.current['lungs']) {
        const breath = 1 + Math.sin(elapsed * 1.8) * 0.04;
        organMeshesRef.current['lungs'].scale.set(breath, breath, breath);
      }

      // Hotspot Ring Pulse
      ringsGroup.children.forEach((r, idx) => {
        const scale = 1 + Math.sin(elapsed * 3 + idx) * 0.15;
        r.scale.set(scale, scale, 1);
        r.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [isRotating]);

  // Handle Focus Zoom onto specific organ
  const handleSelectOrgan = (organ: OrganData) => {
    setSelectedOrgan(organ);
    if (!bodyGroupRef.current || !cameraRef.current) return;
    // Animate camera target
    bodyGroupRef.current.rotation.y = 0;
    bodyGroupRef.current.rotation.x = 0;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? -1 : 1;
    cameraRef.current.position.z = Math.max(4.5, Math.min(12, cameraRef.current.position.z + factor));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !bodyGroupRef.current) return;
    cameraRef.current.position.set(0, 2.2, 8.5);
    bodyGroupRef.current.rotation.set(0, 0, 0);
  };

  const filteredOrgans = ORGANS.filter((o) => {
    const matchesSystem = activeSystemFilter === 'ALL' || o.system === activeSystemFilter;
    const matchesSearch = !searchTerm.trim() || 
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.commonDiseases.some(d => d.nama.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSystem && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Responsive Stylesheet for Anatomi Banner */}
      <style>{`
        .anatomi-banner-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 24px;
          align-items: center;
        }
        .anatomi-text-col {
          display: flex;
          flex-direction: column;
          gap: 18px;
          justify-content: center;
          order: 1;
        }
        .anatomi-visual-frame {
          width: 100%;
          max-width: 380px;
          aspect-ratio: 1 / 1;
          margin: 0 auto;
          order: 2;
        }
        @media (max-width: 900px) {
          .anatomi-banner-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .anatomi-text-col {
            order: 2 !important;
          }
          .anatomi-visual-frame {
            order: 1 !important;
            max-width: 100% !important;
            max-height: 320px !important;
          }
        }
      `}</style>
      {/* Header Neo-Brutalisme */}
      <div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#E0E7FF',
          border: '1.2px solid #1E1E1E',
          color: '#3730A3',
          fontSize: '0.74rem',
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: '8px',
          marginBottom: '8px'
        }}>
          <Sparkles size={14} /> THREE.JS WEBGL 3D ANATOMICAL ENGINE
        </span>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={28} strokeWidth={2.4} color="#18181B" />
          Atlas Anatomi Tubuh 3D & Pemetaan Farmakologi
        </h1>
        <p style={{ color: '#52525B', fontSize: '0.92rem', marginTop: '4px' }}>
          Visualisasi organ manusia interaktif 360°, analisis patologi klinis, dan integrasi rekomendasi farmakoterapi presisi MediagnoTek.
        </p>
      </div>

      {/* Main 3D Canvas Box - Full Width dengan Background Putih Bersih */}
      <div className="neo-card" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '2px solid #1E1E1E',
        boxShadow: '4px 4px 0px #1E1E1E',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
        minHeight: '680px'
      }}>
        {/* Top Floating Control Bar Di Atas Visual 3D (Tema Putih Bersih) */}
        <div style={{
          padding: '12px 18px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1.8px solid #1E1E1E',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          zIndex: 20
        }}>
          {/* Label Informasi Engine */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284C7', display: 'inline-block' }}></span>
            <span style={{ color: '#0F172A', fontSize: '0.80rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              3D CANVAS CONTROLS (DRAG UNTUK ROTASI 360°)
            </span>
            {hoveredOrgan && (
              <span style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 900,
                border: '1.2px solid #1E1E1E',
                boxShadow: '1px 1px 0px #1E1E1E'
              }}>
                🎯 Klik untuk diagnosa: {ORGANS.find((o) => o.id === hoveredOrgan)?.name}
              </span>
            )}
          </div>

          {/* Tombol Kontrol: Rotasi Aktif, Zoom & Reset Posisi (Berada di Atas Visual 3D) */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsRotating(!isRotating)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1.5px solid #1E1E1E',
                backgroundColor: isRotating ? '#DCFCE7' : '#FFFFFF',
                color: isRotating ? '#15803D' : '#18181B',
                fontWeight: 800,
                fontSize: '0.80rem',
                cursor: 'pointer',
                boxShadow: '1.5px 1.5px 0px #1E1E1E'
              }}
            >
              <RotateCw size={14} className={isRotating ? 'animate-spin' : ''} />
              <span>{isRotating ? 'Rotasi Aktif' : 'Rotasi Diam'}</span>
            </button>

            <button
              onClick={() => handleZoom('in')}
              title="Perbesar Model 3D"
              style={{
                padding: '7px 11px',
                borderRadius: '8px',
                border: '1.5px solid #1E1E1E',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '1.5px 1.5px 0px #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ZoomIn size={15} />
            </button>

            <button
              onClick={() => handleZoom('out')}
              title="Perkecil Model 3D"
              style={{
                padding: '7px 11px',
                borderRadius: '8px',
                border: '1.5px solid #1E1E1E',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '1.5px 1.5px 0px #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ZoomOut size={15} />
            </button>

            <button
              onClick={handleResetCamera}
              title="Reset Sudut Pandang"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1.5px solid #1E1E1E',
                backgroundColor: '#FEF3D6',
                color: '#92400E',
                fontWeight: 800,
                fontSize: '0.80rem',
                cursor: 'pointer',
                boxShadow: '1.5px 1.5px 0px #1E1E1E'
              }}
            >
              <Maximize2 size={14} />
              <span>Reset Posisi</span>
            </button>
          </div>
        </div>

        {/* 3D Visual Body Area & 20% Safe Scroll Strip (Background Putih) */}
        <div style={{
          display: 'flex',
          flex: 1,
          minHeight: '580px',
          width: '100%',
          position: 'relative',
          backgroundColor: '#FFFFFF'
        }}>
          {/* Sisi Kiri: 80% Canvas 3D Interaktif */}
          <div
            ref={mountRef}
            style={{
              width: '80%',
              height: '100%',
              minHeight: '580px',
              cursor: 'grab',
              position: 'relative',
              backgroundColor: '#FFFFFF'
            }}
          />

          {/* Sisi Kanan: 20% Ruang Bebas Scroll Layar (Tema Putih Bersih) */}
          <div
            style={{
              width: '20%',
              minWidth: '100px',
              backgroundColor: '#F8FAFC',
              borderLeft: '1.8px dashed #CBD5E1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 12px',
              textAlign: 'center',
              userSelect: 'none',
              cursor: 'ns-resize',
              position: 'relative'
            }}
            title="Area Bebas Scroll: Gulir roda mouse di sini untuk scroll halaman ke atas/bawah tanpa memicu zoom 3D"
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '36px',
                height: '56px',
                borderRadius: '18px',
                border: '2px solid #0284C7',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '8px',
                backgroundColor: '#EFF6FF',
                boxShadow: '1.5px 1.5px 0px #0284C7'
              }}>
                <span style={{
                  width: '4px',
                  height: '12px',
                  borderRadius: '2px',
                  backgroundColor: '#0284C7',
                  animation: 'pulse 1.5s infinite'
                }}></span>
              </div>
              <span style={{
                color: '#0369A1',
                fontSize: '0.74rem',
                fontWeight: 900,
                letterSpacing: '0.6px',
                lineHeight: 1.4
              }}>
                AREA BEBAS SCROLL
              </span>
              <span style={{
                color: '#64748B',
                fontSize: '0.70rem',
                fontWeight: 600,
                lineHeight: 1.4,
                maxWidth: '120px'
              }}>
                Gunakan strip ini untuk scroll halaman tanpa zoom 3D
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: System Filter Tabs (Tema Putih Medis) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1.8px solid #1E1E1E',
          padding: '14px 20px',
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          zIndex: 10
        }}>
          <span style={{ color: '#475569', fontSize: '0.80rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
            FILTER LAPISAN SISTEM ORGAN:
          </span>
          {['ALL', 'Saraf', 'Kardiovaskular', 'Respirasi', 'Pencernaan', 'Ekskresi'].map((sys) => (
            <button
              key={sys}
              onClick={() => setActiveSystemFilter(sys)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1.5px solid #1E1E1E',
                backgroundColor: activeSystemFilter === sys ? '#0284C7' : '#F8FAFC',
                color: activeSystemFilter === sys ? '#FFFFFF' : '#1E293B',
                fontSize: '0.80rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: activeSystemFilter === sys ? '2px 2px 0px #1E1E1E' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {sys === 'ALL' ? 'Semua Organ' : sys}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Organ Quick Selector & Clinical Diagnosis Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Organ Quick Selector Badges with Inline Search Icon on the Left */}
          <div className="neo-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280' }}>
                PILIH ORGAN TARGET SECARA LANGSUNG:
              </span>
              {searchTerm && (
                <span style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 700 }}>
                  Ditemukan {filteredOrgans.length} dari {ORGANS.length} organ
                </span>
              )}
            </div>

            {/* Mode 1: Pencarian Aktif (Input Memenuhi Lebar Penuh) */}
            {isSearchOpen ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  width: '100%'
                }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', color: '#64748B', pointerEvents: 'none' }} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ketik nama organ atau penyakit (misal: Jantung, Lambung, Ginjal, Asma)..."
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 38px',
                      borderRadius: '8px',
                      border: '2px solid #0284C7',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      outline: 'none',
                      color: '#0F172A',
                      boxShadow: '2.5px 2.5px 0px #1E1E1E'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                    title="Tutup pencarian dan tampilkan semua organ"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#F1F5F9',
                      border: '1.2px solid #94A3B8',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}
                  >
                    <X size={15} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Hasil Filter Organ di bawah input pencarian penuh */}
                {searchTerm && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                    {filteredOrgans.length === 0 ? (
                      <span style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 700, padding: '4px 8px' }}>
                        Tidak ditemukan organ yang cocok dengan &quot;{searchTerm}&quot;.
                      </span>
                    ) : (
                      filteredOrgans.map((org) => {
                        const isSelected = selectedOrgan.id === org.id;
                        return (
                          <button
                            key={org.id}
                            onClick={() => handleSelectOrgan(org)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1.5px solid #1E1E1E',
                              backgroundColor: isSelected ? org.highlightColor : '#FAF8F4',
                              color: isSelected ? '#FFFFFF' : '#18181B',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              boxShadow: isSelected ? '2px 2px 0px #1E1E1E' : 'none',
                              transition: 'all 0.1s ease'
                            }}
                          >
                            {org.name.split('(')[0]}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Mode 2: Tampilan Normal (Tombol Cari di kiri Otak, diikuti pilihan organ) */
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 50);
                  }}
                  title="Klik untuk membuka pencarian organ layar penuh"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #1E1E1E',
                    backgroundColor: '#F1F5F9',
                    color: '#1E293B',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Search size={14} strokeWidth={2.6} />
                  <span>Cari</span>
                </button>

                {filteredOrgans.map((org) => {
                  const isSelected = selectedOrgan.id === org.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => handleSelectOrgan(org)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #1E1E1E',
                        backgroundColor: isSelected ? org.highlightColor : '#FAF8F4',
                        color: isSelected ? '#FFFFFF' : '#18181B',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '2px 2px 0px #1E1E1E' : 'none',
                        transition: 'all 0.1s ease'
                      }}
                    >
                      {org.name.split('(')[0]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Organ Clinical Detail Card */}
          <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#FEF3D6',
                  border: '1.2px solid #1E1E1E',
                  color: '#92400E',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}>
                  SISTEM {selectedOrgan.system.toUpperCase()}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 900, color: '#18181B' }}>
                  {selectedOrgan.name}
                </h3>
              </div>

              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                border: '1.6px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <Stethoscope size={24} color="#1E40AF" />
              </div>
            </div>

            {/* Banner Anatomi & Ilustrasi Gambar Organ (Porsi Seimbang 1/2 : 1/2 & Responsif) */}
            <div
              className="anatomi-banner-grid"
              style={{
                backgroundColor: '#FAF8F4',
                border: '1.8px solid #1E1E1E',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '22px',
                boxShadow: '2.5px 2.5px 0px #1E1E1E'
              }}
            >
              {/* Kolom Kiri: Penjelasan Apa itu & Lokasi */}
              <div className="anatomi-text-col">
                <div>
                  <h4 style={{
                    margin: '0 0 10px 0',
                    fontSize: '1.12rem',
                    fontWeight: 900,
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <BookOpen size={20} color="#0284C7" />
                    Apa itu {selectedOrgan.name.split('(')[0]}?
                  </h4>
                  <p style={{ margin: 0, fontSize: '1.02rem', color: '#1E293B', lineHeight: 1.7, fontWeight: 500 }}>
                    {selectedOrgan.whatIs}
                  </p>
                </div>

                <div style={{ borderTop: '1.5px dashed #CBD5E1', paddingTop: '16px' }}>
                  <h4 style={{
                    margin: '0 0 10px 0',
                    fontSize: '1.12rem',
                    fontWeight: 900,
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <MapPin size={20} color="#DC2626" />
                    Lokasi Anatomi & Perlindungan
                  </h4>
                  <p style={{ margin: 0, fontSize: '1.02rem', color: '#1E293B', lineHeight: 1.7, fontWeight: 500 }}>
                    {selectedOrgan.location}
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: Visual Card / Bingkai Gambar Anatomi 2D Organ (Rasio Presisi 1:1 & Responsif) */}
              <div
                className="anatomi-visual-frame"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.6px solid #1E1E1E',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '2px 2px 0px #1E1E1E',
                  boxSizing: 'border-box'
                }}
              >
                <button
                  type="button"
                  onClick={() => selectedOrgan.imageUrl && setIsImageModalOpen(true)}
                  title="Klik untuk memperbesar gambar"
                  style={{
                    width: '100%',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '8px',
                    overflow: 'hidden',
                    cursor: selectedOrgan.imageUrl ? 'pointer' : 'default',
                    position: 'relative',
                    outline: 'none'
                  }}
                >
                  {selectedOrgan.imageUrl ? (
                    <>
                      <img
                        src={selectedOrgan.imageUrl}
                        alt={`Anatomi 2D ${selectedOrgan.name}`}
                        loading="lazy"
                        style={{
                          width: '95%',
                          height: '95%',
                          maxHeight: '250px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
                          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                      {/* Hint Klik Perbesar */}
                      <span style={{
                        position: 'absolute',
                        right: '6px',
                        bottom: '6px',
                        backgroundColor: '#1E293BEE',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        <Maximize2 size={13} />
                        Perbesar
                      </span>
                    </>
                  ) : (
                    <div style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      backgroundColor: `${selectedOrgan.highlightColor}20`,
                      border: `2px solid ${selectedOrgan.highlightColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Activity size={52} color={selectedOrgan.highlightColor} />
                    </div>
                  )}
                </button>

                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.70rem', color: '#64748B', fontWeight: 600 }}>
                    Sumber Terbuka • Wikimedia Medical Commons
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Pencarian Nama Penyakit atau Obat */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              backgroundColor: '#FAF8F4',
              border: '1.6px solid #1E1E1E',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              boxShadow: '2px 2px 0px #1E1E1E',
              flexWrap: 'wrap'
            }}>
              <div style={{
                position: 'relative',
                flex: 1,
                minWidth: '220px'
              }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={diseaseSearchTerm}
                  onChange={(e) => setDiseaseSearchTerm(e.target.value)}
                  placeholder="Cari nama penyakit atau obat (misal: Migrain, Paracetamol, Stroke)..."
                  style={{
                    width: '100%',
                    padding: '8px 34px 8px 34px',
                    borderRadius: '8px',
                    border: '1.4px solid #1E1E1E',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A'
                  }}
                />
                {diseaseSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setDiseaseSearchTerm('')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px'
                    }}
                    title="Hapus pencarian penyakit/obat"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {diseaseSearchTerm && (
                <button
                  type="button"
                  onClick={() => setDiseaseSearchTerm('')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1.2px solid #DC2626',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* Rekomendasi Terapi & Penyakit Terkait */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 12px 0' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={20} color="#DC2626" />
                Jenis Penyakit Terkait & Terapi Obat Farmasi
              </h4>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
                Menampilkan {selectedOrgan.commonDiseases.filter(d => 
                  !diseaseSearchTerm.trim() ||
                  d.nama.toLowerCase().includes(diseaseSearchTerm.toLowerCase()) ||
                  d.gejala.toLowerCase().includes(diseaseSearchTerm.toLowerCase()) ||
                  d.rekomendasiObat.some(o => o.toLowerCase().includes(diseaseSearchTerm.toLowerCase()))
                ).length} dari {selectedOrgan.commonDiseases.length} Patologi
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {selectedOrgan.commonDiseases.filter(d => 
                !diseaseSearchTerm.trim() ||
                d.nama.toLowerCase().includes(diseaseSearchTerm.toLowerCase()) ||
                d.gejala.toLowerCase().includes(diseaseSearchTerm.toLowerCase()) ||
                d.rekomendasiObat.some(o => o.toLowerCase().includes(diseaseSearchTerm.toLowerCase()))
              ).length === 0 ? (
                <div style={{
                  padding: '18px',
                  textAlign: 'center',
                  backgroundColor: '#FFFBEB',
                  border: '1.2px dashed #F59E0B',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  color: '#92400E'
                }}>
                  Tidak ditemukan penyakit atau obat yang cocok dengan kata kunci <strong>&quot;{diseaseSearchTerm}&quot;</strong> pada organ ini.
                </div>
              ) : (
                selectedOrgan.commonDiseases.filter(d => 
                  !diseaseSearchTerm.trim() ||
                  d.nama.toLowerCase().includes(diseaseSearchTerm.toLowerCase()) ||
                  d.gejala.toLowerCase().includes(diseaseSearchTerm.toLowerCase()) ||
                  d.rekomendasiObat.some(o => o.toLowerCase().includes(diseaseSearchTerm.toLowerCase()))
                ).map((dis, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FAF8F4',
                      border: '1.4px solid #1E1E1E',
                      borderRadius: '10px',
                      padding: '16px 18px',
                      boxShadow: '1.5px 1.5px 0px #1E1E1E'
                    }}
                  >
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#18181B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={18} color="#D97706" />
                      {dis.nama}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#0284C7', fontWeight: 800, backgroundColor: '#E0F2FE', padding: '4px 10px', borderRadius: '5px', border: '1px solid #BAE6FD' }}>
                      Katalog Obat Tersedia
                    </span>
                  </div>
                  <div style={{ fontSize: '1.02rem', color: '#334155', margin: '10px 0 14px 0', lineHeight: 1.7, fontWeight: 500 }}>
                    <strong style={{ color: '#0F172A', fontWeight: 800 }}>Gejala Patologis:</strong> {dis.gejala}
                  </div>

                  {/* Rekomendasi Terapi Obat */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
                    <Pill size={18} color="#2563EB" />
                    <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#1D4ED8' }}>Rekomendasi Obat:</span>
                    {dis.rekomendasiObat.map((obt, oIdx) => (
                      <span
                        key={oIdx}
                        style={{
                          backgroundColor: '#EFF6FF',
                          border: '1.4px solid #93C5FD',
                          color: '#1E40AF',
                          fontSize: '0.90rem',
                          fontWeight: 700,
                          padding: '5px 12px',
                          borderRadius: '6px',
                          boxShadow: '1.5px 1.5px 0px #93C5FD'
                        }}
                      >
                        {obt}
                      </span>
                    ))}
                  </div>

                  {/* Informasi Penyembuhan, Pencegahan & Estimasi Pemulihan */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '14px',
                    paddingTop: '14px',
                    borderTop: '1px dashed #CBD5E1'
                  }}>
                    {/* Terapi & Cara Penyembuhan */}
                    {dis.penyembuhan && (
                      <div style={{
                        backgroundColor: '#F0FDF4',
                        border: '1.4px solid #86EFAC',
                        borderRadius: '8px',
                        padding: '14px 16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <HeartHandshake size={18} color="#16A34A" />
                          <strong style={{ fontSize: '0.98rem', color: '#15803D', fontWeight: 800 }}>
                            Metode & Perawatan Penyembuhan:
                          </strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '1.02rem', color: '#14532D', lineHeight: 1.7, fontWeight: 500 }}>
                          {dis.penyembuhan}
                        </p>
                      </div>
                    )}

                    {/* Tindakan Pencegahan */}
                    {dis.pencegahan && (
                      <div style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.4px solid #CBD5E1',
                        borderRadius: '8px',
                        padding: '14px 16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <ShieldCheck size={18} color="#475569" />
                          <strong style={{ fontSize: '0.98rem', color: '#334155', fontWeight: 800 }}>
                            Tindakan Pencegahan:
                          </strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '1.02rem', color: '#334155', lineHeight: 1.7, fontWeight: 500 }}>
                          {dis.pencegahan}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Estimasi Durasi Pemulihan */}
                  {dis.estimasiPemulihan && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '12px',
                      backgroundColor: '#FAF5FF',
                      border: '1.2px solid #D8B4FE',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '0.92rem',
                      color: '#7E22CE',
                      fontWeight: 700
                    }}>
                      <Clock size={16} color="#9333EA" />
                      <span>Estimasi Pemulihan: <strong>{dis.estimasiPemulihan}</strong></span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

            {/* Clinical Farmasi Warning */}
            <div style={{
              marginTop: '20px',
              padding: '16px 18px',
              backgroundColor: '#FEF2F2',
              border: '1.6px solid #DC2626',
              borderRadius: '10px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              <ShieldAlert size={22} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.94rem', color: '#991B1B', display: 'block' }}>
                  Catatan Konseling Klinis Apoteker:
                </strong>
                <span style={{ fontSize: '0.90rem', color: '#7F1D1D', lineHeight: 1.65, display: 'block', marginTop: '4px' }}>
                  {selectedOrgan.clinicalNotes}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Popup Gambar Anatomi */}
        {isImageModalOpen && selectedOrgan.imageUrl && (
          <div
            onClick={() => setIsImageModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '2px solid #1E1E1E',
                boxShadow: '8px 8px 0px #1E1E1E',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1.6px solid #E2E8F0',
                backgroundColor: '#FAF8F4'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Eye size={20} color="#0284C7" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>
                      Detail Anatomi 2D: {selectedOrgan.name}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                      Sistem {selectedOrgan.system} • Sumber Terbuka Wikimedia Medical Commons
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  style={{
                    border: '1.6px solid #1E1E1E',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '1.5px 1.5px 0px #1E1E1E'
                  }}
                  title="Tutup (Esc)"
                >
                  <X size={18} color="#0F172A" />
                </button>
              </div>

              {/* Modal Body / Image */}
              <div style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F8FAFC',
                overflowY: 'auto'
              }}>
                <img
                  src={selectedOrgan.imageUrl}
                  alt={`Anatomi Detail ${selectedOrgan.name}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))',
                    borderRadius: '8px'
                  }}
                />
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '14px 20px',
                borderTop: '1.6px solid #E2E8F0',
                backgroundColor: '#FAF8F4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.80rem', color: '#475569' }}>
                  Tekan area luar atau tombol silang untuk menutup
                </span>
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: '1.6px solid #1E1E1E',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px #1E1E1E'
                  }}
                >
                  Tutup Tampilan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
