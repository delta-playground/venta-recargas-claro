import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Plus, Edit, Trash2, Search, User, Mail, Shield, Check, X } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { api } from '../../services/api'

function UserManagement() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'vendor',
        lowBalanceThreshold: 100
    })

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const data = await api.users.getAll()
            setUsers(data)
        } catch (error) {
            console.error("Error loading users", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user)
            setFormData({
                name: user.name,
                email: user.email,
                password: '', // Don't show password
                role: user.role,
                lowBalanceThreshold: user.lowBalanceThreshold || 100
            })
        } else {
            setEditingUser(null)
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'vendor',
                lowBalanceThreshold: 100
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (editingUser) {
                // Update
                const updateData = { ...formData }
                if (!updateData.password) delete updateData.password // Don't overwrite if empty
                await api.users.update(editingUser.id, updateData)
            } else {
                // Create
                if (!formData.password) throw new Error("La contraseña es obligatoria")
                await api.users.create(formData)
            }
            await loadUsers()
            setIsModalOpen(false)
        } catch (error) {
            alert(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return
        try {
            await api.users.delete(id)
            loadUsers()
        } catch (error) {
            console.error("Error deleting user", error)
        }
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Gestión de Usuarios</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Administrar vendedores y permisos</p>
                </div>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} style={{ marginRight: '8px' }} />
                    Nuevo Usuario
                </Button>
            </header>

            {/* Filters */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>
            </div>

            {/* Users List */}
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {filteredUsers.map(user => (
                    <Card key={user.id} style={{ padding: '1.5rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleOpenModal(user)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <Edit size={18} />
                            </button>
                            {user.role !== 'admin' && (
                                <button onClick={() => handleDelete(user.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: user.role === 'admin' ? '#FEE2E2' : '#DBEAFE',
                                color: user.role === 'admin' ? '#EF4444' : '#3B82F6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{user.name}</h3>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: user.role === 'admin' ? '#FEE2E2' : '#F1F5F9',
                                    color: user.role === 'admin' ? '#B91C1C' : '#475569',
                                    fontWeight: 600
                                }}>
                                    {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={16} />
                                {user.email}
                            </div>
                            {user.role === 'vendor' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={16} />
                                    Saldo: L{user.balance?.toFixed(2)}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Portal Modal */}
            {isModalOpen && ReactDOM.createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999
                }}>
                    <Card style={{
                        width: '90%',
                        maxWidth: '500px',
                        padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        margin: 'auto',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        backgroundColor: '#ffffff'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-secondary)" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input label="Nombre" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            <Input label={editingUser ? "Nueva Contraseña (Opcional)" : "Contraseña"} type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!editingUser} />

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Rol</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--card-bg)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="vendor">Vendedor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)} type="button" disabled={isLoading}>Cancelar</Button>
                                <Button variant="primary" fullWidth type="submit" disabled={isLoading}>
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>,
                document.body
            )}
        </div>
    )
}

export default UserManagement
