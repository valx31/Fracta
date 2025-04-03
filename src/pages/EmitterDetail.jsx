import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MainLayout from '../Layout/MainLayout';
import { Button } from '@heroui/react';
import { ArrowLeftIcon, StarIcon, ArrowTrendingUpIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function EmitterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emitter, setEmitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  useEffect(() => {
    const fetchEmitter = async () => {
      try {
        const docRef = doc(db, 'emisores', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmitter({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching emitter:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmitter();
  }, [id]);

  const formatPrice = (price) => {
    if (!price) return '0,00';
    return price.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculatePriceChange = () => {
    if (!emitter?.precio_actual || emitter.precio_actual.length < 2) return null;
    
    const lastPrice = emitter.precio_actual[emitter.precio_actual.length - 1];
    const previousPrice = emitter.precio_actual[emitter.precio_actual.length - 2];
    
    if (!lastPrice?.precio || !previousPrice?.precio) return null;
    
    const change = lastPrice.precio - previousPrice.precio;
    const percentage = (change / previousPrice.precio) * 100;
    
    return {
      change: formatPrice(Math.abs(change)),
      percentage: Math.abs(percentage).toFixed(2),
      isPositive: change > 0,
      isNegative: change < 0,
      isNeutral: change === 0
    };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-white">Cargando...</div>
      </MainLayout>
    );
  }

  const lastPrice = emitter?.precio_actual?.[emitter.precio_actual.length - 1];
  const priceChange = calculatePriceChange();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            isIconOnly
            variant="light"
            onClick={() => navigate(-1)}
            className="text-white"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">{emitter?.nemotecnico}</h1>
          <Button
            isIconOnly
            variant="light"
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-white"
          >
            {isFavorite ? (
              <StarIconSolid className="w-6 h-6 text-yellow-400" />
            ) : (
              <StarIcon className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Company Info */}
        <div className="flex items-center gap-4 bg-background rounded-xl p-4">
          <img
            src={emitter?.imagen}
            alt={emitter?.nombre_empresa}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-bold text-white">{emitter?.nombre_empresa}</h2>
            <p className="text-textSecondary">{emitter?.nemotecnico}</p>
          </div>
        </div>

        {/* Price Info */}
        <div className="bg-background rounded-xl p-6">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-3xl font-bold text-white">
              ${formatPrice(lastPrice?.precio)}
            </h3>
            {priceChange && (
              <div className={`flex items-center gap-2 ${
                priceChange.isPositive ? 'text-green-500' : 
                priceChange.isNegative ? 'text-red-500' : 
                'text-textSecondary'
              }`}>
                <span className="text-sm">
                  ${priceChange.change} ({priceChange.percentage}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chart Timeframe Selector */}
        <div className="flex gap-2 bg-background rounded-xl p-2">
          {['1m', '5m', '15m', '1h'].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'solid' : 'light'}
              color={selectedTimeframe === timeframe ? 'primary' : 'default'}
              className="flex-1"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe}
            </Button>
          ))}
        </div>

        {/* Chart Placeholder - You'll need to implement actual chart */}
        <div className="bg-background rounded-xl p-4 h-64 flex items-center justify-center">
          <ChartBarIcon className="w-12 h-12 text-textSecondary" />
        </div>

        {/* Action Button */}
        <Button
          color="primary"
          size="lg"
          className="w-full py-6 rounded-xl"
          startContent={<ArrowTrendingUpIcon className="w-5 h-5" />}
        >
          Quiero ser accionista
        </Button>
      </div>
    </MainLayout>
  );
} 