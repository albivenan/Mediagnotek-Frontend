'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pill, Search, Database, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { getDrugs, getDrugDetail, Drug } from '@/lib/api';

const mockDrugs: Drug[] = [
  {
    id: 1,
    nama: 'Metformin HCl 500mg',
    kategori: 'Antidiabetes Oral',
    deskripsi: 'Obat antidiabetes golongan biguanid yang menurunkan kadar glukosa darah puasa dan pascamakan.',
    dosis_standar: '500 mg - 850 mg 2-3 kali sehari sesudah makan.',
    rxcui: '6809',
  },
  {
    id: 2,
    nama: 'Amlodipine Besylate 10mg',
    kategori: 'Antihipertensi',
    deskripsi: 'Obat penghambat saluran kalsium yang digunakan untuk mengontrol hipertensi dan angina pektoris.',
    dosis_standar: '5 mg - 10 mg 1 kali sehari.',
    rxcui: '17767',
  },
  {
    id: 3,
    nama: 'Amoxicillin 500mg',
    kategori: 'Antibiotik Penisilin',
    deskripsi: 'Antibiotik spektrum luas yang efektif membasmi bakteri gram positif dan gram negatif.',
    dosis_standar: '250 mg - 500 mg setiap 8 jam.',
    rxcui: '723',
  },
  {
    id: 4,
    nama: 'Salbutamol Inhaler 100mcg',
    kategori: 'Bronkodilator',
    deskripsi: 'Obat pelega saluran pernapasan yang bekerja cepat merelaksasi otot bronkus.',
    dosis_standar: '1-2 semprotan (100-200 mcg) saat serangan sesak.',
    rxcui: '435',
  },
  {
    id: 5,
    nama: 'Paracetamol 500mg',
    kategori: 'Analgesik & Antipiretik',
    deskripsi: 'Obat pereda nyeri ringan hingga sedang dan penurun demam.',
    dosis_standar: '500 mg - 1000 mg setiap 4-6 jam bila perlu.',
    rxcui: '161',
  },
  {
    id: 6,
    nama: 'Omeprazole 20mg',
    kategori: 'Penghambat Pompa Proton',
    deskripsi: 'Mengurangi produksi asam lambung untuk pengobatan tukak lambung dan GERD.',
    dosis_standar: '20 mg - 40 mg 1 kali sehari sebelum sarapan.',
    rxcui: '7646',
  }
];

export default function KatalogObatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDrug, setActiveDrug] = useState<Drug | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [drugs, setDrugs] = useState<Drug[]>(mockDrugs);
  const [total, setTotal] = useState<number>(mockDrugs.length);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(18);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch dari database backend
  const fetchDrugData = async (query: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await getDrugs(query, pageNum, pageSize);
      if (res && Array.isArray(res.items)) {
        setDrugs(res.items);
        setTotal(res.total);
        setIsLiveDb(true);
      } else {
        // Fallback jika backend tidak merespons
        setIsLiveDb(false);
        const filtered = mockDrugs.filter(d =>
          d.nama.toLowerCase().includes(query.toLowerCase()) ||
          (d.deskripsi && d.deskripsi.toLowerCase().includes(query.toLowerCase()))
        );
        setDrugs(filtered);
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
      fetchDrugData(searchTerm, page);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  // Handle buka modal detail
  const handleViewDetail = async (drug: Drug) => {
    setActiveDrug(drug);
    if (isLiveDb) {
      setLoadingDetail(true);
      try {
        const fullDetail = await getDrugDetail(drug.id);
        if (fullDetail) {
          setActiveDrug(fullDetail);
        }
      } catch (err) {
        console.error('Error fetching drug detail:', err);
      } finally {
        setLoadingDetail(false);
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header & Status Koneksi Database */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pill size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Katalog Obat & Referensi Farmakologi
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
            Basis data farmasi terstandarisasi mencakup kode RxCUI, panduan posologi, dan indikasi klinis resmi.
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
              <span>SQL Database Terhubung ({total.toLocaleString('id-ID')} Obat)</span>
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
              placeholder="Cari dari 2.172+ obat di database (contoh: Paracetamol, Zyloric, Amoxicillin)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <button
            onClick={() => fetchDrugData(searchTerm, page)}
            className="neo-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State / Empty */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', gap: '12px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#18181B' }} />
          <span style={{ fontWeight: 700, color: '#18181B' }}>Memuat data obat dari database SQL...</span>
        </div>
      ) : drugs.length === 0 ? (
        <div className="neo-card" style={{ padding: '48px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <Pill size={42} style={{ margin: '0 auto 14px', color: '#9CA3AF' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Obat tidak ditemukan</h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Coba ubah kata kunci pencarian Anda.</p>
        </div>
      ) : (
        /* Drugs Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '22px' }}>
          {drugs.map((drug) => (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="tag-yellow" style={{ fontSize: '0.80rem', fontWeight: 800 }}>
                    {drug.kategori || (drug.merek_dagang && drug.merek_dagang !== drug.nama ? `Merek: ${drug.merek_dagang}` : 'Sediaan Farmasi')}
                  </span>
                  <span className="tag-cyan" style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                    ID: #{drug.id}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                  {drug.nama}
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
                  {drug.deskripsi || 'Tidak ada deskripsi detail farmakologi.'}
                </p>

                {drug.dosis_standar && (
                  <>
                    <div style={{ fontSize: '0.82rem', color: '#18181B', marginBottom: '6px', fontWeight: 700 }}>Dosis:</div>
                    <div style={{
                      fontSize: '0.84rem',
                      color: '#18181B',
                      backgroundColor: '#FAF8F4',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1.2px solid #1E1E1E',
                      fontWeight: 600
                    }}>
                      {drug.dosis_standar}
                    </div>
                  </>
                )}
              </div>

              <Link
                href={`/dashboard/obat/${drug.id}`}
                className="neo-btn-secondary"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  marginTop: '12px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 800,
                  boxSizing: 'border-box'
                }}
              >
                <span>Lihat Detail Farmakologi</span>
                <ArrowRight size={15} />
              </Link>
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
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            backgroundColor: '#FFFFFF',
            boxShadow: '6px 8px 0px #1E1E1E'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="tag-yellow" style={{ marginBottom: '8px' }}>
                  {activeDrug.merek_dagang || activeDrug.kategori || 'Farmakologi Terdaftar'}
                </span>
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

            {loadingDetail ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '20px 0' }}>
                <Loader2 size={18} className="animate-spin" />
                <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Memuat rincian relasi medis...</span>
              </div>
            ) : null}

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Deskripsi Farmakologi:</h4>
              <p style={{ fontSize: '0.9rem', color: '#52525B', lineHeight: 1.6 }}>
                {activeDrug.deskripsi || 'Deskripsi farmakologi standar.'}
              </p>
            </div>

            {activeDrug.dosis && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700, marginBottom: '6px' }}>Panduan Dosis:</h4>
                <div style={{
                  fontSize: '0.88rem',
                  color: '#166534',
                  backgroundColor: '#DCFCE7',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #1E1E1E'
                }}>
                  {activeDrug.dosis}
                </div>
              </div>
            )}

            {activeDrug.peringatan && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#991B1B', fontWeight: 700, marginBottom: '6px' }}>Peringatan & Kontraindikasi:</h4>
                <div style={{
                  fontSize: '0.88rem',
                  color: '#991B1B',
                  backgroundColor: '#FEE2E2',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #1E1E1E'
                }}>
                  {activeDrug.peringatan}
                </div>
              </div>
            )}

            {activeDrug.diseases && activeDrug.diseases.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 700, marginBottom: '6px' }}>Relasi Indikasi Penyakit Terdaftar:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeDrug.diseases.map((dis) => (
                    <span key={dis.id} className="tag-cyan" style={{ fontSize: '0.82rem' }}>
                      {dis.nama}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveDrug(null)}
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
