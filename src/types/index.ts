// Tipos de Usuario y Autenticación
export type UserRole = 'admin' | 'user';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  clave: string;
  rol: UserRole;
}

export interface AuthUser {
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
}

// Tipos de Restaurante
export interface Restaurante {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface RestauranteFormData {
  nombre: string;
  direccion: string;
  telefono: string;
}

// Tipos de Orden
export type OrderStatus = 'pendiente' | 'preparando' | 'enviado' | 'entregado';

export interface Orden {
  id: string;
  numero_de_orden: string;
  nombre_cliente: string;
  direccion_cliente: string;
  fecha_pedido: string;
  total_pedido: number;
  status: OrderStatus;
  restaurantId: string;
  comentario: string;
}

export interface OrdenFormData {
  nombre_cliente: string;
  direccion_cliente: string;
  total_pedido: number;
  restaurantId: string;
  comentario: string;
}

// Tipos del Contexto de Autenticación
export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (correo: string, clave: string) => Promise<void>;
  register: (nombre: string, correo: string, clave: string) => Promise<void>;
  logout: () => void;
}

// Tipos para Formularios
export interface LoginFormData {
  correo: string;
  clave: string;
}

export interface RegisterFormData {
  nombre: string;
  correo: string;
  clave: string;
  confirmaClave: string;
}
