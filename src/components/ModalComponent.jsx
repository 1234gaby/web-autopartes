// src/components/ModalComponent.jsx
import { Button } from '@shadcn/ui';
import { useState } from 'react';

export function ModalComponent() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="w-full">Abrir Modal</Button>

      {open && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Este es un modal de ejemplo</h2>
            <Button onClick={() => setOpen(false)} variant="secondary" className="w-full">Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
