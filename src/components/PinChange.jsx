import { useState } from 'react'
import { Lock, KeyRound } from 'lucide-react'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'

function PinChange() {
    const [oldPin, setOldPin] = useState('')
    const [newPin, setNewPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuccess('')
        if (!oldPin || !newPin || !confirmPin) {
            setError('Por favor complete todos los campos')
            return
        }
        if (newPin !== confirmPin) {
            setError('El nuevo PIN no coincide')
            return
        }
        if (newPin.length < 4) {
            setError('El PIN debe tener al menos 4 dígitos')
            return
        }

        // Simulate API call
        setError('')
        setSuccess('¡PIN cambiado exitosamente!')
        setOldPin('')
        setNewPin('')
        setConfirmPin('')

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000)
    }

    return (
        <Card>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Cambio de PIN</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Actualiza tu clave de seguridad.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <Input
                    label="PIN Actual"
                    placeholder="****"
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                    type="password"
                    maxLength={6}
                    icon={Lock}
                />

                <Input
                    label="Nuevo PIN"
                    placeholder="****"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    type="password"
                    maxLength={6}
                    icon={KeyRound}
                />

                <Input
                    label="Confirmar Nuevo PIN"
                    placeholder="****"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    type="password"
                    maxLength={6}
                    icon={KeyRound}
                />

                {error && <p style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                {success && <p style={{ color: 'var(--success)', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{success}</p>}

                <div style={{ marginTop: '1.5rem' }}>
                    <Button type="submit" fullWidth>
                        Actualizar PIN
                    </Button>
                </div>
            </form>
        </Card>
    )
}

export default PinChange
