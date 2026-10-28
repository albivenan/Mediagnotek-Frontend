'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Pill,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldAlert,
  FileText,
  Activity,
  Dna,
  Share2,
  BookmarkCheck,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { getDrugDetail, Drug } from '@/lib/api';

export default function DetailObatPage() {
  const params = useParams();
  const router = useRouter();
  const drugId = Number(params?.id);

  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!drugId || isNaN(drugId)) {
      setError('ID Obat tidak valid.');
      setLoading(false);
      return;
    }

    const loadDrug = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDrugDetail(drugId);
        if (data && data.nama) {
          setDrug(data);
        } else {
          setError('Data obat tidak ditemukan di basis data farmasi.');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat rincian obat.');
      } finally {
        setLoading(false);
      }
    };

    loadDrug();
  }, [drugId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Tombol Kembali & Navigasi Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => router.back()}
          className="neo-btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontSize: '0.86rem',
            fontWeight: 800,
            borderRadius: '10px'
          }}
        >
          <ArrowLeft size={16} />
          Kembali ke Katalog Obat
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>
          <Link href="/dashboard/obat" style={{ color: '#0284C7', textDecoration: 'none' }}>
            Katalog Obat
          </Link>
          <span>/</span>
          <span style={{ color: '#0F172A' }}>Rincian Farmakologi #{drugId}</span>
        </div>
      </div>

      {loading ? (
        <div className="neo-card" style={{
          backgroundColor: '#FFFFFF',
          padding: '60px 24px',
          textAlign: 'center',
          borderRadius: '14px',
          boxShadow: '4px 4px 0px #1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}>
          <Loader2 size={36} className="animate-spin" style={{ color: '#0284C7' }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
            Mengambil Data Farmakologi Medis...
          </h3>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.88rem' }}>
            Menghubungkan ke basis data PostgreSQL farmasi terintegrasi.
          </p>
        </div>
      ) : error || !drug ? (
        <div className="neo-card" style={{
          backgroundColor: '#FEF2F2',
          border: '1.8px solid #DC2626',
          padding: '36px 24px',
          borderRadius: '14px',
          boxShadow: '4px 4px 0px #1E1E1E',
          textAlign: 'center'
        }}>
          <AlertCircle size={40} style={{ color: '#DC2626', margin: '0 auto 12px auto' }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991B1B' }}>
            Gagal Membuka Halaman Obat
          </h3>
          <p style={{ margin: '6px 0 16px 0', color: '#7F1D1D', fontSize: '0.88rem' }}>
            {error || 'Data obat tidak ditemukan.'}
          </p>
          <Link href="/dashboard/obat" className="neo-btn-primary" style={{ display: 'inline-block', padding: '10px 20px', textDecoration: 'none' }}>
            Kembali ke Daftar Obat
          </Link>
        </div>
      ) : (
        <>
          {/* Header Kartu Utama Neo-Brutalisme */}
          <div className="neo-card" style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E1E1E',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '4px 5px 0px #1E1E1E',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span className="tag-yellow" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                    {drug.merek_dagang || drug.kategori || 'Obat Medis Farmasi'}
                  </span>
                  <span className="tag-cyan" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                    ID Database: #{drug.id}
                  </span>
                  {drug.rxcui && (
                    <span style={{
                      backgroundColor: '#E0E7FF',
                      border: '1.2px solid #1E1E1E',
                      color: '#3730A3',
                      fontSize: '0.80rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px'
                    }}>
                      RxNav RxCUI: {drug.rxcui}
                    </span>
                  )}
                </div>

                <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.25 }}>
                  {drug.nama}
                </h1>
                {drug.merek_dagang && drug.merek_dagang !== drug.nama && (
                  <p style={{ margin: '6px 0 0 0', fontSize: '1rem', color: '#64748B', fontWeight: 700 }}>
                    Merek Dagang Terkait: {drug.merek_dagang}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: drug.nama, text: drug.deskripsi || '' }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Tautan halaman obat disalin ke clipboard!');
                    }
                  }}
                  className="neo-btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 800 }}
                  title="Bagikan Halaman"
                >
                  <Share2 size={15} />
                  Bagikan
                </button>
              </div>
            </div>

            {/* Deskripsi Pokok */}
            <div style={{
              backgroundColor: '#FAF8F4',
              border: '1.6px solid #1E1E1E',
              borderRadius: '12px',
              padding: '20px 24px',
              lineHeight: 1.7,
              fontSize: '1.04rem',
              color: '#1E293B'
            }}>
              <strong style={{ display: 'block', fontSize: '0.90rem', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Deskripsi Farmakologi Klinis:
              </strong>
              {drug.deskripsi || 'Tidak tersedia deskripsi naratif untuk sediaan obat ini.'}
            </div>
          </div>

          {/* Grid Informasi Dosis, Peringatan & Efek Samping */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Box Panduan Dosis */}
            <div className="neo-card" style={{
              backgroundColor: '#FFFFFF',
              border: '1.8px solid #1E1E1E',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '3px 4px 0px #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D' }}>
                <FileText size={22} strokeWidth={2.4} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                  Panduan Dosis & Pemakaian
                </h3>
              </div>
              <div style={{
                backgroundColor: '#DCFCE7',
                border: '1.4px solid #1E1E1E',
                borderRadius: '10px',
                padding: '16px 18px',
                color: '#14532D',
                fontSize: '0.98rem',
                lineHeight: 1.7,
                fontWeight: 600
              }}>
                {drug.dosis || drug.dosis_standar || 'Dosis harus disesuaikan berdasarkan resep dan instruksi spesifik dokter yang merawat.'}
              </div>
            </div>

            {/* Box Peringatan & Kontraindikasi */}
            <div className="neo-card" style={{
              backgroundColor: '#FFFFFF',
              border: '1.8px solid #1E1E1E',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '3px 4px 0px #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626' }}>
                <ShieldAlert size={22} strokeWidth={2.4} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                  Peringatan & Kontraindikasi
                </h3>
              </div>
              <div style={{
                backgroundColor: '#FEE2E2',
                border: '1.4px solid #1E1E1E',
                borderRadius: '10px',
                padding: '16px 18px',
                color: '#7F1D1D',
                fontSize: '0.98rem',
                lineHeight: 1.7,
                fontWeight: 600
              }}>
                {drug.peringatan || 'Perhatikan riwayat hipersensitivitas, gangguan fungsi hati/ginjal, dan kehamilan sebelum penggunaan obat.'}
              </div>
            </div>
          </div>

          {/* Box Efek Samping */}
          {drug.efek_samping && (
            <div className="neo-card" style={{
              backgroundColor: '#FFFFFF',
              border: '1.8px solid #1E1E1E',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '3px 4px 0px #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706' }}>
                <AlertCircle size={22} strokeWidth={2.4} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                  Efek Samping Yang Mungkin Terjadi
                </h3>
              </div>
              <div style={{
                backgroundColor: '#FEF3C7',
                border: '1.4px solid #1E1E1E',
                borderRadius: '10px',
                padding: '16px 18px',
                color: '#78350F',
                fontSize: '0.98rem',
                lineHeight: 1.7
              }}>
                {drug.efek_samping}
              </div>
            </div>
          )}

          {/* Relasi Indikasi Penyakit Terdaftar */}
          <div className="neo-card" style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E1E1E',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '4px 5px 0px #1E1E1E'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Dna size={22} color="#0284C7" strokeWidth={2.4} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                Indikasi & Relasi Diagnosa Penyakit Terdaftar
              </h3>
            </div>

            {drug.diseases && drug.diseases.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {drug.diseases.map((dis) => (
                  <Link
                    key={dis.id}
                    href={`/dashboard/penyakit/${dis.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      padding: '14px 16px',
                      backgroundColor: '#FAF8F4',
                      border: '1.5px solid #1E1E1E',
                      borderRadius: '10px',
                      boxShadow: '2px 2px 0px #1E1E1E',
                      transition: 'transform 0.1s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span className="tag-yellow" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>
                        Diagnosa #{dis.id}
                      </span>
                      <h4 style={{ margin: '4px 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                        {dis.nama}
                      </h4>
                      <p style={{
                        margin: 0,
                        fontSize: '0.82rem',
                        color: '#64748B',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5
                      }}>
                        {dis.deskripsi || 'Lihat patologi klinis selengkapnya...'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '24px',
                backgroundColor: '#FAF8F4',
                border: '1.4px dashed #CBD5E1',
                borderRadius: '10px',
                textAlign: 'center',
                color: '#64748B',
                fontSize: '0.88rem'
              }}>
                Belum ada pemetaan spesifik indikasi penyakit untuk sediaan ini di database.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
