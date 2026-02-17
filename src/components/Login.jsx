import { useState } from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'
import { api } from '../services/api'

function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Por favor ingrese sus credenciales.')
            return
        }

        setIsLoading(true)

        try {
            const user = await api.auth.login(email, password)
            onLogin(user)
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="animate-gradient" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
            // backgroundColor removed to allow gradient
        }}>
            <Card className="fade-in" style={{
                width: '100%',
                maxWidth: '550px', // Wider (was max-w-md/448px approx)
                padding: '30px 40px' // Less vertical padding, adequate horizontal
            }}>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '56px', // Slightly smaller logo
                        height: '56px',
                        background: 'var(--primary)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '1.5rem',
                        boxShadow: 'var(--shadow-md)',
                        margin: '0 auto 15px auto'
                    }}>
                        IPA
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 5px 0', color: 'var(--text-primary)' }}>
                        Bienvenido
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Inversiones Palo Alto
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        label="Correo Electrónico"
                        placeholder="ejemplo@paloaltohn.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={Mail}
                        autoFocus
                    />

                    <Input
                        type="password"
                        label="Contraseña"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                    />

                    {error && (
                        <div style={{
                            color: 'var(--error)',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            marginBottom: '1rem',
                            fontWeight: 500
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginTop: '2rem' }}>
                        <Button type="submit" fullWidth disabled={isLoading} variant="primary">
                            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                            {!isLoading && <LogIn size={20} style={{ marginLeft: '8px' }} />}
                        </Button>
                    </div>
                </form>

                {/* Footer / Contact Admin */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        ¿Olvidaste tu contraseña?
                    </p>
                    <p style={{ fontSize: '0.85rem' }}>
                        Contáctese con su administrador:
                        <br />
                        <a
                            href="mailto:encargado.it@paloaltohn.com"
                            style={{
                                color: 'var(--primary)',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-block',
                                marginTop: '4px'
                            }}
                        >
                            encargado.it@paloaltohn.com
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default Login
