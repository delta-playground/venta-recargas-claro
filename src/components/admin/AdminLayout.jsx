import { useState } from 'react'
import {
    LayoutDashboard,
    Users,
    Wallet,
    FileBarChart,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import Button from '../ui/Button'

function AdminLayout({ user, onLogout, children, activeSection, onNavigate }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inventory', label: 'Inventario', icon: Wallet },
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'reports', label: 'Reportes', icon: FileBarChart },
    ]

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>

            {/* Mobile Header - Always visible for now to ensure no logic errors */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                backgroundColor: 'var(--card-bg)',
                borderBottom: '1px solid var(--border-color)',
                // display: 'none' // Commented out to ensure visibility
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--primary)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '800'
                    }}>
                        IPA
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Admin</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                {isSidebarOpen && (
                    <aside
                        style={{
                            width: '260px',
                            backgroundColor: 'var(--card-bg)',
                            borderRight: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}
                    >
                        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'var(--primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '800',
                                fontSize: '1.2rem',
                                boxShadow: 'var(--shadow-md)',
                                flexShrink: 0
                            }}>
                                IPA
                            </div>
                            <div style={{ whiteSpace: 'nowrap' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Admin Panel</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Inv. Palo Alto</p>
                            </div>
                        </div>

                        <nav style={{ flex: 1, padding: '0 1rem' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {menuItems.map(item => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => onNavigate(item.id)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '12px 16px',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: 'none',
                                                    background: isActive ? 'var(--primary-light)' : 'transparent',
                                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                                    fontWeight: isActive ? 600 : 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'left',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                <item.icon size={20} />
                                                {item.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)', border: '1px solid var(--border-color)' }}>
                                    {user?.name.charAt(0)}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Administrador</p>
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)', // Subtle border
                                    background: 'transparent',
                                    color: 'var(--error)',
                                    fontWeight: 600, // Match menu active state
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                    fontSize: '0.95rem',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <LogOut size={20} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </aside>
                )}

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', position: 'relative' }}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
