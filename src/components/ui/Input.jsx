import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    icon: Icon,
    error,
    style, // Destructure style
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
            {label && (
                <label
                    style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '0.5rem',
                        color: 'var(--text-secondary)'
                    }}
                >
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                {Icon && (
                    <div style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: isFocused ? 'var(--primary)' : 'var(--text-secondary)',
                        transition: 'color 0.2s',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        pointerEvents: 'none'
                    }}>
                        <Icon size={18} />
                    </div>
                )}
                <motion.input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    animate={{
                        borderColor: error
                            ? 'var(--error)'
                            : isFocused
                                ? 'var(--primary)'
                                : 'var(--border-color)',
                        boxShadow: isFocused
                            ? `0 0 0 4px var(--primary-light)`
                            : 'none',
                    }}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingLeft: Icon ? '40px' : '16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        outline: 'none',
                        ...style // Merge the destructured style
                    }}
                    transition={{ duration: 0.2 }}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        color: 'var(--error)',
                        fontSize: '0.8rem',
                        marginTop: '0.5rem',
                        fontWeight: 500
                    }}
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
