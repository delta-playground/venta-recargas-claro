import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './ui/Button'

function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="modal-overlay"
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        style={{
                            background: 'var(--card-bg)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '2rem',
                            width: '90%',
                            maxWidth: '400px',
                            zIndex: 51,
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)', // This will be overridden by motion, checking if needed
                            // motion handles transform, so we use marginLeft/marginTop technique or fixed centering
                            // simpler to let flexbox in overlay center it?
                            // The overlay above is fixed, but this div is separate.
                            // Let's nest them or use fixed positioning.
                        }}
                        // Re-adjusting structure to ensure centering works with framer motion
                        className="modal-container-fixed"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
                            <button
                                onClick={onClose}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            {children}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button onClick={onClose} variant="secondary" fullWidth>
                                Cancelar
                            </Button>
                            <Button onClick={onConfirm} variant="primary" fullWidth>
                                Confirmar
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ConfirmationModal
