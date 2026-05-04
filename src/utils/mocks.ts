import type { Usuario, Restaurante, Orden } from '../types/index';

// Mock Users
export const mockUsers: Usuario[] = [
  {
    id: '1',
    nombre: 'Admin User',
    correo: 'admin@foodplease.com',
    clave: 'admin123',
    rol: 'admin',
  },
  {
    id: '2',
    nombre: 'Juan Cliente',
    correo: 'juan@example.com',
    clave: 'user123',
    rol: 'user',
  },
  {
    id: '3',
    nombre: 'María Cliente',
    correo: 'maria@example.com',
    clave: 'user123',
    rol: 'user',
  },
];

// Mock Restaurantes
export const mockRestaurantes: Restaurante[] = [
  {
    id: '1',
    nombre: 'Pizzería Milano',
    direccion: 'Calle Principal 123, Madrid',
    telefono: '91-123-4567',
  },
  {
    id: '2',
    nombre: 'Sushi Master',
    direccion: 'Avenida del Prado 456, Barcelona',
    telefono: '93-987-6543',
  },
  {
    id: '3',
    nombre: 'Burger House',
    direccion: 'Plaza Mayor 789, Valencia',
    telefono: '96-555-1234',
  },
  {
    id: '4',
    nombre: 'Don Tacos',
    direccion: 'Gran Vía 321, Bilbao',
    telefono: '94-222-3333',
  },
];

// Mock Órdenes
export const mockOrdenes: Orden[] = [
  {
    id: '1',
    numero_de_orden: '#ORD-001',
    nombre_cliente: 'Juan Pérez',
    direccion_cliente: 'Calle Falsa 123',
    fecha_pedido: '2024-04-14T10:30:00',
    total_pedido: 35.50,
    status: 'entregado',
    restaurantId: '1',
    comentario: 'Sin cebolla, extra queso',
  },
  {
    id: '2',
    numero_de_orden: '#ORD-002',
    nombre_cliente: 'María García',
    direccion_cliente: 'Avenida Real 456',
    fecha_pedido: '2024-04-14T11:15:00',
    total_pedido: 45.00,
    status: 'enviado',
    restaurantId: '2',
    comentario: 'Muy rápido, gracias',
  },
  {
    id: '3',
    numero_de_orden: '#ORD-003',
    nombre_cliente: 'Carlos López',
    direccion_cliente: 'Plaza Centro 789',
    fecha_pedido: '2024-04-14T12:00:00',
    total_pedido: 28.99,
    status: 'preparando',
    restaurantId: '3',
    comentario: 'Sin tomate',
  },
];

export const generateId = (): string =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `#ORD-${timestamp}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\-\s+()]{7,}$/;
  return phoneRegex.test(phone);
};
