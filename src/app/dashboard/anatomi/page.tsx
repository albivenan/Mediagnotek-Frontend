'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
  Clock,
  User,
  Users,
  Loader2
} from 'lucide-react';

interface OrganData {
  id: string;
  name: string;
  system: 'Saraf' | 'Kardiovaskular' | 'Respirasi' | 'Pencernaan' | 'Ekskresi' | 'Endokrin' | 'Imun & Limfatik' | 'Muskuloskeletal';
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
    position: [0, 4.48, 0.02],
    color: 0xE879F9,
    highlightColor: '#C026D3',
    imageUrl: '/images/organs/brain.svg',
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
    position: [0, 2.68, 0.02],
    color: 0x38BDF8,
    highlightColor: '#0284C7',
    imageUrl: '/images/organs/lungs.svg',
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
    position: [-0.11, 2.52, 0.12],
    color: 0xEF4444,
    highlightColor: '#DC2626',
    imageUrl: '/images/organs/heart.svg',
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
    position: [0.18, 1.92, 0.08],
    color: 0xEA580C,
    highlightColor: '#C2410C',
    imageUrl: '/images/organs/liver.svg',
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
    position: [-0.20, 1.82, 0.06],
    color: 0xF59E0B,
    highlightColor: '#D97706',
    imageUrl: '/images/organs/stomach.svg',
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
    position: [0, 1.46, -0.18],
    color: 0x8B5CF6,
    highlightColor: '#7C3AED',
    imageUrl: '/images/organs/kidneys.svg',
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
  },
  {
    id: 'eyes',
    name: 'Mata & Saraf Optik (Oculus & Nervus Opticus)',
    system: 'Saraf',
    description: 'Organ fotoreseptor sensorik visual yang menangkap spektrum cahaya dan mengubahnya menjadi impuls saraf ke korteks oksipital otak.',
    whatIs: 'Mata adalah organ sensorik penglihatan kompleks yang terdiri atas kornea transparan, iris pengatur bukaan pupil, lensa kristalina pemfokus cahaya, cairan humor vitreus, serta lapisan retina yang mengandung jutaan sel fotoreseptor batang (rod) dan kerucut (cone) yang terhubung langsung ke otak melalui saraf optik (Nervus Kranialis II).',
    location: 'Terletak berpasangan di dalam rongga tulang orbita tengkorak wajah bagian depan (cavum orbitae), dilindungi oleh kelopak mata (palpebra), kelenjar lakrimal, dan digerakkan secara presisi oleh 6 otot ekstraokular.',
    position: [0, 4.42, 0.22],
    color: 0x06B6D4,
    highlightColor: '#0891B2',
    imageUrl: '/images/organs/eyes.svg',
    commonDiseases: [
      {
        nama: 'Konjungtivitis Bakterial & Alergi (Mata Merah)',
        gejala: 'Mata merah injeksi konjungtiva, berair, gatal atau perih mengganjal, sekret belekan mukopurulen terutama saat bangun pagi.',
        rekomendasiObat: ['Chloramphenicol 0.5% Eye Drops', 'Gentamicin Sulfate 0.3% Tetes Mata', 'Sodium Cromoglycate 2% Eye Drops', 'Carboxymethylcellulose (Artificial Tears)'],
        penyembuhan: 'Bersihkan sekret mata dengan kasa steril hangat dari sudut dalam ke luar, teteskan obat mata secara aseptik tanpa menyentuh ujung botol ke mata, kompres dingin bila disebabkan alergi.',
        pencegahan: 'Jangan mengucek mata dengan tangan kotor, pisahkan handuk dan bantal wajah, lepaskan lensa kontak selama mata mengalami peradangan.',
        estimasiPemulihan: '3 hingga 7 hari terapi tetes mata rutin'
      },
      {
        nama: 'Glaukoma Sudut Terbuka & Hipertensi Okuli',
        gejala: 'Penyempitan lapang pandang tepi secara perlahan (tunnel vision), rasa pegal/nyeri di bola mata, melihat lingkaran pelangi (halo) di sekitar lampu.',
        rekomendasiObat: ['Timolol Maleate 0.5% Eye Drops', 'Latanoprost 0.005% Eye Drops', 'Acetazolamide 250mg Tablet'],
        penyembuhan: 'Kepatuhan penggunaan tetes mata penurun tekanan intraokular (TIO) setiap hari pada jam yang sama, serta kontrol tonometri dan funduskopi berkala ke dokter spesialis mata.',
        pencegahan: 'Pemeriksaan tekanan bola mata rutin terutama usia > 40 tahun atau penderita diabetes/hipertensi, hindari pemakaian tetes mata steroid jangka panjang tanpa pengawasan dokter.',
        estimasiPemulihan: 'Kontrol tekanan intraokular stabil jangka panjang'
      }
    ],
    clinicalNotes: 'Tetes mata beta-blocker (Timolol) dapat diserap secara sistemik melalui duktus nasolakrimal dan dikontraindikasikan pada pasien dengan asma bronkial atau bradikardia. Tekan sudut dalam mata (oklusi pungtum) selama 1 menit pasca penetesan dan buang botol tetes mata 28 hari setelah dibuka.'
  },
  {
    id: 'thyroid',
    name: 'Kelenjar Tiroid (Glandula Thyroidea)',
    system: 'Endokrin',
    description: 'Kelenjar endokrin berbentuk kupu-kupu di leher depan yang memproduksi hormon tiroksin (T4) dan triiodotironin (T3) pengatur metabolisme tubuh.',
    whatIs: 'Kelenjar tiroid adalah regulator utama kecepatan metabolisme tubuh manusia. Terdiri atas dua lobus lateral (kiri dan kanan) yang dihubungkan oleh jembatan jaringan sempit bernama isthmus. Kelenjar ini menyerap yodium dari darah untuk mensintesis hormon T3, T4, dan kalsitonin yang mengendalikan pembakaran energi, suhu tubuh, frekuensi detak jantung, serta metabolisme kalsium tulang.',
    location: 'Terletak di bagian depan leher bawah (regio colli anterior), memeluk bagian depan dan samping trakea tepat di bawah tulang rawan tiroid (jakun / laryngeal prominence), setinggi vertebra C5–T1.',
    position: [0, 3.38, 0.05],
    color: 0xF43F5E,
    highlightColor: '#E11D48',
    imageUrl: '/images/organs/thyroid.jpg',
    commonDiseases: [
      {
        nama: 'Hipertiroidisme & Penyakit Graves',
        gejala: 'Jantung berdebar cepat (takikardia/palpitasi), tangan gemetar halus (tremor), penurunan berat badan drastis meski nafsu makan meningkat, berkeringat berlebih dan tidak tahan panas.',
        rekomendasiObat: ['Methimazole (Thiamazole / Thyrozol) 5mg / 10mg', 'Propylthiouracil (PTU) 100mg', 'Propranolol HCl 10mg / 20mg'],
        penyembuhan: 'Konsumsi obat antitiroid secara teratur untuk menekan sintesis hormon tiroid berlebih, gunakan beta-blocker (Propranolol) untuk meredakan tremor dan berdebar, serta evaluasi kadar FT4 dan TSH setiap 4–6 minggu.',
        pencegahan: 'Batasi konsumsi makanan/suplemen tinggi yodium berlebih, kelola stres emosional, dan wajib berhenti merokok untuk mencegah komplikasi mata menonjol (oftalmopati Graves).',
        estimasiPemulihan: 'Eutiroid tercapai dalam 6–12 minggu; pemeliharaan 12–18 bulan'
      },
      {
        nama: 'Hipotiroidisme Primer',
        gejala: 'Mudah lelah dan mengantuk, tidak tahan dingin, kenaikan berat badan, kulit kering dan kasar, sembelit (konstipasi), detak jantung lambat.',
        rekomendasiObat: ['Levothyroxine Sodium (Euthyrox) 50mcg / 100mcg'],
        penyembuhan: 'Terapi sulih hormon tiroid (Levothyroxine) diminum rutin setiap pagi saat perut kosong (30–60 menit sebelum sarapan) hanya dengan air putih.',
        pencegahan: 'Pastikan kecukupan konsumsi garam beryodium dalam diet harian dan lakukan skrining TSH pada ibu hamil serta lansia.',
        estimasiPemulihan: 'Perbaikan gejala klinis dalam 2–4 minggu terapi hormon'
      }
    ],
    clinicalNotes: 'Levothyroxine wajib diberi jeda minimal 4 jam dari obat maag (Antasida/Sukralfat), suplemen Kalsium, atau Zat Besi karena dapat mengikat obat di saluran cerna. Waspadai tanda agranulositosis (demam dan radang tenggorokan mendadak) pada pengguna PTU/Methimazole.'
  },
  {
    id: 'esophagus',
    name: 'Esofagus / Kerongkongan (Oesophagus)',
    system: 'Pencernaan',
    description: 'Saluran fibromuskular peristaltik sepanjang 25 cm yang menyalurkan bolus makanan dari faring menuju lambung melewati rongga mediastinum.',
    whatIs: 'Esofagus adalah tabung berotot yang menghubungkan tenggorokan (faring) dengan lambung. Dilengkapi oleh dua katup otot cincin (sfingter esofagus atas dan bawah/LES) yang membuka saat menelan dan menutup kembali guna mencegah naiknya asam lambung ke kerongkongan.',
    location: 'Membentang vertikal di mediastinum posterior rongga dada, berada tepat di belakang trakea dan jantung serta di depan tulang belakang, lalu menembus hiatus diafragma setinggi vertebra T10 menuju cardia lambung.',
    position: [0, 3.05, -0.05],
    color: 0xFB7185,
    highlightColor: '#E11D48',
    imageUrl: '/images/organs/esophagus.jpg',
    commonDiseases: [
      {
        nama: 'Esofagitis Erosif & Refluks Laringofaringeal (LPR)',
        gejala: 'Nyeri perih saat menelan (odinofagia), sensasi mengganjal di kerongkongan (globus pharyngeus), rasa terbakar di balik tulang dada.',
        rekomendasiObat: ['Esomeprazole 40mg', 'Pantoprazole 40mg', 'Sukralfat Suspensi 500mg/5mL', 'Natrium Alginat (Gaviscon)'],
        penyembuhan: 'Terapi pelapis mukosa (Sukralfat) dikombinasikan dengan PPI untuk menyembuhkan erosi dinding esofagus, konsumsi makanan lunak bersuhu ruang, dan makan secara perlahan.',
        pencegahan: 'Selalu minum obat tablet/kapsul dengan segelas penuh air putih dalam posisi tegak (mencegah pill-induced esophagitis), hindari berbaring 3 jam setelah makan.',
        estimasiPemulihan: '4 hingga 8 minggu penyembuhan mukosa esofagus'
      },
      {
        nama: 'Spasme Esofagus Difus & Disfagia Fungsional',
        gejala: 'Nyeri dada meremas non-kardiak yang dipicu minuman terlalu dingin atau panas, kesulitan menelan makanan padat maupun cair.',
        rekomendasiObat: ['Nifedipine 10mg', 'Isosorbide Dinitrate (ISDN) 5mg', 'Diltiazem HCl 30mg'],
        penyembuhan: 'Konsumsi makanan dalam porsi kecil dan kunyah hingga halus, minum air hangat perlahan untuk merelaksasi otot polos esofagus.',
        pencegahan: 'Hindari makanan/minuman dengan suhu ekstrem (es atau kuah mendidih) serta kelola stres dan kecemasan.',
        estimasiPemulihan: 'Mereda 15–30 menit pasca relaksan otot polos'
      }
    ],
    clinicalNotes: 'Edukasi pasien yang menerima resep Doxycycline, Clindamycin, Tetracycline, atau Bisphosphonate (Alendronate) agar tidak berbaring minimal 30 menit setelah minum obat guna mencegah ulserasi esofagus.'
  },
  {
    id: 'spleen',
    name: 'Limpa (Lien / Splen)',
    system: 'Imun & Limfatik',
    description: 'Organ limfoid terbesar tubuh yang menyaring eritrosit tua, menyimpan cadangan trombosit, dan membentuk respons imun antibodi.',
    whatIs: 'Limpa adalah pusat pertahanan imunologis dan penyaring darah berkapasitas tinggi. Tersusun atas "pulpa merah" yang bertugas menghancurkan sel darah merah tua/rusak serta mendaur ulang zat besi hemoglobin, dan "pulpa putih" yang kaya akan sel limfosit T dan B untuk memproduksi antibodi terhadap bakteri berkapsul dalam aliran darah.',
    location: 'Terletak di kuadran kiri atas rongga perut (hipokondrium sinistra), berada di sisi kiri-belakang (posterolateral) fundus lambung, tepat di bawah diafragma dan terlindungi oleh tulang iga ke-9 hingga ke-11 kiri.',
    position: [-0.34, 1.88, -0.06],
    color: 0xA855F7,
    highlightColor: '#9333EA',
    imageUrl: '/images/organs/spleen.jpg',
    commonDiseases: [
      {
        nama: 'Splenomegali Reaktif (Infeksi Tifoid / Malaria / Viral)',
        gejala: 'Rasa penuh atau nyeri tumpul di perut kiri atas yang menjalar ke bahu kiri, mudah kenyang karena lambung terdesak, demam, dan pucat.',
        rekomendasiObat: ['Azithromycin 500mg / Cefixime 200mg (Terapi Infeksi Tifoid)', 'Paracetamol 500mg', 'Asam Folat 1mg + Vitamin B Kompleks'],
        penyembuhan: 'Mengobati infeksi sistemik penyebab pembesaran limpa hingga tuntas, tirah baring cukup, dan diet lunak tinggi protein untuk pemulihan hematopoietik.',
        pencegahan: 'Wajib menghindari olahraga kontak fisik, lari berat, atau angkat beban selama limpa masih membengkak guna mencegah komplikasi pecahnya (ruptur) limpa.',
        estimasiPemulihan: '2 hingga 4 minggu seiring sembuhnya infeksi primer'
      },
      {
        nama: 'Trombositopenia Imun (ITP) & Hipersplenisme',
        gejala: 'Bintik-bintik merah di kulit (petekie), mudah memar kebiruan (ekimosis), gusi berdarah atau mimisan akibat penghancuran trombosit di limpa.',
        rekomendasiObat: ['Methylprednisolone 8mg / 16mg', 'Prednisone 5mg', 'Asam Traneksamat 500mg (Antifibrinolitik)'],
        penyembuhan: 'Terapi imunosupresan kortikosteroid untuk menekan fagositosis trombosit oleh makrofag limpa serta pemantauan hitung trombosit darah tepi secara berkala.',
        pencegahan: 'Hindari pemakaian obat pereda nyeri golongan NSAID (Aspirin, Ibuprofen, Asam Mefenamat) yang menghambat agregasi trombosit.',
        estimasiPemulihan: 'Peningkatan trombosit dalam 1–3 minggu terapi kortikosteroid'
      }
    ],
    clinicalNotes: 'Pada pasien dengan splenomegali atau trombositopenia, kontraindikasikan seluruh analgesik NSAID dan gunakan Paracetamol sebagai lini aman. Pasien pasca pengangkatan limpa (splenektomi) wajib mendapat vaksinasi Pneumokokus dan Meningokokus.'
  },
  {
    id: 'pancreas',
    name: 'Pankreas (Pancreas)',
    system: 'Endokrin',
    description: 'Kelenjar ganda eksokrin dan endokrin yang memproduksi enzim pencernaan (amilase, lipase, protease) serta hormon insulin dan glukagon.',
    whatIs: 'Pankreas adalah organ kelenjar memanjang yang menjalankan dua peran vital sekaligus: (1) Fungsi Endokrin melalui Pulau-pulau Langerhans (sel alfa dan sel beta) yang melepaskan hormon Insulin dan Glukagon ke darah untuk menjaga kestabilan gula darah; dan (2) Fungsi Eksokrin yang mensekresikan getah pankreas kaya enzim pencernaan dan bikarbonat penetral asam ke usus dua belas jari (duodenum).',
    location: 'Terletak melintang secara retroperitoneal di bagian belakang-atas rongga perut (regio epigastrium hingga hipokondrium sinistra), berada tepat di belakang lambung, memanjang dari lengkung duodenum hingga menyentuh hilus limpa.',
    position: [-0.04, 1.62, -0.04],
    color: 0xFBBF24,
    highlightColor: '#D97706',
    imageUrl: '/images/organs/pancreas.png',
    commonDiseases: [
      {
        nama: 'Diabetes Melitus Tipe 2 (Defisiensi & Resistensi Insulin)',
        gejala: 'Sering merasa haus (polidipsia), sering BAK terutama malam hari (poliuria), cepat lapar (polifagia), kesemutan, luka sulit sembuh, gula darah puasa ≥ 126 mg/dL.',
        rekomendasiObat: ['Metformin HCl 500mg / 850mg', 'Glimepiride 2mg / Gliclazide 80mg', 'Empagliflozin 10mg / Dapagliflozin 10mg', 'Insulin Glargine / Insulin Aspart Pen'],
        penyembuhan: 'Terapi terpadu obat antidiabetik oral atau injeksi insulin sesuai target HbA1c (< 7%), pengaturan pola makan 3J (Jumlah, Jenis, Jadwal) rendah indeks glikemik, dan olahraga aerobik 150 menit/minggu.',
        pencegahan: 'Batasi minuman manis kemasan dan karbohidrat sederhana, pertahankan berat badan dan lingkar pinggang ideal, serta cek gula darah rutin.',
        estimasiPemulihan: 'Gula darah terkontrol dalam 2–4 minggu; evaluasi HbA1c tiap 3 bulan'
      },
      {
        nama: 'Insufisiensi Eksokrin Pankreas & Dispepsia Pankreatik',
        gejala: 'Perut kembung penuh setelah makan berlemak, nyeri ulu hati menembus ke punggung, tinja pucat berminyak (steatorrhea).',
        rekomendasiObat: ['Pancreatin (Enzim Amilase + Lipase + Protease)', 'Omeprazole 20mg', 'Paracetamol 500mg'],
        penyembuhan: 'Suplementasi enzim pencernaan pankreas yang diminum bersamaan saat makan utama, pembagian porsi makan kecil tapi sering dengan diet rendah lemak jenuh.',
        pencegahan: 'Berhenti konsumsi alkohol dan rokok secara total, kendalikan kadar trigliserida darah, dan cegah pembentukan batu empedu.',
        estimasiPemulihan: '1 hingga 3 minggu perbaikan absorpsi nutrisi'
      }
    ],
    clinicalNotes: 'Edukasi pasien agar meminum Metformin bersama atau tepat sesudah makan untuk mencegah mual/diare, sedangkan Glimepiride diminum 15–30 menit sebelum sarapan. Kenali gejala hipoglikemia (keringat dingin, gemetar, lemas) dan siapkan larutan air gula.'
  },
  {
    id: 'gallbladder',
    name: 'Kandung Empedu (Vesica Fellea)',
    system: 'Pencernaan',
    description: 'Kantung berbentuk buah pir di bawah hati yang menyimpan, memekatkan, dan menyemprotkan cairan empedu ke duodenum untuk mengemulsi lemak.',
    whatIs: 'Kandung empedu adalah reservoar fibromuskular sepanjang 7–10 cm yang menampung sekitar 30–50 mL cairan empedu produksi hati. Saat makanan berlemak masuk ke duodenum, hormon kolesistokinin (CCK) memicu kandung empedu berkontraksi menyalurkan garam empedu melalui duktus koledokus untuk memecah globul lemak.',
    location: 'Terletak menempel pada cekungan fossa vesicae felleae di permukaan bawah (viseral) lobus kanan hati, di kuadran kanan atas rongga perut tepat di bawah lengkung iga kanan.',
    position: [0.16, 1.75, 0.12],
    color: 0x10B981,
    highlightColor: '#059669',
    imageUrl: '/images/organs/gallbladder.svg',
    commonDiseases: [
      {
        nama: 'Kolelitiasis (Batu Kandung Empedu Kolesterol)',
        gejala: 'Nyeri kolik bilier tajam di perut kanan atas atau ulu hati 30–60 menit setelah makan makanan bersantan/berlemak, menjalar ke bahu/belikat kanan, disertai mual.',
        rekomendasiObat: ['Asam Ursodeoksikolat (UDCA / Urdahex) 250mg', 'Hyoscine-N-Butylbromide (Buscopan) 10mg', 'Ketorolac / Natrium Diklofenak 50mg'],
        penyembuhan: 'Terapi disolusi batu kolesterol non-kalsifikasi menggunakan UDCA secara rutin, pemberian antispasmodik untuk meredakan kejang saluran bilier, dan diet ketat rendah lemak.',
        pencegahan: 'Kurangi konsumsi gorengan, santan kental, jeroan, dan makanan cepat saji; perbanyak serat sayur-buah dan hindari diet ekstrem penurunan berat badan drastis.',
        estimasiPemulihan: 'Kolik mereda dalam 1–4 jam; pelarutan batu mikro 6–12 bulan UDCA'
      },
      {
        nama: 'Kolesistitis Akut (Radang Kandung Empedu)',
        gejala: 'Nyeri perut kanan atas menetap > 6 jam terutama saat menarik napas dalam (Murphy sign positif), demam menggigil, mual dan muntah.',
        rekomendasiObat: ['Cefixime 200mg / Ciprofloxacin 500mg', 'Metronidazole 500mg', 'Ondansetron 4mg', 'Paracetamol 500mg'],
        penyembuhan: 'Istirahatkan saluran cerna dari makanan berlemak, rehidrasi cairan adekuat, dan terapi antibiotik untuk mengatasi infeksi bakteri enterik pada kandung empedu.',
        pencegahan: 'Penanganan batu empedu sejak dini dan menjaga indeks massa tubuh ideal.',
        estimasiPemulihan: '5 hingga 10 hari terapi antibiotik & manajemen diet'
      }
    ],
    clinicalNotes: 'Asam Ursodeoksikolat (UDCA) diminum bersama makanan (terutama malam hari) untuk melarutkan batu kolesterol radiolusen. Hindari pemberian koleretik jika terdapat obstruksi total saluran empedu.'
  },
  {
    id: 'small_intestine',
    name: 'Usus Halus (Intestinum Tenue: Duodenum, Jejunum, Ileum)',
    system: 'Pencernaan',
    description: 'Saluran pencernaan berliku sepanjang 6 meter dengan jutaan vili mikroskopis tempat berlangsungnya 90% penyerapan nutrisi dan obat.',
    whatIs: 'Usus halus adalah pusat pencernaan enzimatik dan absorpsi nutrisi utama tubuh yang terbagi menjadi tiga segmen: Duodenum (usus 12 jari tempat bermuaranya enzim pankreas dan empedu), Jejunum (usus kosong tempat penyerapan gula, asam amino, dan asam lemak), serta Ileum (usus penyerapan vitamin B12 dan garam empedu).',
    location: 'Memenuhi bagian tengah dan bawah rongga abdomen (regio umbilikalis dan hipogastrium), tersusun berlipat-lipat diikat oleh mesenterium dan dikelilingi oleh bingkai usus besar.',
    position: [0, 1.12, 0.08],
    color: 0xFB923C,
    highlightColor: '#EA580C',
    imageUrl: '/images/organs/small_intestine.png',
    commonDiseases: [
      {
        nama: 'Gastroenteritis Akut & Diare Sekretorik / Infeksius',
        gejala: 'Buang air besar cair > 3 kali sehari, perut melilit (hiperperistaltik), mual, lemas, dan risiko dehidrasi.',
        rekomendasiObat: ['Oralit (Garam Rehidrasi Oral)', 'Zinc Sulfate 20mg', 'Attapulgite / Dioctahedral Smectite (Smecta)', 'Probiotik (Lactobacillus / L-Bio)', 'Loperamide HCl 2mg (khusus diare non-infeksius dewasa)'],
        penyembuhan: 'Minum larutan Oralit setiap selesai BAB cair untuk mengganti elektrolit, konsumsi Zinc 20mg/hari selama 10 hari penuh untuk mempercepat regenerasi vili usus halus, serta makan makanan lunak rendah serat.',
        pencegahan: 'Biasakan cuci tangan dengan sabun sebelum makan, konsumsi air minum dan makanan yang dimasak matang sempurna, serta jaga sanitasi peralatan makan.',
        estimasiPemulihan: '2 hingga 5 hari dengan rehidrasi oral dan suplementasi Zinc'
      },
      {
        nama: 'Ulkus Duodenum (Tukak Usus 12 Jari)',
        gejala: 'Nyeri perih di ulu hati 2–3 jam setelah makan atau saat tengah malam (hunger pain) yang membaik sementara setelah diisi makanan, disertai kembung.',
        rekomendasiObat: ['Lansoprazole 30mg / Omeprazole 20mg', 'Sukralfat Suspensi', 'Regimen Eradikasi H. pylori (Amoxicillin 1000mg + Clarithromycin 500mg + PPI)'],
        penyembuhan: 'Terapi penekan asam lambung (PPI) selama 4 minggu dan penuntasan antibiotik eradikasi apabila terbukti infeksi bakteri Helicobacter pylori.',
        pencegahan: 'Hindari konsumsi obat nyeri NSAID tanpa pelindung mukosa, hentikan merokok, dan hindari makan terlalu larut malam.',
        estimasiPemulihan: '4 minggu penyembuhan mukosa duodenum'
      }
    ],
    clinicalNotes: 'Loperamide dikontraindikasikan pada diare yang disertai demam tinggi atau tinja berdarah/berlendir (disentri) karena memperlambat pengeluaran toksin bakteri. Beri jeda 2 jam antara adsorben (Attapulgite) dengan obat oral lain.'
  },
  {
    id: 'large_intestine',
    name: 'Usus Besar & Apendiks (Intestinum Crassum / Colon)',
    system: 'Pencernaan',
    description: 'Bagian akhir saluran cerna sepanjang 1,5 meter yang menyerap air-elektrolit, memfermentasi serat bersama mikrobiota, dan membentuk feses.',
    whatIs: 'Usus besar membentuk bingkai mengelilingi usus halus dan terdiri atas Sekum (dengan umbai cacing / Appendix Vermiformis), Kolon Asendens (kanan), Kolon Transversum (melintang), Kolon Desendens (kiri), Kolon Sigmoid, dan Rektum. Berperan menyerap kembali air hingga 1–1,5 liter/hari, tempat simbiosis mikrobiota penghasil vitamin K, serta mengatur defekasi.',
    location: 'Membingkai tepi rongga perut mulai dari fossa iliaka kanan bawah (sekum & apendiks), naik ke bawah hati, melintang ke kiri di bawah lambung, turun ke panggul kiri, dan berakhir di rektum pada garis tengah belakang panggul.',
    position: [0.24, 1.18, 0.05],
    color: 0xD97706,
    highlightColor: '#B45309',
    imageUrl: '/images/organs/large_intestine.png',
    commonDiseases: [
      {
        nama: 'Irritable Bowel Syndrome (IBS) & Kolitis Spastik',
        gejala: 'Kram perut bawah berulang yang mereda setelah BAB, perut kembung bergas, perubahan pola BAB (sembelit bergantian dengan diare).',
        rekomendasiObat: ['Mebeverine HCl (Duspatalin) 135mg', 'Hyoscine-N-Butylbromide 10mg', 'Simethicone + Enzim Pencernaan', 'Probiotik Multi-strain'],
        penyembuhan: 'Pemberian antispasmodik selektif otot polos kolon 20 menit sebelum makan, penerapan diet rendah FODMAP, dan relaksasi pengendalian stres (gut-brain axis).',
        pencegahan: 'Konsumsi serat larut secara bertahap, minum air putih minimal 2 liter/hari, olahraga teratur, dan hindari pemicu gas tinggi (kol, minuman bersoda, pemanis sorbitol).',
        estimasiPemulihan: 'Perbaikan gejala dalam 1–2 minggu terapi antispasmodik & diet'
      },
      {
        nama: 'Konstipasi Fungsional & Hemoroid (Wasir)',
        gejala: 'Sulit BAB (< 3 kali seminggu), feses keras kering, harus mengejan kuat, disertai benjolan atau darah segar menetes saat BAB.',
        rekomendasiObat: ['Lactulose Syrup 10g/15mL', 'Bisacodyl (Dulcolax) 5mg', 'Diosmin + Hesperidin (Ardium) 500mg', 'Suppositoria / Salep Antihemoroid'],
        penyembuhan: 'Gunakan pencahar osmotik (Lactulose) untuk melunakkan feses tanpa memicu kram, konsumsi venotonik (Diosmin-Hesperidin) untuk meredakan bengkak vena hemoroid, serta rendam duduk air hangat (sitz bath) 10–15 menit.',
        pencegahan: 'Jangan menahan rangsangan BAB, hindari duduk terlalu lama di toilet, tingkatkan asupan buah pepaya, sayur hijau, dan air putih.',
        estimasiPemulihan: 'Konstipasi teratasi 24–48 jam; remisi hemoroid akut 5–10 hari'
      }
    ],
    clinicalNotes: 'Hindari pemakaian pencahar stimulan (Bisacodyl/Senna) terus-menerus > 7 hari. Waspadai nyeri perut kanan bawah tajam (titik McBurney) disertai demam sebagai tanda Apendisitis Akut (radang usus buntu)—kondisi ini dilarang diberi pencahar dan wajib dirujuk segera ke dokter bedah.'
  },
  {
    id: 'bladder',
    name: 'Kandung Kemih (Vesica Urinaria)',
    system: 'Ekskresi',
    description: 'Kantung muskular elastis (otot detrusor) di rongga panggul depan yang menampung urin dari kedua ureter sebelum dikeluarkan melalui uretra.',
    whatIs: 'Kandung kemih adalah reservoar urin sementara yang dilapisi oleh epitel transisional (urothelium) dan dinding otot polos detrusor yang mampu meregang menampung 300–500 mL urin. Di bagian dasarnya terdapat area segitiga (trigonum vesicae) tempat bermuaranya dua ureter dari ginjal dan satu pintu keluar uretra yang dikawal oleh sfingter urinarius.',
    location: 'Terletak di dasar rongga panggul bagian depan (cavum pelvis / regio suprapubik), berada tepat di belakang tulang kemaluan (symphysis pubis).',
    position: [0, 0.68, 0.12],
    color: 0x3B82F6,
    highlightColor: '#2563EB',
    imageUrl: '/images/organs/bladder.png',
    commonDiseases: [
      {
        nama: 'Sistitis Akut (Infeksi Kandung Kemih / ISK Bawah)',
        gejala: 'Rasa perih dan panas saat buang air kecil (disuria), sering BAK sedikit-sedikit (anyang-anyangan / polakisuria), nyeri tekan di atas kemaluan (suprapubik), urin keruh.',
        rekomendasiObat: ['Fosfomycin Trometamol 3g Sachet (Dosis Tunggal)', 'Cefixime 200mg / Ciprofloxacin 500mg', 'Phenazopyridine HCl (Urogetix) 100mg', 'Paracetamol 500mg'],
        penyembuhan: 'Tuntaskan terapi antibiotik untuk mengeradikasi bakteri uropatogen (E. coli), gunakan analgesik mukosa kemih (Phenazopyridine) untuk meredakan nyeri anyang-anyangan, dan minum air putih 2,5–3 liter/hari.',
        pencegahan: 'Jangan pernah menahan keinginan berkemih, biasakan berkemih setelah berhubungan seksual, dan jaga area urogenital tetap bersih serta kering.',
        estimasiPemulihan: 'Gejala perih mereda dalam 24–48 jam; sembuh tuntas 3–5 hari'
      },
      {
        nama: 'Overactive Bladder (OAB / Kandung Kemih Hiperaktif)',
        gejala: 'Desakan berkemih mendadak yang sulit ditahan (urgency), frekuensi BAK > 8 kali sehari, sering terbangun malam hari untuk BAK (nokturia).',
        rekomendasiObat: ['Solifenacin Succinate (Vesicare) 5mg', 'Mirabegron (Betmiga) 25mg / 50mg', 'Flavoxate HCl (Urispas) 200mg'],
        penyembuhan: 'Pemberian antimuskarinik (Solifenacin) atau agonis beta-3 (Mirabegron) untuk menekan kontraksi involunter otot detrusor, dikombinasikan dengan latihan otot dasar panggul (Senam Kegel) dan bladder training.',
        pencegahan: 'Kurangi konsumsi kafein (kopi, teh pekat), minuman berkarbonasi, dan batasi minum berlebihan 2 jam sebelum tidur malam.',
        estimasiPemulihan: 'Frekuensi berkemih terkontrol dalam 2–4 minggu terapi'
      }
    ],
    clinicalNotes: 'Edukasi pasien bahwa Phenazopyridine akan mengubah warna urin menjadi merah-jingga terang sehingga pasien tidak panik. Obat antimuskarinik (Solifenacin) memiliki efek samping antikolinergik berupa mulut kering, konstipasi, dan pandangan agak kabur.'
  },
  {
    id: 'spine',
    name: 'Tulang Belakang & Medulla Spinalis (Columna Vertebralis)',
    system: 'Muskuloskeletal',
    description: 'Pilar kerangka aksial 33 ruas vertebra dan cakram intervertebralis yang menopang postur tubuh sekaligus melindungi sumsum tulang belakang.',
    whatIs: 'Tulang belakang adalah struktur biomekanik penyangga utama tubuh yang tersusun atas 7 ruas leher (Servikal), 12 ruas punggung (Torakal), 5 ruas pinggang (Lumbal), 5 ruas kelangkang (Sakral), dan 4 ruas tulang ekor (Koksigis) yang dipisahkan oleh bantalan peredam kejut (discus intervertebralis). Di dalam terowongan tengahnya berjalan Sumsum Tulang Belakang (Medulla Spinalis) beserta 31 pasang akar saraf spinalis.',
    location: 'Membentang vertikal di garis tengah bagian belakang tubuh (dorsal/posterior) mulai dari dasar tengkorak kepala, menyusuri leher, punggung tengah, pinggang bawah, hingga bersendi dengan tulang panggul.',
    position: [0, 2.35, -0.25],
    color: 0x14B8A6,
    highlightColor: '#0D9488',
    imageUrl: '/images/organs/spine.png',
    commonDiseases: [
      {
        nama: 'Low Back Pain (LBP) Mekanik & Spasme Otot Paraspinal',
        gejala: 'Nyeri pinggang bawah pegal atau kaku yang memberat saat membungkuk, duduk lama, atau mengangkat beban, disertai ketegangan otot samping tulang belakang.',
        rekomendasiObat: ['Eperisone HCl (Myonal) 50mg', 'Meloxicam 15mg / Celecoxib 200mg / Natrium Diklofenak 50mg', 'Ketoprofen Gel / Krim Metil Salisilat Topikal'],
        penyembuhan: 'Terapi kombinasi relaksan otot rangka (Eperisone) dengan antiinflamasi (NSAID), kompres hangat 15–20 menit pada pinggang, tetap aktif bergerak ringan (hindari bed rest total > 48 jam), dan peregangan fisioterapi.',
        pencegahan: 'Saat mengangkat barang berat dari lantai, tekuk kedua lutut dan jaga punggung tetap lurus; gunakan kursi kerja dengan bantalan penyangga lengkung pinggang (lumbar support).',
        estimasiPemulihan: '5 hingga 14 hari dengan terapi kombinasi dan koreksi ergonomi'
      },
      {
        nama: 'Hernia Nukleus Pulposus (HNP / Saraf Kejepit) & Skiatika',
        gejala: 'Nyeri tajam menjalar seperti tersengat listrik dari pinggang bawah ke bokong, paha belakang, hingga betis/kaki (sciatica), disertai kesemutan atau baal.',
        rekomendasiObat: ['Pregabalin 75mg / Gabapentin 300mg', 'Mecobalamin (Vitamin B12 Aktif) 500mcg', 'Etoricoxib 60mg / 90mg', 'Methylprednisolone 4mg / 8mg'],
        penyembuhan: 'Terapi spesifik nyeri saraf neuropatik (Pregabalin/Gabapentin) ditambah neurotropik pelindung selubung mielin saraf (Mecobalamin), fisioterapi traksi lumbal, latihan ekstensi punggung, dan olahraga berenang.',
        pencegahan: 'Jaga berat badan ideal untuk mengurangi beban tekan pada cakram L4–L5 dan L5–S1, hindari gerakan memutar pinggang secara mendadak sambil menahan beban.',
        estimasiPemulihan: '4 hingga 12 minggu terapi konservatif & rehabilitasi medik'
      }
    ],
    clinicalNotes: 'Pregabalin, Gabapentin, dan Eperisone dapat menyebabkan rasa kantuk dan pusing (dizziness); wajib ingatkan pasien agar tidak mengemudi kendaraan atau mengoperasikan mesin setelah meminum obat tersebut.'
  }
];

export default function AnatomiPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const [activeSystemFilter, setActiveSystemFilter] = useState<string>('ALL');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [modelOpacity, setModelOpacity] = useState<number>(0.28);
  const [viewMode, setViewMode] = useState<'hologram' | 'solid' | 'xray'>('hologram');
  const [isOrganIsolated, setIsOrganIsolated] = useState<boolean>(false);
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [diseaseSearchTerm, setDiseaseSearchTerm] = useState<string>('');
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const organMeshesRef = useRef<{ [key: string]: THREE.Mesh | THREE.Group }>({});
  const ringsRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const glbModelGroupRef = useRef<THREE.Group | null>(null);
  const isRotatingRef = useRef<boolean>(isRotating);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  // Reset status error gambar setiap kali organ terpilih berganti
  useEffect(() => {
    setImageError(false);
  }, [selectedOrgan]);

  // Sinkronisasi material model tubuh saat viewMode atau modelOpacity berubah tanpa reload GLB
  useEffect(() => {
    const modelContainer = glbModelGroupRef.current;
    if (!modelContainer) return;
    const isHologram = viewMode === 'hologram';
    const isXray = viewMode === 'xray';
    const bodyThemeColor = gender === 'female' ? 0xEC4899 : 0x0284C7;

    modelContainer.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (isXray) {
          child.material = new THREE.MeshBasicMaterial({
            color: bodyThemeColor,
            wireframe: true,
            transparent: true,
            opacity: 0.35
          });
        } else if (isHologram) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: bodyThemeColor,
            transparent: true,
            opacity: modelOpacity,
            roughness: 0.35,
            metalness: 0.12,
            transmission: 0.72,
            ior: 1.32,
            thickness: 0.85,
            emissive: bodyThemeColor,
            emissiveIntensity: 0.15,
            depthWrite: false
          });
        } else {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xFBCFE8,
            roughness: 0.5,
            metalness: 0.05,
            transparent: true,
            opacity: 0.88
          });
        }
      }
    });
  }, [viewMode, modelOpacity, gender]);

  // Efek visibilitas organ 3D tersinkronisasi antara Filter Sistem Organ & Pilihan Organ Individual
  useEffect(() => {
    Object.entries(organMeshesRef.current).forEach(([id, groupOrMesh]) => {
      const orgData = ORGANS.find((o) => o.id === id);
      const isSelected = selectedOrgan?.id === id;
      const isHovered = hoveredOrgan === id;
      const matchesFilter = activeSystemFilter === 'ALL' || orgData?.system === activeSystemFilter;

      // Jika organ individual sedang dipilih/dikunci (isOrganIsolated = true dan ada selectedOrgan), tampilkan hanya organ tersebut.
      // Jika tidak (atau setelah di-reset dengan tombol silang X), tampilkan seluruh organ pada Filter Lapisan Sistem Organ yang aktif.
      const isVisible = (isOrganIsolated && selectedOrgan) ? isSelected : matchesFilter;

      groupOrMesh.visible = isVisible;

      if (isVisible) {
        groupOrMesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshPhysicalMaterial;
            if (mat.userData?.baseEmissiveIntensity === undefined) {
              mat.userData = {
                baseEmissiveIntensity: mat.emissiveIntensity ?? 0.45,
                baseOpacity: mat.opacity ?? 1
              };
            }
            if ((isOrganIsolated && isSelected) || isHovered) {
              mat.transparent = false;
              mat.opacity = 1;
              mat.emissiveIntensity = Math.min(1.25, (mat.userData.baseEmissiveIntensity as number) * (isHovered ? 1.85 : 1.45));
            } else {
              mat.transparent = false;
              mat.opacity = 1;
              mat.emissiveIntensity = mat.userData.baseEmissiveIntensity as number;
            }
          }
        });
      }

      const ring = ringsRef.current[id];
      if (ring) {
        ring.visible = isVisible;
        if (ring.material instanceof THREE.MeshBasicMaterial) {
          ring.material.opacity = (isOrganIsolated && isSelected) || isHovered ? 0.95 : 0.45;
        }
      }
    });
  }, [selectedOrgan, hoveredOrgan, activeSystemFilter, isOrganIsolated, isLoadingModel]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene dengan Background Putih Bersih
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
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
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights (Studio Medis Putih Bersih)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.75);
    dirLight1.position.set(5, 10, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284C7, 0.75);
    dirLight2.position.set(-6, 4, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xF59E0B, 0.85, 12);
    pointLight.position.set(0, 2.5, 3.5);
    scene.add(pointLight);

    // 5. Grid Ground & Pedestal (Warna Halus Medis untuk Background Putih)
    const gridHelper = new THREE.GridHelper(10, 20, 0x0284C7, 0xE2E8F0);
    gridHelper.position.y = -4.55;
    scene.add(gridHelper);

    // 6. Root Body Group
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = -0.6;
    scene.add(bodyGroup);
    bodyGroupRef.current = bodyGroup;

    // Helper: Tag semua sub-mesh dengan organId untuk raycasting akurat
    const tagOrganGroup = (group: THREE.Group, organId: string) => {
      group.name = organId;
      group.userData.organId = organId;
      group.traverse((child) => {
        child.userData.organId = organId;
      });
    };

    // Helper: Material Jaringan Organ Biologis (Organic Tissue Shader)
    const createOrganMaterial = (color: number, emissive: number, emissiveIntensity = 0.42, roughness = 0.32) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        emissive,
        emissiveIntensity,
        roughness,
        metalness: 0.08,
        clearcoat: 0.65,
        clearcoatRoughness: 0.25,
        reflectivity: 0.5
      });
      mat.userData = { baseEmissiveIntensity: emissiveIntensity, baseOpacity: 1 };
      return mat;
    };

    // 7. Realistic 3D Human Anatomy GLB Model (female.glb / male.glb)
    setIsLoadingModel(true);
    const gltfLoader = new GLTFLoader();
    const modelPath = gender === 'female' ? '/female.glb' : '/male.glb';

    gltfLoader.load(
      modelPath,
      (gltf) => {
        const root = gltf.scene;

        // Hitung bounding box agar model terpusat sempurna dan proporsional dengan organ dalam
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Standarisasi tinggi model manusia (skala tinggi ~ 9.0)
        const targetHeight = 9.0;
        const scaleFactor = targetHeight / (size.y || 1);

        // Kalibrasi offset Z (+0.26 di ruang modelContainer) agar poros tengah rongga dada/perut berada tepat di Z = 0
        root.position.x = -center.x;
        root.position.y = -center.y;
        root.position.z = -center.z + 0.26 / scaleFactor;

        const modelContainer = new THREE.Group();
        modelContainer.add(root);
        modelContainer.scale.set(scaleFactor, scaleFactor, scaleFactor);
        modelContainer.position.y = 0.55;

        const isHologram = viewMode === 'hologram';
        const isXray = viewMode === 'xray';
        const bodyThemeColor = gender === 'female' ? 0xEC4899 : 0x0284C7;

        root.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.geometry.computeVertexNormals();

            if (isXray) {
              child.material = new THREE.MeshBasicMaterial({
                color: bodyThemeColor,
                wireframe: true,
                transparent: true,
                opacity: 0.25
              });
            } else if (isHologram) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: bodyThemeColor,
                transparent: true,
                opacity: modelOpacity,
                roughness: 0.25,
                metalness: 0.1,
                transmission: 0.85,
                ior: 1.25,
                thickness: 0.7,
                emissive: bodyThemeColor,
                emissiveIntensity: 0.2,
                depthWrite: false
              });
            } else {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xFBCFE8,
                roughness: 0.5,
                metalness: 0.05,
                transparent: true,
                opacity: 0.88
              });
            }
          }
        });

        glbModelGroupRef.current = modelContainer;
        bodyGroup.add(modelContainer);
        setIsLoadingModel(false);
      },
      undefined,
      (err) => {
        console.error('Gagal memuat GLB model anatomi:', err);
        setIsLoadingModel(false);
      }
    );

    // =========================================================================
    // 8. ANATOMICAL 3D ORGANS (PROCEDURAL SCULPTED GEOMETRIES)
    // =========================================================================
    const organMeshes: { [key: string]: THREE.Mesh | THREE.Group } = {};

    // -------------------------------------------------------------------------
    // A. OTAK (Encephalon: Left/Right Cerebral Hemispheres, Cerebellum, Brainstem)
    // -------------------------------------------------------------------------
    const brainGroup = new THREE.Group();
    brainGroup.position.set(0, 4.48, 0.02);

    const cerebrumMat = createOrganMaterial(0xF0ABFC, 0x86198F, 0.45, 0.38);
    const cerebellumMat = createOrganMaterial(0xD946EF, 0x701A75, 0.42, 0.42);
    const brainstemMat = createOrganMaterial(0xF5D0FE, 0x86198F, 0.35, 0.35);

    const buildCerebralHemisphere = (side: -1 | 1) => {
      const geo = new THREE.SphereGeometry(0.21, 40, 32);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const nx = v.x / 0.21;
        const ny = v.y / 0.21;
        const nz = v.z / 0.21;

        // Pipihkan dinding medial yang menghadap fisura longitudinalis tengah
        if ( nx * side < 0 ) {
          v.x *= 0.22;
        } else {
          v.x *= 0.88;
        }

        // Memanjang anteroposterior (Frontal ke Oksipital)
        v.z *= 1.32;
        v.y *= 1.02;

        // Pipihkan sedikit dasar otak (inferior)
        if (ny < -0.2) {
          v.y *= 0.78;
        }

        // Tonjolan Lobus Temporalis di sisi bawah-samping-depan
        if (nx * side > 0.2 && ny < 0.05 && ny > -0.75 && nz > -0.25 && nz < 0.55) {
          const tempBulge = Math.cos((ny + 0.3) * 2.5) * Math.cos((nz - 0.15) * 2.2);
          if (tempBulge > 0) {
            v.x += side * tempBulge * 0.038;
            v.y -= tempBulge * 0.022;
          }
        }

        // Meruncing halus pada kutub frontal (depan)
        if (nz > 0.3) {
          v.x *= 1 - (nz - 0.3) * 0.22;
          v.y *= 1 - (nz - 0.3) * 0.15;
        }

        // Efek lekukan korteks serebri (Gyri & Sulci)
        const sulci =
          Math.sin(nx * 19 + nz * 15) * Math.cos(ny * 17 - nz * 13) * 0.008 +
          Math.sin(nz * 25 + ny * 21) * 0.005;
        const len = v.length() || 1;
        v.addScaledVector(v, sulci / len);

        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, cerebrumMat);
      mesh.position.set(side * 0.032, 0.04, 0.01);
      return mesh;
    };

    brainGroup.add(buildCerebralHemisphere(-1));
    brainGroup.add(buildCerebralHemisphere(1));

    // Otak Kecil (Cerebellum - 2 Hemisfer + Vermis dengan alur folia horizontal)
    ([-1, 1] as const).forEach((side) => {
      const cbGeo = new THREE.SphereGeometry(0.095, 24, 20);
      const pos = cbGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) * 1.05;
        const y = pos.getY(i) * 0.72;
        const z = pos.getZ(i) * 0.85;
        const folia = Math.sin(y * 95) * 0.0035;
        pos.setXYZ(i, x + side * folia, y, z + folia);
      }
      cbGeo.computeVertexNormals();
      const cbMesh = new THREE.Mesh(cbGeo, cerebellumMat);
      cbMesh.position.set(side * 0.075, -0.11, -0.15);
      brainGroup.add(cbMesh);
    });

    // Batang Otak (Brainstem: Pons & Medulla Oblongata)
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.04, -0.02),
      new THREE.Vector3(0, -0.13, -0.03),
      new THREE.Vector3(0, -0.24, -0.06),
      new THREE.Vector3(0, -0.34, -0.07)
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 16, 0.042, 14, false);
    const stemMesh = new THREE.Mesh(stemGeo, brainstemMat);
    brainGroup.add(stemMesh);

    // Tonjolan Pons pada batang otak
    const ponsGeo = new THREE.SphereGeometry(0.058, 16, 16);
    ponsGeo.scale(1.1, 0.9, 0.85);
    const ponsMesh = new THREE.Mesh(ponsGeo, brainstemMat);
    ponsMesh.position.set(0, -0.12, -0.015);
    brainGroup.add(ponsMesh);

    tagOrganGroup(brainGroup, 'brain');
    bodyGroup.add(brainGroup);
    organMeshes['brain'] = brainGroup;

    // -------------------------------------------------------------------------
    // B. PARU-PARU & TRAKEA (Pulmo Dextra 3 Lobus, Pulmo Sinistra 2 Lobus + Cardiac Notch)
    // -------------------------------------------------------------------------
    const lungsGroup = new THREE.Group();
    lungsGroup.position.set(0, 2.68, 0.02);

    const lungMat = createOrganMaterial(0x38BDF8, 0x0284C7, 0.42, 0.36);
    const tracheaMat = createOrganMaterial(0xBAE6FD, 0x0369A1, 0.35, 0.3);

    const buildAnatomicalLung = (side: -1 | 1) => {
      // side = 1: Paru Kanan (di layar kanan +X), side = -1: Paru Kiri (di layar kiri -X dengan Cardiac Notch)
      const geo = new THREE.SphereGeometry(0.32, 40, 34);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const nx = THREE.MathUtils.clamp(v.x / 0.32, -1, 1);
        const ny = THREE.MathUtils.clamp(v.y / 0.32, -1, 1);
        const nz = THREE.MathUtils.clamp(v.z / 0.32, -1, 1);

        // Tinggi vertikal paru
        v.y *= 1.48;

        // Meruncing di bagian atas (Apex Pulmonis) dan melebar di bagian bawah (Basis)
        const heightNorm = THREE.MathUtils.clamp((ny + 1) * 0.5, 0, 1); // 0 (bawah) s/d 1 (atas)
        const widthTaper = 1.08 - 0.52 * Math.pow(heightNorm, 1.45);
        v.x *= widthTaper * 0.78;
        v.z *= (1.02 - 0.38 * Math.pow(heightNorm, 1.3)) * 0.72;

        // Dinding medial (menghadap jantung/mediastinum) dibuat rata/cekung
        if (nx * side < 0) {
          v.x *= 0.42;
        } else {
          // Dinding lateral (costal surface) melengkung mengikuti tulang rusuk
          v.x += side * 0.03 * Math.cos(ny * 1.2);
        }

        // Cekungan Kubah Diafragma di dasar paru (Diaphragmatic Surface)
        if (ny < -0.55) {
          const domeBase = Math.max(0, (-0.55 - ny) / 0.45);
          const dome = Math.cos(nx * 1.2) * Math.cos(nz * 1.2) * Math.pow(domeBase, 1.3);
          v.y += Math.max(0, dome) * 0.09;
        }

        // Khusus Paru Kiri (side === -1): Lekukan Jantung (Cardiac Notch) di anteromedial bawah
        if (side === -1 && nx > -0.15 && ny < 0.15 && ny > -0.75 && nz > -0.15) {
          const notchStrength = Math.cos((ny + 0.3) * 2.6) * Math.max(0, 1 - Math.abs(nx - 0.35) * 1.8);
          if (notchStrength > 0) {
            v.x -= notchStrength * 0.085;
            v.z -= notchStrength * 0.04;
          }
        }

        // Alur Fisura Oblik (Fissura Obliqua) & Fisura Horizontal (pada Paru Kanan)
        const obliqueDist = Math.abs(ny + nz * 0.65 + 0.1);
        if (obliqueDist < 0.06) {
          const groove = (1 - obliqueDist / 0.06) * 0.014;
          v.multiplyScalar(1 - groove);
        }
        if (side === 1 && nz > -0.1) {
          const horizDist = Math.abs(ny - 0.08);
          if (horizDist < 0.05) {
            const groove = (1 - horizDist / 0.05) * 0.012;
            v.multiplyScalar(1 - groove);
          }
        }

        pos.setXYZ(i, v.x, v.y, v.z);
      }

      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, lungMat);
      mesh.position.set(side * 0.22, -0.02, 0);
      return mesh;
    };

    lungsGroup.add(buildAnatomicalLung(-1));
    lungsGroup.add(buildAnatomicalLung(1));

    // Batang Trakea (Trachea) + Cincin Tulang Rawan + Percabangan Bronkus Utama
    const tracheaGeo = new THREE.CylinderGeometry(0.036, 0.038, 0.38, 20);
    const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
    tracheaMesh.position.set(0, 0.42, -0.02);
    lungsGroup.add(tracheaMesh);

    for (let r = 0; r < 8; r++) {
      const ringGeo = new THREE.TorusGeometry(0.039, 0.006, 8, 20);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, tracheaMat);
      ringMesh.position.set(0, 0.26 + r * 0.042, -0.02);
      lungsGroup.add(ringMesh);
    }

    ([-1, 1] as const).forEach((side) => {
      const bronchusCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.24, -0.02),
        new THREE.Vector3(side * 0.09, 0.16, -0.01),
        new THREE.Vector3(side * 0.18, 0.06, 0)
      ]);
      const bronchusGeo = new THREE.TubeGeometry(bronchusCurve, 12, 0.026, 12, false);
      const bronchusMesh = new THREE.Mesh(bronchusGeo, tracheaMat);
      lungsGroup.add(bronchusMesh);
    });

    tagOrganGroup(lungsGroup, 'lungs');
    bodyGroup.add(lungsGroup);
    organMeshes['lungs'] = lungsGroup;

    // -------------------------------------------------------------------------
    // C. JANTUNG (Cor: Ventrikel Kerucut Asimetris, Atrium, Aortic Arch & Vena Cava)
    // -------------------------------------------------------------------------
    const heartGroup = new THREE.Group();
    heartGroup.position.set(-0.11, 2.52, 0.12);

    const heartMat = createOrganMaterial(0xEF4444, 0x991B1B, 0.58, 0.28);
    const aortaMat = createOrganMaterial(0xDC2626, 0x7F1D1D, 0.5, 0.3);
    const venaMat = createOrganMaterial(0x6366F1, 0x312E81, 0.45, 0.32);

    // Korpus Ventrikel (Bentuk kerucut jantung organik meruncing ke Apeks Cordis kiri-bawah)
    const ventricleGeo = new THREE.SphereGeometry(0.165, 36, 32);
    const vPos = ventricleGeo.attributes.position;
    const hVec = new THREE.Vector3();
    for (let i = 0; i < vPos.count; i++) {
      hVec.fromBufferAttribute(vPos, i);
      const ny = THREE.MathUtils.clamp(hVec.y / 0.165, -1, 1); // -1 (apeks bawah) s/d +1 (basis atas)
      const t = THREE.MathUtils.clamp((ny + 1) * 0.5, 0, 1); // 0 di apeks, 1 di basis

      // Meruncing di bagian bawah (apeks) dan membulat penuh di bagian tengah-atas
      const radiusProfile = 0.35 + 0.78 * Math.pow(t, 0.55);
      hVec.x *= radiusProfile * 0.92;
      hVec.z *= radiusProfile * 0.82;
      hVec.y *= 1.25;

      // Membelokkan ujung apeks sedikit ke arah kiri-depan
      const apexBend = Math.pow(Math.max(0, 1 - t), 1.6);
      hVec.x -= apexBend * 0.055;
      hVec.z += apexBend * 0.035;

      // Alur Sulkus Interventrikularis Anterior
      if (hVec.z > 0 && Math.abs(hVec.x + 0.02 - ny * 0.03) < 0.02) {
        hVec.z -= 0.008;
      }

      vPos.setXYZ(i, hVec.x, hVec.y, hVec.z);
    }
    ventricleGeo.computeVertexNormals();
    const ventricleMesh = new THREE.Mesh(ventricleGeo, heartMat);
    ventricleMesh.rotation.z = 0.22;
    heartGroup.add(ventricleMesh);

    // Atrium Kanan & Kiri di bagian basis atas jantung
    const rightAtriumGeo = new THREE.SphereGeometry(0.075, 20, 18);
    rightAtriumGeo.scale(0.95, 1.05, 0.85);
    const rightAtriumMesh = new THREE.Mesh(rightAtriumGeo, heartMat);
    rightAtriumMesh.position.set(0.085, 0.09, -0.01);
    heartGroup.add(rightAtriumMesh);

    const leftAtriumGeo = new THREE.SphereGeometry(0.068, 20, 18);
    leftAtriumGeo.scale(0.95, 0.95, 0.85);
    const leftAtriumMesh = new THREE.Mesh(leftAtriumGeo, heartMat);
    leftAtriumMesh.position.set(-0.075, 0.11, -0.03);
    heartGroup.add(leftAtriumMesh);

    // Lengkung Aorta (Arcus Aortae) + 3 Cabang Arteri Supra-aorta
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 0.09, 0.01),
      new THREE.Vector3(0.025, 0.21, 0.02),
      new THREE.Vector3(-0.015, 0.27, -0.01),
      new THREE.Vector3(-0.06, 0.22, -0.05),
      new THREE.Vector3(-0.055, 0.06, -0.07)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 24, 0.032, 16, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    heartGroup.add(aortaMesh);

    [-0.025, 0.0, 0.022].forEach((bx, idx) => {
      const branchGeo = new THREE.CylinderGeometry(0.01, 0.013, 0.075, 10);
      const branchMesh = new THREE.Mesh(branchGeo, aortaMat);
      branchMesh.position.set(bx, 0.295 - idx * 0.006, 0.0 - idx * 0.008);
      branchMesh.rotation.z = (idx - 1) * -0.15;
      heartGroup.add(branchMesh);
    });

    // Vena Cava Superior & Trunkus Pulmonalis
    const svcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.09, 0.10, -0.01),
      new THREE.Vector3(0.095, 0.22, -0.015),
      new THREE.Vector3(0.09, 0.29, -0.02)
    ]);
    const svcGeo = new THREE.TubeGeometry(svcCurve, 12, 0.024, 12, false);
    const svcMesh = new THREE.Mesh(svcGeo, venaMat);
    heartGroup.add(svcMesh);

    const pulmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.08, 0.045),
      new THREE.Vector3(-0.04, 0.17, 0.03),
      new THREE.Vector3(-0.09, 0.19, 0.0)
    ]);
    const pulmGeo = new THREE.TubeGeometry(pulmCurve, 12, 0.025, 12, false);
    const pulmMesh = new THREE.Mesh(pulmGeo, venaMat);
    heartGroup.add(pulmMesh);

    tagOrganGroup(heartGroup, 'heart');
    bodyGroup.add(heartGroup);
    organMeshes['heart'] = heartGroup;

    // -------------------------------------------------------------------------
    // D. HATI / LIVER (Hepar: Lobus Kanan Besar, Lobus Kiri Meruncing & Kantung Empedu)
    // -------------------------------------------------------------------------
    const liverGroup = new THREE.Group();
    liverGroup.position.set(0.18, 1.92, 0.08);

    const liverMat = createOrganMaterial(0xEA580C, 0x7C2D12, 0.42, 0.34);
    const gallbladderMat = createOrganMaterial(0x10B981, 0x065F46, 0.45, 0.3);

    const liverGeo = new THREE.SphereGeometry(0.26, 40, 32);
    const lPos = liverGeo.attributes.position;
    const lVec = new THREE.Vector3();

    for (let i = 0; i < lPos.count; i++) {
      lVec.fromBufferAttribute(lPos, i);
      const nx = lVec.x / 0.26; // -1 (ujung lobus kiri meruncing) s/d +1 (lobus kanan tebal)
      const ny = lVec.y / 0.26;
      const nz = lVec.z / 0.26;

      // Lebar horizontal hati membentang dari kanan ke lewat tengah kiri
      lVec.x *= 1.35;

      // Bentuk Baji (Wedge): Lobus kanan (nx > 0) tebal & tinggi, Lobus kiri (nx < 0) menipis & meruncing ke atas-kiri
      const wedgeFactor = Math.max(0.18, Math.min(1.15, 0.68 + nx * 0.48));
      lVec.y *= wedgeFactor * 0.78;
      lVec.z *= wedgeFactor * 0.68;

      // Lengkungan kubah diafragma di atas dan mengangkat ujung kiri mengikuti bawah jantung
      lVec.y += nx < 0 ? nx * -0.045 : -Math.pow(nx, 2) * 0.04;

      // Cekungan permukaan viseral bawah hati (Visceral Surface)
      if (ny < -0.15) {
        const concavity = Math.cos(nx * 1.1) * Math.cos(nz * 1.2) * 0.045;
        lVec.y += Math.max(0, concavity);
      }

      // Lekukan Ligamentum Falciforme pembatas Lobus Kanan & Lobus Kiri
      const falciformDist = Math.abs(nx + 0.12);
      if (falciformDist < 0.08 && nz > -0.1) {
        const groove = (1 - falciformDist / 0.08) * 0.018;
        lVec.z -= groove;
        lVec.y -= groove * 0.5;
      }

      lPos.setXYZ(i, lVec.x, lVec.y, lVec.z);
    }
    liverGeo.computeVertexNormals();
    const liverMesh = new THREE.Mesh(liverGeo, liverMat);
    liverGroup.add(liverMesh);

    tagOrganGroup(liverGroup, 'liver');
    bodyGroup.add(liverGroup);
    organMeshes['liver'] = liverGroup;

    // -------------------------------------------------------------------------
    // E. LAMBUNG (Gaster: Kantung Huruf-J Utuh — Cardia, Fundus, Corpus, Antrum, Pylorus)
    // -------------------------------------------------------------------------
    const stomachGroup = new THREE.Group();
    stomachGroup.position.set(-0.20, 1.82, 0.06);

    const stomachMat = createOrganMaterial(0xF59E0B, 0xB45309, 0.46, 0.32);

    // Bangun geometri tabung huruf-J dengan profil jari-jari variabel (Variable-Radius Swept Tube)
    const stomachSpine = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.09, 0.24, -0.02),  // Esofagus distal / Cardia
      new THREE.Vector3(-0.02, 0.16, -0.01), // Pertemuan Cardia - Fundus
      new THREE.Vector3(-0.11, 0.06, 0.01),  // Corpus atas (Curvatura Major mengembang ke kiri)
      new THREE.Vector3(-0.10, -0.08, 0.02), // Corpus bawah
      new THREE.Vector3(-0.01, -0.16, 0.02), // Antrum Pyloricum (melengkung bentuk J)
      new THREE.Vector3(0.09, -0.11, 0.0),   // Canalis Pyloricus / Sfingter Pilorus
      new THREE.Vector3(0.14, -0.17, -0.02)  // Awal Duodenum
    ]);

    const tubularSegments = 48;
    const radialSegments = 24;
    const frames = stomachSpine.computeFrenetFrames(tubularSegments, false);
    const sVertices: number[] = [];
    const sIndices: number[] = [];

    // Radius anatomis di sepanjang kurva: kecil di esofagus, besar menggembung di fundus/corpus, mengecil di pilorus
    const getStomachRadius = (t: number) => {
      if (t < 0.14) {
        return 0.026 + (t / 0.14) * 0.065; // Esofagus -> Cardia
      } else if (t < 0.62) {
        const localT = (t - 0.14) / 0.48;
        return 0.091 + Math.sin(localT * Math.PI) * 0.032; // Menggembung di Fundus & Corpus
      } else if (t < 0.85) {
        const localT = (t - 0.62) / 0.23;
        return 0.091 * (1 - localT) + 0.032 * localT; // Menyempit di Antrum -> Pilorus
      } else {
        return 0.034; // Duodenum
      }
    };

    const p = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const vertex = new THREE.Vector3();

    for (let i = 0; i <= tubularSegments; i++) {
      const t = i / tubularSegments;
      stomachSpine.getPointAt(t, p);
      const N = frames.normals[i];
      const B = frames.binormals[i];
      const baseR = getStomachRadius(t);

      for (let j = 0; j <= radialSegments; j++) {
        const vAngle = (j / radialSegments) * Math.PI * 2;
        const sin = Math.sin(vAngle);
        const cos = -Math.cos(vAngle);

        normal.x = cos * N.x + sin * B.x;
        normal.y = cos * N.y + sin * B.y;
        normal.z = cos * N.z + sin * B.z;
        normal.normalize();

        // Pipihkan sedikit secara anteroposterior (sumbu Z) agar tampak seperti kantung lambung asli
        const rX = baseR * 1.08;
        const rY = baseR * 1.05;
        const rZ = baseR * 0.68;

        vertex.x = p.x + rX * normal.x;
        vertex.y = p.y + rY * normal.y;
        vertex.z = p.z + rZ * normal.z;

        // Tonjolan Kubah Fundus Gastricus di bagian kiri-atas (t sekitar 0.15 - 0.38)
        if (t > 0.12 && t < 0.42 && normal.x < 0) {
          const fundusBulge = Math.sin(((t - 0.12) / 0.30) * Math.PI) * (-normal.x);
          vertex.x -= fundusBulge * 0.042;
          vertex.y += fundusBulge * 0.048;
        }

        sVertices.push(vertex.x, vertex.y, vertex.z);
      }
    }

    for (let j = 1; j <= tubularSegments; j++) {
      for (let i = 1; i <= radialSegments; i++) {
        const a = (radialSegments + 1) * (j - 1) + (i - 1);
        const b = (radialSegments + 1) * j + (i - 1);
        const c = (radialSegments + 1) * j + i;
        const d = (radialSegments + 1) * (j - 1) + i;
        sIndices.push(a, b, d);
        sIndices.push(b, c, d);
      }
    }

    const stomachGeo = new THREE.BufferGeometry();
    stomachGeo.setAttribute('position', new THREE.Float32BufferAttribute(sVertices, 3));
    stomachGeo.setIndex(sIndices);
    stomachGeo.computeVertexNormals();

    const stomachMesh = new THREE.Mesh(stomachGeo, stomachMat);
    stomachGroup.add(stomachMesh);

    tagOrganGroup(stomachGroup, 'stomach');
    bodyGroup.add(stomachGroup);
    organMeshes['stomach'] = stomachGroup;

    // -------------------------------------------------------------------------
    // F. GINJAL (Ren Sinistra & Dextra: Bentuk Kacang + Hilus, Kelenjar Adrenal & Ureter)
    // -------------------------------------------------------------------------
    const kidneyGroup = new THREE.Group();
    kidneyGroup.position.set(0, 1.46, -0.18);

    const kidneyMat = createOrganMaterial(0x8B5CF6, 0x4C1D95, 0.46, 0.32);
    const adrenalMat = createOrganMaterial(0xFBBF24, 0x92400E, 0.38, 0.4);
    const ureterMat = createOrganMaterial(0xDDD6FE, 0x5B21B6, 0.35, 0.35);

    const buildBeanKidney = (side: -1 | 1) => {
      // side = -1 (Kiri layar / lebih tinggi), side = 1 (Kanan layar / sedikit lebih rendah di bawah hati)
      const kSubGroup = new THREE.Group();
      const yOffset = side === 1 ? -0.045 : 0.045;
      kSubGroup.position.set(side * 0.22, yOffset, 0);

      const geo = new THREE.SphereGeometry(0.11, 32, 26);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const nx = v.x / 0.11;
        const ny = v.y / 0.11;

        // Proporsi memanjang vertikal dan pipih anteroposterior
        v.y *= 1.42;
        v.x *= 0.85;
        v.z *= 0.58;

        // Lengkungan bentuk kacang (Bean-shape): kutub atas & bawah melengkung ke arah medial (tengah)
        v.x -= side * Math.pow(ny, 2) * 0.038;

        // Cekungan Hilus Renalis (Renal Hilum) di sisi medial yang menghadap tulang belakang
        if (nx * side < 0 && Math.abs(ny) < 0.65) {
          const hilumIndent = Math.cos(ny * 2.2) * Math.abs(nx);
          v.x += side * hilumIndent * 0.052;
        }

        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      const kMesh = new THREE.Mesh(geo, kidneyMat);
      kMesh.rotation.z = side * 0.15;
      kMesh.rotation.y = -side * 0.22;
      kSubGroup.add(kMesh);

      // Kelenjar Adrenal (Suprarenal Gland) di kutub atas-medial tiap ginjal
      const adrGeo = new THREE.ConeGeometry(0.042, 0.055, 16);
      adrGeo.scale(1.1, 0.85, 0.65);
      const adrMesh = new THREE.Mesh(adrGeo, adrenalMat);
      adrMesh.position.set(-side * 0.02, 0.155, 0.005);
      adrMesh.rotation.z = side * 0.35;
      kSubGroup.add(adrMesh);

      // Saluran Ureter turun dari Hilus Renalis menuju vesika urinaria
      const ureterCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-side * 0.04, -0.01, 0.0),
        new THREE.Vector3(-side * 0.07, -0.14, 0.015),
        new THREE.Vector3(-side * 0.09, -0.32, 0.03)
      ]);
      const ureterGeo = new THREE.TubeGeometry(ureterCurve, 14, 0.011, 10, false);
      const ureterMesh = new THREE.Mesh(ureterGeo, ureterMat);
      kSubGroup.add(ureterMesh);

      // Pembuluh Arteri/Vena Renalis masuk ke Hilus
      const renalVesselGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.14, 10);
      renalVesselGeo.rotateZ(Math.PI / 2);
      const renalVesselMesh = new THREE.Mesh(renalVesselGeo, kidneyMat);
      renalVesselMesh.position.set(-side * 0.10, 0.01, 0.01);
      kSubGroup.add(renalVesselMesh);

      return kSubGroup;
    };

    kidneyGroup.add(buildBeanKidney(-1));
    kidneyGroup.add(buildBeanKidney(1));

    tagOrganGroup(kidneyGroup, 'kidneys');
    bodyGroup.add(kidneyGroup);
    organMeshes['kidneys'] = kidneyGroup;

    // -------------------------------------------------------------------------
    // G. MATA & SARAF OPTIK (Oculus & Nervus Opticus + Chiasma Opticum)
    // -------------------------------------------------------------------------
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 4.42, 0.22);

    const scleraMat = createOrganMaterial(0xF8FAFC, 0x38BDF8, 0.32, 0.2);
    const irisMat = createOrganMaterial(0x06B6D4, 0x0891B2, 0.65, 0.15);
    const pupilMat = createOrganMaterial(0x0F172A, 0x000000, 0.1, 0.1);
    const opticNerveMat = createOrganMaterial(0xFDE047, 0xCA8A04, 0.45, 0.35);

    ([-1, 1] as const).forEach((side) => {
      const eyeSub = new THREE.Group();
      eyeSub.position.set(side * 0.115, 0, 0);

      // Bola Mata (Bulbus Oculi / Sclera)
      const scleraGeo = new THREE.SphereGeometry(0.046, 24, 20);
      const scleraMesh = new THREE.Mesh(scleraGeo, scleraMat);
      eyeSub.add(scleraMesh);

      // Kornea & Iris di bagian anterior
      const irisGeo = new THREE.SphereGeometry(0.025, 20, 16);
      irisGeo.scale(1, 1, 0.45);
      const irisMesh = new THREE.Mesh(irisGeo, irisMat);
      irisMesh.position.set(0, 0, 0.038);
      eyeSub.add(irisMesh);

      // Pupil di tengah iris
      const pupilGeo = new THREE.SphereGeometry(0.012, 16, 12);
      pupilGeo.scale(1, 1, 0.4);
      const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
      pupilMesh.position.set(0, 0, 0.046);
      eyeSub.add(pupilMesh);

      // Saraf Optik (Nervus Opticus) menuju Chiasma Opticum di belakang
      const opticCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, -0.04),
        new THREE.Vector3(-side * 0.045, -0.005, -0.11),
        new THREE.Vector3(-side * 0.115, -0.01, -0.18)
      ]);
      const opticGeo = new THREE.TubeGeometry(opticCurve, 12, 0.011, 10, false);
      const opticMesh = new THREE.Mesh(opticGeo, opticNerveMat);
      eyeSub.add(opticMesh);

      eyesGroup.add(eyeSub);
    });

    tagOrganGroup(eyesGroup, 'eyes');
    bodyGroup.add(eyesGroup);
    organMeshes['eyes'] = eyesGroup;

    // -------------------------------------------------------------------------
    // H. KELENJAR TIROID (Glandula Thyroidea: Bentuk Kupu-Kupu 2 Lobus + Isthmus)
    // -------------------------------------------------------------------------
    const thyroidGroup = new THREE.Group();
    thyroidGroup.position.set(0, 3.38, 0.05);

    const thyroidMat = createOrganMaterial(0xF43F5E, 0x9F1239, 0.5, 0.34);

    ([-1, 1] as const).forEach((side) => {
      // Lobus Lateral Tiroid (Meruncing di kutub atas, membulat di bawah)
      const lobeGeo = new THREE.SphereGeometry(0.048, 24, 20);
      const pos = lobeGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ny = THREE.MathUtils.clamp(pos.getY(i) / 0.048, -1, 1);
        const taper = 1 - Math.max(0, ny) * 0.38;
        pos.setXYZ(
          i,
          pos.getX(i) * 0.68 * taper,
          pos.getY(i) * 1.55,
          pos.getZ(i) * 0.62 * taper
        );
      }
      lobeGeo.computeVertexNormals();
      const lobeMesh = new THREE.Mesh(lobeGeo, thyroidMat);
      lobeMesh.position.set(side * 0.052, 0.01, -0.008);
      lobeMesh.rotation.z = -side * 0.22;
      lobeMesh.rotation.y = side * 0.35;
      thyroidGroup.add(lobeMesh);
    });

    // Jembatan Isthmus Tiroid di bagian tengah depan trakea
    const isthmusGeo = new THREE.CapsuleGeometry(0.018, 0.055, 10, 14);
    isthmusGeo.rotateZ(Math.PI / 2);
    const isthmusMesh = new THREE.Mesh(isthmusGeo, thyroidMat);
    isthmusMesh.position.set(0, -0.015, 0.012);
    thyroidGroup.add(isthmusMesh);

    tagOrganGroup(thyroidGroup, 'thyroid');
    bodyGroup.add(thyroidGroup);
    organMeshes['thyroid'] = thyroidGroup;

    // -------------------------------------------------------------------------
    // I. ESOFAGUS / KERONGKONGAN (Oesophagus: Tabung Fibromuskular Faring -> Cardia)
    // -------------------------------------------------------------------------
    const esophagusGroup = new THREE.Group();
    esophagusGroup.position.set(0, 3.05, -0.05);

    const esophagusMat = createOrganMaterial(0xFB7185, 0x9F1239, 0.44, 0.35);

    const esoCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 0.52, 0.0),     // Faring bawah / Sfingter Esofagus Atas
      new THREE.Vector3(-0.01, 0.22, -0.01), // Esofagus Servikal-Torakal atas
      new THREE.Vector3(0.0, -0.15, -0.015), // Esofagus Torakal tengah (di belakang trakea/jantung)
      new THREE.Vector3(-0.03, -0.58, 0.01), // Esofagus Torakal bawah
      new THREE.Vector3(-0.10, -0.95, 0.08)  // Menembus Hiatus Diafragma ke Cardia Lambung
    ]);
    const esoGeo = new THREE.TubeGeometry(esoCurve, 36, 0.028, 16, false);
    const esoMesh = new THREE.Mesh(esoGeo, esophagusMat);
    esophagusGroup.add(esoMesh);

    tagOrganGroup(esophagusGroup, 'esophagus');
    bodyGroup.add(esophagusGroup);
    organMeshes['esophagus'] = esophagusGroup;

    // -------------------------------------------------------------------------
    // J. LIMPA (Lien / Splen: Kubah Limfoid Posterolateral Kiri Lambung)
    // -------------------------------------------------------------------------
    const spleenGroup = new THREE.Group();
    spleenGroup.position.set(-0.34, 1.88, -0.06);

    const spleenMat = createOrganMaterial(0xA855F7, 0x581C87, 0.48, 0.33);

    const spleenGeo = new THREE.SphereGeometry(0.105, 28, 24);
    const spPos = spleenGeo.attributes.position;
    for (let i = 0; i < spPos.count; i++) {
      const nx = THREE.MathUtils.clamp(spPos.getX(i) / 0.105, -1, 1);
      const ny = THREE.MathUtils.clamp(spPos.getY(i) / 0.105, -1, 1);
      let x = spPos.getX(i) * 0.72;
      const y = spPos.getY(i) * 1.32;
      const z = spPos.getZ(i) * 0.92;
      // Cekungan medial (gastric impression) yang menghadap fundus lambung
      if (nx > 0) {
        x *= 0.65;
      } else {
        x -= Math.cos(ny * 1.2) * 0.015;
      }
      spPos.setXYZ(i, x, y, z);
    }
    spleenGeo.computeVertexNormals();
    const spleenMesh = new THREE.Mesh(spleenGeo, spleenMat);
    spleenMesh.rotation.z = -0.28;
    spleenMesh.rotation.y = 0.35;
    spleenGroup.add(spleenMesh);

    tagOrganGroup(spleenGroup, 'spleen');
    bodyGroup.add(spleenGroup);
    organMeshes['spleen'] = spleenGroup;

    // -------------------------------------------------------------------------
    // K. PANKREAS (Pancreas: Kaput, Kolum, Korpus & Kauda Melintang Retroperitoneal)
    // -------------------------------------------------------------------------
    const pancreasGroup = new THREE.Group();
    pancreasGroup.position.set(-0.04, 1.62, -0.04);

    const pancreasMat = createOrganMaterial(0xFBBF24, 0xB45309, 0.48, 0.38);

    const pancCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.11, -0.05, 0.01),  // Processus Uncinatus & Kaput Pankreas (di lengkung duodenum)
      new THREE.Vector3(0.06, 0.0, 0.02),    // Collum (Leher) Pankreas
      new THREE.Vector3(-0.06, 0.04, 0.01),  // Corpus (Badan) Pankreas
      new THREE.Vector3(-0.18, 0.09, -0.02), // Cauda (Ekor) Pankreas menuju hilus limpa
      new THREE.Vector3(-0.25, 0.13, -0.04)
    ]);

    const pTubular = 32;
    const pRadial = 18;
    const pFrames = pancCurve.computeFrenetFrames(pTubular, false);
    const pVertices: number[] = [];
    const pIndices: number[] = [];
    const pPoint = new THREE.Vector3();
    const pNorm = new THREE.Vector3();

    for (let i = 0; i <= pTubular; i++) {
      const t = i / pTubular;
      pancCurve.getPointAt(t, pPoint);
      const N = pFrames.normals[i];
      const B = pFrames.binormals[i];
      // Kaput pankreas (t=0..0.25) tebal membulat, lalu meruncing bertahap ke ekor (t=1)
      const baseR = (0.068 * (1 - t * 0.68)) + (t < 0.25 ? Math.sin((t / 0.25) * Math.PI) * 0.018 : 0);

      for (let j = 0; j <= pRadial; j++) {
        const ang = (j / pRadial) * Math.PI * 2;
        const sin = Math.sin(ang);
        const cos = -Math.cos(ang);
        pNorm.set(
          cos * N.x + sin * B.x,
          cos * N.y + sin * B.y,
          cos * N.z + sin * B.z
        ).normalize();

        // Tekstur lobular khas kelenjar pankreas
        const lobule = 1 + Math.sin(t * 42 + ang * 6) * 0.06;
        pVertices.push(
          pPoint.x + pNorm.x * baseR * lobule,
          pPoint.y + pNorm.y * baseR * 0.85 * lobule,
          pPoint.z + pNorm.z * baseR * 0.58 * lobule
        );
      }
    }

    for (let j = 1; j <= pTubular; j++) {
      for (let i = 1; i <= pRadial; i++) {
        const a = (pRadial + 1) * (j - 1) + (i - 1);
        const b = (pRadial + 1) * j + (i - 1);
        const c = (pRadial + 1) * j + i;
        const d = (pRadial + 1) * (j - 1) + i;
        pIndices.push(a, b, d);
        pIndices.push(b, c, d);
      }
    }

    const pancGeo = new THREE.BufferGeometry();
    pancGeo.setAttribute('position', new THREE.Float32BufferAttribute(pVertices, 3));
    pancGeo.setIndex(pIndices);
    pancGeo.computeVertexNormals();
    const pancMesh = new THREE.Mesh(pancGeo, pancreasMat);
    pancreasGroup.add(pancMesh);

    tagOrganGroup(pancreasGroup, 'pancreas');
    bodyGroup.add(pancreasGroup);
    organMeshes['pancreas'] = pancreasGroup;

    // -------------------------------------------------------------------------
    // L. KANDUNG EMPEDU & SALURAN BILIER (Vesica Fellea & Ductus Choledochus)
    // -------------------------------------------------------------------------
    const gallbladderGroup = new THREE.Group();
    gallbladderGroup.position.set(0.16, 1.75, 0.12);

    // Kantung berbentuk buah pir (Fundus, Corpus, Infundibulum)
    const gbSacGeo = new THREE.SphereGeometry(0.052, 24, 20);
    const gbPos = gbSacGeo.attributes.position;
    for (let i = 0; i < gbPos.count; i++) {
      const ny = THREE.MathUtils.clamp(gbPos.getY(i) / 0.052, -1, 1);
      // Bagian bawah (fundus) menggembung bulat, bagian atas (leher/collum) meruncing
      const pearScale = 1 - Math.max(0, (ny + 0.3) / 1.3) * 0.55;
      gbPos.setXYZ(
        i,
        gbPos.getX(i) * 0.82 * pearScale,
        gbPos.getY(i) * 1.45,
        gbPos.getZ(i) * 0.82 * pearScale
      );
    }
    gbSacGeo.computeVertexNormals();
    const gbSacMesh = new THREE.Mesh(gbSacGeo, gallbladderMat);
    gbSacMesh.rotation.z = -0.38;
    gbSacMesh.rotation.x = 0.22;
    gallbladderGroup.add(gbSacMesh);

    // Saluran Ductus Cysticus & Ductus Choledochus menuju Duodenum
    const bileDuctCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.06, -0.01),
      new THREE.Vector3(-0.06, 0.09, -0.03),
      new THREE.Vector3(-0.09, 0.02, -0.05),
      new THREE.Vector3(-0.11, -0.09, -0.05)
    ]);
    const bileDuctGeo = new THREE.TubeGeometry(bileDuctCurve, 16, 0.01, 10, false);
    const bileDuctMesh = new THREE.Mesh(bileDuctGeo, gallbladderMat);
    gallbladderGroup.add(bileDuctMesh);

    tagOrganGroup(gallbladderGroup, 'gallbladder');
    bodyGroup.add(gallbladderGroup);
    organMeshes['gallbladder'] = gallbladderGroup;

    // -------------------------------------------------------------------------
    // M. USUS HALUS (Intestinum Tenue: Lilitan Berliku Duodenum, Jejunum & Ileum)
    // -------------------------------------------------------------------------
    const smallIntestineGroup = new THREE.Group();
    smallIntestineGroup.position.set(0, 1.12, 0.08);

    const smallIntestineMat = createOrganMaterial(0xFB923C, 0x9A3412, 0.44, 0.34);

    // Buat kurva lilitan usus halus berliku-liku (Meandering Intestinal Coils) di tengah rongga perut
    const siPoints: THREE.Vector3[] = [];
    const numRows = 6;
    const ptsPerRow = 7;
    for (let r = 0; r < numRows; r++) {
      const yRow = 0.22 - (r / (numRows - 1)) * 0.44;
      const rowWidth = 0.19 - Math.abs(r - 2.5) * 0.012;
      const dir = r % 2 === 0 ? 1 : -1;
      for (let c = 0; c < ptsPerRow; c++) {
        const frac = c / (ptsPerRow - 1);
        const xVal = dir * (-rowWidth + frac * 2 * rowWidth);
        const yWave = Math.sin(frac * Math.PI * 2.5 + r) * 0.028;
        const zWave = Math.cos(frac * Math.PI * 3 + r * 1.4) * 0.038;
        siPoints.push(new THREE.Vector3(xVal, yRow + yWave, zWave));
      }
    }
    const siCurve = new THREE.CatmullRomCurve3(siPoints, false, 'centripetal', 0.5);
    const siGeo = new THREE.TubeGeometry(siCurve, 140, 0.034, 14, false);
    const siMesh = new THREE.Mesh(siGeo, smallIntestineMat);
    smallIntestineGroup.add(siMesh);

    tagOrganGroup(smallIntestineGroup, 'small_intestine');
    bodyGroup.add(smallIntestineGroup);
    organMeshes['small_intestine'] = smallIntestineGroup;

    // -------------------------------------------------------------------------
    // N. USUS BESAR & APENDIKS (Colon Frame: Sekum, Asendens, Transversum, Desendens, Sigmoid, Rektum)
    // -------------------------------------------------------------------------
    const largeIntestineGroup = new THREE.Group();
    largeIntestineGroup.position.set(0, 1.14, 0.05);

    const colonMat = createOrganMaterial(0xD97706, 0x78350F, 0.44, 0.36);

    const colonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.24, -0.22, 0.01),  // Sekum (Caecum) di fossa iliaka kanan bawah
      new THREE.Vector3(0.26, 0.02, 0.0),    // Kolon Asendens tengah
      new THREE.Vector3(0.25, 0.25, 0.01),   // Fleksura Hepatika (di bawah hati)
      new THREE.Vector3(0.08, 0.28, 0.04),   // Kolon Transversum kanan
      new THREE.Vector3(-0.08, 0.29, 0.04),  // Kolon Transversum kiri
      new THREE.Vector3(-0.25, 0.27, 0.01),  // Fleksura Lienalis (di bawah limpa)
      new THREE.Vector3(-0.26, 0.02, -0.01), // Kolon Desendens tengah
      new THREE.Vector3(-0.24, -0.22, 0.0),  // Kolon Iliaka kiri bawah
      new THREE.Vector3(-0.12, -0.30, -0.02),// Kolon Sigmoid melengkung ke tengah panggul
      new THREE.Vector3(0.0, -0.32, -0.05),  // Rektum atas
      new THREE.Vector3(0.0, -0.45, -0.06)   // Kanal Anal / Rektum bawah
    ]);

    const cTubular = 72;
    const cRadial = 18;
    const cFrames = colonCurve.computeFrenetFrames(cTubular, false);
    const cVertices: number[] = [];
    const cIndices: number[] = [];
    const cPt = new THREE.Vector3();
    const cNorm = new THREE.Vector3();

    for (let i = 0; i <= cTubular; i++) {
      const t = i / cTubular;
      colonCurve.getPointAt(t, cPt);
      const N = cFrames.normals[i];
      const B = cFrames.binormals[i];
      // Gelombang kantung Haustra Coli khas usus besar (mengecil di ujung rektum bawah)
      const haustra = 1 + Math.abs(Math.sin(t * Math.PI * 18)) * 0.24;
      const rectTaper = t > 0.9 ? 1 - ((t - 0.9) / 0.1) * 0.35 : 1;
      const r = 0.048 * haustra * rectTaper;

      for (let j = 0; j <= cRadial; j++) {
        const ang = (j / cRadial) * Math.PI * 2;
        const sin = Math.sin(ang);
        const cos = -Math.cos(ang);
        cNorm.set(
          cos * N.x + sin * B.x,
          cos * N.y + sin * B.y,
          cos * N.z + sin * B.z
        ).normalize();
        cVertices.push(
          cPt.x + cNorm.x * r,
          cPt.y + cNorm.y * r,
          cPt.z + cNorm.z * r * 0.85
        );
      }
    }

    for (let j = 1; j <= cTubular; j++) {
      for (let i = 1; i <= cRadial; i++) {
        const a = (cRadial + 1) * (j - 1) + (i - 1);
        const b = (cRadial + 1) * j + (i - 1);
        const c = (cRadial + 1) * j + i;
        const d = (cRadial + 1) * (j - 1) + i;
        cIndices.push(a, b, d);
        cIndices.push(b, c, d);
      }
    }

    const colonGeo = new THREE.BufferGeometry();
    colonGeo.setAttribute('position', new THREE.Float32BufferAttribute(cVertices, 3));
    colonGeo.setIndex(cIndices);
    colonGeo.computeVertexNormals();
    const colonMesh = new THREE.Mesh(colonGeo, colonMat);
    largeIntestineGroup.add(colonMesh);

    // Umbai Cacing / Usus Buntu (Appendix Vermiformis) di bawah Sekum kanan
    const appendixCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.24, -0.22, 0.01),
      new THREE.Vector3(0.22, -0.29, 0.02),
      new THREE.Vector3(0.19, -0.33, 0.01)
    ]);
    const appendixGeo = new THREE.TubeGeometry(appendixCurve, 12, 0.014, 10, false);
    const appendixMesh = new THREE.Mesh(appendixGeo, colonMat);
    largeIntestineGroup.add(appendixMesh);

    tagOrganGroup(largeIntestineGroup, 'large_intestine');
    bodyGroup.add(largeIntestineGroup);
    organMeshes['large_intestine'] = largeIntestineGroup;

    // -------------------------------------------------------------------------
    // O. KANDUNG KEMIH (Vesica Urinaria: Kantung Detrusor + Leher Uretra di Dasar Panggul)
    // -------------------------------------------------------------------------
    const bladderGroup = new THREE.Group();
    bladderGroup.position.set(0, 0.68, 0.12);

    const bladderMat = createOrganMaterial(0x3B82F6, 0x1D4ED8, 0.48, 0.3);

    const bladderGeo = new THREE.SphereGeometry(0.095, 28, 24);
    const bPos = bladderGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      const ny = THREE.MathUtils.clamp(bPos.getY(i) / 0.095, -1, 1);
      // Bentuk tetrahedron membulat: melebar di kubah atas (apex/fundus), menyempit di leher bawah (cervix vesicae)
      const neckTaper = ny < 0 ? 1 + ny * 0.42 : 1 - ny * 0.12;
      bPos.setXYZ(
        i,
        bPos.getX(i) * 1.05 * neckTaper,
        bPos.getY(i) * 0.95,
        bPos.getZ(i) * 0.88 * neckTaper
      );
    }
    bladderGeo.computeVertexNormals();
    const bladderMesh = new THREE.Mesh(bladderGeo, bladderMat);
    bladderGroup.add(bladderMesh);

    // Saluran Uretra proksimal di bawah kandung kemih
    const urethraGeo = new THREE.CylinderGeometry(0.016, 0.014, 0.08, 12);
    const urethraMesh = new THREE.Mesh(urethraGeo, bladderMat);
    urethraMesh.position.set(0, -0.10, -0.005);
    bladderGroup.add(urethraMesh);

    tagOrganGroup(bladderGroup, 'bladder');
    bodyGroup.add(bladderGroup);
    organMeshes['bladder'] = bladderGroup;

    // -------------------------------------------------------------------------
    // P. TULANG BELAKANG & MEDULLA SPINALIS (Columna Vertebralis: Kurva S 24 Ruas + Sakrum)
    // -------------------------------------------------------------------------
    const spineGroup = new THREE.Group();
    spineGroup.position.set(0, 2.35, -0.25);

    const vertebraMat = createOrganMaterial(0xE2E8F0, 0x0D9488, 0.38, 0.35);
    const discMat = createOrganMaterial(0x2DD4BF, 0x0F766E, 0.52, 0.25);
    const cordMat = createOrganMaterial(0xFDE047, 0xCA8A04, 0.48, 0.3);

    // Kurva S fisiologis tulang belakang (Lordosis Servikal, Kifosis Torakal, Lordosis Lumbal, Sakrum)
    const spinePoints: THREE.Vector3[] = [];
    const numVertebrae = 22;
    for (let vIdx = 0; vIdx < numVertebrae; vIdx++) {
      const frac = vIdx / (numVertebrae - 1); // 0 (C1 atas) s/d 1 (L5/Sakrum bawah)
      const yPos = 1.65 - frac * 3.15;
      // Kurva S sagital (sumbu Z)
      const zCurve = Math.sin(frac * Math.PI * 2.2) * 0.045;
      spinePoints.push(new THREE.Vector3(0, yPos, zCurve));

      // Ukuran korpus vertebra makin besar dari leher (servikal) ke pinggang (lumbal)
      const vRadius = 0.042 + frac * 0.032;
      const vHeight = 0.068;

      const vBodyGeo = new THREE.CylinderGeometry(vRadius, vRadius * 1.04, vHeight, 16);
      vBodyGeo.scale(1.15, 1, 0.88);
      const vBodyMesh = new THREE.Mesh(vBodyGeo, vertebraMat);
      vBodyMesh.position.set(0, yPos, zCurve);
      spineGroup.add(vBodyMesh);

      // Processus Spinosus (tonjolan tulang belakang ke arah punggung) & Processus Transversus
      const spinousGeo = new THREE.BoxGeometry(0.018, 0.042, 0.055);
      const spinousMesh = new THREE.Mesh(spinousGeo, vertebraMat);
      spinousMesh.position.set(0, yPos - 0.01, zCurve - vRadius * 0.95);
      spinousMesh.rotation.x = 0.35;
      spineGroup.add(spinousMesh);

      const transGeo = new THREE.BoxGeometry(vRadius * 2.9, 0.024, 0.024);
      const transMesh = new THREE.Mesh(transGeo, vertebraMat);
      transMesh.position.set(0, yPos, zCurve - vRadius * 0.45);
      spineGroup.add(transMesh);

      // Cakram Intervertebralis (Discus Intervertebralis) di antara ruas vertebra
      if (vIdx < numVertebrae - 1) {
        const discGeo = new THREE.CylinderGeometry(vRadius * 0.98, vRadius * 0.98, 0.026, 16);
        discGeo.scale(1.12, 1, 0.85);
        const discMesh = new THREE.Mesh(discGeo, discMat);
        discMesh.position.set(0, yPos - 0.052, zCurve);
        spineGroup.add(discMesh);
      }
    }

    // Tulang Kelangkang (Os Sacrum) berbentuk perisai segitiga terbalik di dasar lumbal
    const sacrumGeo = new THREE.ConeGeometry(0.088, 0.24, 16);
    sacrumGeo.scale(1.3, 1, 0.55);
    sacrumGeo.rotateX(Math.PI);
    const sacrumMesh = new THREE.Mesh(sacrumGeo, vertebraMat);
    sacrumMesh.position.set(0, -1.64, -0.02);
    sacrumMesh.rotation.x = Math.PI - 0.25;
    spineGroup.add(sacrumMesh);

    // Sumsum Tulang Belakang (Medulla Spinalis) berjalan di dalam kanalis vertebralis
    const spinalCordCurve = new THREE.CatmullRomCurve3(spinePoints);
    const spinalCordGeo = new THREE.TubeGeometry(spinalCordCurve, 40, 0.018, 12, false);
    const spinalCordMesh = new THREE.Mesh(spinalCordGeo, cordMat);
    spinalCordMesh.position.set(0, 0, -0.022);
    spineGroup.add(spinalCordMesh);

    tagOrganGroup(spineGroup, 'spine');
    bodyGroup.add(spineGroup);
    organMeshes['spine'] = spineGroup;

    organMeshesRef.current = organMeshes;

    // 9. Interactive Hotspot Rings (Ukuran halus & menempel dekat organ tanpa menghalangi bentuk 3D)
    const ringsGroup = new THREE.Group();
    bodyGroup.add(ringsGroup);
    const ringsMap: { [key: string]: THREE.Mesh } = {};

    ORGANS.forEach((org) => {
      const ringGeo = new THREE.RingGeometry(0.065, 0.095, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: org.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        depthTest: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(org.position[0], org.position[1], org.position[2] + 0.14);
      ring.userData.organId = org.id;
      ringsGroup.add(ring);
      ringsMap[org.id] = ring;
    });
    ringsRef.current = ringsMap;

    // Helper: Cari organId dari objek hasil raycast (mendukung nested group)
    const resolveOrganId = (obj: THREE.Object3D | null): string | null => {
      let curr: THREE.Object3D | null = obj;
      while (curr) {
        if (curr.userData?.organId) return curr.userData.organId;
        curr = curr.parent;
      }
      return null;
    };

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

      const clickableRoots = Object.values(organMeshesRef.current).filter((m) => m.visible);
      const intersects = raycaster.intersectObjects(clickableRoots, true);
      if (intersects.length > 0) {
        const foundId = resolveOrganId(intersects[0].object);
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

      const clickableRoots = Object.values(organMeshesRef.current).filter((m) => m.visible);
      const intersects = raycaster.intersectObjects(clickableRoots, true);
      if (intersects.length > 0) {
        const foundId = resolveOrganId(intersects[0].object);
        if (foundId) {
          const org = ORGANS.find((o) => o.id === foundId);
          if (org) {
            setSelectedOrgan(org);
            setIsOrganIsolated(true);
          }
        }
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
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow Auto-rotation if enabled
      if (isRotatingRef.current && !isMouseDown && bodyGroupRef.current) {
        bodyGroupRef.current.rotation.y += 0.004;
      }

      // Heart Pulsing (Systole & Diastole simulation)
      if (organMeshesRef.current['heart']) {
        const pulse = 1 + Math.sin(elapsed * 4.5) * 0.05;
        organMeshesRef.current['heart'].scale.set(pulse, pulse, pulse);
      }

      // Lungs Breathing (Inhalation & Exhalation)
      if (organMeshesRef.current['lungs']) {
        const breath = 1 + Math.sin(elapsed * 1.8) * 0.035;
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
  }, [gender]);

  // Handle Focus Zoom onto specific organ & isolate in 3D
  const handleSelectOrgan = (organ: OrganData) => {
    setSelectedOrgan(organ);
    setIsOrganIsolated(true);
    if (!bodyGroupRef.current || !cameraRef.current) return;
    bodyGroupRef.current.rotation.y = 0;
    bodyGroupRef.current.rotation.x = 0;
  };

  // Reset pilihan individual organ kembali ke tampilan Filter Lapisan Sistem Organ
  const handleResetOrganSelection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOrganIsolated(false);
    setSelectedOrgan(null);
    if (cameraRef.current && bodyGroupRef.current) {
      cameraRef.current.position.set(0, 2.2, 8.5);
      bodyGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  // Sinkronisasi saat klik tab Filter Lapisan Sistem Organ
  const handleSelectSystemFilter = (sys: string) => {
    setActiveSystemFilter(sys);
    setIsOrganIsolated(false);
    setSelectedOrgan(null);
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

          {/* Tombol Kontrol: Gender Switch (GLB 3D), Rotasi Aktif, Zoom & Reset Posisi */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Toggle Model 3D: Pria vs Wanita (female.glb & male.glb) */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#F1F5F9',
              borderRadius: '9px',
              padding: '2px',
              border: '1.5px solid #1E1E1E',
              boxShadow: '1.5px 1.5px 0px #1E1E1E'
            }}>
              <button
                type="button"
                onClick={() => setGender('female')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: gender === 'female' ? '#FCE7F3' : 'transparent',
                  color: gender === 'female' ? '#9D174D' : '#64748B',
                  fontWeight: gender === 'female' ? 900 : 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Model 3D Anatomi Wanita"
              >
                <Users size={14} />
                <span>Wanita</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('male')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: gender === 'male' ? '#E0F2FE' : 'transparent',
                  color: gender === 'male' ? '#0369A1' : '#64748B',
                  fontWeight: gender === 'male' ? 900 : 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Model 3D Anatomi Pria"
              >
                <User size={14} />
                <span>Pria</span>
              </button>
            </div>

            {/* Mode Visual Hologram / X-Ray / Solid */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#F8FAFC',
              borderRadius: '9px',
              padding: '2px',
              border: '1.5px solid #1E1E1E',
              boxShadow: '1.5px 1.5px 0px #1E1E1E'
            }}>
              {(['hologram', 'xray', 'solid'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setViewMode(m)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: viewMode === m ? '#1E1E1E' : 'transparent',
                    color: viewMode === m ? '#FFFFFF' : '#475569',
                    fontWeight: viewMode === m ? 900 : 700,
                    fontSize: '0.76rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {m === 'hologram' ? 'Hologram Glass' : m === 'xray' ? 'X-Ray Mesh' : 'Solid Body'}
                </button>
              ))}
            </div>

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
          >
            {isLoadingModel && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(3px)',
                zIndex: 30,
                pointerEvents: 'none'
              }}>
                <Loader2 size={36} className="animate-spin text-blue-600" style={{ color: '#0284C7' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                  Memuat Model 3D Anatomi ({gender === 'female' ? 'Wanita' : 'Pria'})...
                </span>
              </div>
            )}
          </div>

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

        {/* Bottom Bar: System Filter Tabs (Menempel ke Kiri / Align Left) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1.8px solid #1E1E1E',
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          zIndex: 10
        }}>
          <span style={{ color: '#475569', fontSize: '0.80rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
            FILTER LAPISAN SISTEM ORGAN:
          </span>
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            width: '100%'
          }}>
            {['ALL', 'Saraf', 'Kardiovaskular', 'Respirasi', 'Pencernaan', 'Ekskresi', 'Endokrin', 'Imun & Limfatik', 'Muskuloskeletal'].map((sys) => (
              <button
                key={sys}
                onClick={() => handleSelectSystemFilter(sys)}
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
      </div>

      {/* Row 2: Organ Quick Selector & Clinical Diagnosis Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Organ Quick Selector Badges with Inline Search Icon on the Left */}
          <div className="neo-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280' }}>
                  PILIH ORGAN TARGET SECARA LANGSUNG:
                </span>
                <span style={{
                  fontSize: '0.71rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1.2px solid #1E1E1E',
                  backgroundColor: (isOrganIsolated && selectedOrgan) ? '#FEF3C7' : '#E0F2FE',
                  color: (isOrganIsolated && selectedOrgan) ? '#92400E' : '#0369A1'
                }}>
                  {isOrganIsolated && selectedOrgan
                    ? `3D Fokus: ${selectedOrgan.name.split('(')[0].trim()}`
                    : `3D Lapisan: ${activeSystemFilter === 'ALL' ? 'Semua Organ' : `Sistem ${activeSystemFilter}`}`}
                </span>
              </div>
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
                        const isSelected = isOrganIsolated && selectedOrgan?.id === org.id;
                        return (
                          <div
                            key={org.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              borderRadius: '8px',
                              border: '1.5px solid #1E1E1E',
                              backgroundColor: isSelected ? org.highlightColor : '#FAF8F4',
                              color: isSelected ? '#FFFFFF' : '#18181B',
                              boxShadow: isSelected ? '2px 2px 0px #1E1E1E' : 'none',
                              overflow: 'hidden',
                              transition: 'all 0.1s ease'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleSelectOrgan(org)}
                              style={{
                                padding: isSelected ? '6px 8px 6px 12px' : '6px 12px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: 'inherit',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                cursor: 'pointer'
                              }}
                            >
                              {org.name.split('(')[0].trim()}
                            </button>
                            {isSelected && (
                              <button
                                type="button"
                                onClick={handleResetOrganSelection}
                                title="Reset pilihan organ (kembali ke tampilan sistem organ)"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: '6px 8px 6px 4px',
                                  border: 'none',
                                  borderLeft: '1px solid rgba(255,255,255,0.35)',
                                  backgroundColor: 'rgba(0,0,0,0.18)',
                                  color: '#FFFFFF',
                                  cursor: 'pointer'
                                }}
                              >
                                <X size={13} strokeWidth={3} />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Mode 2: Tampilan Normal (Tombol Cari di kiri Otak, diikuti pilihan organ dengan tombol silang X saat aktif) */
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
                  const isSelected = isOrganIsolated && selectedOrgan?.id === org.id;
                  return (
                    <div
                      key={org.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        borderRadius: '8px',
                        border: '1.5px solid #1E1E1E',
                        backgroundColor: isSelected ? org.highlightColor : '#FAF8F4',
                        color: isSelected ? '#FFFFFF' : '#18181B',
                        boxShadow: isSelected ? '2px 2px 0px #1E1E1E' : 'none',
                        overflow: 'hidden',
                        transition: 'all 0.1s ease'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectOrgan(org)}
                        style={{
                          padding: isSelected ? '6px 8px 6px 12px' : '6px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'inherit',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        {org.name.split('(')[0].trim()}
                      </button>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={handleResetOrganSelection}
                          title="Reset pilihan organ (kembali ke tampilan sistem organ)"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 8px 6px 5px',
                            border: 'none',
                            borderLeft: '1.2px solid rgba(255,255,255,0.4)',
                            backgroundColor: 'rgba(0,0,0,0.18)',
                            color: '#FFFFFF',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={13} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Organ Clinical Detail Card */}
          <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E', flex: 1 }}>
            {!selectedOrgan ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 24px',
                textAlign: 'center',
                backgroundColor: '#FAF8F4',
                borderRadius: '12px',
                border: '1.8px dashed #CBD5E1',
                gap: '16px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#EFF6FF',
                  border: '2px solid #1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2.5px 2.5px 0px #1E1E1E'
                }}>
                  <Stethoscope size={32} color="#0284C7" />
                </div>
                <div style={{ maxWidth: '460px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>
                    Silakan Pilih Organ untuk Divisualisasi
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                    Klik salah satu tombol organ di atas pada <strong>PILIH ORGAN TARGET SECARA LANGSUNG</strong> atau sentuh/klik organ langsung pada model 3D di atas untuk melihat visualisasi detail anatomi, patologi penyakit, dan rekomendasi farmakoterapi.
                  </p>
                </div>
              </div>
            ) : (
              <>
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
                  {selectedOrgan.imageUrl && !imageError ? (
                    <>
                      <img
                        src={selectedOrgan.imageUrl}
                        alt={`Anatomi 2D ${selectedOrgan.name}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() => setImageError(true)}
                        style={{
                          width: '95%',
                          height: '95%',
                          maxHeight: '250px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.10))',
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
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: `${selectedOrgan.highlightColor}15`,
                      border: `2.5px solid ${selectedOrgan.highlightColor}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <Activity size={48} color={selectedOrgan.highlightColor} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: selectedOrgan.highlightColor }}>
                        {selectedOrgan.system}
                      </span>
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
              </>
            )}
          </div>
        </div>

        {/* Modal Popup Gambar Anatomi */}
        {isImageModalOpen && selectedOrgan?.imageUrl && (
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
                      Detail Anatomi 2D: {selectedOrgan?.name}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                      Sistem {selectedOrgan?.system} • Sumber Terbuka Wikimedia Medical Commons
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
                  src={selectedOrgan?.imageUrl}
                  alt={`Anatomi Detail ${selectedOrgan?.name}`}
                  referrerPolicy="no-referrer"
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
