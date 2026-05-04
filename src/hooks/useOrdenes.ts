import { useState, useCallback } from 'react';
import type { Orden, OrdenFormData, OrderStatus } from '../types/index';
import { mockOrdenes, generateId, generateOrderNumber } from '../utils/mocks';

const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>(mockOrdenes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearOrden = useCallback(
    async (data: OrdenFormData): Promise<Orden> => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (!data.nombre_cliente.trim()) throw new Error('El nombre del cliente es requerido');
        if (!data.direccion_cliente.trim()) throw new Error('La dirección de entrega es requerida');
        if (data.total_pedido <= 0) throw new Error('El total debe ser mayor a 0');
        if (!data.restaurantId) throw new Error('Debes seleccionar un restaurante');

        const newOrden: Orden = {
          id: generateId(),
          numero_de_orden: generateOrderNumber(),
          nombre_cliente: data.nombre_cliente,
          direccion_cliente: data.direccion_cliente,
          fecha_pedido: new Date().toISOString(),
          total_pedido: data.total_pedido,
          status: 'pendiente',
          restaurantId: data.restaurantId,
          comentario: data.comentario || '',
        };

        setOrdenes((prev) => [...prev, newOrden]);
        return newOrden;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al crear orden';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const actualizarStatusOrden = useCallback(
    async (id: string, newStatus: OrderStatus): Promise<Orden> => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const statuses: OrderStatus[] = ['pendiente', 'preparando', 'enviado', 'entregado'];
        if (!statuses.includes(newStatus)) throw new Error('Estado de orden inválido');

        let updatedOrden: Orden | undefined;

        setOrdenes((prev) =>
          prev.map((o) => {
            if (o.id === id) {
              updatedOrden = { ...o, status: newStatus };
              return updatedOrden;
            }
            return o;
          })
        );

        if (!updatedOrden) throw new Error('Orden no encontrada');
        return updatedOrden;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al actualizar orden';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    ordenes,
    isLoading,
    error,
    crearOrden,
    actualizarStatusOrden,
  };
};

export default useOrdenes;
