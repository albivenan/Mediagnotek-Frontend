'use client';

import { useState, useEffect } from 'react';
import { Dna, Search, Database, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Pill } from 'lucide-react';
import { getDiseases, getDiseaseDetail, Disease } from '@/lib/api';

const mockDiseases: Disease[] = [
  {
    id: 1,
    nama: 'Diabetes Mellitus Tipe 2',
    deskripsi: 'Gangguan metabolisme yang ditandai dengan kadar gula darah tinggi akibat resistensi insulin.',
    penyebab: 'Resistensi insulin dan defisiensi sekresi insulin.',
    gejala_teks: 'Poliuria, polidipsia, lemas berkepanjangan, penglihatan kabur.'
  },
  {
    id: 2,
    nama: 'Hipertensi Esensial',
    deskripsi: 'Kondisi kronis di mana tekanan darah pada arteri meningkat secara signifikan.',
    penyebab: 'Faktor genetik, gaya hidup tinggi natrium, stres.',
    gejala_teks: 'Sakit kepala belakang, nyeri tengkuk, dada berdebar.'
  },
  {
    id: 3,
    nama: 'Pneumonia Bakterial',
    deskripsi: 'Infeksi pada salah satu atau kedua paru-paru yang menyebabkan kantung udara meradang.',
    penyebab: 'Infeksi Streptococcus pneumoniae.',
    gejala_teks: 'Demam tinggi, menggigil, batuk berdahak, sesak napas.'
  }
];

export default function NamaPenyakitPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<Disease | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [diseases, setDiseases] = useState<Disease[]>(mockDiseases);
  const [total, setTotal] = useState<number>(mockDiseases.length);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(18);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch data penyakit dari backend database SQL
  const fetchDiseaseData = async (query: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await getDiseases(query, pageNum, pageSize);
      if (res && Array.isArray(res.items)) {
        setDiseases(res.items);
        setTotal(res.total);
        setIsLiveDb(true);
      } else {
        setIsLiveDb(false);
        const filtered = mockDiseases.filter(d =>
          d.nama.toLowerCase().includes(query.toLowerCase()) ||
          (d.deskripsi && d.deskripsi.toLowerCase().includes(query.toLowerCase()))
        );
        setDiseases(filtered);
        setTotal(filtered.length);
      }
    } catch {
      setIsLiveDb(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDiseaseData(searchTerm, page);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  // Handle buka detail penyakit
  const handleViewDetail = async (disease: Disease) => {
    setActiveModal(disease);
    if (isLiveDb) {
      setLoadingDetail(true);
      try {
        const fullDetail = await getDiseaseDetail(disease.id);
        if (fullDetail) {
          setActiveModal(fullDetail);
        }
      } catch (err) {
        console.error('Error fetching disease detail:', err);
      } finally {
        setLoadingDetail(false);
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Page Header with Database Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Dna size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Katalog & Database Nama Penyakit
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
            Database medis terstruktur dengan rincian kode patologi, gejala klinis, dan relasi farmakoterapi.
          </p>
        </div>

        {/* Live Badge Database */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '9999px',
          backgroundColor: isLiveDb ? '#DCFCE7' : '#FEF3C7',
          border: '1.5px solid #1E1E1E',
          boxShadow: '2px 2px 0px #1E1E1E',
          fontWeight: 700,
          fontSize: '0.85rem',
          color: isLiveDb ? '#166534' : '#92400E'
        }}>
          {isLiveDb ? (
            <>
              <CheckCircle2 size={16} />
              <span>SQL Database Terhubung ({total.toLocaleString('id-ID')} Penyakit)</span>
            </>
          ) : (
            <>
              <Database size={16} />
              <span>Mode Lokal Fallback</span>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} strokeWidth={2} style={{ position: 'absolute', left: '16px', color: '#6B7280' }} />
            <input
              type="text"
              className="form-input-neo"
              placeholder="Cari dari 1.358+ penyakit di database (contoh: Diabetes, Asma, Hipertensi, Xerosis)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <button
            onClick={() => fetchDiseaseData(searchTerm, page)}
            className="neo-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State / List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', gap: '12px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#18181B' }} />
          <span style={{ fontWeight: 700, color: '#18181B' }}>Memuat data penyakit dari database SQL...</span>
        </div>
      ) : diseases.length === 0 ? (
        <div className="neo-card" style={{ padding: '48px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <Dna size={42} style={{ margin: '0 auto 14px', color: '#9CA3AF' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Penyakit tidak ditemukan</h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Coba ubah kata kunci pencarian Anda.</p>
        </div>
      ) : (
        /* Disease Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '22px' }}>
          {diseases.map((disease) => (
            <div
              key={disease.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="tag-yellow" style={{ fontSize: '0.78rem' }}>
                    Diagnosa Terdaftar
                  </span>
                  <span className="tag-cyan" style={{ fontSize: '0.78rem' }}>
                    ID: #{disease.id}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                  {disease.nama}
                </h3>

                <p style={{
                  fontSize: '0.88rem',
                  color: '#52525B',
                  lineHeight: 1.55,
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {disease.deskripsi || 'Tidak ada uraian deskripsi klinis.'}
                </p>
              </div>

              <button
                onClick={() => handleViewDetail(disease)}
                className="neo-btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem', marginTop: '12px', borderRadius: '12px' }}
              >
                Lihat Rincian Patologi & Terapi →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="neo-btn-secondary"
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', opacity: page === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#18181B' }}>
            Halaman {page} dari {totalPages} ({total} Total)
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="neo-btn-secondary"
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', opacity: page >= totalPages ? 0.5 : 1 }}
          >
            Selanjutnya <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Disease Modal Detail */}
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
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            backgroundColor: '#FFFFFF',
            boxShadow: '6px 8px 0px #1E1E1E'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="tag-yellow" style={{ marginBottom: '8px' }}>Penyakit Terverifikasi</span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#18181B', marginTop: '6px' }}>{activeModal.nama}</h2>
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

            {loadingDetail ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 0' }}>
                <Loader2 size={18} className="animate-spin" />
                <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Memuat rincian relasi farmakologi...</span>
              </div>
            ) : null}

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Klinis:</h4>
              <p style={{ fontSize: '0.9rem', color: '#52525B', lineHeight: 1.6 }}>{activeModal.deskripsi}</p>
            </div>

            {activeModal.penyebab && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Etiologi & Penyebab:</h4>
                <p style={{ fontSize: '0.9rem', color: '#52525B', lineHeight: 1.6 }}>{activeModal.penyebab}</p>
              </div>
            )}

            {activeModal.gejala_teks && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 700, marginBottom: '6px' }}>Gejala Klinis:</h4>
                <div style={{
                  fontSize: '0.88rem',
                  color: '#92400E',
                  backgroundColor: '#FEF3C7',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #1E1E1E'
                }}>
                  {activeModal.gejala_teks}
                </div>
              </div>
            )}

            {activeModal.symptoms && activeModal.symptoms.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Tanda & Gejala Terpetakan (Dataset):</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeModal.symptoms.map((s) => (
                    <span key={s.id} className="tag-yellow" style={{ fontSize: '0.8rem' }}>
                      {s.nama}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeModal.drugs && activeModal.drugs.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={16} /> Rekomendasi Terapi Obat (Database):
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeModal.drugs.map((d) => (
                    <span key={d.id} className="tag-cyan" style={{ fontSize: '0.82rem' }}>
                      {d.nama}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="neo-btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '12px' }}
            >
              Tutup Modal Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
