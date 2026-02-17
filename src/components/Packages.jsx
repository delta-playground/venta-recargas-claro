import { useState } from 'react'
import { Phone, Package } from 'lucide-react'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'
import ConfirmationModal from './ConfirmationModal'

import { Filter } from 'lucide-react'

// Extended Data Structure
const CATEGORIES = [
    { id: 'todo_incluido', label: 'TODO INCLUIDO' },
    { id: 'internet', label: 'INTERNET' },
    { id: 'minutos', label: 'MINUTOS' },
    { id: 'redes_sociales', label: 'REDES SOCIALES' },
]

const PACKAGES_BY_CATEGORY = {
    'todo_incluido': [
        { id: 'sb_1d', name: 'Superpack 1 día - L.25', price: 25 },
        { id: 'sb_3d', name: 'Superpack 3 días - L.50', price: 50 },
        { id: 'sb_7d', name: 'Superpack 7 días - L.110', price: 110 },
    ],
    'internet': [
        { id: 'int_1d', name: 'Internet 1 día - L.20', price: 20 },
        { id: 'int_5gb', name: '5GB - 3 días - L.45', price: 45 },
    ],
    'minutos': [
        { id: 'voice_unlim', name: 'Llamadas Ilimitadas - L.40', price: 40 },
    ],
    'redes_sociales': [
        { id: 'fb_unlim', name: 'Facebook Ilimitado - L.15', price: 15 },
    ]
}

function Packages() {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id)
    const [selectedPackage, setSelectedPackage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState('')

    // Derived state: available packages based on category
    const availablePackages = PACKAGES_BY_CATEGORY[selectedCategory] || []

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!phoneNumber || !selectedPackage) {
            setError('Por favor complete todos los campos')
            return
        }
        setError('')
        setIsModalOpen(true)
    }

    const handleConfirm = () => {
        const pkg = availablePackages.find(p => p.id === selectedPackage)
        alert(`Paquete "${pkg?.name}" activado param el ${phoneNumber} exitosamente!`)
        setIsModalOpen(false)
        setPhoneNumber('')
        setSelectedPackage('')
    }

    const selectedPkgDetails = availablePackages.find(p => p.id === selectedPackage)

    return (
        <>
            <Card>
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Paquetes</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Activa planes de data y voz.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Número de Teléfono"
                        placeholder="Ej: 33123456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type="tel"
                        maxLength={8}
                        icon={Phone}
                    />

                    {/* Category Filter */}
                    <div className="mb-4 w-full" style={{ marginBottom: '1.5rem' }}>
                        <label className="block text-sm font-medium mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            Tipo de Paquete
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '16px', // Matched Input padding
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)',
                                pointerEvents: 'none',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Filter size={18} />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value)
                                    setSelectedPackage('')
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    paddingLeft: '44px', // Icon spacing
                                    height: '48px', // Enforce height
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--card-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 w-full" style={{ marginBottom: '1.5rem' }}>
                        <label className="block text-sm font-medium mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            Seleccionar Paquete
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)',
                                pointerEvents: 'none',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Package size={18} />
                            </div>
                            <select
                                value={selectedPackage}
                                onChange={(e) => setSelectedPackage(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    paddingLeft: '44px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--card-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="">-- Seleccione un paquete --</option>
                                {availablePackages.map(pkg => (
                                    <option key={pkg.id} value={pkg.id}>
                                        {pkg.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {error && <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 500 }}>{error}</p>}
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <Button type="submit" fullWidth>
                            Activar Paquete
                        </Button>
                    </div>
                </form>
            </Card>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                title="Confirmar Activación"
            >
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>Paquete seleccionado</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', margin: '10px 0' }}>
                        {selectedPkgDetails?.name}
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>para el número <strong>{phoneNumber}</strong></p>
                </div>
            </ConfirmationModal>
        </>
    )
}

export default Packages
