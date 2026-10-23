'use client';

import { useState } from 'react';
import { LineChart, BarChart3, PieChart, AlertCircle, Building2 } from 'lucide-react';

export default function VisualPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Bulan Ini');

  // Chart bar data simulation
  const monthlyTrends = [
    { month: 'Jan', cases: 140, barHeight: '55%' },
    { month: 'Feb', cases: 185, barHeight: '70%' },
    { month: 'Mar', cases: 210, barHeight: '82%' },
    { month: 'Apr', cases: 160, barHeight: '62%' },
    { month: 'Mei', cases: 240, barHeight: '92%' },
    { month: 'Jun', cases: 195, barHeight: '75%' },
    { month: 'Jul', cases: 260, barHeight: '100%' },
  ];

  const categoryDistribution = [
    { name: 'Penyakit Metabolik', percentage: 38, count: 420, color: '#FCD34D' },
    { name: 'Gangguan Kardiologi', percentage: 27, count: 298, color: '#38BDF8' },
    { name: 'Infeksi Respirasi', percentage: 22, count: 243, color: '#439335' },
    { name: 'Penyakit Neurologi', percentage: 13, count: 144, color: '#F87171' },
  ];

  const severityDistribution = [
    { label: 'Ringan', count: '512 kasus', pct: 45, color: '#439335' },
    { label: 'Sedang', count: '380 kasus', pct: 34, color: '#F59E0B' },
    { label: 'Tinggi', count: '185 kasus', pct: 16, color: '#EF4444' },
    { label: 'Kritis', count: '56 kasus', pct: 5, color: '#8B5CF6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Title */}
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

        {/* Timeframe selector */}
        <div className="neo-card" style={{ padding: '6px 10px', display: 'flex', gap: '6px', backgroundColor: '#FFFFFF', boxShadow: '2px 2px 0px #1E1E1E' }}>
          {['Minggu Ini', 'Bulan Ini', 'Tahun 2026'].map((tf) => {
            const isSelected = selectedTimeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: isSelected ? '1.5px solid #1E1E1E' : '1.5px solid transparent',
                  background: isSelected ? '#FEF3D6' : 'transparent',
                  color: '#18181B',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '1px 1px 0px #1E1E1E' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tf}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* Chart 1: Monthly Trends Bar Chart */}
        <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={20} strokeWidth={2.2} style={{ color: '#18181B' }} />
                Tren Diagnosa Bulanan
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>Total sesi diagnosa tervalidasi</p>
            </div>
            <span className="tag-yellow">+18.4% YoY</span>
          </div>

          {/* Bar Chart Graphic Area */}
          <div style={{
            height: '240px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '16px 12px 10px 12px',
            borderBottom: '2px solid #1E1E1E',
            backgroundColor: '#FAF8F4',
            borderRadius: '14px',
            border: '1.5px solid #1E1E1E'
          }}>
            {monthlyTrends.map((item, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700 }}>{item.cases}</span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '44px',
                    height: item.barHeight,
                    backgroundColor: idx === 6 ? '#439335' : '#FDE68A',
                    border: '1.5px solid #1E1E1E',
                    borderRadius: '8px 8px 0 0',
                    boxShadow: '1.5px 0px 0px #1E1E1E',
                    transition: 'height 0.4s ease'
                  }}
                  title={`${item.month}: ${item.cases} kasus`}
                />
                <span style={{ fontSize: '0.82rem', color: '#18181B', fontWeight: 700 }}>{item.month}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.85rem', color: '#6B7280' }}>
            <span>Rata-rata: <strong>198 diagnosa/bulan</strong></span>
            <span>Puncak: <strong>Jul (260 kasus)</strong></span>
          </div>
        </div>

        {/* Chart 2: Category Distribution Breakdown */}
        <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '3px 4px 0px #1E1E1E' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieChart size={20} strokeWidth={2.2} style={{ color: '#18181B' }} />
                  Distribusi Kategori Penyakit
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>Proporsi diagnosa berdasarkan rumpun medis</p>
              </div>
              <span className="tag-cyan">4 Rumpun</span>
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
                    borderRight: i < 3 ? '1.5px solid #1E1E1E' : 'none'
                  }}
                  title={`${cat.name}: ${cat.percentage}%`}
                />
              ))}
            </div>

            {/* Category List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {categoryDistribution.map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: cat.color, border: '1.2px solid #1E1E1E' }} />
                    <span style={{ color: '#18181B', fontWeight: 600 }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>{cat.count} Kasus</span>
                    <span style={{ fontWeight: 800, color: '#18181B', minWidth: '40px', textAlign: 'right' }}>{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Severity Breakdown */}
        <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Sebaran Tingkat Keparahan Kasus
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {severityDistribution.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FAF8F4', borderRadius: '12px', border: '1.2px solid #1E1E1E' }}>
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
            Berdasarkan 1.428 rekam diagnostik, kelompok usia <strong>40-60 tahun</strong> mendominasi sebanyak <strong>48%</strong>, terutama pada kasus metabolik dan kardiologi.
          </p>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#DCFCE7',
            borderRadius: '12px',
            border: '1.5px solid #1E1E1E',
            fontSize: '0.85rem',
            color: '#166534',
            fontWeight: 700
          }}>
            ✓ Data tersinkronisasi otomatis dengan server statistik regional.
          </div>
        </div>
      </div>
    </div>
  );
}
