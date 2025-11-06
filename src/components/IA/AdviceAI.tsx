"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/challenges/Button";
import { Pencil } from "lucide-react";
import { useGastoMensual } from "@/hooks/useGastoMensual";

type AdviceAIProps = {
  gastoMensual?: number;   // gasto total del mes mock/front
  ahorroActual?: number;   // ahorro acumulado
  meta?: number;           // objetivo de ahorro
};

type MetaFinanciera = {
  montoMeta: number;
  plazoMeses: number;
};

export default function AdviceAI({
  gastoMensual = 0,
  ahorroActual = 0,
  meta = 0,
}: AdviceAIProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [metaFinanciera, setMetaFinanciera] = useState<MetaFinanciera>({
    montoMeta: meta || 0,
    plazoMeses: 12
  });

  useEffect(() => {
    // Cargar meta financiera al montar el componente
    const cargarMetaFinanciera = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No hay token disponible');
          return;
        }

        const userId = localStorage.getItem('userid'); // Cambiado a 'userid'
        if (!userId) {
          console.log('No hay userid disponible');
          return;
        }

        console.log('URL de la API:', process.env.NEXT_PUBLIC_BACKEND_URL);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/meta-financiera`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        // Si es 404, significa que no hay meta financiera establecida
        if (res.status === 404) {
          console.log('No hay meta financiera establecida');
          return;
        }
        
        if (!res.ok) {
          const errorData = await res.text();
          console.error('Respuesta del servidor:', {
            status: res.status,
            statusText: res.statusText,
            body: errorData
          });
          throw new Error(`Error al cargar meta financiera: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Datos recibidos:', data);
        
        if (!data || typeof data.montoMeta === 'undefined') {
          console.error('Datos inválidos recibidos:', data);
          throw new Error('Datos inválidos recibidos del servidor');
        }

        setMetaFinanciera({
          montoMeta: data.montoMeta || 0,
          plazoMeses: data.plazoMeses || 12
        });
        
        if (typeof data.gastoMensual !== 'undefined') {
          setGastosMensuales(data.gastoMensual);
        }
        if (typeof data.ahorroActual !== 'undefined') {
          setAhorroActualLocal(data.ahorroActual);
        }
      } catch (error) {
        console.error('Error detallado al cargar meta financiera:', error);
        // Inicializar con valores por defecto en caso de error
        setMetaFinanciera({
          montoMeta: 0,
          plazoMeses: 12
        });
      }
    };

    cargarMetaFinanciera();
  }, []);
  const userId = localStorage.getItem('userid') || ''; // Cambiado a 'userid'
  const { gastoMensual: gastoMensualReal, loading: loadingGasto, error: errorGasto } = useGastoMensual(userId);
  const [gastosMensuales, setGastosMensuales] = useState<number>(gastoMensual);
  const [ahorroActualLocal, setAhorroActualLocal] = useState<number>(ahorroActual);

  useEffect(() => {
    if (!loadingGasto && gastoMensualReal !== undefined && !errorGasto) {
      console.log('Actualizando gasto mensual:', gastoMensualReal);
      setGastosMensuales(gastoMensualReal);
    }
  }, [gastoMensualReal, loadingGasto, errorGasto]);

  // Debug para ver los valores
  useEffect(() => {
    console.log('Estado actual:', {
      gastoMensualReal,
      loadingGasto,
      errorGasto,
      gastosMensuales
    });
  }, [gastoMensualReal, loadingGasto, errorGasto, gastosMensuales]);

  async function refetch() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No hay sesión activa");
      
      // Primero verificamos la conectividad
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        throw new Error("No hay conexión con el servidor. Por favor, verifica tu conexión a internet.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai-tips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          gastoMensual: gastosMensuales, 
          ahorroActual: ahorroActualLocal, 
          meta: metaFinanciera.montoMeta 
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Error from AI service:', errorData);
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message;
        } catch {
          errorMessage = "Error al contactar el servicio de IA";
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      if (!data.tips || !Array.isArray(data.tips)) {
        throw new Error("Formato de respuesta inválido del servidor");
      }
      setTips(data.tips);
      setError(null);

    } catch (error) {
      console.error('Error detallado:', error);
      setError(error instanceof Error ? error.message : "Error inesperado");
      // Solo usamos el fallback si es un error de conectividad
      if (error instanceof Error && error.message.includes("conexión")) {
        setTips([
          "⚠️ Modo sin conexión:",
          "Reservá un 10% de cada ingreso apenas lo recibas.",
          "Dá de baja 2 suscripciones que no usás.",
          "Poné un tope semanal para delivery y transporte.",
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative mb-8">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-violet-100/50 shadow-lg shadow-violet-500/20 p-4 md:p-6 relative overflow-hidden transition-all hover:border-violet-500/30 hover:shadow-violet-500/30">
        {/* Efectos de brillo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 shadow-lg shadow-violet-500/40 border border-violet-500/30">
                🤖
              </span>
              <h3 className="text-lg font-semibold text-white text-shadow-glow">IA de Consejos</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto sm:ml-auto">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-3 py-1 rounded-full bg-gray-800/80 text-gray-200 text-sm border border-violet-500/20 shadow-md shadow-violet-500/10">
                  Gasto mensual: ${gastosMensuales.toLocaleString()}
                </span>

                <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm border border-violet-500/30 shadow-md shadow-violet-500/20">
                  Meta: ${ahorroActualLocal.toLocaleString()} / ${metaFinanciera.montoMeta.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                <Button
                  onClick={() => setShowModal(true)}
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 bg-purple-800/80 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/50 border-2 border-purple-700/50 transition-all hover:scale-105 font-medium"
                >
                  Editar Meta
                </Button>

                <Button
                  onClick={refetch}
                  loading={loading}
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/50 border-2 border-violet-500/50 transition-all hover:scale-105 font-medium text-xl"
                  aria-label="Refrescar consejos"
                >
                  ⟳ Actualizar
                </Button>
              </div>
            </div>
          </div>

          {/* Caja de resultados */}
          <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 border border-violet-500/10 shadow-inner shadow-violet-500/5">
            {error ? (
              <div className="text-red-400 text-center py-4 px-4 bg-red-950/20 rounded-lg border border-red-500/20">
                <p className="mb-2">❌ {error}</p>
                <p className="text-sm text-red-300">Intenta de nuevo más tarde o contacta a soporte si el problema persiste.</p>
              </div>
            ) : tips.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No hay recomendaciones por ahora. ¡Probá actualizar!
              </div>
            ) : (
              <ul className="space-y-4">
                {tips.map((t, i) => (
                  <li 
                    key={i}
                    className="flex items-start gap-3 text-gray-200 leading-relaxed"
                  >
                    <span className="text-violet-400 mt-1">•</span>
                    <span className="text-violet-50">{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal para configurar meta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-violet-500/20 p-6 rounded-xl shadow-xl shadow-violet-500/20 max-w-md w-full m-4 relative overflow-hidden">
            {/* Efectos de brillo en el modal */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 shadow-lg shadow-violet-500/30 border border-violet-500/30">
                  🎯
                </span>
                Configurar Meta Financiera
              </h2>
            
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gasto Mensual Promedio
                  </label>
                  <input
                    type="number"
                    value={gastosMensuales}
                    onChange={(e) => setGastosMensuales(Number(e.target.value))}
                    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Ahorro Actual
                  </label>
                  <input
                    type="number"
                    value={ahorroActualLocal}
                    onChange={(e) => setAhorroActualLocal(Number(e.target.value))}
                    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Meta de Ahorro ($)
                  </label>
                  <input
                    type="number"
                    value={metaFinanciera.montoMeta}
                    onChange={(e) => setMetaFinanciera(prev => ({
                      ...prev,
                      montoMeta: Number(e.target.value)
                    }))}
                    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Plazo (meses)
                  </label>
                  <input
                    type="number"
                    value={metaFinanciera.plazoMeses}
                    onChange={(e) => setMetaFinanciera(prev => ({
                      ...prev,
                      plazoMeses: Number(e.target.value)
                    }))}
                    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="secondary"
                  size="sm"
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700/50 shadow-lg shadow-gray-900/30 transition-all hover:scale-105"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      if (!token) throw new Error('No hay sesión activa');

                      console.log('Enviando datos de meta financiera:', {
                        montoMeta: metaFinanciera.montoMeta,
                        plazoMeses: metaFinanciera.plazoMeses,
                        gastoMensual: gastosMensuales,
                        ahorroActual: ahorroActualLocal,
                      });

                      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/meta-financiera`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          montoMeta: metaFinanciera.montoMeta,
                          plazoMeses: metaFinanciera.plazoMeses,
                          gastoMensual: gastosMensuales,
                          ahorroActual: ahorroActualLocal,
                        }),
                      });

                      if (!res.ok) {
                        const errorData = await res.text();
                        console.error('Error al guardar meta financiera:', {
                          status: res.status,
                          statusText: res.statusText,
                          body: errorData
                        });
                        throw new Error(`Error al guardar meta financiera: ${res.status} ${res.statusText}`);
                      }

                      const data = await res.json();
                      console.log('Meta financiera guardada:', data);

                      setShowModal(false);
                      refetch(); // Actualizar consejos con los nuevos valores
                    } catch (error) {
                      console.error('Error al guardar meta financiera:', error);
                      // Aquí podrías mostrar un mensaje de error al usuario
                    }
                  }}
                  variant="primary"
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/50 border border-violet-500/50 transition-all hover:scale-105"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}