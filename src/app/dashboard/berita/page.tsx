'use client';

import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  ExternalLink,
  Search,
  RefreshCw,
  Clock,
  Globe,
  Flame,
  Filter,
  AlertCircle,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

const CATEGORIES = [
  { id: 'all', label: 'Semua Warta Medis' },
  { id: 'pharmacy', label: 'Obat & Farmasi' },
  { id: 'disease', label: 'Penyakit & Epidemi' },
  { id: 'hospital', label: 'Rumah Sakit & Klinis' },
  { id: 'policy', label: 'Kemenkes & BPJS' },
  { id: 'tech', label: 'Teknologi Medis' }
];

export default function BeritaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const pageSize = 10;

  const fetchNews = async (cat: string, query: string, pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cat && cat !== 'all') params.append('category', cat);
      if (query.trim()) params.append('q', query.trim());
      params.append('page', pageNum.toString());
      params.append('pageSize', pageSize.toString());

      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || data.status !== 'ok') {
        throw new Error(data.message || 'Gagal mengambil berita terkini');
      }

      // Filter artikel yang memiliki judul valid dan bukan "[Removed]"
      const validArticles = (data.articles || []).filter(
        (art: Article) => art.title && art.title !== '[Removed]'
      );

      setArticles(validArticles);
      // NewsAPI membatasi developer free tier hingga 100 berita total
      const totalCount = Math.min(data.totalResults || 0, 100);
      setTotalResults(totalCount);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat berita. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchNews(selectedCategory, activeSearch, 1);
  }, [selectedCategory, activeSearch]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
    fetchNews(selectedCategory, activeSearch, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setActiveSearch('');
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    } catch {
      return isoString;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Neo-Brutalisme */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#DCFCE7',
            border: '1.2px solid #1E1E1E',
            color: '#15803D',
            fontSize: '0.74rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <Globe size={14} /> LIVE NEWS STREAM • INDONESIA HEALTH & MEDICAL NEWSAPI
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Newspaper size={28} strokeWidth={2.4} color="#18181B" />
            Warta Kesehatan & Medis Indonesia
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.92rem', marginTop: '4px' }}>
            Portal sindikasi berita eksklusif seputar dunia kesehatan, kebijakan Kemenkes & BPJS, perkembangan farmasi obat, dan riset medis terkini di Indonesia.
          </p>
        </div>

        <button
          onClick={() => fetchNews(selectedCategory, activeSearch)}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '10px',
            border: '1.6px solid #1E1E1E',
            backgroundColor: '#FFFFFF',
            color: '#18181B',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '2px 2px 0px #1E1E1E',
            opacity: loading ? 0.7 : 1
          }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Menyinkronkan...' : 'Perbarui Berita'}</span>
        </button>
      </div>

      {/* Filter Kategori & Pencarian Berita */}
      <div className="neo-card" style={{
        backgroundColor: '#FFFFFF',
        border: '1.8px solid #1E1E1E',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '3px 3px 0px #1E1E1E',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Form Pencarian */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari topik berita (misal: Vaksin, BPJS, Rumah Sakit, Kemenkes, Farmasi)..."
              style={{
                width: '100%',
                padding: '9px 36px 9px 38px',
                borderRadius: '8px',
                border: '1.6px solid #1E1E1E',
                fontSize: '0.86rem',
                fontWeight: 600,
                outline: 'none',
                backgroundColor: '#FAF8F4',
                color: '#0F172A'
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleResetSearch}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#64748B'
                }}
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              border: '1.6px solid #1E1E1E',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: '1.5px 1.5px 0px #1E1E1E'
            }}
          >
            Cari Berita
          </button>
        </form>

        {/* Tab Kategori */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: isSelected ? '1.6px solid #1E1E1E' : '1.4px solid #CBD5E1',
                  backgroundColor: isSelected ? '#1E293B' : '#FAF8F4',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '1.5px 1.5px 0px #1E1E1E' : 'none',
                  transition: 'all 0.12s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={16} color="#DC2626" />
          Menampilkan {articles.length} Kabar Terbaru
          {activeSearch && <span>untuk kata kunci <strong>&quot;{activeSearch}&quot;</strong></span>}
        </span>
        <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>
          Sumber Terverifikasi • NewsAPI.org Indonesia
        </span>
      </div>

      {/* Grid Konten Berita */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="neo-card"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.6px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                opacity: 0.6
              }}
            >
              <div style={{ width: '100%', height: '160px', backgroundColor: '#F1F5F9', borderRadius: '8px' }}></div>
              <div style={{ width: '70%', height: '18px', backgroundColor: '#F1F5F9', borderRadius: '4px' }}></div>
              <div style={{ width: '100%', height: '14px', backgroundColor: '#F1F5F9', borderRadius: '4px' }}></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{
          padding: '24px',
          backgroundColor: '#FEF2F2',
          border: '1.8px solid #DC2626',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: '#991B1B'
        }}>
          <AlertCircle size={24} color="#DC2626" />
          <div>
            <strong style={{ display: 'block', fontSize: '0.94rem' }}>Kendala Memuat Berita</strong>
            <span style={{ fontSize: '0.84rem' }}>{error}</span>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div style={{
          padding: '36px 20px',
          backgroundColor: '#FFFBEB',
          border: '1.8px dashed #F59E0B',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#92400E'
        }}>
          <Newspaper size={36} color="#D97706" style={{ margin: '0 auto 10px auto' }} />
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Tidak Ada Berita Ditemukan</h3>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.86rem' }}>
            Coba ubah kata kunci pencarian atau pilih kategori berita lainnya.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {articles.map((item, idx) => (
            <article
              key={idx}
              className="neo-card"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.6px solid #1E1E1E',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '3px 3px 0px #1E1E1E',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '4px 5px 0px #1E1E1E';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '3px 3px 0px #1E1E1E';
              }}
            >
              {/* Gambar Berita */}
              <div style={{
                width: '100%',
                height: '180px',
                backgroundColor: '#F1F5F9',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '1.4px solid #1E1E1E'
              }}>
                {item.urlToImage ? (
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      // Fallback jika url gambar rusak
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#E2E8F0',
                    color: '#64748B'
                  }}>
                    <Newspaper size={42} strokeWidth={1.5} />
                  </div>
                )}
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#1E293BEE',
                  color: '#F8FAFC',
                  fontSize: '0.70rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #334155'
                }}>
                  {item.source.name || 'Warta'}
                </span>
              </div>

              {/* Isi Konten Berita */}
              <div style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.78rem', fontWeight: 700 }}>
                      <Clock size={14} />
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                    {item.author && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontSize: '0.80rem', fontWeight: 700 }}>
                        <User size={14} color="#0284C7" />
                        <span>Penulis: <strong style={{ color: '#0F172A' }}>{item.author.length > 38 ? item.author.slice(0, 38) + '...' : item.author}</strong></span>
                      </div>
                    )}
                  </div>

                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '1.08rem',
                    fontWeight: 900,
                    color: '#0F172A',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    margin: 0,
                    fontSize: '0.92rem',
                    color: '#475569',
                    lineHeight: 1.65,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description || 'Klik tautan untuk membaca liputan lengkap selengkapnya di sumber berita resmi.'}
                  </p>
                </div>

                {/* Footer Kartu Berita */}
                <div style={{
                  borderTop: '1.2px dashed #E2E8F0',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#0284C7',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      textDecoration: 'none'
                    }}
                  >
                    <span>Baca Selengkapnya</span>
                    <ExternalLink size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: item.title,
                          url: item.url
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(item.url);
                        alert('Tautan berita disalin ke clipboard!');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    title="Bagikan Tautan Berita"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls (10 Berita per Halaman) */}
      {!loading && !error && articles.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          border: '1.8px solid #1E1E1E',
          borderRadius: '12px',
          boxShadow: '3px 3px 0px #1E1E1E',
          marginTop: '8px'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
            Halaman <strong style={{ color: '#0F172A' }}>{currentPage}</strong> dari{' '}
            <strong style={{ color: '#0F172A' }}>{Math.max(1, Math.ceil(totalResults / pageSize))}</strong>{' '}
            (Menampilkan {articles.length} dari {totalResults} warta)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1.6px solid #1E1E1E',
                backgroundColor: currentPage <= 1 ? '#F1F5F9' : '#FFFFFF',
                color: currentPage <= 1 ? '#94A3B8' : '#0F172A',
                fontSize: '0.80rem',
                fontWeight: 800,
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                boxShadow: currentPage <= 1 ? 'none' : '1.5px 1.5px 0px #1E1E1E',
                transition: 'all 0.1s ease'
              }}
            >
              <ChevronLeft size={16} />
              Sebelumnya
            </button>

            {/* Quick Page Indicator */}
            {Array.from({ length: Math.min(5, Math.ceil(totalResults / pageSize)) }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1.6px solid #1E1E1E',
                    backgroundColor: isCurrent ? '#0284C7' : '#FFFFFF',
                    color: isCurrent ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: isCurrent ? '1.5px 1.5px 0px #1E1E1E' : 'none'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalResults / pageSize) || loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1.6px solid #1E1E1E',
                backgroundColor: currentPage >= Math.ceil(totalResults / pageSize) ? '#F1F5F9' : '#FFFFFF',
                color: currentPage >= Math.ceil(totalResults / pageSize) ? '#94A3B8' : '#0F172A',
                fontSize: '0.80rem',
                fontWeight: 800,
                cursor: currentPage >= Math.ceil(totalResults / pageSize) ? 'not-allowed' : 'pointer',
                boxShadow: currentPage >= Math.ceil(totalResults / pageSize) ? 'none' : '1.5px 1.5px 0px #1E1E1E',
                transition: 'all 0.1s ease'
              }}
            >
              Selanjutnya
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
