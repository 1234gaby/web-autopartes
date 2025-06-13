// src/components/FormComponent.jsx
import { Input, Button } from '@shadcn/ui';
import { useState } from 'react';

export function FormComponent() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <Input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <Button type="submit" className="w-full">Enviar</Button>
    </form>
  );
}
