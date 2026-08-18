import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#FFD60A] hover:bg-[#FFE66D] text-black shadow-lg shadow-[#FFD60A]/20 hover:shadow-[#FFD60A]/35 font-bold',
    secondary: 'bg-[#1B1F28] hover:bg-[#252B38] text-white border border-white/10 hover:border-white/20',
    outline: 'bg-transparent border border-[#FFD60A]/40 text-[#FFD60A] hover:bg-[#FFD60A]/10 hover:border-[#FFD60A]',
    danger: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#EF4444]/30',
    ghost: 'bg-transparent text-text-muted hover:text-white hover:bg-white/5',
    glass: 'bg-white/5 hover:bg-white/10 text-white backdrop-blur-lg border border-white/10 hover:border-[#FFD60A]/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-3.5 text-lg gap-3',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </motion.button>
  );
};
