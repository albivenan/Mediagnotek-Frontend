'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Dna,
  Pill,
  Microscope,
  Bot,
  Zap,
  Package,
  LineChart,
  Users,
  ShoppingCart,
  History,
  AlertTriangle,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
  Wallet
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navSections = [
    {
      title: 'Pelayanan Apotek (Front Office)',
      items: [
        { label: 'Overview Apotek', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Kasir & Resep (POS)', href: '/dashboard/kasir', icon: ShoppingCart },
        { label: 'Buku Data Pasien', href: '/dashboard/pasien', icon: Users },
      ]
    },
    {
      title: 'Inventori & Logistik (Back Office)',
      items: [
        {
          label: 'Stok & FEFO Obat',
          href: '/dashboard/stok',
          icon: Package,
          badge: '2 Exp',
          badgeColor: '#EF4444'
        },
        { label: 'Katalog Farmasi', href: '/dashboard/obat', icon: Pill },
      ]
    },
    {
      title: 'Klinis & Konseling AI',
      items: [
        { label: 'Asisten AI Apoteker', href: '/dashboard/ai-analisa', icon: Bot },
      ]
    },
    {
      title: 'Laporan & Tren',
      items: [
        { label: 'Analisa & Visual', href: '/dashboard/visual', icon: LineChart },
        { label: 'Laporan Keuangan', href: '/dashboard/keuangan', icon: Wallet },
      ]
    }
  ];

  const allNavItems = navSections.flatMap((s) => s.items);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: 'var(--warm-bg)',
      color: 'var(--warm-text)',
      position: 'relative'
    }}>
      {/* Backdrop overlay saat sidebar terbuka di layar mobile / tablet */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="dashboard-sidebar-backdrop"
          title="Tutup Menu"
        />
      )}

      {/* Sidebar in Neo-Brutalist Style with Fixed Height & Collapsible Toggle */}
      <aside
        className={`dashboard-sidebar-drawer ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: sidebarOpen ? '280px' : '0px',
          minWidth: sidebarOpen ? '280px' : '0px',
          backgroundColor: '#FFFFFF',
          borderRight: sidebarOpen ? '1.8px solid #1E1E1E' : 'none',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          zIndex: 50,
          flexShrink: 0,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          visibility: sidebarOpen ? 'visible' : 'hidden',
          whiteSpace: 'nowrap'
        }}
      >
        {/* Sidebar Brand Logo & Close Toggle */}
        <div style={{
          padding: '18px 16px',
          borderBottom: '1.8px solid #1E1E1E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minWidth: 0 }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FEF3D6',
              border: '1.8px solid #1E1E1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '1.5px 2px 0px #1E1E1E',
              flexShrink: 0
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#1E1E1E">
                <circle cx="6" cy="6" r="2.5" />
                <circle cx="12" cy="6" r="2.5" />
                <circle cx="18" cy="6" r="2.5" />
                <circle cx="6" cy="14" r="2.5" />
                <circle cx="12" cy="14" r="2.5" />
                <circle cx="18" cy="14" r="2.5" />
              </svg>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181B', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
                MediagnoTek
              </div>
              <div style={{ fontSize: '0.68rem', color: '#166534', marginTop: '3px', fontWeight: 700 }}>
                ● Pharmacy Management
              </div>
            </div>
          </Link>

          {/* Toggle Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            title="Tutup Sidebar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1.5px solid #1E1E1E',
              backgroundColor: '#FAF8F4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#18181B',
              boxShadow: '1px 1px 0px #1E1E1E',
              flexShrink: 0
            }}
          >
            <PanelLeftClose size={18} strokeWidth={2.2} />
          </button>
        </div>


        {/* Sidebar Navigation Menu - Grouped clean scroll */}
        <nav style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto'
        }}>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#9CA3AF',
                padding: '0 12px 4px 12px',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                {section.title}
              </div>

              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? '#18181B' : '#4B5563',
                      backgroundColor: isActive ? '#FEF3D6' : 'transparent',
                      border: isActive ? '1.8px solid #1E1E1E' : '1.8px solid transparent',
                      boxShadow: isActive ? '2px 2px 0px #1E1E1E' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconComponent
                        size={18}
                        strokeWidth={isActive ? 2.3 : 1.9}
                        style={{
                          color: isActive ? '#18181B' : '#4B5563',
                          flexShrink: 0
                        }}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span style={{
                        backgroundColor: item.badgeColor || '#DC2626',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        border: '1px solid #1E1E1E'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div style={{ padding: '16px', borderTop: '1.8px solid #1E1E1E' }}>
          <div style={{
            padding: '12px',
            backgroundColor: '#FAF8F4',
            border: '1.5px solid #1E1E1E',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '1.5px 2px 0px #1E1E1E'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#DCFCE7',
              border: '1.5px solid #1E1E1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#166534',
              fontSize: '0.82rem',
              boxShadow: '1px 1px 0px #1E1E1E',
              flexShrink: 0
            }}>
              🏥
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Apotek Sehat Farma
              </div>
              <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>
                ● Admin Faskes Resmi
              </div>
            </div>
            <Link href="/" title="Keluar ke Landing Page" style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              border: '1.2px solid #1E1E1E',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#18181B',
              textDecoration: 'none'
            }}>
              <LogOut size={15} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace - Independent scroll area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Top Header */}
        <header
          className="dashboard-top-header"
          style={{
            height: '66px',
            minHeight: '66px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1.8px solid #1E1E1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Toggle Button: Muncul selalu di mobile atau jika sidebar tertutup */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Tutup Sidebar Menu" : "Buka Sidebar Menu"}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '10px',
                border: '1.8px solid #1E1E1E',
                backgroundColor: '#FEF3D6',
                color: '#18181B',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}
            >
              {sidebarOpen ? <PanelLeftClose size={17} strokeWidth={2.2} /> : <PanelLeft size={17} strokeWidth={2.2} />}
              <span>Menu</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="header-breadcrumb-prefix" style={{ fontSize: '0.88rem', color: '#6B7280', fontWeight: 500 }}>Dashboard /</span>
              <span style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#18181B',
                backgroundColor: '#FEF3D6',
                border: '1.2px solid #1E1E1E',
                padding: '3px 10px',
                borderRadius: '9999px',
                maxWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {allNavItems.find(n => n.href === pathname)?.label || 'Overview Apotek'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              className="header-badge-status"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: '#DCFCE7',
                border: '1.5px solid #1E1E1E',
                color: '#166534',
                fontSize: '0.78rem',
                fontWeight: 700,
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}
            >
              ● FastAPI Connected
            </div>
            <Link
              href="/"
              className="nav-pill-login"
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap'
              }}
            >
              Landing Page
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main
          className="dashboard-main-content"
          style={{
            flex: 1,
            padding: '28px',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

