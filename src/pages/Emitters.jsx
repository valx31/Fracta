import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import MainLayout from '../Layout/MainLayout';
import { Input } from "@heroui/react";
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function Emitters() {
  const [emitters, setEmitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEmitters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'emisores'));
        const emittersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmitters(emittersData);
      } catch (error) {
        console.error('Error fetching emitters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmitters();
  }, []);

  const filteredEmitters = emitters.filter(emitter => {
    const searchLower = searchQuery.toLowerCase();
    const nombreEmpresa = emitter.nombre_empresa?.toLowerCase() || '';
    const nemotecnico = emitter.nemotecnico?.toLowerCase() || '';
    return nombreEmpresa.includes(searchLower) || nemotecnico.includes(searchLower);
  });

  const calculatePriceChange = (precioActual) => {
    if (!precioActual || precioActual.length < 2) return null;
    
    const lastPrice = precioActual[precioActual.length - 1];
    const previousPrice = precioActual[precioActual.length - 2];
    
    if (!lastPrice?.precio || !previousPrice?.precio) return null;
    
    const change = lastPrice.precio - previousPrice.precio;
    const percentage = (change / previousPrice.precio) * 100;
    
    return {
      change,
      percentage,
      isPositive: change > 0,
      isNegative: change < 0,
      isNeutral: change === 0
    };
  };

  const formatPrice = (price) => {
    if (!price) return '0.00';
    return price.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <MainLayout>
      <main className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Acciones Disponibles</h1>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background rounded-xl"
            startContent={
              <MagnifyingGlassIcon className="w-5 h-5 text-textSecondary" />
            }
          />
        </div>
        
        {loading ? (
          <div className="text-white">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredEmitters.map((emitter) => {
              const lastPrice = emitter.precio_actual?.[emitter.precio_actual.length - 1];
              const priceChange = calculatePriceChange(emitter.precio_actual);
              
              return (
                <div 
                  key={emitter.id} 
                  className="bg-background rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {emitter.imagen && (
                      <img 
                        src={emitter.imagen} 
                        alt={emitter.nombre_empresa || 'Company'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-white font-semibold text-sm">{emitter.nombre_empresa || 'Sin nombre'}</h3>
                      <p className="text-textSecondary text-xs">{emitter.nemotecnico || 'Sin símbolo'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-center gap-1 justify-end">
                      <p className="text-white font-bold text-sm">${formatPrice(lastPrice?.precio)}</p>
                      {priceChange && (
                        <div className={`flex items-center gap-1 ${
                          priceChange.isPositive ? 'text-green-500' : 
                          priceChange.isNegative ? 'text-red-500' : 
                          'text-textSecondary'
                        }`}>
                          {priceChange.isPositive ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : priceChange.isNegative ? (
                            <ArrowDownIcon className="w-4 h-4" />
                          ) : (
                            <MinusIcon className="w-4 h-4" />
                          )}
                          <span className="text-xs font-semibold">
                            {priceChange.isNeutral ? '0.00' : `${Math.abs(priceChange.percentage).toFixed(2)}%`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </MainLayout>
  );
} 