import { useState, useEffect } from 'react';

export const useGastoMensual = (userId: string) => {
  const [gastoMensual, setGastoMensual] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGastoMensual = async () => {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userid'); // Cambiado a 'userid'
      
      if (!storedUserId || !token) {
        console.log('No hay credenciales:', { storedUserId, token });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching gasto mensual para usuario:', userId);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/gasto-mensual/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          console.error('Error response:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error body:', errorText);
          throw new Error(`Error al obtener el gasto mensual: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Gasto mensual recibido:', data);
        setGastoMensual(data);
        setError(null);
      } catch (err) {
        console.error('Error en useGastoMensual:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setGastoMensual(0);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchGastoMensual();
    }
  }, [userId]);

  return { gastoMensual, loading, error };
};