import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Smartphone, Package, KeyRound, FileBarChart } from 'lucide-react'
import './index.css'
import Recharges from './components/Recharges'
import Packages from './components/Packages'
import PinChange from './components/PinChange'
import Reports from './components/Reports'

import Login from './components/Login'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/Dashboard'
import Inventory from './components/admin/Inventory'
import UserManagement from './components/admin/UserManagement'
import AdminReports from './components/admin/Reports' // Admin Reports Component
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [user, setUser] = useState(null) // Changed from boolean isLoggedIn to object
  const [activeTab, setActiveTab] = useState('recargas')
  const [theme, setTheme] = useState('light')

  const [adminSection, setAdminSection] = useState('dashboard')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const tabs = [
    { id: 'recargas', label: 'Recargas', icon: Smartphone },
    { id: 'paquetes', label: 'Paquetes', icon: Package },
    { id: 'reporteria', label: 'Reportería', icon: FileBarChart },
    { id: 'pin', label: 'Cambiar PIN', icon: KeyRound },
  ]

  if (!user) {
    return (
      <div className="app-container">
        <Login onLogin={(userData) => setUser(userData)} />
      </div>
    )
  }

  // Admin Role Rendering
  if (user.role === 'admin') {
    try {
      const renderAdminContent = () => {
        switch (adminSection) {
          case 'dashboard': return <Dashboard onNavigate={setAdminSection} />
          case 'inventory': return <Inventory user={user} />
          case 'users': return <UserManagement />
          case 'users': return <UserManagement />
          case 'reports': return <AdminReports />
          default: return <Dashboard onNavigate={setAdminSection} />
        }
      }

      return (
        <AdminLayout
          user={user}
          onLogout={() => setUser(null)}
          activeSection={adminSection}
          onNavigate={setAdminSection}
        >
          <ErrorBoundary>
            {renderAdminContent()}
          </ErrorBoundary>
        </AdminLayout>
      )
    } catch (error) {
      return <div style={{ color: 'red' }}>Error Rendering Admin Panel: {error.message}</div>
    }
  }

  return (
    <div className="app-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', minHeight: '100vh' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem 0'
      }}>
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: 'var(--primary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '800',
            fontSize: '1.2rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            IPA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, lineHeight: 1.1, color: 'var(--text-primary)' }}>
              Venta de Recargas
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Inversiones Palo Alto
            </span>
          </div>
        </div>

        {/* User Info Removed */}

        {/* Actions Section */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              transition: 'all 0.2s'
            }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <nav style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        background: 'var(--card-bg)',
        padding: '6px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        width: 'fit-content',
        margin: '0 auto 40px auto'
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-secondary)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* User Info Section - Relocated */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          background: 'var(--card-bg)',
          padding: '10px 30px',
          borderRadius: '50px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Vendedor: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>151104</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            L966.00 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>↻</span>
          </div>
        </div>
      </div>

      <main style={{ position: 'relative' }}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'recargas' && <Recharges />}
            {activeTab === 'paquetes' && <Packages />}
            {activeTab === 'reporteria' && <Reports />}
            {activeTab === 'pin' && <PinChange />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{
        textAlign: 'center',
        marginTop: '60px',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem'
      }}>
        © 2026 Claro Honduras. Todos los derechos reservados.
      </footer>
    </div>
  )
}

export default App
