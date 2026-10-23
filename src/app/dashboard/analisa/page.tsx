'use client';

import { useState } from 'react';
import { Microscope, FileText, Target, Lightbulb, Play } from 'lucide-react';

export default function AnalisaPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Demam tinggi (>38°C)',
    'Batuk berdahak'
  ]);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [bloodSugar, setBloodSugar] = useState(110);
  const [temperature, setTemperature] = useState(38.2);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(true);

  const availableSymptoms = [
    'Demam tinggi (>38°C)',
    'Batuk berdahak',
    'Sesak napas / Dada berat',
    'Nyeri dada menjalar',
    'Sakit kepala berdenyut',
    'Pusing / Tengkuk kaku',
    'Poliuria (Sering kencing)',
    'Sering haus (Polidipsia)',
    'Lemas & Letih'
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Microscope size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
          Modul Simulasi Analisa Diagnostik
        </h1>
        <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
          Masukkan indikator klinis dan centang gejala pasien untuk mendapatkan estimasi diagnosa serta rekomendasi medis.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Input Form Column */}
        <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} strokeWidth={2.2} />
            Data Input Pasien
          </h2>

          {/* Symptom Checklist */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#18181B', marginBottom: '12px', display: 'block' }}>
              Gejala Klinis yang Dialami Pasien:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableSymptoms.map((sym) => {
                const isChecked = selectedSymptoms.includes(sym);
                return (
                  <div
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: isChecked ? '#FEF3D6' : '#FAF8F4',
                      border: isChecked ? '1.5px solid #1E1E1E' : '1.5px solid #E5E7EB',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.88rem',
                      fontWeight: isChecked ? 700 : 500,
                      color: '#18181B',
                      boxShadow: isChecked ? '1.5px 1.5px 0px #1E1E1E' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      style={{ accentColor: '#439335', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span>{sym}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Vital Parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#18181B' }}>Parameter Vital Pasien:</label>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Tekanan Darah (mmHg)
              </label>
              <input
                type="text"
                className="form-input-neo"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 600 }}>Gula Darah Puasa (mg/dL):</span>
                <strong style={{ color: '#18181B', fontSize: '0.85rem' }}>{bloodSugar} mg/dL</strong>
              </div>
              <input
                type="range"
                min="60"
                max="300"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#439335', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 600 }}>Suhu Tubuh (°C):</span>
                <strong style={{ color: '#18181B', fontSize: '0.85rem' }}>{temperature}°C</strong>
              </div>
              <input
                type="range"
                min="35.0"
                max="41.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#439335', cursor: 'pointer' }}
              />
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || selectedSymptoms.length === 0}
            className="neo-btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '0.95rem', cursor: isAnalyzing ? 'wait' : 'pointer', borderRadius: '12px' }}
          >
            {isAnalyzing ? '⚡ Memproses Analisa...' : '🚀 Jalankan Analisa Diagnostik'}
          </button>
        </div>

        {/* Output Result Column */}
        <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '3px 4px 0px #1E1E1E' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} strokeWidth={2.2} />
                Hasil Estimasi Diagnosa
              </h2>
              {hasResult && <span className="tag-cyan">Analisa Selesai</span>}
            </div>

            {isAnalyzing ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Microscope size={48} strokeWidth={1.8} style={{ color: '#18181B', margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B' }}>Menghitung Probabilitas Medis...</h3>
                <p style={{ fontSize: '0.88rem', color: '#6B7280', marginTop: '8px' }}>Mengorelasikan parameter vital dengan database penyakit.</p>
              </div>
            ) : hasResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Predicted Primary Disease */}
                <div style={{
                  backgroundColor: '#FEF3D6',
                  padding: '22px',
                  borderRadius: '16px',
                  border: '1.8px solid #1E1E1E',
                  boxShadow: '2px 2.5px 0px #1E1E1E'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 800, marginBottom: '6px' }}>
                    DIAGNOSA PRIMER TERPREDIKSI (ICD-10 J18)
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                    Pneumonia Bakterial
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#52525B', marginBottom: '16px', lineHeight: 1.5 }}>
                    Terdeteksi dari kombinasi demam {temperature}°C, batuk berdahak, serta parameter vital pernapasan.
                  </div>

                  {/* Confidence Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: '#18181B' }}>Tingkat Keyakinan:</span>
                      <span style={{ color: '#166534' }}>92.8%</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', backgroundColor: '#FFFFFF', border: '1.2px solid #1E1E1E', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: '92.8%', height: '100%', backgroundColor: '#439335', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>

                {/* Secondary Differential Diagnosis */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#18181B', fontWeight: 800, marginBottom: '10px' }}>
                    Diagnosa Banding Lainnya:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#FAF8F4', border: '1.2px solid #1E1E1E', borderRadius: '10px', fontSize: '0.88rem' }}>
                      <span style={{ fontWeight: 600, color: '#18181B' }}>Bronkitis Akut (ICD-10 J20)</span>
                      <span style={{ color: '#92400E', fontWeight: 800 }}>45.2%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#FAF8F4', border: '1.2px solid #1E1E1E', borderRadius: '10px', fontSize: '0.88rem' }}>
                      <span style={{ fontWeight: 600, color: '#18181B' }}>Asthma Bronkial (ICD-10 J45)</span>
                      <span style={{ color: '#6B7280', fontWeight: 800 }}>18.7%</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Recommendations */}
                <div style={{ padding: '16px 20px', backgroundColor: '#DCFCE7', borderRadius: '14px', border: '1.5px solid #1E1E1E' }}>
                  <h4 style={{ fontSize: '0.92rem', color: '#166534', marginBottom: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lightbulb size={18} strokeWidth={2.2} />
                    Rekomendasi Tindakan Medis:
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: '#166534', lineHeight: 1.6 }}>
                    <li>Lakukan foto Rontgen Thorax (AP/Lateral).</li>
                    <li>Pemeriksaan Darah Lengkap (Lekosit) & Kultur Dahak.</li>
                    <li>Berikan antipiretik dan pertimbangkan antibiotik oral sesuai resep.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
                Tekan tombol &quot;Jalankan Analisa Diagnostik&quot; untuk menampilkan hasil analisa.
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.76rem', color: '#6B7280', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
            * Hasil simulasi sistem ini merupakan alat bantu dan tetap memerlukan verifikasi langsung oleh Dokter Penanggung Jawab.
          </div>
        </div>
      </div>
    </div>
  );
}
