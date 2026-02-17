import { useState, useEffect } from 'react'
import { Calendar, Search, FileText, Smartphone, Download, AlertCircle, Users, Filter } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { api } from '../../services/api'

function Reports() {
    // Default to today
    const today = new Date().toISOString().split('T')[0]
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)
    const [selectedVendor, setSelectedVendor] = useState('')
    const [vendors, setVendors] = useState([])

    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    useEffect(() => {
        loadVendors()
    }, [])

    const loadVendors = async () => {
        try {
            const data = await api.users.getVendors()
            setVendors(data)
        } catch (error) {
            console.error("Error loading vendors", error)
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        setSearched(true)
        try {
            const filters = {
                startDate,
                endDate,
                vendorId: selectedVendor || null // Pass null if empty to get all
            }
            const data = await api.reports.getTransactions(filters)
            setResults(data)
        } catch (error) {
            console.error("Error fetching report", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownload = () => {
        if (results.length === 0) return

        // CSV Header
        let csvContent = "data:text/csv;charset=utf-8,"
            + "ID Transaccion,Vendedor,Tipo,Detalle,Numero,Monto,Fecha,Estado\n"

        // CSV Rows
        results.forEach(row => {
            // Find vendor name if possible (optimization: could be better to map this once)
            const vendorName = vendors.find(v => v.id === row.vendorId)?.name || 'Desconocido'

            const rowData = [
                row.id,
                vendorName,
                row.type,
                row.name,
                row.target,
                row.amount,
                row.date.replace('T', ' '),
                row.status
            ]
            csvContent += rowData.join(",") + "\n"
        })

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `reporte_general_${startDate}_${endDate}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const totalSales = results.length
    const totalAmount = results.reduce((acc, curr) => acc + curr.amount, 0)

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Reportes Globales</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Consulta de transacciones de toda la red.</p>
            </header>

            <Card className="w-full" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                {/* Filters Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                    alignItems: 'end',
                    marginBottom: '1.5rem'
                }}>
                    {/* Vendor Filter */}
                    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Vendedor
                        </label>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={selectedVendor}
                                onChange={(e) => setSelectedVendor(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    paddingLeft: '40px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--card-bg)',
                                    color: 'var(--text-primary)',
                                    height: '48px',
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">Todos</option>
                                {vendors.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div>
                        <Input
                            type="date"
                            label="Fecha Inicio"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            icon={Calendar}
                            style={{ height: '48px' }}
                        />
                    </div>
                    <div>
                        <Input
                            type="date"
                            label="Fecha Fin"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            icon={Calendar}
                            style={{ height: '48px' }}
                        />
                    </div>
                </div>

                {/* Button Row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSearch} variant="primary" disabled={isLoading} style={{ minWidth: '200px', height: '48px' }}>
                        <Search size={18} style={{ marginRight: '8px' }} />
                        {isLoading ? 'Consultando...' : 'Generar Reporte'}
                    </Button>
                </div>
            </Card>

            {searched && (
                <div className="fade-in">
                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Transacciones</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalSales}</h3>
                            </div>
                        </Card>
                        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                <Download size={24} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Ventas</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>L.{totalAmount.toFixed(2)}</h3>
                            </div>
                        </Card>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Detalle de Transacciones</h3>
                        <Button
                            onClick={handleDownload}
                            variant="secondary"
                            disabled={results.length === 0}
                            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                        >
                            <Download size={16} style={{ marginRight: '8px' }} />
                            Exportar CSV
                        </Button>
                    </div>

                    <div style={{
                        overflowX: 'auto',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--card-bg)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <tr>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ID / Fecha</th>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Vendedor</th>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tipo / Detalle</th>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Número</th>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? (
                                    results.map(row => {
                                        const vendor = vendors.find(v => v.id === row.vendorId)
                                        return (
                                            <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{row.id}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.date.replace('T', ' ')}</div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{vendor ? vendor.name : 'Desconocido'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {row.vendorId?.replace('vendor-', '')}</div>
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '0.95rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            background: row.type === 'Recarga' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            color: row.type === 'Recarga' ? 'var(--success)' : '#3b82f6'
                                                        }}>
                                                            {row.type === 'Recarga' ? <Smartphone size={18} /> : <FileText size={18} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{row.type}</div>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{row.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{row.target}</td>
                                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>L.{row.amount.toFixed(2)}</td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ padding: '16px', borderRadius: '50%', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                                                    <Filter size={32} style={{ opacity: 0.5 }} />
                                                </div>
                                                <span style={{ fontSize: '1rem', fontWeight: 500 }}>No se encontraron registros.</span>
                                                <span style={{ fontSize: '0.85rem' }}>Prueba ajustando los filtros de fecha o vendedor.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Reports
