# Rencana Integrasi Model 3D Human Base Mesh (Opsi A)

Dokumen ini memuat panduan dan arsitektur integrasi model 3D manusia dari Sketchfab ke dalam engine visualisasi Three.js halaman Anatomi MediagnoTek.

---

## 1. Referensi Model 3D
- **Sumber**: [Sketchfab - Male & Female Base Mesh Pack](https://sketchfab.com/3d-models/male-female-base-mesh-pack-ec3041da6a214c1c995f3d47dc7d04c1)
- **Format Target**: `.glb` (Binary glTF - paling efisien dan ringan untuk performa web) atau `.gltf`

---

## 2. Langkah Persiapan Aset
1. Buka tautan model di browser dan login ke akun Sketchfab.
2. Klik tombol **Download 3D Model**.
3. Pilih format **glTF** atau **GLB (Binary)**.
4. Simpan file yang telah diunduh ke dalam direktori frontend:
   ```text
   mediagnotek-frontend/public/models/human_base_mesh.glb
   ```

---

## 3. Rencana Teknis Implementasi (Three.js `GLTFLoader`)

### A. Penggunaan GLTFLoader
Mengimpor `GLTFLoader` dari pustaka Three.js addons:
```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
```

### B. Alur Pemuatan Model (Loading Pipeline)
1. Inisialisasi loader di dalam hook `useEffect`:
   ```typescript
   const loader = new GLTFLoader();
   loader.load(
     '/models/human_base_mesh.glb',
     (gltf) => {
       const model = gltf.scene;
       model.scale.set(1.2, 1.2, 1.2);
       model.position.set(0, -2.5, 0);
       
       // Material semi-transparan holografik / medis agar organ internal tetap terlihat
       model.traverse((child) => {
         if ((child as THREE.Mesh).isMesh) {
           const mesh = child as THREE.Mesh;
           mesh.material = new THREE.MeshPhysicalMaterial({
             color: 0x38BDF8,
             transparent: true,
             opacity: 0.25,
             roughness: 0.3,
             metalness: 0.1,
             wireframe: false
           });
         }
       });
       bodyGroup.add(model);
     },
     (xhr) => {
       console.log(`Model 3D dimuat: ${(xhr.loaded / xhr.total) * 100}%`);
     },
     (error) => {
       console.error('Gagal memuat model 3D, fallback ke siluet geometri default:', error);
     }
   );
   ```

### C. Keuntungan Opsi A
- **Interaktivitas Penuh**: Hotspot deteksi klik organ (Otak, Jantung, Paru-paru, dsb.) tetap aktif.
- **Konsistensi UI**: Mendukung rotasi 360°, zoom, kontrol reset, dan tema latar belakang putih bersih.
- **Transparansi Berlapis**: Tubuh manusia dapat diatur menjadi transparan/x-ray sehingga letak anatomi organ di dalam tubuh terlihat jelas.
