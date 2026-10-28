import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';
  const q = searchParams.get('q') || '';
  const apiKey = 'dc373b88c40444a192572152a8ce1680';

  let apiUrl = `https://newsapi.org/v2/top-headlines?country=id&apiKey=${apiKey}`;

  if (category && category !== 'all') {
    apiUrl += `&category=${encodeURIComponent(category)}`;
  }

  if (q.trim()) {
    apiUrl += `&q=${encodeURIComponent(q.trim())}`;
  }

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Cache selama 5 menit
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
