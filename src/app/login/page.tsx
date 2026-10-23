'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  KeyRound,
  Mail,
  Building2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--warm-bg)',
      color: 'var(--warm-text)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative'
    }}>
      {/* Background Decorative Neo Elements */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px'
      }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1.8px solid #1E1E1E',
          backgroundColor: '#FFFFFF',
          color: '#18181B',
          fontWeight: 700,
          fontSize: '0.86rem',
          textDecoration: 'none',
          boxShadow: '2px 2px 0px #1E1E1E'
        }}>
          <ArrowLeft size={16} strokeWidth={2.4} />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Main Login Neo Card */}
      <div className="neo-card" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '36px 32px',
        backgroundColor: '#FFFFFF',
        boxShadow: '4px 5px 0px #1E1E1E',
        borderRadius: '18px',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#FEF3D6',
            border: '2px solid #1E1E1E',
            boxShadow: '2px 2.5px 0px #1E1E1E',
            marginBottom: '14px'
          }}>
            {/* MediagnoTek 6-dots mark */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1E1E1E">
              <circle cx="6" cy="6" r="2.5" />
              <circle cx="12" cy="6" r="2.5" />
              <circle cx="18" cy="6" r="2.5" />
              <circle cx="6" cy="14" r="2.5" />
              <circle cx="12" cy="14" r="2.5" />
              <circle cx="18" cy="14" r="2.5" />
            </svg>
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 900,
            color: '#18181B',
            letterSpacing: '-0.5px',
            marginBottom: '6px'
          }}>
            Login Portal Fasilitas Kesehatan
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.88rem', margin: 0 }}>
            Masuk ke portal operasional Apotek, Klinik, & Rumah Sakit
          </p>
        </div>

        {/* Google SSO Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '12px',
            border: '1.8px solid #1E1E1E',
            backgroundColor: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.92rem',
            color: '#18181B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '2.5px 2.5px 0px #1E1E1E',
            marginBottom: '18px',
            transition: 'all 0.1s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.99 0 12s.45 3.84 1.25 5.43l4.03-3.14z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z" />
          </svg>
          <span>Masuk dengan Akun Google</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '18px 0',
          color: '#9CA3AF',
          fontSize: '0.78rem',
          fontWeight: 700
        }}>
          <div style={{ flex: 1, height: '1.2px', backgroundColor: '#E5E7EB' }} />
          <span style={{ padding: '0 10px', textTransform: 'uppercase' }}>atau email terdaftar</span>
          <div style={{ flex: 1, height: '1.2px', backgroundColor: '#E5E7EB' }} />
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '6px' }}>
              Email Resmi Faskes *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6B7280' }} />
              <input
                id="email"
                type="email"
                required
                placeholder="faskes@apoteksehat.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input-neo"
                style={{ width: '100%', paddingLeft: '36px' }}
              />
            </div>
          </div>

          {/* Kata Sandi Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label htmlFor="password" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#18181B' }}>
                Kata Sandi *
              </label>
              <a href="#" style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700, textDecoration: 'underline' }}>
                Lupa sandi?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6B7280' }} />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input-neo"
                style={{ width: '100%', paddingLeft: '36px' }}
              />
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="remember"
              defaultChecked
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#18181B',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.82rem', color: '#4B5563', fontWeight: 600, cursor: 'pointer' }}>
              Ingat sesi login di perangkat ini
            </label>
          </div>

          {/* Submit Button Neo */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '6px',
              padding: '13px',
              borderRadius: '12px',
              border: '2px solid #1E1E1E',
              backgroundColor: '#FEF3D6',
              fontWeight: 900,
              fontSize: '0.96rem',
              color: '#18181B',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '3px 3px 0px #1E1E1E',
              transition: 'all 0.15s ease'
            }}
          >
            <LogIn size={18} strokeWidth={2.4} />
            <span>{isLoading ? 'Memvalidasi Kredensial...' : 'Masuk ke Dashboard Faskes'}</span>
          </button>
        </form>

        {/* Register Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1.5px dashed #D1D5DB',
          fontSize: '0.86rem',
          color: '#6B7280'
        }}>
          Fasilitas kesehatan belum terdaftar?{' '}
          <Link href="/register" style={{ color: '#18181B', fontWeight: 800, textDecoration: 'underline' }}>
            Daftar Akun Faskes Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
