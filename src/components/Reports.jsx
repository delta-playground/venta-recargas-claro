import { useState } from 'react'
import { Calendar, Search, FileText, Smartphone, Download, AlertCircle } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'

// Mock Data with specific dates for testing filtering
const FULL_MOCK_HISTORY = [
    { id: 'TXN-001', type: 'Recarga', name: 'Saldo Regular', target: '33998877', amount: 25, date: '2026-02-15T08:30:00', status: 'Exitoso' },
    { id: 'TXN-002', type: 'Paquete', name: 'Superpack 7 días', target: '99887766', amount: 110, date: '2026-02-15T09:15:00', status: 'Exitoso' },
    { id: 'TXN-003', type: 'Recarga', name: 'Saldo Regular', target: '88776655', amount: 50, date: '2026-02-15T10:45:00', status: 'Exitoso' },
    { id: 'TXN-004', type: 'Paquete', name: 'Internet 1 Día', target: '33221100', amount: 45, date: '2026-02-15T11:20:00', status: 'Exitoso' },
    { id: 'TXN-005', type: 'Recarga', name: 'Saldo Regular', target: '99112233', amount: 10, date: '2026-02-16T09:00:00', status: 'Exitoso' }, // Next day
    { id: 'TXN-006', type: 'Paquete', name: 'Todo Incluido', target: '33112233', amount: 300, date: '2026-02-14T15:00:00', status: 'Exitoso' }, // Previous day
]

function Reports() {
    // Default to today
    const today = new Date().toISOString().split('T')[0]
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)
    const [results, setResults] = useState([])
    const [searched, setSearched] = useState(false)

    const handleSearch = () => {
        setSearched(true)

        // Filter logic
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)

        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        const filtered = FULL_MOCK_HISTORY.filter(item => {
            const itemDate = new Date(item.date)
            return itemDate >= start && itemDate <= end
        })

        setResults(filtered)
    }

    const handleDownload = () => {
        if (results.length === 0) return

        // CSV Header
        let csvContent = "data:text/csv;charset=utf-8,"
            + "ID Transaccion,Tipo,Detalle,Numero,Monto,Fecha,Estado\n"

        // CSV Rows
        results.forEach(row => {
            const rowData = [
                row.id,
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
        link.setAttribute("download", `reporte_ventas_${startDate}_${endDate}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const totalSales = results.length
    const totalAmount = results.reduce((acc, curr) => acc + curr.amount, 0)

    return (
        <Card className="w-full max-w-5xl mx-auto">
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Histórico de Ventas</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Consulta y descarga tus transacciones.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                alignItems: 'end',
                marginBottom: '2rem'
            }}>
                <div style={{ marginBottom: 0 }}>
                    <Input
                        type="date"
                        label="Fecha Inicio"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        icon={Calendar}
                        style={{ height: '48px' }}
                    />
                </div>
                <div style={{ marginBottom: 0 }}>
                    <Input
                        type="date"
                        label="Fecha Fin"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        icon={Calendar}
                        style={{ height: '48px' }}
                    />
                </div>
                <div>
                    <div style={{ height: '48px', marginBottom: '1.5rem' }}>
                        <Button onClick={handleSearch} variant="primary" fullWidth>
                            <Search size={20} style={{ marginRight: '8px' }} />
                            Consultar
                        </Button>
                    </div>
                </div>
            </div>

            {searched && (
                <div className="fade-in">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Resultados</h3>
                        <Button
                            onClick={handleDownload}
                            variant="secondary"
                            disabled={results.length === 0}
                            style={{ padding: '8px 16px', fontSize: '0.9rem', opacity: results.length === 0 ? 0.5 : 1 }}
                        >
                            <Download size={16} style={{ marginRight: '8px' }} />
                            Descargar Reporte
                        </Button>
                    </div>

                    <div style={{
                        overflowX: 'auto',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)',
                        marginBottom: '1rem',
                        background: 'var(--card-bg)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                            <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <tr>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ID Transacción</th>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tipo / Detalle</th>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Número</th>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Fecha</th>
                                    <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? (
                                    results.map(row => (
                                        <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '16px', fontWeight: 500, fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                                {row.id}
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
                                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{row.type}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{row.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', fontWeight: 500 }}>{row.target}</td>
                                            <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                {row.date.replace('T', ' ')}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>L.{row.amount.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                                <AlertCircle size={32} style={{ opacity: 0.5 }} />
                                                <span>No se encontraron registros en este rango de fechas.</span>
                                                <span style={{ fontSize: '0.85rem' }}>Intenta con otro rango (ej: 2026-02-15).</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        background: 'var(--bg-color)',
                        padding: '20px',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Transacciones: <strong>{totalSales}</strong>
                        </div>
                        <div style={{ fontSize: '1.2rem' }}>
                            Total Vendido: <strong style={{ color: 'var(--primary)' }}>L.{totalAmount.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

export default Reports
