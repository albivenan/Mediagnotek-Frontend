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
  Maximize2
} from 'lucide-react';

interface OrganData {
  id: string;
  name: string;
  system: 'Saraf' | 'Kardiovaskular' | 'Respirasi' | 'Pencernaan' | 'Ekskresi' | 'Muskuloskeletal';
  description: string;
  position: [number, number, number];
  color: number;
  highlightColor: string;
  commonDiseases: {
    nama: string;
    gejala: string;
    rekomendasiObat: string[];
  }[];
  clinicalNotes: string;
}

const ORGANS: OrganData[] = [
  {
    id: 'brain',
    name: 'Otak (Encephalon) & Kepala',
    system: 'Saraf',
    description: 'Pusat kendali sistem saraf pusat yang mengatur seluruh fungsi kognitif, motorik, dan otonom tubuh.',
    position: [0, 4.4, 0],
    color: 0xE879F9,
    highlightColor: '#C026D3',
    commonDiseases: [
      {
        nama: 'Cephalea / Tension Headache',
        gejala: 'Nyeri kepala tegang seperti diikat, kekakuan otot leher.',
        rekomendasiObat: ['Paracetamol 500mg', 'Ibuprofen 400mg', 'Kombinasi Paracetamol + Kafein']
      },
      {
        nama: 'Migrain Tanpa Aura',
        gejala: 'Nyeri kepala berdenyut unilateral, fotofobia, mual.',
        rekomendasiObat: ['Sumatriptan', 'Paracetamol + Metoclopramide', 'Ergotamine']
      }
    ],
    clinicalNotes: 'Skrining kontraindikasi ergotamine pada pasien dengan riwayat penyakit vaskular perifer atau hipertensi tidak terkontrol.'
  },
  {
    id: 'lungs',
    name: 'Paru-paru (Pulmo Dextra & Sinistra)',
    system: 'Respirasi',
    description: 'Organ respirasi utama penukar oksigen dan karbon dioksida melalui alveoli mikroskopis.',
    position: [0, 2.7, 0.15],
    color: 0x38BDF8,
    highlightColor: '#0284C7',
    commonDiseases: [
      {
        nama: 'Asma Bronkial',
        gejala: 'Mengi (wheezing), sesak napas saat malam/dingin, batuk kering.',
        rekomendasiObat: ['Salbutamol Inhaler 100mcg', 'Budesonide Inhaler', 'Kombinasi Salmeterol + Fluticasone']
      },
      {
        nama: 'PPOK (Penyakit Paru Obstruktif Kronis)',
        gejala: 'Batuk produktif kronis, sesak bertahap, riwayat paparan polusi/rokok.',
        rekomendasiObat: ['Tiotropium Bromide', 'Ipratropium Bromide', 'Mukolitik N-Asetilsistein']
      }
    ],
    clinicalNotes: 'Cek riwayat alergi aerosol inhaler dan edukasi cara penggunaan MDI (Metered Dose Inhaler) yang benar kepada pasien.'
  },
  {
    id: 'heart',
    name: 'Jantung (Cor)',
    system: 'Kardiovaskular',
    description: 'Pompa muskular 4 ruang yang memompa darah teroksigenasi ke sirkulasi sistemik dan darah deoksigenasi ke paru.',
    position: [-0.28, 2.45, 0.45],
    color: 0xEF4444,
    highlightColor: '#DC2626',
    commonDiseases: [
      {
        nama: 'Hipertensi Primer Esensial',
        gejala: 'Tekanan darah ≥ 140/90 mmHg, rasa pegal di tengkuk, pusing.',
        rekomendasiObat: ['Amlodipine Besylate 5mg/10mg', 'Candesartan Cilexetil 8mg', 'Bisoprolol Fumarate 5mg']
      },
      {
        nama: 'Angina Pektoris Stabil',
        gejala: 'Nyeri dada retrosternal menjalar ke lengan kiri atau rahang saat aktivitas fisik.',
        rekomendasiObat: ['Isosorbide Dinitrate (ISDN) 5mg Sublingual', 'Aspirin 80mg', 'Atorvastatin 20mg']
      }
    ],
    clinicalNotes: 'Perhatikan skrining interaksi obat CCB (Amlodipine) dengan inhibitor CYP3A4 kuat dan pantau profil lipid berkala.'
  },
  {
    id: 'liver',
    name: 'Hati (Hepar)',
    system: 'Pencernaan',
    description: 'Kelenjar terbesar tubuh yang bertanggung jawab atas detoksifikasi racun, sintesis protein plasma, dan metabolisme obat (sitokrom P450).',
    position: [0.45, 1.6, 0.35],
    color: 0xEA580C,
    highlightColor: '#C2410C',
    commonDiseases: [
      {
        nama: 'Fatty Liver Disease (NAFLD)',
        gejala: 'Kelelahan, rasa tidak nyaman di perut kanan atas, peningkatan enzim SGOT/SGPT.',
        rekomendasiObat: ['Curcuma Extract / Hepatoprotektor', 'Vitamin E 400 IU', 'Metformin (jika ada resistensi insulin)']
      },
      {
        nama: 'Hepatitis Medikamentosa (DILI)',
        gejala: 'Ikterus ringan, mual, riwayat pemakaian hepatotoksik jangka panjang.',
        rekomendasiObat: ['N-Acetylcysteine (NAC)', 'Penghentian obat hepatotoksik', 'Asam Ursodeoksikolat (UDCA)']
      }
    ],
    clinicalNotes: 'Waspadai dosis kumulatif paracetamol > 4 gram/hari pada pasien dengan gangguan hepar kronis.'
  },
  {
    id: 'stomach',
    name: 'Lambung (Gaster)',
    system: 'Pencernaan',
    description: 'Organ muskular berongga berbentuk huruf J yang mensekresi asam lambung (HCl) dan pepsin untuk pencernaan bolus makanan.',
    position: [-0.35, 1.5, 0.35],
    color: 0xF59E0B,
    highlightColor: '#D97706',
    commonDiseases: [
      {
        nama: 'GERD (Gastroesophageal Reflux Disease)',
        gejala: 'Rasa terbakar di dada (heartburn), regurgitasi asam, rasa pahit di lidah.',
        rekomendasiObat: ['Omeprazole 20mg', 'Lansoprazole 30mg', 'Antasida Suspensi (kombinasi MgOH + AlOH)']
      },
      {
        nama: 'Dispepsia Fungsional & Tukak Lambung',
        gejala: 'Nyeri epigastrium / ulu hati, kembung cepat kenyang, mual muntah.',
        rekomendasiObat: ['Sukralfat Suspensi', 'Domperidone 10mg', 'Famotidine 20mg']
      }
    ],
    clinicalNotes: 'Edukasi konsumsi obat PPI 30-60 menit sebelum makan pagi untuk bioavailabilitas dan efektivitas optimal.'
  },
  {
    id: 'kidneys',
    name: 'Ginjal (Ren Sinistra & Dextra)',
    system: 'Ekskresi',
    description: 'Sepasang organ penyaring darah retroperitoneal yang menjaga keseimbangan elektrolit, osmolalitas cairan, dan tekanan darah via sistem RAAS.',
    position: [0, 1.25, -0.35],
    color: 0x8B5CF6,
    highlightColor: '#7C3AED',
    commonDiseases: [
      {
        nama: 'Nefrolitiasis (Batu Ginjal)',
        gejala: 'Nyeri kolik pinggang menjalar ke selangkangan, disuria, hematuria.',
        rekomendasiObat: ['Asam Mefenamat / Ketorolac (analgesik kolik)', 'Kalium Sitrat', 'Tamsulosin 0.4mg']
      },
      {
        nama: 'Infeksi Saluran Kemih (ISK / Pielonefritis)',
        gejala: 'Demam menggigil, nyeri sudut kostovertebra, urgensi berkemih.',
        rekomendasiObat: ['Ciprofloxacin 500mg', 'Levofloxacin 500mg', 'Cefixime 200mg']
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

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38BDF8, 2.5);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xE879F9, 2.0);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xFDE047, 2.0, 10);
    pointLight.position.set(0, 2.5, 3);
    scene.add(pointLight);

    // 5. Grid Ground & Cyberpunk Pedestal
    const gridHelper = new THREE.GridHelper(10, 20, 0x0284C7, 0x1E293B);
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

  const filteredOrgans = activeSystemFilter === 'ALL'
    ? ORGANS
    : ORGANS.filter((o) => o.system === activeSystemFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Neo-Brutalisme */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
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

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsRotating(!isRotating)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1.6px solid #1E1E1E',
              backgroundColor: isRotating ? '#DCFCE7' : '#FFFFFF',
              color: isRotating ? '#15803D' : '#18181B',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}
          >
            <RotateCw size={15} className={isRotating ? 'animate-spin' : ''} />
            <span>{isRotating ? 'Rotasi Aktif' : 'Rotasi Diam'}</span>
          </button>

          <button
            onClick={() => handleZoom('in')}
            title="Perbesar Model 3D"
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1.6px solid #1E1E1E',
              backgroundColor: '#FFFFFF',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={() => handleZoom('out')}
            title="Perkecil Model 3D"
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1.6px solid #1E1E1E',
              backgroundColor: '#FFFFFF',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}
          >
            <ZoomOut size={16} />
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Sudut Pandang"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1.6px solid #1E1E1E',
              backgroundColor: '#FEF3D6',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}
          >
            <Maximize2 size={15} />
            <span>Reset Posisi</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Box - Full Width (Satu Sel Penuh Panjang) */}
      <div className="neo-card" style={{
        backgroundColor: '#0A0F1D',
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
        {/* Canvas Floating Overlay Controls */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'none'
        }}>
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            padding: '6px 14px',
            borderRadius: '8px',
            color: '#38BDF8',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8', display: 'inline-block' }}></span>
            3D FULL CANVAS VIEWER (DRAG UNTUK ROTASI 360°, SCROLL UNTUK ZOOM)
          </div>

          {hoveredOrgan && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.95)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 900,
              border: '1.5px solid #FFFFFF',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.5)'
            }}>
              🎯 Klik untuk diagnosa: {ORGANS.find((o) => o.id === hoveredOrgan)?.name}
            </div>
          )}
        </div>

        {/* Mount ThreeJS Canvas */}
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            minHeight: '580px',
            cursor: 'grab'
          }}
        />

        {/* Bottom Bar: System Filter Tabs */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1.5px solid rgba(56, 189, 248, 0.2)',
          padding: '14px 20px',
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          zIndex: 10
        }}>
          <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
            FILTER LAPISAN SISTEM ORGAN:
          </span>
          {['ALL', 'Saraf', 'Kardiovaskular', 'Respirasi', 'Pencernaan', 'Ekskresi'].map((sys) => (
            <button
              key={sys}
              onClick={() => setActiveSystemFilter(sys)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeSystemFilter === sys ? '1.8px solid #38BDF8' : '1.2px solid #334155',
                backgroundColor: activeSystemFilter === sys ? '#0284C7' : '#1E293B',
                color: activeSystemFilter === sys ? '#FFFFFF' : '#94A3B8',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
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
          {/* Organ Quick Selector Badges */}
          <div className="neo-card" style={{ padding: '16px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', display: 'block', marginBottom: '8px' }}>
              PILIH ORGAN TARGET SECARA LANGSUNG:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  marginBottom: '6px'
                }}>
                  SISTEM {selectedOrgan.system.toUpperCase()}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#18181B' }}>
                  {selectedOrgan.name}
                </h3>
              </div>

              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                border: '1.6px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '1.5px 1.5px 0px #1E1E1E'
              }}>
                <Stethoscope size={22} color="#1E40AF" />
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#4B5563', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              {selectedOrgan.description}
            </p>

            {/* Rekomendasi Terapi & Penyakit Terkait */}
            <h4 style={{ margin: '14px 0 10px 0', fontSize: '0.9rem', fontWeight: 900, color: '#18181B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#DC2626" />
              Patologi & Terapi Obat Terkait (Katalog Apotek)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedOrgan.commonDiseases.map((dis, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1.4px solid #1E1E1E',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    boxShadow: '1.5px 1.5px 0px #1E1E1E'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#18181B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{dis.nama}</span>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>Diagnosa Umum</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#52525B', margin: '4px 0 8px 0' }}>
                    <strong>Gejala:</strong> {dis.gejala}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                    <Pill size={13} color="#2563EB" />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563EB' }}>Obat Rekomendasi:</span>
                    {dis.rekomendasiObat.map((obt, oIdx) => (
                      <span
                        key={oIdx}
                        style={{
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          color: '#1E40AF',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '5px'
                        }}
                      >
                        {obt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Clinical Farmasi Warning */}
            <div style={{
              marginTop: '16px',
              padding: '12px 14px',
              backgroundColor: '#FEF2F2',
              border: '1.4px solid #DC2626',
              borderRadius: '10px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.82rem', color: '#991B1B', display: 'block' }}>
                  Catatan Konseling Klinis Apoteker:
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#7F1D1D', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                  {selectedOrgan.clinicalNotes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
