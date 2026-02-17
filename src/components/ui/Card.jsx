import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', style = {}, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(10px)',
                ...style
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
