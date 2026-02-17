import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    type = 'button',
    fullWidth = false,
    className = '',
    disabled = false,
    style = {}, // Destructure style default
    ...props
}) => {
    // Converted Tailwind classes to real CSS styles
    const baseStyle = {
        padding: '16px 24px',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        transition: 'all 0.2s ease',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            boxShadow: 'var(--shadow-md)',
        },
        secondary: {
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '2px solid var(--border-color)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            padding: '8px 16px',
        }
    };

    const finalStyle = {
        ...baseStyle,
        ...variants[variant],
        ...style // Merge custom styles safely
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            style={finalStyle}
            className={className}
            whileHover={!disabled ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            disabled={disabled}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
