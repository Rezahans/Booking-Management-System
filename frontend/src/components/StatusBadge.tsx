'use client';

import React from 'react';
import { BookingStatus } from '@/lib/types';
import { cn, getStatusConfig } from '@/lib/utils';
import { Clock, CheckCircle2, CheckCheck, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const config = getStatusConfig(status);

  const getIcon = () => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-3 h-3" />;
      case 'CONFIRMED':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'COMPLETED':
        return <CheckCheck className="w-3.5 h-3.5" />;
      case 'CANCELLED':
        return <XCircle className="w-3 h-3" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200',
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
      )}
    >
      {showIcon && getIcon()}
      <span>{config.label}</span>
    </span>
  );
};
