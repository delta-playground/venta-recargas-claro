import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Users, AlertCircle, Wallet } from 'lucide-react'
import Card from '../ui/Card'
import { api } from '../../services/api'
import Button from '../ui/Button'

function Dashboard({ onNavigate }) {
    const [stats, setStats] = useState({
        globalBalance: 0,
        activeVendors: 0,
        lowBalanceVendors: 0,
        dailySales: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            // Mock data loading
            const balance = await api.inventory.getGlobalBalance()
            // In a real app we would have endpoints for these stats
            setStats({
                globalBalance: typeof balance === 'number' ? balance : 0,
                activeVendors: 2, // Mock
                lowBalanceVendors: 0, // Mock
                dailySales: 15430.00 // Mock
            })
        } catch (error) {
            console.error("Error loading stats", error)
            // Fallback to 0 to prevent crash
            setStats({
                globalBalance: 0,
                activeVendors: 0,
                lowBalanceVendors: 0,
                dailySales: 0
            })
        } finally {
            setIsLoading(false)
        }
    }

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{title}</span>
                <div style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: color + '20', // 20% opacity 
                    color: color
                }}>
                    <Icon size={20} />
                </div>
            </div>
            <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {value}
                </h3>
                {subtext && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{subtext}</p>}
            </div>
        </Card>
    )

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Resumen general de Inversiones Palo Alto</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    title="Saldo Global"
                    value={isLoading ? "..." : `L${stats.globalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    color="#F97316" // Orange
                    subtext="Disponible para asignar"
                />
                <StatCard
                    title="Ventas del Día"
                    value={isLoading ? "..." : `L${stats.dailySales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    icon={TrendingUp}
                    color="#10B981" // Green
                    subtext="+12% vs ayer"
                />
                <StatCard
                    title="Vendedores Activos"
                    value={stats.activeVendors}
                    icon={Users}
                    color="#3B82F6" // Blue
                    subtext="Total registrados: 2"
                />
                <StatCard
                    title="Alertas de Saldo"
                    value={stats.lowBalanceVendors}
                    icon={AlertCircle}
                    color="#EF4444" // Red
                    subtext="Vendedores con saldo bajo"
                />
            </div>

            {/* Quick Actions */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Acciones Rápidas</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button variant="primary" onClick={() => onNavigate('inventory')}>
                    <Wallet size={18} style={{ marginRight: '8px' }} />
                    Enviar Saldo a Vendedor
                </Button>
                <Button variant="secondary" onClick={() => onNavigate('users')}>
                    <Users size={18} style={{ marginRight: '8px' }} />
                    Gestionar Vendedores
                </Button>
            </div>
        </div>
    )
}

export default Dashboard
