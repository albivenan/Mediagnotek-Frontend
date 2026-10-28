import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const q = searchParams.get('q') || '';
  const apiKey = 'dc373b88c40444a192572152a8ce1680';

  // Pemetaan kata kunci pencarian berita Indonesia berdasarkan kategori
  let queryKeyword = 'indonesia';
  if (category === 'health') {
    queryKeyword = 'kesehatan OR medis OR dokter OR rumah sakit OR obat OR bpjs';
  } else if (category === 'science') {
    queryKeyword = 'sains OR farmasi OR riset OR teknologi kesehatan';
  } else if (category === 'technology') {
    queryKeyword = 'teknologi OR digital OR ai OR startup';
  } else if (category === 'business') {
    queryKeyword = 'bisnis OR ekonomi OR pasar OR finansial';
  } else if (category === 'general') {
    queryKeyword = 'indonesia OR nasional OR masyarakat';
  }

  // Jika pengguna memasukkan kata kunci pencarian spesifik
  if (q.trim()) {
    queryKeyword = `(${queryKeyword}) AND (${q.trim()})`;
  }

  const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(queryKeyword)}&language=id&sortBy=publishedAt&pageSize=40&apiKey=${apiKey}`;

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
