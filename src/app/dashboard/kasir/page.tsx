'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  User,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Printer,
  Receipt,
  FileCheck,
  Search,
  QrCode,
  Banknote,
  Coins
} from 'lucide-react';
import { Patient, PrescriptionItem } from '@/lib/api';

const MOCK_PATIENTS: Patient[] = [
  {
    id: 1,
    nama: 'Budi Santoso',
    nik: '3273011405820003',
    tanggal_lahir: '1982-05-14',
    jenis_kelamin: 'L',
    telepon: '081234567890',
    alamat: 'Jl. Merdeka No. 45, Bandung',
    alergi_obat: ['Amoxicillin', 'Penisilin'],
    catatan_medis: 'Hipertensi',
  },
  {
    id: 2,
    nama: 'Siti Rahmawati',
    nik: '3273015509910001',
    tanggal_lahir: '1991-09-15',
    jenis_kelamin: 'P',
    telepon: '082198765432',
    alamat: 'Jl. Dago Asri No. 12',
    alergi_obat: ['Aspirin'],
    catatan_medis: 'Ibu hamil trimester 2',
  },
  {
    id: 3,
    nama: 'Ahmad Fauzi',
    nik: '3273010101750004',
    tanggal_lahir: '1975-01-01',
    jenis_kelamin: 'L',
    telepon: '085611223344',
    alamat: 'Komplek Antapani Indah',
    alergi_obat: [],
  }
];

const AVAILABLE_MEDICINES = [
  { id: 1, nama: 'Paracetamol 500mg', harga: 8000, satuan: 'Strip (10 Tab)', stok: 120, golongan: 'Bebas' },
  { id: 2, nama: 'Amoxicillin 500mg', harga: 14000, satuan: 'Strip (10 Kapsul)', stok: 14, golongan: 'Keras' },
  { id: 3, nama: 'Metformin HCl 500mg', harga: 6500, satuan: 'Strip (10 Tab)', stok: 85, golongan: 'Keras' },
  { id: 4, nama: 'Amlodipine Besylate 10mg', harga: 12500, satuan: 'Strip (10 Tab)', stok: 9, golongan: 'Keras' },
  { id: 5, nama: 'Cetirizine HCl 10mg', harga: 9000, satuan: 'Strip (10 Tab)', stok: 52, golongan: 'Bebas Terbatas' },
  { id: 6, nama: 'Aspirin 80mg', harga: 11000, satuan: 'Strip (10 Tab)', stok: 30, golongan: 'Bebas Terbatas' },
];

const PACKAGING_OPTIONS = [
  'Tablet / Pcs',
  'Strip (10 Tab)',
  'Bungkus / Sachet',
  'Botol / Sirup',
  'Box / Dus',
  'Tube',
  'Ampul / Vial'
];

export default function KasirPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | ''>(1);
  const [nonResepNamaPasien, setNonResepNamaPasien] = useState('unknown');
  const [tipeTransaksi, setTipeTransaksi] = useState<'Resep' | 'Non-Resep'>('Resep');
  const [dokterPerujuk, setDokterPerujuk] = useState('dr. H. Susanto, Sp.PD');
  const [cartItems, setCartItems] = useState<PrescriptionItem[]>([
    { drug_id: 3, drug_nama: 'Metformin HCl 500mg', jumlah: 30, satuan: 'Tablet / Pcs', signa: '2 x 1 tablet sesudah makan', harga: 6500 },
    { drug_id: 4, drug_nama: 'Amlodipine Besylate 10mg', jumlah: 30, satuan: 'Tablet / Pcs', signa: '1 x 1 tablet malam hari', harga: 12500 }
  ]);

  // Selected drug to add
  const [addDrugId, setAddDrugId] = useState(1);
  const [addQty, setAddQty] = useState(10);
  const [addSatuan, setAddSatuan] = useState('Tablet / Pcs');
  const [addCustomPrice, setAddCustomPrice] = useState<string>(''); // string allows placeholder default
  const [addSigna, setAddSigna] = useState('3 x 1 tablet sesudah makan');
  const [successNotif, setSuccessNotif] = useState(false);

  const selectedPatient = tipeTransaksi === 'Resep'
    ? MOCK_PATIENTS.find((p) => p.id === Number(selectedPatientId))
    : undefined;
  const currentSelectedMed = AVAILABLE_MEDICINES.find((m) => m.id === Number(addDrugId)) || AVAILABLE_MEDICINES[0];

  // Skrining Alergi Obat Real-time
  const allergyConflicts = cartItems.filter((item) => {
    if (!selectedPatient || !selectedPatient.alergi_obat) return false;
    return selectedPatient.alergi_obat.some((al) =>
      item.drug_nama.toLowerCase().includes(al.toLowerCase())
    );
  });


  // Skrining Interaksi Obat Antar Item di Keranjang
  const checkDrugInteractions = () => {
    const names = cartItems.map((c) => c.drug_nama.toLowerCase());
    const warnings: string[] = [];
    if (names.some((n) => n.includes('amlodipine')) && names.some((n) => n.includes('aspirin'))) {
      warnings.push('Potensi interaksi moderat: Pemakaian bersamaan memerlukan pemantauan tekanan darah.');
    }
    return warnings;
  };

  const interactionWarnings = checkDrugInteractions();

  const handleSelectDrugChange = (medId: number) => {
    setAddDrugId(medId);
    const m = AVAILABLE_MEDICINES.find((item) => item.id === medId);
    if (m) {
      setAddCustomPrice(String(m.harga));
    }
  };

  const handleAddItem = () => {
    const med = AVAILABLE_MEDICINES.find((m) => m.id === Number(addDrugId));
    if (!med) return;

    // Use custom price entered, or fallback to default drug price
    const itemPrice = addCustomPrice !== '' && !isNaN(Number(addCustomPrice))
      ? Number(addCustomPrice)
      : med.harga;

    const existingIndex = cartItems.findIndex((c) => c.drug_id === med.id && c.satuan === addSatuan);
    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].jumlah += addQty;
      updated[existingIndex].harga = itemPrice;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          drug_id: med.id,
          drug_nama: med.nama,
          jumlah: addQty,
          satuan: addSatuan,
          signa: addSigna,
          harga: itemPrice
        }
      ]);
    }
  };

  const handleUpdateItemPrice = (drugId: number, newPrice: number) => {
    setCartItems(cartItems.map((item) => {
      if (item.drug_id === drugId) {
        return { ...item, harga: Math.max(0, newPrice) };
      }
      return item;
    }));
  };

  const handleUpdateItemQty = (drugId: number, newQty: number) => {
    setCartItems(cartItems.map((item) => {
      if (item.drug_id === drugId) {
        return { ...item, jumlah: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (drugId: number) => {
    setCartItems(cartItems.filter((item) => item.drug_id !== drugId));
  };

  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'TUNAI'>('QRIS');
  const [tunaiBayar, setTunaiBayar] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const subtotalObat = cartItems.reduce((acc, curr) => acc + curr.harga * curr.jumlah, 0);
  const tuslah = tipeTransaksi === 'Resep' ? 5000 : 0;
  const grandTotal = subtotalObat + tuslah;

  const nominalTunai = tunaiBayar !== '' ? Number(tunaiBayar) : 0;
  const kembalian = nominalTunai >= grandTotal ? nominalTunai - grandTotal : 0;
  const isTunaiKurang = paymentMethod === 'TUNAI' && (tunaiBayar === '' || nominalTunai < grandTotal);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setPaymentError('Keranjang belanja masih kosong.');
      return;
    }

    if (paymentMethod === 'TUNAI' && nominalTunai < grandTotal) {
      setPaymentError(`Uang tunai yang dibayarkan kurang Rp ${(grandTotal - nominalTunai).toLocaleString('id-ID')}. Inputan harus sama atau di atas total harga.`);
      return;
    }

    setPaymentError(null);
    setSuccessNotif(true);
    setTimeout(() => {
      setSuccessNotif(false);
      setCartItems([]);
      setTunaiBayar('');
    }, 2500);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Kasir & Penebusan Resep Apotek
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
            Point of Sales (POS) Apotek dengan fitur otomatis: Skrining Alergi Pasien, Interaksi Obat, dan Cetak Etiket Signa.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setTipeTransaksi('Resep')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1.8px solid #1E1E1E',
              backgroundColor: tipeTransaksi === 'Resep' ? '#FEF3D6' : '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: tipeTransaksi === 'Resep' ? '2px 2px 0px #1E1E1E' : 'none'
            }}
          >
            📋 Penebusan Resep Dokter
          </button>
          <button
            onClick={() => setTipeTransaksi('Non-Resep')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1.8px solid #1E1E1E',
              backgroundColor: tipeTransaksi === 'Non-Resep' ? '#FEF3D6' : '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: tipeTransaksi === 'Non-Resep' ? '2px 2px 0px #1E1E1E' : 'none'
            }}
          >
            💊 Penjualan Bebas (OTC)
          </button>
        </div>
      </div>

      {successNotif && (
        <div style={{
          backgroundColor: '#DCFCE7',
          border: '2px solid #166534',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '3px 3px 0px #1E1E1E'
        }}>
          <CheckCircle2 size={24} color="#166534" />
          <div>
            <div style={{ fontWeight: 800, color: '#166534' }}>
              Transaksi {tipeTransaksi === 'Resep' ? `Pasien ${selectedPatient?.nama || 'Umum'}` : `Pembeli ${nonResepNamaPasien}`} Berhasil Diproses!
            </div>
            <div style={{ fontSize: '0.82rem', color: '#14532D' }}>
              Stok otomatis terpotong dari sistem kartu inventori apotek. Struk dan nota kasir siap dicetak.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Data Pasien & Form Obat | Keranjang & Skrining */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Kolom Kiri: Input Pasien & Tambah Obat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card Pasien */}
          <div className="neo-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> {tipeTransaksi === 'Resep' ? 'Identitas Pasien Penebus' : 'Data Pembeli Bebas (OTC)'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tipeTransaksi === 'Resep' ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                      Pilih Data Pasien (Rekam Medis):
                    </label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value ? Number(e.target.value) : '')}
                      className="form-input-neo"
                      style={{ width: '100%', cursor: 'pointer' }}
                    >
                      <option value="">-- Pembeli Umum Tanpa Rekam Medis --</option>
                      {MOCK_PATIENTS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama} ({p.telepon}) - {p.alergi_obat.length > 0 ? `⚠️ Alergi: ${p.alergi_obat.join(', ')}` : 'Aman'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatient && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#FAF8F4',
                      borderRadius: '10px',
                      border: '1.5px solid #1E1E1E',
                      fontSize: '0.84rem'
                    }}>
                      <div style={{ fontWeight: 700 }}>Alamat: {selectedPatient.alamat}</div>
                      <div style={{ marginTop: '4px', color: '#DC2626', fontWeight: 700 }}>
                        Alergi Obat: {selectedPatient.alergi_obat.length > 0 ? selectedPatient.alergi_obat.join(', ') : 'Tidak ada catatan alergi'}
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                      Dokter Perujuk / Penulis Resep:
                    </label>
                    <input
                      type="text"
                      value={dokterPerujuk}
                      onChange={(e) => setDokterPerujuk(e.target.value)}
                      className="form-input-neo"
                      style={{ width: '100%' }}
                    />
                  </div>
                </>
              ) : (
                /* Penjualan Bebas (OTC): Input nama pasien dengan default 'unknown' */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563' }}>
                      Nama Pasien / Pembeli:
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                      Penjualan Langsung
                    </span>
                  </div>
                  <input
                    type="text"
                    value={nonResepNamaPasien}
                    onChange={(e) => setNonResepNamaPasien(e.target.value)}
                    placeholder="unknown"
                    className="form-input-neo"
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setNonResepNamaPasien('unknown')}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: '1px solid #1E1E1E',
                        backgroundColor: nonResepNamaPasien === 'unknown' ? '#FEF3D6' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      Set 'unknown'
                    </button>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                      *Default nama untuk pembeli umum OTC tanpa kartu pasien
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Tambah Item Obat */}
          <div className="neo-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} /> Masukkan Obat ke Resep / Keranjang
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                  Pilih Obat:
                </label>
                <select
                  value={addDrugId}
                  onChange={(e) => handleSelectDrugChange(Number(e.target.value))}
                  className="form-input-neo"
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  {AVAILABLE_MEDICINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} — Acuan: Rp {m.harga.toLocaleString('id-ID')} / {m.satuan} (Sisa: {m.stok})
                    </option>
                  ))}
                </select>
              </div>

              {/* Satuan & Harga Fleksibel / Placeholder */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Satuan Kemasan:
                  </label>
                  <select
                    value={addSatuan}
                    onChange={(e) => setAddSatuan(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%', cursor: 'pointer' }}
                  >
                    {PACKAGING_OPTIONS.map((pkg) => (
                      <option key={pkg} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563' }}>
                      Harga Jual (Rp):
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 700, backgroundColor: '#FEF3C7', padding: '1px 5px', borderRadius: '4px' }}>
                      Bisa diubah
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={addCustomPrice}
                    onChange={(e) => setAddCustomPrice(e.target.value)}
                    placeholder={`Contoh: ${currentSelectedMed.harga}`}
                    className="form-input-neo"
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', marginTop: '2px' }}>
                    *Harga acuan master: Rp {currentSelectedMed.harga.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Jumlah (Qty):
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={addQty}
                    onChange={(e) => setAddQty(Number(e.target.value))}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Signa (Aturan Pakai pada Etiket):
                  </label>
                  <input
                    type="text"
                    value={addSigna}
                    onChange={(e) => setAddSigna(e.target.value)}
                    placeholder="Contoh: 3 x 1 tablet sesudah makan"
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.8px solid #1E1E1E',
                  backgroundColor: '#FEF3D6',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '2px 2px 0px #1E1E1E'
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Tambahkan ke Keranjang
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Keranjang, Peringatan Klinis & Checkout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Peringatan Klinis Apoteker jika ada alergi / interaksi */}
          {allergyConflicts.length > 0 && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '2px solid #DC2626',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '2.5px 2.5px 0px #1E1E1E'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontWeight: 800, fontSize: '0.95rem' }}>
                <ShieldAlert size={20} />
                PERINGATAN KRITIS: KONTRAINDIKASI ALERGI!
              </div>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: '#7F1D1D' }}>
                Pasien <strong>{selectedPatient?.nama}</strong> tercatat memiliki alergi terhadap:{' '}
                <strong>{selectedPatient?.alergi_obat.join(', ')}</strong>. Segera konfirmasi ke dokter penulis resep sebelum meracik/menyerahkan!
              </p>
            </div>
          )}

          {interactionWarnings.length > 0 && (
            <div style={{
              backgroundColor: '#FEF3C7',
              border: '2px solid #D97706',
              borderRadius: '12px',
              padding: '14px 16px',
              boxShadow: '2.5px 2.5px 0px #1E1E1E'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 800, fontSize: '0.9rem' }}>
                <AlertTriangle size={18} />
                Deteksi Interaksi Obat (Farmakokinetik/Dinamik)
              </div>
              <ul style={{ margin: '6px 0 0 18px', padding: 0, fontSize: '0.82rem', color: '#78350F' }}>
                {interactionWarnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Rincian Resep / Keranjang */}
          <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Receipt size={20} /> Rincian Obat & Etiket Pasien
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '2px' }}>
                  Harga satuan dan jumlah dapat diubah langsung pada kolom di bawah
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#E0E7FF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #1E1E1E' }}>
                {cartItems.length} Obat Terinput
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '0.9rem' }}>
                Keranjang obat masih kosong. Silakan tambahkan obat dari panel sebelah kiri.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item) => (
                  <div
                    key={`${item.drug_id}-${item.satuan}`}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #1E1E1E',
                      backgroundColor: '#FAF8F4',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ flex: '1 1 200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#18181B' }}>
                          {item.drug_nama}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#FEF3D6',
                          border: '1px solid #1E1E1E',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          {item.satuan || 'Tablet'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
                        🔖 Etiket: {item.signa}
                      </div>
                    </div>

                    {/* Quick Edit Qty & Custom Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.68rem', color: '#6B7280', fontWeight: 700 }}>Qty:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.jumlah}
                          onChange={(e) => handleUpdateItemQty(item.drug_id, Number(e.target.value))}
                          style={{
                            width: '54px',
                            padding: '3px 6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1.5px solid #1E1E1E',
                            backgroundColor: '#FFFFFF',
                            textAlign: 'center'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.68rem', color: '#6B7280', fontWeight: 700 }}>Harga Satuan (Rp):</span>
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={item.harga}
                          onChange={(e) => handleUpdateItemPrice(item.drug_id, Number(e.target.value))}
                          style={{
                            width: '95px',
                            padding: '3px 6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1.5px solid #1E1E1E',
                            backgroundColor: '#FFFFFF'
                          }}
                        />
                      </div>

                      <div style={{ textAlign: 'right', minWidth: '90px' }}>
                        <span style={{ fontSize: '0.68rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>Subtotal:</span>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#18181B' }}>
                          Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.drug_id)}
                        title="Hapus Obat"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}


                {/* Total & Rincian Pembayaran */}
                <div style={{ marginTop: '16px', borderTop: '2px dashed #1E1E1E', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.9rem' }}>Subtotal Obat:</span>
                    <span style={{ fontWeight: 700 }}>Rp {subtotalObat.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 700, color: '#4B5563', fontSize: '0.9rem' }}>Biaya Pelayanan / Tuslah Resep:</span>
                    <span style={{ fontWeight: 700 }}>Rp {tuslah.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: 900, borderTop: '1.8px solid #1E1E1E', paddingTop: '12px' }}>
                    <span>TOTAL TAGIHAN:</span>
                    <span style={{ color: '#15803D' }}>
                      Rp {grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Pilihan Metode Pembayaran: Hanya QRIS & TUNAI */}
                  <div style={{ marginTop: '18px', padding: '16px', backgroundColor: '#FAF8F4', borderRadius: '12px', border: '1.8px solid #1E1E1E' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181B', display: 'block', marginBottom: '10px' }}>
                      Pilih Metode Pembayaran:
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                      {/* Pilihan QRIS */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('QRIS');
                          setPaymentError(null);
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: paymentMethod === 'QRIS' ? '2px solid #1E1E1E' : '1.5px solid #D1D5DB',
                          backgroundColor: paymentMethod === 'QRIS' ? '#FEF3D6' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          boxShadow: paymentMethod === 'QRIS' ? '2.5px 2.5px 0px #1E1E1E' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#E0F2FE',
                          border: '1px solid #1E1E1E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <QrCode size={18} color="#0284C7" />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#18181B' }}>QRIS</div>
                          <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Dinamis / Statis</div>
                        </div>
                      </button>

                      {/* Pilihan TUNAI */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('TUNAI');
                          setPaymentError(null);
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: paymentMethod === 'TUNAI' ? '2px solid #1E1E1E' : '1.5px solid #D1D5DB',
                          backgroundColor: paymentMethod === 'TUNAI' ? '#FEF3D6' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          boxShadow: paymentMethod === 'TUNAI' ? '2.5px 2.5px 0px #1E1E1E' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#DCFCE7',
                          border: '1px solid #1E1E1E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Banknote size={18} color="#15803D" />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#18181B' }}>Uang Tunai</div>
                          <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Cash Kasir</div>
                        </div>
                      </button>
                    </div>

                    {/* Rincian Spesifik Sesuai Metode */}
                    {paymentMethod === 'QRIS' ? (
                      <div style={{
                        padding: '12px',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #1E1E1E',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>Nominal Tagihan QRIS:</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0284C7' }}>
                            Rp {grandTotal.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <span style={{
                          backgroundColor: '#E0F2FE',
                          color: '#0369A1',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid #BAE6FD',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          ✓ Otomatis Pas Sesuai Tagihan
                        </span>
                      </div>
                    ) : (
                      /* Input Tunai dengan Validasi Nominal di Atas Total */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#18181B' }}>
                              Uang Tunai yang Dibayarkan (Rp):
                            </label>
                            <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                              Min: Rp {grandTotal.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <input
                            type="number"
                            min={grandTotal}
                            step={1000}
                            value={tunaiBayar}
                            onChange={(e) => {
                              setTunaiBayar(e.target.value);
                              setPaymentError(null);
                            }}
                            placeholder={`Masukkan minimal ${grandTotal}`}
                            className="form-input-neo"
                            style={{
                              width: '100%',
                              fontWeight: 800,
                              fontSize: '1.05rem',
                              borderColor: isTunaiKurang ? '#EF4444' : '#1E1E1E',
                              backgroundColor: isTunaiKurang ? '#FEF2F2' : '#FFFFFF'
                            }}
                          />
                        </div>

                        {/* Quick Cash Buttons */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setTunaiBayar(String(grandTotal))}
                            style={{
                              padding: '3px 8px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              borderRadius: '6px',
                              border: '1px solid #1E1E1E',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer'
                            }}
                          >
                            Uang Pas (Rp {grandTotal.toLocaleString('id-ID')})
                          </button>
                          {[50000, 100000, 200000].filter(n => n >= grandTotal).map(nom => (
                            <button
                              key={nom}
                              type="button"
                              onClick={() => setTunaiBayar(String(nom))}
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                borderRadius: '6px',
                                border: '1px solid #1E1E1E',
                                backgroundColor: '#FFFFFF',
                                cursor: 'pointer'
                              }}
                            >
                              Rp {nom.toLocaleString('id-ID')}
                            </button>
                          ))}
                        </div>

                        {/* Kalkulasi Kembalian atau Pesan Peringatan Nominal Kurang */}
                        {isTunaiKurang ? (
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#FEF2F2',
                            border: '1.5px solid #EF4444',
                            borderRadius: '8px',
                            color: '#B91C1C',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            ⚠️ Uang tunai kurang Rp {(grandTotal - nominalTunai).toLocaleString('id-ID')}. Inputan harus sama atau di atas total harga tagihan.
                          </div>
                        ) : (
                          <div style={{
                            padding: '10px 14px',
                            backgroundColor: '#DCFCE7',
                            border: '1.5px solid #15803D',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontWeight: 700, color: '#166534', fontSize: '0.85rem' }}>
                              Uang Kembalian:
                            </span>
                            <span style={{ fontWeight: 900, color: '#15803D', fontSize: '1.15rem' }}>
                              Rp {kembalian.toLocaleString('id-ID')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {paymentError && (
                    <div style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      backgroundColor: '#FEF2F2',
                      border: '1.5px solid #EF4444',
                      borderRadius: '8px',
                      color: '#B91C1C',
                      fontSize: '0.84rem',
                      fontWeight: 700
                    }}>
                      {paymentError}
                    </div>
                  )}

                  {/* Tombol Eksekusi Pembayaran */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
                    <button
                      onClick={handleCheckout}
                      disabled={paymentMethod === 'TUNAI' && isTunaiKurang}
                      style={{
                        flex: 1,
                        padding: '13px',
                        borderRadius: '12px',
                        border: '2px solid #1E1E1E',
                        backgroundColor: (paymentMethod === 'TUNAI' && isTunaiKurang) ? '#E5E7EB' : '#FEF3D6',
                        color: (paymentMethod === 'TUNAI' && isTunaiKurang) ? '#9CA3AF' : '#18181B',
                        fontWeight: 900,
                        fontSize: '1rem',
                        cursor: (paymentMethod === 'TUNAI' && isTunaiKurang) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: (paymentMethod === 'TUNAI' && isTunaiKurang) ? 'none' : '3px 3px 0px #1E1E1E',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Printer size={18} />
                      Bayar {paymentMethod} ({paymentMethod === 'QRIS' ? `Rp ${grandTotal.toLocaleString('id-ID')}` : (nominalTunai > 0 ? `Rp ${nominalTunai.toLocaleString('id-ID')}` : 'Tunai')}) & Cetak Nota
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
