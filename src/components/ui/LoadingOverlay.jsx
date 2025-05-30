import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingOverlay({ loading }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <Loader2 className="animate-spin text-white h-12 w-12" />
    </div>
  );
}
