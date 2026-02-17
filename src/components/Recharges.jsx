import { useState } from 'react'
import { Phone, DollarSign } from 'lucide-react'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'
import ConfirmationModal from './ConfirmationModal'

function Recharges() {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [amount, setAmount] = useState('')
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleAmountChange = (e) => {
        const val = e.target.value
        setAmount(val)
        if (val && val % 5 !== 0) {
            setError('El monto debe ser múltiplo de 5 (ej: 5, 10, 15...)')
        } else {
            setError('')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!phoneNumber || !amount) {
            setError('Por favor complete todos los campos')
            return
        }
        if (amount % 5 !== 0) {
            setError('El monto debe ser múltiplo de 5')
            return
        }
        setError('')
        setIsModalOpen(true)
    }

    const handleConfirm = () => {
        alert(`Recarga de L.${amount} enviada al ${phoneNumber} exitosamente!`)
        setIsModalOpen(false)
        setPhoneNumber('')
        setAmount('')
    }

    return (
        <>
            <Card>
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Recargas</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ingresa los detalles para enviar saldo.</p>
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

                    <Input
                        label="Monto de Recarga"
                        placeholder="Múltiplos de 5"
                        value={amount}
                        onChange={handleAmountChange}
                        type="number"
                        min="5"
                        step="5"
                        icon={DollarSign}
                        error={error}
                    />

                    <div style={{ marginTop: '1.5rem' }}>
                        <Button type="submit" fullWidth>
                            Enviar Recarga
                        </Button>
                    </div>
                </form>
            </Card>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                title="Confirmar Recarga"
            >
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>Vas a enviar</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--claro-red)', margin: 0 }}>L.{amount}</p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>al número <strong>{phoneNumber}</strong></p>
                </div>
            </ConfirmationModal>
        </>
    )
}

export default Recharges
