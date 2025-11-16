'use client';

import { useOrganizationAuth } from '@/hooks/use-organization-auth';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ReactNode, ComponentProps } from 'react';

interface ProtectedActionButtonProps extends ComponentProps<typeof Button> {
  requiredPermission:
    | 'read'
    | 'write'
    | 'delete'
    | 'manage_members'
    | 'manage_settings';
  children: ReactNode;
  tooltipText?: string;
}

/**
 * Button component yang melindungi aksi berdasarkan user permissions
 * Menampilkan tooltip jika user tidak punya permission
 */
export function ProtectedActionButton({
  requiredPermission,
  children,
  tooltipText,
  disabled,
  ...props
}: ProtectedActionButtonProps) {
  const { hasPermission, isLoaded } = useOrganizationAuth();

  const canPerformAction = hasPermission(requiredPermission);
  const isDisabled = disabled || !canPerformAction || !isLoaded;

  const button = (
    <Button {...props} disabled={isDisabled}>
      {children}
    </Button>
  );

  if (!canPerformAction && isLoaded) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>
              {tooltipText ||
                `You don't have permission to ${requiredPermission}`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
