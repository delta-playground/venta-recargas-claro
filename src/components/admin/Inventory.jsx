import { useState, useEffect } from 'react'
import { DollarSign, Send, Users, Search, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { api } from '../../services/api'

function Inventory({ user }) {
    const [vendors, setVendors] = useState([])
    const [globalBalance, setGlobalBalance] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    // Transfer State
    const [selectedVendor, setSelectedVendor] = useState('')
    const [amount, setAmount] = useState('')
    const [transferStatus, setTransferStatus] = useState({ type: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [vendorsData, balanceData] = await Promise.all([
                api.users.getVendors(),
                api.inventory.getGlobalBalance()
            ])
            setVendors(vendorsData)
            setGlobalBalance(balanceData)
        } catch (error) {
            console.error("Error loading inventory data", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleTransfer = async (e) => {
        e.preventDefault()
        console.log("Transfer requested:", { selectedVendor, amount, user })

        if (!selectedVendor || !amount || parseFloat(amount) <= 0) {
            console.log("Validation failed")
            setTransferStatus({ type: 'error', message: 'Por favor seleccione un vendedor y un monto válido.' })
            return
        }

        setIsSubmitting(true)
        setTransferStatus({ type: '', message: '' })

        try {
            console.log("Calling API...")
            const result = await api.inventory.transfer(user.id, selectedVendor, amount)
            console.log("API Result:", result)


            // Update local state on success
            setGlobalBalance(result.newGlobalBalance)
            setVendors(prev => prev.map(v =>
                v.id === selectedVendor ? { ...v, balance: result.newVendorBalance } : v
            ))

            setTransferStatus({ type: 'success', message: `¡Transferencia exitosa! Nuevo saldo global: L${result.newGlobalBalance.toFixed(2)}` })
            setAmount('')
            setSelectedVendor('')

            // Clear success message after 3 seconds
            setTimeout(() => setTransferStatus({ type: '', message: '' }), 3000)

        } catch (error) {
            setTransferStatus({ type: 'error', message: error.message || 'Error al realizar la transferencia.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Gestión de Inventario</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Administración de saldo y distribución a vendedores</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Global Balance Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Card style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--primary), #EA580C)', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                                <DollarSign size={24} color="white" />
                            </div>
                            <span style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.9 }}>Saldo Global Disponible</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                            L{globalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                            Actualizado al momento
                        </p>
                    </Card>

                    {/* Transfer Form */}
                    <Card style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Send size={20} color="var(--primary)" />
                            Transferir Saldo
                        </h3>

                        <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                    Seleccionar Vendedor
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={selectedVendor}
                                        onChange={(e) => setSelectedVendor(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)',
                                            fontSize: '1rem',
                                            backgroundColor: 'var(--card-bg)',
                                            color: 'var(--text-primary)',
                                            appearance: 'none',
                                            cursor: 'pointer'
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        <option value="">-- Seleccionar --</option>
                                        {vendors.map(v => (
                                            <option key={v.id} value={v.id}>
                                                {v.name} (Saldo: L{v.balance?.toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                    <Users size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                                </div>
                            </div>

                            <Input
                                label="Monto a Transferir (L)"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                icon={DollarSign}
                                disabled={isSubmitting}
                            />

                            {transferStatus.message && (
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: transferStatus.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: transferStatus.type === 'error' ? 'var(--error)' : 'var(--success)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.9rem'
                                }}>
                                    {transferStatus.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                                    {transferStatus.message}
                                </div>
                            )}

                            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting || !selectedVendor || !amount}>
                                {isSubmitting ? 'Procesando...' : 'Confirmar Transferencia'}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Vendors List */}
                <Card style={{ padding: '2rem', height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Vendedores Activos</h3>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '12px' }}>
                            {vendors.length} Total
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {vendors.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No hay vendedores registrados.</p>
                        ) : (
                            vendors.map(vendor => (
                                <div key={vendor.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: '#DBEAFE',
                                            color: '#3B82F6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {vendor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{vendor.name}</p>
                                            <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>{vendor.email}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>L{vendor.balance?.toFixed(2)}</p>
                                        <p style={{ fontSize: '0.75rem', margin: 0, color: vendor.balance < (vendor.lowBalanceThreshold || 100) ? 'var(--error)' : 'var(--success)' }}>
                                            {vendor.balance < (vendor.lowBalanceThreshold || 100) ? 'Saldo Bajo' : 'Activo'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Inventory
