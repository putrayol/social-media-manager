'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface SocialLinkButtonProps {
  url: string;
  platform: string;
  type?: 'profile' | 'post';
  buttonVariant?: 'default' | 'ghost' | 'outline' | 'link';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function SocialLinkButton({
  url,
  platform,
  type = 'post',
  buttonVariant = 'ghost',
  buttonSize = 'sm',
  showLabel = false
}: SocialLinkButtonProps) {
  if (!url) return null;

  return (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      asChild
      className='gap-1'
      title={`Buka ${type === 'profile' ? 'profil' : 'postingan'} di tab baru`}
    >
      <a href={url} target='_blank' rel='noopener noreferrer'>
        <ExternalLink className='h-4 w-4' />
        {showLabel && (
          <span className='hidden sm:inline'>
            {type === 'profile' ? 'Lihat Profil' : 'Lihat Post'}
          </span>
        )}
      </a>
    </Button>
  );
}

// Alias for backward compatibility with existing code
export function SocialPreviewButton({
  url,
  platform,
  type = 'post',
  title
}: {
  url: string;
  platform: string;
  type?: 'profile' | 'post';
  title?: string;
}) {
  if (!url) return null;

  return (
    <SocialLinkButton
      url={url}
      platform={platform}
      type={type}
      buttonVariant='ghost'
      buttonSize='sm'
    />
  );
}

// Keep the modal export for backward compatibility
export function SocialEmbedModal({
  url,
  platform,
  type = 'post',
  buttonVariant = 'ghost',
  buttonSize = 'icon',
  showLabel = false
}: SocialLinkButtonProps) {
  return (
    <SocialLinkButton
      url={url}
      platform={platform}
      type={type}
      buttonVariant={buttonVariant}
      buttonSize={buttonSize}
      showLabel={showLabel}
    />
  );
}
