'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useCrudFeedback() {
  const router = useRouter();

  async function run<T>(
    operation: () => Promise<T>,
    messages?: {
      success?: string;
      error?: string;
    }
  ): Promise<T | null> {
    try {
      const result = await operation();

      // Show success toast
      if (messages?.success) {
        toast.success(messages.success);
      } else {
        toast.success('Berhasil diproses');
      }

      // Force refresh the router to update the UI with new data
      router.refresh();

      return result;
    } catch (error: any) {
      // Extract error message
      let errorMessage = 'Terjadi kesalahan';

      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Show error toast
      if (messages?.error) {
        toast.error(`${messages.error}: ${errorMessage}`);
      } else {
        toast.error(errorMessage);
      }

      // Re-throw the error if needed for additional handling
      throw error;
    }
  }

  return { run, router };
}
