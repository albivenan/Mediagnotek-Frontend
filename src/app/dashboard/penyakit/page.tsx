'use client';

import { useState } from 'react';
import { Dna, Search } from 'lucide-react';

interface Disease {
  id: string;
  code: string;
  name: string;
  category: string;
  severity: 'Ringan' | 'Sedang' | 'Tinggi' | 'Kritis';
  description: string;
  symptoms: string[];
  treatment: string;
}

const diseaseData: Disease[] = [
  {
    id: '1',
    code: 'ICD-10 E11',
    name: 'Diabetes Mellitus Tipe 2',
    category: 'Metabolik',
    severity: 'Sedang',
    description: 'Gangguan metabolisme yang ditandai dengan kadar gula darah tinggi akibat resistensi insulin.',
    symptoms: ['Poliuria (sering kencing)', 'Polidipsia (sering haus)', 'Lemas berkepanjangan', 'Penglihatan kabur'],
    treatment: 'Perubahan gaya hidup, terapi insulin, metformin.'
  },
  {
    id: '2',
    code: 'ICD-10 I10',
    name: 'Hipertensi Esensial',
    category: 'Kardiologi',
    severity: 'Sedang',
    description: 'Kondisi kronis di mana tekanan darah pada arteri meningkat secara signifikan.',
    symptoms: ['Sakit kepala belakang', 'Pusing / Nyeri tengkuk', 'Dada berdebar', 'Napas pendek'],
    treatment: 'Antihipertensi (Amlodipine), diet rendah garam.'
  },
  {
    id: '3',
    code: 'ICD-10 J18',
    name: 'Pneumonia Bakterial',
    category: 'Respirasi',
    severity: 'Tinggi',
    description: 'Infeksi pada salah satu atau kedua paru-paru yang menyebabkan kantung udara meradang.',
    symptoms: ['Demam tinggi & menggigil', 'Batuk berdahak', 'Nyeri dada saat bernapas', 'Sesak napas'],
    treatment: 'Antibiotik spektrum luas, terapi oksigen, cairan IV.'
  },
  {
    id: '4',
    code: 'ICD-10 G43',
    name: 'Migrain Tanpa Aura',
    category: 'Neurologi',
    severity: 'Ringan',
    description: 'Nyeri kepala berdenyut sedang hingga berat yang biasanya mengenai satu sisi kepala.',
    symptoms: ['Nyeri kepala sebelah', 'Sensitif terhadap cahaya (Fotofobia)', 'Mual / Muntah'],
    treatment: 'Analgesik, triptan, istirahat di ruangan gelap.'
  },
  {
    id: '5',
    code: 'ICD-10 J45',
    name: 'Asthma Bronkial',
    category: 'Respirasi',
    severity: 'Sedang',
    description: 'Penyakit kronis saluran pernapasan yang ditandai dengan peradangan dan penyempitan bronkus.',
    symptoms: ['Mengi (seperti siulan)', 'Batuk malam hari', 'Dada terasa berat', 'Sesak napas akut'],
    treatment: 'Inhaler kortikosteroid, bronkodilator (Salbutamol).'
  },
  {
    id: '6',
    code: 'ICD-10 I21',
    name: 'Infark Miokard Akut (Serangan Jantung)',
    category: 'Kardiologi',
    severity: 'Kritis',
    description: 'Kematian otot jantung akibat terhentinya pasokan darah secara mendadak.',
    symptoms: ['Nyeri dada hebat menjalar ke lengan kiri', 'Keringat dingin', 'Mual parah', 'Kecemasan hebat'],
    treatment: 'Penanganan darurat medis, trombolitik, angioplasti koroner.'
  }
];

export default function NamaPenyakitPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeModal, setActiveModal] = useState<Disease | null>(null);

  const categories = ['Semua', 'Metabolik', 'Kardiologi', 'Respirasi', 'Neurologi'];

  const filteredDiseases = diseaseData.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Kritis':
      case 'Tinggi':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' };
      case 'Sedang':
        return { bg: '#FEF3D6', text: '#92400E', border: '#FDE68A' };
      default:
        return { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Dna size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
          Katalog & Database Nama Penyakit
        </h1>
        <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
          Database medis terstruktur dengan rincian kode ICD-10, gejala klinis, dan panduan penanganan awal.
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
              placeholder="Cari nama penyakit atau kode ICD-10..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    border: '1.5px solid #1E1E1E',
                    background: isActive ? '#FEF3D6' : '#FFFFFF',
                    color: '#18181B',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '2px 2px 0px #1E1E1E' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
        {filteredDiseases.map((d) => {
          const sevStyle = getSeverityStyle(d.severity);
          return (
            <div
              key={d.id}
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
                  <span style={{
                    backgroundColor: '#FEF3D6',
                    color: '#92400E',
                    border: '1.2px solid #1E1E1E',
                    borderRadius: '9999px',
                    padding: '3px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    {d.code}
                  </span>
                  <span style={{
                    backgroundColor: sevStyle.bg,
                    color: sevStyle.text,
                    border: '1.2px solid #1E1E1E',
                    borderRadius: '9999px',
                    padding: '3px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {d.severity}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                  {d.name}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#52525B', lineHeight: 1.55, marginBottom: '16px' }}>
                  {d.description}
                </p>

                <div style={{ fontSize: '0.82rem', color: '#18181B', marginBottom: '8px', fontWeight: 700 }}>Gejala Utama:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {d.symptoms.map((sym, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.76rem',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      color: '#475569',
                      fontWeight: 500
                    }}>
                      • {sym}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveModal(d)}
                className="neo-btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem', marginTop: '14px', borderRadius: '12px' }}
              >
                Lihat Detail Penyakit & Pengobatan →
              </button>
            </div>
          );
        })}
      </div>

      {/* Disease Detail Modal */}
      {activeModal && (
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
            maxWidth: '580px',
            padding: '32px',
            backgroundColor: '#FFFFFF',
            boxShadow: '6px 8px 0px #1E1E1E',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="tag-yellow" style={{ marginBottom: '8px' }}>{activeModal.code}</span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#18181B', marginTop: '6px' }}>{activeModal.name}</h2>
              </div>
              <button
                onClick={() => setActiveModal(null)}
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

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <span className="tag-cyan">Kategori: {activeModal.category}</span>
              <span className="tag-yellow">Keparahan: {activeModal.severity}</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Medis:</h4>
              <p style={{ fontSize: '0.9rem', color: '#52525B', lineHeight: 1.6 }}>{activeModal.description}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Gejala Klinis Terkait:</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: '#52525B', lineHeight: 1.6 }}>
                {activeModal.symptoms.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700, marginBottom: '6px' }}>Standar Penanganan / Obat:</h4>
              <div style={{
                fontSize: '0.9rem',
                color: '#166534',
                backgroundColor: '#DCFCE7',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #1E1E1E'
              }}>
                {activeModal.treatment}
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
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
