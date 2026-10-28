'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dna,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Pill,
  Activity,
  FileText,
  Share2,
  CheckCircle2,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { getDiseaseDetail, Disease } from '@/lib/api';

export default function DetailPenyakitPage() {
  const params = useParams();
  const router = useRouter();
  const diseaseId = Number(params?.id);

  const [disease, setDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!diseaseId || isNaN(diseaseId)) {
      setError('ID Penyakit tidak valid.');
      setLoading(false);
      return;
    }

    const loadDisease = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDiseaseDetail(diseaseId);
        if (data && data.nama) {
          setDisease(data);
        } else {
          setError('Data penyakit tidak ditemukan di basis data klinis.');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat rincian penyakit.');
      } finally {
        setLoading(false);
      }
    };

    loadDisease();
  }, [diseaseId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Tombol Navigasi Kembali & Breadcrumb */}
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
          Kembali ke Katalog Penyakit
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>
          <Link href="/dashboard/penyakit" style={{ color: '#0284C7', textDecoration: 'none' }}>
            Katalog Penyakit
          </Link>
          <span>/</span>
          <span style={{ color: '#0F172A' }}>Rincian Patologi #{diseaseId}</span>
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
            Mengambil Data Patologi Klinis...
          </h3>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.88rem' }}>
            Menghubungkan ke basis data PostgreSQL terintegrasi.
          </p>
        </div>
      ) : error || !disease ? (
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
            Gagal Membuka Halaman Penyakit
          </h3>
          <p style={{ margin: '6px 0 16px 0', color: '#7F1D1D', fontSize: '0.88rem' }}>
            {error || 'Data penyakit tidak ditemukan.'}
          </p>
          <Link href="/dashboard/penyakit" className="neo-btn-primary" style={{ display: 'inline-block', padding: '10px 20px', textDecoration: 'none' }}>
            Kembali ke Daftar Penyakit
          </Link>
        </div>
      ) : (
        <>
          {/* Header Kartu Utama Diagnosa Neo-Brutalisme */}
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
                    Diagnosa Klinis Resmi
                  </span>
                  <span className="tag-cyan" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                    ID Database: #{disease.id}
                  </span>
                </div>

                <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.25 }}>
                  {disease.nama}
                </h1>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: disease.nama, text: disease.deskripsi || '' }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Tautan halaman penyakit disalin ke clipboard!');
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

            {/* Deskripsi Pokok Klinis */}
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
                Deskripsi Klinis & Karakteristik:
              </strong>
              {disease.deskripsi || 'Tidak tersedia uraian deskripsi klinis.'}
            </div>
          </div>

          {/* Grid Informasi Penyebab & Gejala */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Box Etiologi & Penyebab */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284C7' }}>
                <Stethoscope size={22} strokeWidth={2.4} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                  Etiologi & Patofisiologi Penyebab
                </h3>
              </div>
              <div style={{
                backgroundColor: '#F0F9FF',
                border: '1.4px solid #1E1E1E',
                borderRadius: '10px',
                padding: '16px 18px',
                color: '#0369A1',
                fontSize: '0.98rem',
                lineHeight: 1.7,
                fontWeight: 600
              }}>
                {disease.penyebab || 'Penyebab spesifik multifaktorial atau perlu ditegakkan melalui pemeriksaan laboratorium penunjang.'}
              </div>
            </div>

            {/* Box Gejala Klinis */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706' }}>
                <HeartPulse size={22} strokeWidth={2.4} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                  Gejala Klinis Pasien
                </h3>
              </div>
              <div style={{
                backgroundColor: '#FEF3C7',
                border: '1.4px solid #1E1E1E',
                borderRadius: '10px',
                padding: '16px 18px',
                color: '#92400E',
                fontSize: '0.98rem',
                lineHeight: 1.7,
                fontWeight: 600
              }}>
                {disease.gejala_teks || 'Gejala klinis bervariasi tergantung stadium dan kondisi fisik pasien.'}
              </div>
            </div>
          </div>

          {/* Tag Gejala Spesifik Terpetakan (Dataset) */}
          {disease.symptoms && disease.symptoms.length > 0 && (
            <div className="neo-card" style={{
              backgroundColor: '#FFFFFF',
              border: '1.8px solid #1E1E1E',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '3px 4px 0px #1E1E1E'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Activity size={20} color="#15803D" strokeWidth={2.4} />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>
                  Tanda & Gejala Diagnostik Terpetakan:
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {disease.symptoms.map((sym) => (
                  <span
                    key={sym.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: '#DCFCE7',
                      border: '1.2px solid #1E1E1E',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#166534'
                    }}
                  >
                    <CheckCircle2 size={13} />
                    {sym.nama}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rekomendasi Terapi Obat Terkait */}
          <div className="neo-card" style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E1E1E',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '4px 5px 0px #1E1E1E'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Pill size={22} color="#0284C7" strokeWidth={2.4} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                Rekomendasi Terapi & Sediaan Obat Terdaftar (Database Farmakologi)
              </h3>
            </div>

            {disease.drugs && disease.drugs.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {disease.drugs.map((dr) => (
                  <Link
                    key={dr.id}
                    href={`/dashboard/obat/${dr.id}`}
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
                        Obat #{dr.id}
                      </span>
                      <h4 style={{ margin: '4px 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                        {dr.nama}
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
                        {dr.deskripsi || 'Lihat panduan dosis & farmakologi selengkapnya...'}
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
                Belum ada pemetaan terapi obat spesifik yang terhubung ke diagnosa ini di database.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
