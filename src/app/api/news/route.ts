import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const apiKey = 'dc373b88c40444a192572152a8ce1680';

  // Filter Khusus: Seluruh berita WAJIB seputar kesehatan, medis, obat, atau farmasi di Indonesia
  const healthBaseScope = '(kesehatan OR medis OR dokter OR "rumah sakit" OR obat OR farmasi OR bpjs OR kemenkes OR apotek OR vaksin OR penyakit OR epidemiologi)';
  
  let subQuery = '';
  if (category === 'pharmacy') {
    subQuery = '(obat OR farmasi OR apotek OR "industri farmasi" OR "uji klinis" OR suplemen OR vaksin OR bpom)';
  } else if (category === 'disease') {
    subQuery = '(penyakit OR virus OR infeksi OR kanker OR jantung OR diabetes OR stroke OR gejala OR diagnosa)';
  } else if (category === 'hospital') {
    subQuery = '("rumah sakit" OR puskesmas OR faskes OR dokter OR perawat OR igd OR rawat OR operasi)';
  } else if (category === 'policy') {
    subQuery = '(kemenkes OR bpjs OR "menteri kesehatan" OR regulasi OR "kebijakan kesehatan" OR "iuran bpjs")';
  } else if (category === 'tech') {
    subQuery = '("teknologi kesehatan" OR "health tech" OR telemedicine OR "ai medis" OR inovasi OR bioteknologi)';
  }

  let finalQuery = healthBaseScope;
  if (subQuery) {
    finalQuery = `${healthBaseScope} AND ${subQuery}`;
  }

  // Jika ada kata kunci pencarian dari pengguna, gabungkan dengan cakupan kesehatan
  if (q.trim()) {
    finalQuery = `(${finalQuery}) AND (${q.trim()})`;
  }

  const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(finalQuery)}&searchIn=title,description&language=id&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 180 }, // Cache 3 menit
      headers: {
        'User-Agent': 'MediagnotekHealthPortal/1.0'
      }
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return NextResponse.json(
        { status: 'error', message: errJson.message || 'Gagal memuat berita dari NewsAPI' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Terjadi kesalahan server saat mengambil berita' },
      { status: 500 }
    );
  }
}
