import { useState, useCallback } from 'react';
import type { Restaurante, RestauranteFormData } from '../types/index';
import { mockRestaurantes, generateId } from '../utils/mocks';

const useRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>(mockRestaurantes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregarRestaurante = useCallback(
    async (data: RestauranteFormData): Promise<Restaurante> => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (!data.nombre.trim()) throw new Error('El nombre del restaurante es requerido');
        if (!data.direccion.trim()) throw new Error('La dirección es requerida');
        if (!data.telefono.trim()) throw new Error('El teléfono es requerido');

        const newRestaurante: Restaurante = { id: generateId(), ...data };
        setRestaurantes((prev) => [...prev, newRestaurante]);
        return newRestaurante;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al agregar restaurante';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const actualizarRestaurante = useCallback(
    async (id: string, data: RestauranteFormData): Promise<Restaurante> => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (!data.nombre.trim()) throw new Error('El nombre del restaurante es requerido');
        if (!data.direccion.trim()) throw new Error('La dirección es requerida');
        if (!data.telefono.trim()) throw new Error('El teléfono es requerido');

        const restaurante: Restaurante = { id, ...data };
        setRestaurantes((prev) => prev.map((r) => (r.id === id ? restaurante : r)));
        return restaurante;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al actualizar restaurante';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const eliminarRestaurante = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setRestaurantes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar restaurante';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    restaurantes,
    isLoading,
    error,
    agregarRestaurante,
    actualizarRestaurante,
    eliminarRestaurante,
  };
};

export default useRestaurantes;
