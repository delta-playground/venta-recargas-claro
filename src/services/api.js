// Simulated Backend Database
const MOCK_DB = {
    users: [
        {
            id: 'admin-1',
            role: 'admin',
            email: 'admin@paloaltohn.com',
            password: 'admin', // In real app, this would be hashed
            name: 'Super Admin',
            globalBalance: 100000.00
        },
        {
            id: 'vendor-151104',
            role: 'vendor',
            email: 'vendedor@paloaltohn.com',
            password: '123',
            name: 'Vendedor 1',
            balance: 966.00,
            lowBalanceThreshold: 100.00
        }
    ],
    transactions: [
        { id: 'TXN-001', vendorId: 'vendor-151104', type: 'Recarga', name: 'Saldo Regular', target: '33998877', amount: 25, date: '2026-02-15T08:30:00', status: 'Exitoso' },
        { id: 'TXN-002', vendorId: 'vendor-151104', type: 'Paquete', name: 'Superpack 7 días', target: '99887766', amount: 110, date: '2026-02-15T09:15:00', status: 'Exitoso' },
        { id: 'TXN-003', vendorId: 'vendor-151104', type: 'Recarga', name: 'Saldo Regular', target: '88776655', amount: 50, date: '2026-02-15T10:45:00', status: 'Exitoso' },
        { id: 'TXN-004', vendorId: 'vendor-151104', type: 'Paquete', name: 'Internet 1 Día', target: '33221100', amount: 45, date: '2026-02-15T11:20:00', status: 'Exitoso' },
        { id: 'TXN-005', vendorId: 'vendor-151104', type: 'Recarga', name: 'Saldo Regular', target: '99112233', amount: 10, date: '2026-02-16T09:00:00', status: 'Exitoso' },
        { id: 'TXN-006', vendorId: 'vendor-151104', type: 'Paquete', name: 'Todo Incluido', target: '33112233', amount: 300, date: '2026-02-14T15:00:00', status: 'Exitoso' },
    ]
};

// Utilities to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    auth: {
        login: async (email, password) => {
            await delay(800);
            const user = MOCK_DB.users.find(u => u.email === email && u.password === password);
            if (user) {
                // Return user without password
                const { password, ...userWithoutPass } = user;
                return userWithoutPass;
            }
            throw new Error('Credenciales inválidas');
        }
    },
    users: {
        getById: async (id) => {
            await delay(300);
            return MOCK_DB.users.find(u => u.id === id);
        },
        getAll: async () => {
            await delay(500);
            return [...MOCK_DB.users];
        },
        getVendors: async () => {
            await delay(500);
            return MOCK_DB.users.filter(u => u.role === 'vendor');
        },
        create: async (userData) => {
            await delay(800);
            const newUser = {
                id: `user-${Date.now()}`,
                balance: 0,
                ...userData
            };
            MOCK_DB.users.push(newUser);
            return newUser;
        },
        update: async (id, userData) => {
            await delay(500);
            const index = MOCK_DB.users.findIndex(u => u.id === id);
            if (index !== -1) {
                MOCK_DB.users[index] = { ...MOCK_DB.users[index], ...userData };
                return MOCK_DB.users[index];
            }
            throw new Error('Usuario no encontrado');
        },
        delete: async (id) => {
            await delay(500);
            MOCK_DB.users = MOCK_DB.users.filter(u => u.id !== id);
            return true;
        },
        updateBalance: async (userId, newBalance) => {
            await delay(500);
            const user = MOCK_DB.users.find(u => u.id === userId);
            if (user) {
                user.balance = newBalance;
                return true;
            }
            return false;
        }
    },
    inventory: {
        getGlobalBalance: async () => {
            // In a real scenario this might come from a specific admin record or a system table
            const admin = MOCK_DB.users.find(u => u.role === 'admin');
            return admin ? admin.globalBalance : 0;
        },
        transfer: async (fromAdminId, toVendorId, amount) => {
            await delay(1000);
            const admin = MOCK_DB.users.find(u => u.id === fromAdminId);
            const vendor = MOCK_DB.users.find(u => u.id === toVendorId);

            if (!admin || !vendor) throw new Error('Usuario no encontrado');
            if (amount <= 0) throw new Error('Monto inválido');
            if (admin.globalBalance < amount) throw new Error('Saldo global insuficiente');

            // Transaction
            admin.globalBalance -= parseFloat(amount);
            vendor.balance = (vendor.balance || 0) + parseFloat(amount);

            return { success: true, newGlobalBalance: admin.globalBalance, newVendorBalance: vendor.balance };
        }
    },
    reports: {
        getTransactions: async (filters = {}) => {
            await delay(600);
            let filtered = [...MOCK_DB.transactions];

            // Filter by Vendor
            if (filters.vendorId) {
                filtered = filtered.filter(t => t.vendorId === filters.vendorId);
            }

            // Filter by Date Range
            if (filters.startDate && filters.endDate) {
                const start = new Date(filters.startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);

                filtered = filtered.filter(t => {
                    const date = new Date(t.date);
                    return date >= start && date <= end;
                });
            }

            return filtered;
        }
    }
};
