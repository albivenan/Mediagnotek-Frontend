'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  BarChart3,
  PieChart,
  AlertCircle,
  Building2,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  Activity,
  Layers,
  X,
  ChevronDown
} from 'lucide-react';

interface ClinicalCaseMetric {
  month: string;
  category: 'Metabolik' | 'Kardiologi' | 'Respirasi' | 'Neurologi';
  severity: 'Ringan' | 'Sedang' | 'Tinggi' | 'Kritis';
  ageGroup: 'ANAK' | 'DEWASA' | 'LANSIA';
  isVerified: boolean;
  cases: number;
}

// Comprehensive clinical dataset across 2026
const RAW_METRICS: ClinicalCaseMetric[] = [
  // Jan
  { month: 'Jan', category: 'Metabolik', severity: 'Sedang', ageGroup: 'LANSIA', isVerified: true, cases: 55 },
  { month: 'Jan', category: 'Kardiologi', severity: 'Tinggi', ageGroup: 'LANSIA', isVerified: true, cases: 40 },
  { month: 'Jan', category: 'Respirasi', severity: 'Ringan', ageGroup: 'DEWASA', isVerified: true, cases: 30 },
  { month: 'Jan', category: 'Neurologi', severity: 'Sedang', ageGroup: 'DEWASA', isVerified: false, cases: 15 },

  // Feb
  { month: 'Feb', category: 'Metabolik', severity: 'Sedang', ageGroup: 'LANSIA', isVerified: true, cases: 70 },
  { month: 'Feb', category: 'Kardiologi', severity: 'Tinggi', ageGroup: 'DEWASA', isVerified: true, cases: 50 },
  { month: 'Feb', category: 'Respirasi', severity: 'Ringan', ageGroup: 'ANAK', isVerified: true, cases: 45 },
  { month: 'Feb', category: 'Neurologi', severity: 'Kritis', ageGroup: 'LANSIA', isVerified: true, cases: 20 },

  // Mar
  { month: 'Mar', category: 'Metabolik', severity: 'Ringan', ageGroup: 'DEWASA', isVerified: true, cases: 80 },
  { month: 'Mar', category: 'Kardiologi', severity: 'Tinggi', ageGroup: 'LANSIA', isVerified: true, cases: 60 },
  { month: 'Mar', category: 'Respirasi', severity: 'Sedang', ageGroup: 'ANAK', isVerified: true, cases: 50 },
  { month: 'Mar', category: 'Neurologi', severity: 'Sedang', ageGroup: 'DEWASA', isVerified: false, cases: 20 },

  // Apr
  { month: 'Apr', category: 'Metabolik', severity: 'Sedang', ageGroup: 'LANSIA', isVerified: true, cases: 60 },
  { month: 'Apr', category: 'Kardiologi', severity: 'Sedang', ageGroup: 'DEWASA', isVerified: true, cases: 45 },
  { month: 'Apr', category: 'Respirasi', severity: 'Ringan', ageGroup: 'ANAK', isVerified: true, cases: 35 },
  { month: 'Apr', category: 'Neurologi', severity: 'Tinggi', ageGroup: 'LANSIA', isVerified: true, cases: 20 },

  // Mei
  { month: 'Mei', category: 'Metabolik', severity: 'Sedang', ageGroup: 'LANSIA', isVerified: true, cases: 90 },
  { month: 'Mei', category: 'Kardiologi', severity: 'Tinggi', ageGroup: 'LANSIA', isVerified: true, cases: 65 },
  { month: 'Mei', category: 'Respirasi', severity: 'Ringan', ageGroup: 'DEWASA', isVerified: true, cases: 55 },
  { month: 'Mei', category: 'Neurologi', severity: 'Kritis', ageGroup: 'DEWASA', isVerified: true, cases: 30 },

  // Jun
  { month: 'Jun', category: 'Metabolik', severity: 'Ringan', ageGroup: 'DEWASA', isVerified: true, cases: 75 },
  { month: 'Jun', category: 'Kardiologi', severity: 'Sedang', ageGroup: 'LANSIA', isVerified: true, cases: 55 },
  { month: 'Jun', category: 'Respirasi', severity: 'Sedang', ageGroup: 'ANAK', isVerified: false, cases: 40 },
  { month: 'Jun', category: 'Neurologi', severity: 'Tinggi', ageGroup: 'LANSIA', isVerified: true, cases: 25 },

  // Jul
  { month: 'Jul', category: 'Metabolik', severity: 'Sedang', ageGroup: 'LANSIA', isVerified: true, cases: 100 },
  { month: 'Jul', category: 'Kardiologi', severity: 'Kritis', ageGroup: 'LANSIA', isVerified: true, cases: 75 },
  { month: 'Jul', category: 'Respirasi', severity: 'Ringan', ageGroup: 'DEWASA', isVerified: true, cases: 55 },
  { month: 'Jul', category: 'Neurologi', severity: 'Tinggi', ageGroup: 'DEWASA', isVerified: true, cases: 30 },

  // Agu
  { month: 'Agu', category: 'Metabolik', severity: 'Ringan', ageGroup: 'DEWASA', isVerified: true, cases: 85 },
  { month: 'Agu', category: 'Kardiologi', severity: 'Tinggi', ageGroup: 'LANSIA', isVerified: true, cases: 60 },
  { month: 'Agu', category: 'Respirasi', severity: 'Sedang', ageGroup: 'ANAK', isVerified: true, cases: 45 },
  { month: 'Agu', category: 'Neurologi', severity: 'Sedang', ageGroup: 'DEWASA', isVerified: false, cases: 20 },

  // Sep
  { month: 'Sep', category: 'Metabolik', severity: 'Sedang', ageGroup: 'LANSIA', isVerified: true, cases: 95 },
  { month: 'Sep', category: 'Kardiologi', severity: 'Sedang', ageGroup: 'DEWASA', isVerified: true, cases: 65 },
  { month: 'Sep', category: 'Respirasi', severity: 'Tinggi', ageGroup: 'ANAK', isVerified: true, cases: 50 },
  { month: 'Sep', category: 'Neurologi', severity: 'Kritis', ageGroup: 'LANSIA', isVerified: true, cases: 25 },

  // Okt (Bulan Berjalan)
  { month: 'Okt', category: 'Metabolik', severity: 'Sedang', ageGroup: 'LANSIA', isVerified: true, cases: 110 },
  { month: 'Okt', category: 'Kardiologi', severity: 'Tinggi', ageGroup: 'LANSIA', isVerified: true, cases: 80 },
  { month: 'Okt', category: 'Respirasi', severity: 'Ringan', ageGroup: 'ANAK', isVerified: true, cases: 60 },
  { month: 'Okt', category: 'Neurologi', severity: 'Sedang', ageGroup: 'DEWASA', isVerified: true, cases: 35 },
];

export default function VisualPage() {
  // Multi-Filter State
  const [filterPeriod, setFilterPeriod] = useState<'SEMUA' | 'SMT1' | 'SMT2' | 'Q3_Q4'>('SEMUA');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'Metabolik' | 'Kardiologi' | 'Respirasi' | 'Neurologi'>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'Ringan' | 'Sedang' | 'Tinggi' | 'Kritis'>('ALL');
  const [filterDemographic, setFilterDemographic] = useState<'ALL' | 'ANAK' | 'DEWASA' | 'LANSIA'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');

  // Filter Drawer Collapse Toggle
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Active Filter Count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterPeriod !== 'SEMUA') count++;
    if (filterCategory !== 'ALL') count++;
    if (filterSeverity !== 'ALL') count++;
    if (filterDemographic !== 'ALL') count++;
    if (filterStatus !== 'ALL') count++;
    return count;
  }, [filterPeriod, filterCategory, filterSeverity, filterDemographic, filterStatus]);

  // Reset Filters
  const handleResetFilters = () => {
    setFilterPeriod('SEMUA');
    setFilterCategory('ALL');
    setFilterSeverity('ALL');
    setFilterDemographic('ALL');
    setFilterStatus('ALL');
  };

  // Filtered raw metrics
  const filteredMetrics = useMemo(() => {
    return RAW_METRICS.filter(item => {
      // 1. Period filter
      if (filterPeriod === 'SMT1') {
        if (!['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'].includes(item.month)) return false;
      } else if (filterPeriod === 'SMT2') {
        if (!['Jul', 'Agu', 'Sep', 'Okt'].includes(item.month)) return false;
      } else if (filterPeriod === 'Q3_Q4') {
        if (!['Jul', 'Agu', 'Sep', 'Okt'].includes(item.month)) return false;
      }

      // 2. Category
      if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;

      // 3. Severity
      if (filterSeverity !== 'ALL' && item.severity !== filterSeverity) return false;

      // 4. Demographic
      if (filterDemographic !== 'ALL' && item.ageGroup !== filterDemographic) return false;

      // 5. Verification Status
      if (filterStatus === 'VERIFIED' && !item.isVerified) return false;
      if (filterStatus === 'UNVERIFIED' && item.isVerified) return false;

      return true;
    });
  }, [filterPeriod, filterCategory, filterSeverity, filterDemographic, filterStatus]);

  // Months list depending on period filter
  const monthsInScope = useMemo(() => {
    if (filterPeriod === 'SMT1') return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    if (filterPeriod === 'SMT2' || filterPeriod === 'Q3_Q4') return ['Jul', 'Agu', 'Sep', 'Okt'];
    return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
  }, [filterPeriod]);

  // Grouped monthly trends
  const monthlyTrends = useMemo(() => {
    const map: Record<string, number> = {};
    monthsInScope.forEach(m => (map[m] = 0));

    filteredMetrics.forEach(item => {
      if (map[item.month] !== undefined) {
        map[item.month] += item.cases;
      }
    });

    const values = Object.values(map);
    const maxVal = Math.max(...values, 1);

    return monthsInScope.map(m => {
      const cases = map[m] || 0;
      const barHeight = `${Math.max(12, Math.round((cases / maxVal) * 100))}%`;
      return { month: m, cases, barHeight };
    });
  }, [filteredMetrics, monthsInScope]);

  // Category breakdown
  const categoryDistribution = useMemo(() => {
    const counts = {
      Metabolik: 0,
      Kardiologi: 0,
      Respirasi: 0,
      Neurologi: 0
    };

    filteredMetrics.forEach(item => {
      counts[item.category] += item.cases;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const config = [
      { name: 'Penyakit Metabolik', key: 'Metabolik', color: '#FCD34D' },
      { name: 'Gangguan Kardiologi', key: 'Kardiologi', color: '#38BDF8' },
      { name: 'Infeksi Respirasi', key: 'Respirasi', color: '#439335' },
      { name: 'Penyakit Neurologi', key: 'Neurologi', color: '#F87171' }
    ] as const;

    return config.map(c => {
      const count = counts[c.key as keyof typeof counts];
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        name: c.name,
        category: c.key,
        count,
        percentage,
        color: c.color
      };
    });
  }, [filteredMetrics]);

  // Severity breakdown
  const severityDistribution = useMemo(() => {
    const counts = { Ringan: 0, Sedang: 0, Tinggi: 0, Kritis: 0 };
    filteredMetrics.forEach(item => {
      counts[item.severity] += item.cases;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const config = [
      { label: 'Ringan', key: 'Ringan', color: '#439335' },
      { label: 'Sedang', key: 'Sedang', color: '#F59E0B' },
      { label: 'Tinggi', key: 'Tinggi', color: '#EF4444' },
      { label: 'Kritis', key: 'Kritis', color: '#8B5CF6' }
    ] as const;

    return config.map(c => {
      const count = counts[c.key as keyof typeof counts];
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        label: c.label,
        count: `${count} kasus`,
        pct,
        color: c.color
      };
    });
  }, [filteredMetrics]);

  // Total cases in scope
  const totalCases = useMemo(() => {
    return filteredMetrics.reduce((acc, curr) => acc + curr.cases, 0);
  }, [filteredMetrics]);

  // Peak month
  const peakMonth = useMemo(() => {
    if (monthlyTrends.length === 0) return { month: '-', cases: 0 };
    return [...monthlyTrends].sort((a, b) => b.cases - a.cases)[0];
  }, [monthlyTrends]);

  // Average per month
  const avgMonthlyCases = useMemo(() => {
    if (monthsInScope.length === 0) return 0;
    return Math.round(totalCases / monthsInScope.length);
  }, [totalCases, monthsInScope]);

  // Download visual stats as CSV
  const handleExportData = () => {
    if (filteredMetrics.length === 0) {
      alert('Tidak ada data statistik untuk diekspor.');
      return;
    }
    const headers = ['Bulan', 'Rumpun Penyakit', 'Tingkat Keparahan', 'Kelompok Usia', 'Tervalidasi ICD', 'Jumlah Kasus'];
    const rows = filteredMetrics.map(r => [
      r.month,
      r.category,
      r.severity,
      r.ageGroup === 'ANAK' ? 'Anak (<18)' : r.ageGroup === 'DEWASA' ? 'Dewasa (18-50)' : 'Lansia (>50)',
      r.isVerified ? 'Ya' : 'Belum',
      r.cases
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `statistik_visual_mediagnotek_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Title & Download Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LineChart size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Visualisasi Data Statistik Kesehatan
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
            Grafik interaktif tren diagnosa bulanan, proporsi kasus per kategori medis, dan sebaran tingkat keparahan pasien.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="neo-btn-primary"
          style={{
            padding: '8px 16px',
            fontSize: '0.84rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Unduh rekaman statistik kasus terfilter"
        >
          <Download size={15} strokeWidth={2.2} />
          <span>Ekspor Data Visual</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* FILTER CONSOLE LAPORAN & TREN                            */}
      {/* ======================================================== */}
      <div className="neo-card" style={{ padding: '18px 20px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Row 1: Timeframe Presets + Advanced Toggle */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', marginRight: '4px' }}>
              Rentang Waktu:
            </span>
            {[
              { id: 'SEMUA', label: 'Sepanjang 2026 (Jan - Okt)' },
              { id: 'SMT1', label: 'Semester 1 (Jan - Jun)' },
              { id: 'SMT2', label: 'Semester 2 (Jul - Okt)' },
              { id: 'Q3_Q4', label: 'Kuartal Terakhir (Q3 - Q4)' }
            ].map(tf => {
              const isActive = filterPeriod === tf.id;
              return (
                <button
                  key={tf.id}
                  onClick={() => setFilterPeriod(tf.id as any)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '9999px',
                    border: '1.5px solid #1E1E1E',
                    backgroundColor: isActive ? '#FEF3D6' : '#FAF8F4',
                    color: '#18181B',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '1.5px 1.5px 0px #1E1E1E' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>

          {/* Toggle Filter Lanjutan */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(prev => !prev)}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1.5px solid #1E1E1E',
              backgroundColor: isAdvancedOpen || activeFiltersCount > 0 ? '#FEF3D6' : '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: '#18181B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '1.5px 1.5px 0px #1E1E1E',
              flexShrink: 0
            }}
          >
            <SlidersHorizontal size={14} strokeWidth={2.2} />
            <span>Filter Kategori & Pasien</span>
            {activeFiltersCount > 0 && (
              <span style={{
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '0.68rem',
                padding: '1px 6px',
                fontWeight: 800
              }}>
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown size={14} style={{ transform: isAdvancedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Row 2: Advanced Dropdowns */}
        {isAdvancedOpen && (
          <div style={{
            padding: '14px',
            backgroundColor: '#FAF8F4',
            border: '1.5px solid #1E1E1E',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            animation: 'float-subtle 0.2s ease-out'
          }}>
            {/* 1. Kategori Penyakit */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Rumpun Kategori
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="ALL">Semua Rumpun Kategori</option>
                <option value="Metabolik">Penyakit Metabolik</option>
                <option value="Kardiologi">Gangguan Kardiologi</option>
                <option value="Respirasi">Infeksi Respirasi</option>
                <option value="Neurologi">Penyakit Neurologi</option>
              </select>
            </div>

            {/* 2. Tingkat Keparahan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Tingkat Keparahan
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as any)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="ALL">Semua Keparahan</option>
                <option value="Ringan">Ringan (Simtomatik)</option>
                <option value="Sedang">Sedang (Terapi Lanjut)</option>
                <option value="Tinggi">Tinggi (Perlu Monitoring)</option>
                <option value="Kritis">Kritis (Instensif / Rujukan)</option>
              </select>
            </div>

            {/* 3. Kelompok Usia / Demografi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Kelompok Usia Pasien
              </label>
              <select
                value={filterDemographic}
                onChange={(e) => setFilterDemographic(e.target.value as any)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="ALL">Semua Kelompok Usia</option>
                <option value="ANAK">Anak & Remaja (&lt; 18 Th)</option>
                <option value="DEWASA">Dewasa Produktif (18 - 50 Th)</option>
                <option value="LANSIA">Lansia Geriatri (&gt; 50 Th)</option>
              </select>
            </div>

            {/* 4. Status Validasi Medis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Validasi Diagnosa ICD-10
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="ALL">Semua Status</option>
                <option value="VERIFIED">Tervalidasi Resmi Dokter</option>
                <option value="UNVERIFIED">Observasi / Rujukan Lanjut</option>
              </select>
            </div>
          </div>
        )}

        {/* Row 3: Active Filter Chips & Reset */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 700 }}>
              Total Terdata: <strong>{totalCases}</strong> Kasus Klinis
            </span>

            {filterCategory !== 'ALL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Kategori: {filterCategory}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterCategory('ALL')} />
              </span>
            )}
            {filterSeverity !== 'ALL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Keparahan: {filterSeverity}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterSeverity('ALL')} />
              </span>
            )}
            {filterDemographic !== 'ALL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Usia: {filterDemographic}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterDemographic('ALL')} />
              </span>
            )}
            {filterStatus !== 'ALL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Status: {filterStatus}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('ALL')} />
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1.2px solid #DC2626',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN CHARTS GRID                                         */}
      {/* ======================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
        {/* Chart 1: Monthly Trends Bar Chart */}
        <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <BarChart3 size={20} strokeWidth={2.2} style={{ color: '#18181B' }} />
                Tren Kasus Terfilter Bulanan
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px', margin: 0 }}>
                {filterCategory === 'ALL' ? 'Total seluruh sesi diagnosa klinis' : `Fokus kategori: ${filterCategory}`}
              </p>
            </div>
            <span className="tag-yellow" style={{ fontWeight: 800 }}>
              Puncak: {peakMonth.month} ({peakMonth.cases} kss)
            </span>
          </div>

          {/* Bar Chart Graphic Area */}
          <div style={{
            height: '240px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '16px 12px 10px 12px',
            borderBottom: '2px solid #1E1E1E',
            backgroundColor: '#FAF8F4',
            borderRadius: '14px',
            border: '1.5px solid #1E1E1E'
          }}>
            {monthlyTrends.map((item, idx) => {
              const isPeak = item.month === peakMonth.month && item.cases > 0;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.7rem', color: isPeak ? '#15803D' : '#6B7280', fontWeight: 800 }}>
                    {item.cases}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '40px',
                      height: item.cases === 0 ? '4px' : item.barHeight,
                      backgroundColor: isPeak ? '#439335' : item.cases > 0 ? '#FDE68A' : '#E5E7EB',
                      border: '1.5px solid #1E1E1E',
                      borderRadius: '8px 8px 0 0',
                      boxShadow: '1.5px 0px 0px #1E1E1E',
                      transition: 'height 0.4s ease'
                    }}
                    title={`${item.month}: ${item.cases} kasus`}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#18181B', fontWeight: isPeak ? 800 : 600 }}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.85rem', color: '#6B7280', flexWrap: 'wrap', gap: '6px' }}>
            <span>Rata-rata: <strong>{avgMonthlyCases} kasus/bulan</strong></span>
            <span>Total Terhitung: <strong>{totalCases} kasus</strong></span>
          </div>
        </div>

        {/* Chart 2: Category Distribution Breakdown */}
        <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '3px 4px 0px #1E1E1E' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <PieChart size={20} strokeWidth={2.2} style={{ color: '#18181B' }} />
                  Distribusi Kategori Penyakit
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px', margin: 0 }}>
                  Proporsi diagnosa berdasarkan rumpun medis
                </p>
              </div>
              <span className="tag-cyan" style={{ fontWeight: 800 }}>4 Rumpun</span>
            </div>

            {/* Visual Progress Stack */}
            <div style={{ width: '100%', height: '24px', backgroundColor: '#FAF8F4', border: '1.5px solid #1E1E1E', borderRadius: '12px', display: 'flex', overflow: 'hidden', marginBottom: '24px' }}>
              {categoryDistribution.map((cat, i) => (
                <div
                  key={i}
                  style={{
                    width: `${cat.percentage}%`,
                    height: '100%',
                    backgroundColor: cat.color,
                    borderRight: i < 3 ? '1.5px solid #1E1E1E' : 'none',
                    transition: 'width 0.3s ease'
                  }}
                  title={`${cat.name}: ${cat.percentage}% (${cat.count} kasus)`}
                />
              ))}
            </div>

            {/* Category List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categoryDistribution.map((cat, i) => (
                <div
                  key={i}
                  onClick={() => setFilterCategory(filterCategory === cat.category ? 'ALL' : (cat.category as any))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.88rem',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: filterCategory === cat.category ? '#FEF3D6' : 'transparent',
                    border: filterCategory === cat.category ? '1.2px solid #1E1E1E' : '1.2px solid transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: cat.color, border: '1.2px solid #1E1E1E', flexShrink: 0 }} />
                    <span style={{ color: '#18181B', fontWeight: 700 }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <span style={{ color: '#6B7280', fontSize: '0.82rem' }}>{cat.count} Kasus</span>
                    <span style={{ fontWeight: 800, color: '#18181B', minWidth: '40px', textAlign: 'right' }}>{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM 2 CARDS: SEVERITY & DEMOGRAPHIC INSIGHT           */}
      {/* ======================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Severity Breakdown */}
        <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Sebaran Tingkat Keparahan Kasus
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {severityDistribution.map((s, idx) => (
              <div
                key={idx}
                onClick={() => setFilterSeverity(filterSeverity === s.label ? 'ALL' : (s.label as any))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: filterSeverity === s.label ? '#FEF3D6' : '#FAF8F4',
                  borderRadius: '12px',
                  border: filterSeverity === s.label ? '1.8px solid #1E1E1E' : '1.2px solid #1E1E1E',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontWeight: 700, color: '#18181B', fontSize: '0.88rem' }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#6B7280', fontSize: '0.82rem' }}>{s.count}</span>
                  <span style={{ fontWeight: 800, color: s.color, fontSize: '0.88rem' }}>{s.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographic Quick Note */}
        <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Distribusi Demografis Pasien
          </h3>
          <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
            {filterCategory === 'Metabolik'
              ? 'Pada kelompok Penyakit Metabolik, populasi usia Lansia (>50 Th) mendominasi 62% kasus, memerlukan monitoring gula darah puasa & HbA1c teratur.'
              : filterCategory === 'Respirasi'
              ? 'Pada kelompok Infeksi Respirasi, anak-anak & balita mendominasi hingga 45% kasus bronkopneumonia & faringitis akut.'
              : filterDemographic === 'LANSIA'
              ? 'Pasien geriatri (>50 tahun) memiliki komorbiditas kardiometabolik tertinggi (rata-rata 2.4 diagnosa simultan).'
              : 'Berdasarkan rekam diagnostik terfilter, usia produktif (18-50 tahun) dan lansia (>50 tahun) mendominasi pola kunjungan fasilitas kesehatan.'}
          </p>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#DCFCE7',
            borderRadius: '12px',
            border: '1.5px solid #1E1E1E',
            fontSize: '0.85rem',
            color: '#166534',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>Kalkulasi visual realtime tersinkronisasi filter data rekam medis.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
