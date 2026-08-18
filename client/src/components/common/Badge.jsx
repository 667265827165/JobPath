import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-white/5 text-text-muted border-white/10',
    yellow: 'bg-[#FFD60A]/10 text-[#FFD60A] border-[#FFD60A]/30',
    success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
    info: 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30',
    purple: 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-lg border backdrop-blur-md ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
