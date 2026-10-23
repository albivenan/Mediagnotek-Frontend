'use client';

import { useState } from 'react';
import { Pill, Search } from 'lucide-react';

interface DrugItem {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  dosis_standar: string;
  rxcui?: string;
  indikasi: string[];
}

const mockDrugs: DrugItem[] = [
  {
    id: 1,
    nama: 'Metformin HCl 500mg',
    kategori: 'Antidiabetes Oral',
    deskripsi: 'Obat antidiabetes golongan biguanid yang menurunkan kadar glukosa darah puasa dan pascamakan.',
    dosis_standar: '500 mg - 850 mg 2-3 kali sehari sesudah makan.',
    rxcui: '6809',
    indikasi: ['Diabetes Mellitus Tipe 2', 'Resistensi Insulin']
  },
  {
    id: 2,
    nama: 'Amlodipine Besylate 10mg',
    kategori: 'Antihipertensi',
    deskripsi: 'Obat penghambat saluran kalsium yang digunakan untuk mengontrol hipertensi dan angina pektoris.',
    dosis_standar: '5 mg - 10 mg 1 kali sehari.',
    rxcui: '17767',
    indikasi: ['Hipertensi Esensial', 'Angina Pektoris Stabil']
  },
  {
    id: 3,
    nama: 'Amoxicillin 500mg',
    kategori: 'Antibiotik Penisilin',
    deskripsi: 'Antibiotik spektrum luas yang efektif membasmi bakteri gram positif dan gram negatif.',
    dosis_standar: '250 mg - 500 mg setiap 8 jam.',
    rxcui: '723',
    indikasi: ['Pneumonia Bakterial', 'Bronkitis Akut', 'Infeksi Saluran Kemih']
  },
  {
    id: 4,
    nama: 'Salbutamol Inhaler 100mcg',
    kategori: 'Bronkodilator',
    deskripsi: 'Obat pelega saluran pernapasan yang bekerja cepat merelaksasi otot bronkus.',
    dosis_standar: '1-2 semprotan (100-200 mcg) saat serangan sesak.',
    rxcui: '435',
    indikasi: ['Asthma Bronkial', 'PPOK (Penyakit Paru Obstruktif Kronis)']
  },
  {
    id: 5,
    nama: 'Paracetamol 500mg',
    kategori: 'Analgesik & Antipiretik',
    deskripsi: 'Obat pereda nyeri ringan hingga sedang dan penurun demam.',
    dosis_standar: '500 mg - 1000 mg setiap 4-6 jam bila perlu.',
    rxcui: '161',
    indikasi: ['Demam', 'Sakit Kepala', 'Nyeri Otot']
  },
  {
    id: 6,
    nama: 'Omeprazole 20mg',
    kategori: 'Penghambat Pompa Proton',
    deskripsi: 'Mengurangi produksi asam lambung untuk pengobatan tukak lambung dan GERD.',
    dosis_standar: '20 mg - 40 mg 1 kali sehari sebelum sarapan.',
    rxcui: '7646',
    indikasi: ['GERD', 'Gastritis Akut', 'Tukak Peptik']
  }
];

export default function KatalogObatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [activeDrug, setActiveDrug] = useState<DrugItem | null>(null);

  const kategoriList = ['Semua', 'Antidiabetes Oral', 'Antihipertensi', 'Antibiotik Penisilin', 'Bronkodilator', 'Analgesik & Antipiretik'];

  const filteredDrugs = mockDrugs.filter(d => {
    const matchesSearch = d.nama.toLowerCase().includes(searchTerm.toLowerCase()) || d.kategori.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedKategori === 'Semua' || d.kategori === selectedKategori;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Pill size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
          Katalog Obat & Referensi Farmakologi
        </h1>
        <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
          Basis data farmasi terstandarisasi mencakup kode RxCUI, panduan posologi, dan indikasi klinis resmi.
        </p>
      </div>

      {/* Filter and Search Bar in Neo Card */}
      <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} strokeWidth={2} style={{ position: 'absolute', left: '16px', color: '#6B7280' }} />
            <input
              type="text"
              className="form-input-neo"
              placeholder="Cari nama obat, bahan aktif, atau golongan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {kategoriList.map((kat) => {
              const isActive = selectedKategori === kat;
              return (
                <button
                  key={kat}
                  onClick={() => setSelectedKategori(kat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    border: '1.5px solid #1E1E1E',
                    background: isActive ? '#FEF3D6' : '#FFFFFF',
                    color: '#18181B',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '2px 2px 0px #1E1E1E' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {kat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drugs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
        {filteredDrugs.map((drug) => (
          <div
            key={drug.id}
            className="neo-card"
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '3px 4px 0px #1E1E1E'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="tag-yellow">{drug.kategori}</span>
                {drug.rxcui && <span className="tag-cyan">RxCUI: {drug.rxcui}</span>}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                {drug.nama}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#52525B', lineHeight: 1.55, marginBottom: '16px' }}>
                {drug.deskripsi}
              </p>

              <div style={{ fontSize: '0.82rem', color: '#18181B', marginBottom: '6px', fontWeight: 700 }}>Dosis Standar:</div>
              <div style={{
                fontSize: '0.86rem',
                color: '#18181B',
                backgroundColor: '#FAF8F4',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.2px solid #1E1E1E',
                fontWeight: 600
              }}>
                {drug.dosis_standar}
              </div>
            </div>

            <button
              onClick={() => setActiveDrug(drug)}
              className="neo-btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.88rem', marginTop: '12px', borderRadius: '12px' }}
            >
              Lihat Detail & Indikasi Medis →
            </button>
          </div>
        ))}
      </div>

      {/* Drug Modal Detail */}
      {activeDrug && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="neo-card" style={{
            width: '100%',
            maxWidth: '560px',
            padding: '32px',
            backgroundColor: '#FFFFFF',
            boxShadow: '6px 8px 0px #1E1E1E'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="tag-yellow" style={{ marginBottom: '8px' }}>{activeDrug.kategori}</span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#18181B', marginTop: '6px' }}>{activeDrug.nama}</h2>
              </div>
              <button
                onClick={() => setActiveDrug(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1.5px solid #1E1E1E',
                  backgroundColor: '#FAF8F4',
                  color: '#18181B',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Farmakologi:</h4>
              <p style={{ fontSize: '0.9rem', color: '#52525B', lineHeight: 1.6 }}>{activeDrug.deskripsi}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Indikasi Klinis:</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: '#52525B', lineHeight: 1.6 }}>
                {activeDrug.indikasi.map((ind, i) => (
                  <li key={i}>{ind}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700, marginBottom: '6px' }}>Petunjuk Pemakaian & Posologi:</h4>
              <div style={{
                fontSize: '0.9rem',
                color: '#166534',
                backgroundColor: '#DCFCE7',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #1E1E1E'
              }}>
                {activeDrug.dosis_standar}
              </div>
            </div>

            <button
              onClick={() => setActiveDrug(null)}
              className="neo-btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Tutup Modal Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
