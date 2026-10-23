'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  AlertCircle,
  FileText,
  Phone,
  Calendar,
  HeartPulse,
  Pill,
  Clock,
  X,
  Check
} from 'lucide-react';
import { Patient } from '@/lib/api';

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 1,
    nama: 'Budi Santoso',
    nik: '3273011405820003',
    tanggal_lahir: '1982-05-14',
    jenis_kelamin: 'L',
    telepon: '081234567890',
    alamat: 'Jl. Merdeka No. 45, Bandung',
    alergi_obat: ['Amoxicillin', 'Penisilin'],
    catatan_medis: 'Pasien penderita Hipertensi tingkat 1, rutin kontrol bulanan.',
    riwayat_penyakit: ['Hipertensi', 'Dislipidemia']
  },
  {
    id: 2,
    nama: 'Siti Rahmawati',
    nik: '3273015509910001',
    tanggal_lahir: '1991-09-15',
    jenis_kelamin: 'P',
    telepon: '082198765432',
    alamat: 'Jl. Dago Asri No. 12, Bandung',
    alergi_obat: ['Aspirin'],
    catatan_medis: 'Ibu hamil trimester 2. Hindari obat golongan NSAID berisiko.',
    riwayat_penyakit: ['Gastritis Kronis']
  },
  {
    id: 3,
    nama: 'Ahmad Fauzi',
    nik: '3273010101750004',
    tanggal_lahir: '1975-01-01',
    jenis_kelamin: 'L',
    telepon: '085611223344',
    alamat: 'Komplek Antapani Indah Blok B4, Bandung',
    alergi_obat: [],
    catatan_medis: 'Diabetes Melitus tipe 2. Menggunakan Metformin teratur.',
    riwayat_penyakit: ['Diabetes Melitus Tipe 2']
  },
  {
    id: 4,
    nama: 'Dewi Lestari',
    nik: '3273016812880005',
    tanggal_lahir: '1988-12-28',
    jenis_kelamin: 'P',
    telepon: '087855443322',
    alamat: 'Jl. Cihampelas No. 102, Bandung',
    alergi_obat: ['Sulfa'],
    catatan_medis: 'Asma bronchial ringan saat terpapar alergen dingin.',
    riwayat_penyakit: ['Asma']
  }
];

export default function PasienPage() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(INITIAL_PATIENTS[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    telepon: '',
    alamat: '',
    alergi_obat_raw: '',
    riwayat_penyakit_raw: '',
    catatan_medis: ''
  });

  const filteredPatients = patients.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.nik.includes(search) ||
    p.telepon.includes(search)
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;

    const newPatient: Patient = {
      id: Date.now(),
      nama: formData.nama,
      nik: formData.nik || '-',
      tanggal_lahir: formData.tanggal_lahir || '1990-01-01',
      jenis_kelamin: formData.jenis_kelamin,
      telepon: formData.telepon || '-',
      alamat: formData.alamat || '-',
      alergi_obat: formData.alergi_obat_raw
        ? formData.alergi_obat_raw.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      riwayat_penyakit: formData.riwayat_penyakit_raw
        ? formData.riwayat_penyakit_raw.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      catatan_medis: formData.catatan_medis
    };

    setPatients([newPatient, ...patients]);
    setSelectedPatient(newPatient);
    setShowAddModal(false);
    setFormData({
      nama: '',
      nik: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L',
      telepon: '',
      alamat: '',
      alergi_obat_raw: '',
      riwayat_penyakit_raw: '',
      catatan_medis: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Buku Induk & Rekam Pasien Apotek
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
            Database pasien apotek untuk skrining alergi obat, riwayat penebusan resep, dan konseling farmasi.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FEF3D6',
            border: '2px solid #1E1E1E',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '2.5px 2.5px 0px #1E1E1E'
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Tambah Pasien Baru
        </button>
      </div>

      {/* Grid Content: Daftar Pasien & Detail Pasien */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px', alignItems: 'start' }}>
        {/* Kolom Kiri: Search & List Pasien */}
        <div className="neo-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6B7280' }} />
            <input
              type="text"
              placeholder="Cari pasien (Nama, NIK, No HP)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input-neo"
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '560px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              const hasAllergy = p.alergi_obat.length > 0;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #1E1E1E' : '1.5px solid #E5E7EB',
                    backgroundColor: isSelected ? '#FEF3D6' : '#FFFFFF',
                    boxShadow: isSelected ? '2px 2px 0px #1E1E1E' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#18181B' }}>
                        {p.nama} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B7280' }}>({p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>
                        NIK: {p.nik} • {p.telepon}
                      </div>
                    </div>

                    {hasAllergy && (
                      <span
                        title={`Alergi: ${p.alergi_obat.join(', ')}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                          border: '1.2px solid #DC2626',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px'
                        }}
                      >
                        <AlertCircle size={12} />
                        Alergi Obat
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredPatients.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '0.9rem' }}>
                Tidak ada data pasien yang sesuai.
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Detail Pasien Terpilih */}
        {selectedPatient ? (
          <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            {/* Header Profil */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#E0E7FF',
                  border: '1.2px solid #1E1E1E',
                  color: '#3730A3',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  marginBottom: '6px'
                }}>
                  ID PASIEN #{selectedPatient.id}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#18181B' }}>
                  {selectedPatient.nama}
                </h2>
                <div style={{ display: 'flex', gap: '14px', marginTop: '4px', color: '#4B5563', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> Lahir: {selectedPatient.tanggal_lahir}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} /> {selectedPatient.telepon}
                  </span>
                </div>
              </div>

              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#FEF3D6',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '1.5px 1.5px 0px #1E1E1E'
              }}>
                <HeartPulse size={22} color="#1E1E1E" />
              </div>
            </div>

            {/* Warning Alergi Khusus Apoteker */}
            <div style={{
              backgroundColor: selectedPatient.alergi_obat.length > 0 ? '#FEF2F2' : '#F0FDF4',
              border: selectedPatient.alergi_obat.length > 0 ? '1.8px solid #DC2626' : '1.8px solid #16A34A',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '20px',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: selectedPatient.alergi_obat.length > 0 ? '#991B1B' : '#166534', fontSize: '0.9rem' }}>
                <AlertCircle size={18} />
                Peringatan Alergi Obat Pasien
              </div>
              <div style={{ marginTop: '6px', fontSize: '0.88rem' }}>
                {selectedPatient.alergi_obat.length > 0 ? (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {selectedPatient.alergi_obat.map((a, i) => (
                      <span key={i} style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#166534', fontWeight: 600 }}>Pasien tidak memiliki riwayat alergi obat yang tercatat.</span>
                )}
              </div>
            </div>

            {/* Riwayat Penyakit & Catatan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FAF8F4', border: '1.5px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Riwayat Penyakit Kronis
                </div>
                {selectedPatient.riwayat_penyakit && selectedPatient.riwayat_penyakit.length > 0 ? (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedPatient.riwayat_penyakit.map((p, idx) => (
                      <span key={idx} style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Tidak ada riwayat kronis</span>
                )}
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#FAF8F4', border: '1.5px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Alamat Lengkap
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1F2937', lineHeight: 1.4 }}>
                  {selectedPatient.alamat}
                </div>
              </div>
            </div>

            {/* Catatan Medis & Edukasi Farmasi */}
            <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1.5px solid #1E1E1E', marginBottom: '22px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4B5563', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} /> Catatan Khusus Apoteker:
              </div>
              <p style={{ fontSize: '0.86rem', color: '#1F2937', margin: 0, lineHeight: 1.5 }}>
                {selectedPatient.catatan_medis || 'Belum ada catatan khusus untuk pasien ini.'}
              </p>
            </div>

            {/* Riwayat Penebusan Obat Terakhir */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18181B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} /> Riwayat Penebusan Obat Terakhir (Farmasi)
              </div>
              <div style={{ border: '1.5px solid #1E1E1E', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF8F4', borderBottom: '1.5px solid #1E1E1E' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Tanggal</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Nama Obat / Resep</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700 }}>Jml</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Signa (Aturan Pakai)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '10px 12px' }}>2026-10-18</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>Amlodipine Besylate 10mg</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>30 tab</td>
                      <td style={{ padding: '10px 12px', color: '#4B5563' }}>1 x 1 tab malam hari sesudah makan</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 12px' }}>2026-09-20</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>Metformin HCl 500mg</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>60 tab</td>
                      <td style={{ padding: '10px 12px', color: '#4B5563' }}>2 x 1 tab bersama makan</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="neo-card" style={{ padding: '40px', backgroundColor: '#FFFFFF', textAlign: 'center', color: '#6B7280' }}>
            Pilih pasien dari daftar sebelah kiri untuk melihat rekam medis apotek.
          </div>
        )}
      </div>

      {/* Modal Tambah Pasien */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="neo-card" style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '26px',
            boxShadow: '4px 4px 0px #1E1E1E'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Tambah Pasien Baru
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPatient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Nama Lengkap Pasien *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="form-input-neo"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    NIK (KTP)
                  </label>
                  <input
                    type="text"
                    placeholder="16 digit NIK"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value as 'L' | 'P' })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxx"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: '#DC2626' }}>
                  ⚠️ Riwayat Alergi Obat (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Amoxicillin, Penisilin, Sulfa"
                  value={formData.alergi_obat_raw}
                  onChange={(e) => setFormData({ ...formData, alergi_obat_raw: e.target.value })}
                  className="form-input-neo"
                  style={{ width: '100%', borderColor: '#DC2626' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Riwayat Penyakit Kronis (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Hipertensi, Diabetes Melitus, Asma"
                  value={formData.riwayat_penyakit_raw}
                  onChange={(e) => setFormData({ ...formData, riwayat_penyakit_raw: e.target.value })}
                  className="form-input-neo"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  placeholder="Jl. / RT / RW / Kelurahan / Kota"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="form-input-neo"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Catatan Tambahan Apoteker
                </label>
                <textarea
                  rows={2}
                  placeholder="Kondisi khusus, hamil/menyusui, toleransi dosis, dsb."
                  value={formData.catatan_medis}
                  onChange={(e) => setFormData({ ...formData, catatan_medis: e.target.value })}
                  className="form-input-neo"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #1E1E1E',
                    background: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    border: '1.8px solid #1E1E1E',
                    backgroundColor: '#FEF3D6',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px #1E1E1E'
                  }}
                >
                  Simpan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
