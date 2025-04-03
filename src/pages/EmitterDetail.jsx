import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MainLayout from '../Layout/MainLayout';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Input, Tabs, Tab } from '@heroui/react';
import { ArrowLeftIcon, StarIcon, ArrowTrendingUpIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmitterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emitter, setEmitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(new Set(["1"]));
  const [customQuantity, setCustomQuantity] = useState('');
  const [selectedFraction, setSelectedFraction] = useState(new Set(["1"]));
  const [showCustomInput, setShowCustomInput] = useState(false);

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 rounded-lg border border-gray-700">
          <p className="text-white text-xs">{`Precio: $${formatPrice(payload[0].value)}`}</p>
          <p className="text-textSecondary text-xs">{label}</p>
        </div>
      );
    }
    return null;
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

  // Prepare data for the chart
  const chartData = emitter?.precio_actual?.map((price) => {
    const date = new Date(price.fecha);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return {
      time: `${day}/${month}`,
      price: price.precio
    };
  }) || [];

  // Calculate min and max prices for YAxis domain
  const prices = chartData.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1; // 10% padding

  const handleQuantityChange = (value) => {
    const selectedValue = Array.from(value)[0];
    setSelectedQuantity(value);
    if (selectedValue === 'otro') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
  };

  const calculateTotalPrice = () => {
    const quantity = showCustomInput ? parseInt(customQuantity) || 0 : parseInt(Array.from(selectedQuantity)[0]);
    const fraction = parseFloat(Array.from(selectedFraction)[0]);
    const price = lastPrice?.precio || 0;
    const total = quantity * fraction * price;
    return formatPrice(total);
  };

  const handlePurchase = () => {
    setIsPurchaseModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const quantityOptions = [
    { id: "1", label: "1 acción" },
    { id: "2", label: "2 acciones" },
    { id: "3", label: "3 acciones" },
    { id: "4", label: "4 acciones" },
    { id: "5", label: "5 acciones" },
    { id: "6", label: "6 acciones" },
    { id: "otro", label: "Otro" }
  ];

  const fractionOptions = [
    { id: "1", label: "Acción completa" },
    { id: "0.5", label: "1/2 Acción" },
    { id: "0.25", label: "1/4 Acción" }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            isIconOnly
            variant="light"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">{emitter?.nemotecnico}</h1>
          <Button
            isIconOnly
            variant="light"
            onClick={() => setIsFavorite(!isFavorite)}
            className=""
          >
            {isFavorite ? (
              <StarIconSolid className="w-6 h-6 text-yellow-400" />
            ) : (
              <StarIcon className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Company Info */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl p-4">
          <img
            src={emitter?.imagen}
            alt={emitter?.nombre_empresa}
            className="w-16 h-16 rounded-full border border-gray-700 object-cover"
          />
          <div className='flex flex-col items-center justify-center'>
            <h2 className="text-lg font-bold text-blac">{emitter?.nombre_empresa}</h2>
            <p className="text-textSecondary">{emitter?.nemotecnico}</p>
          </div>
        </div>

        {/* Price Info */}
        <div className="rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-5xl font-bold">
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
        <Tabs 
          aria-label="Timeframe options"
          color="primary"
          fullWidth
          selectedKey={selectedTimeframe}
          onSelectionChange={setSelectedTimeframe}
          className="bg-background rounded-xl p-2"
        >
          <Tab key="1m" title="1m" />
          <Tab key="5m" title="5m" />
          <Tab key="15m" title="15m" />
          <Tab key="1h" title="1h" />
        </Tabs>

        {/* Chart */}
        <div className="bg-background rounded-xl p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#9CA3AF', fontSize: '12px' }}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#9CA3AF', fontSize: '12px' }}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
                tickFormatter={(value) => `$${formatPrice(value)}`}
                domain={[minPrice - padding, maxPrice + padding]}
                allowDataOverflow={false}
                width={80}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="price"
                stroke={priceChange?.isPositive ? '#10B981' : priceChange?.isNegative ? '#EF4444' : '#9CA3AF'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: priceChange?.isPositive ? '#10B981' : priceChange?.isNegative ? '#EF4444' : '#9CA3AF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Action Button */}
        <Button
          color="primary"
          size="lg"
          className="w-full py-6 rounded-xl"
          startContent={<ArrowTrendingUpIcon className="w-5 h-5" />}
          onPress={() => setIsPurchaseModalOpen(true)}
        >
          Quiero ser accionista
        </Button>

        {/* Purchase Modal */}
        <Modal 
          isOpen={isPurchaseModalOpen} 
          onClose={() => setIsPurchaseModalOpen(false)}
          placement="bottom"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Comprar acciones de {emitter?.nombre_empresa}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Select
                  label="Cantidad de acciones"
                  placeholder="Selecciona la cantidad"
                  selectedKeys={selectedQuantity}
                  onSelectionChange={handleQuantityChange}
                  className="w-full"
                >
                  {quantityOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {showCustomInput && (
                  <Input
                    type="number"
                    label="Cantidad personalizada"
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(e.target.value)}
                    min="1"
                    placeholder="Ingresa la cantidad"
                    className="w-full"
                  />
                )}

                <Select
                  label="Fracción de acción"
                  placeholder="Selecciona la fracción"
                  selectedKeys={selectedFraction}
                  onSelectionChange={setSelectedFraction}
                  className="w-full"
                >
                  {fractionOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                <div className="bg-background p-4 rounded-xl">
                  <p className="text-textSecondary">Precio total</p>
                  <p className="text-2xl font-bold text-white">${calculateTotalPrice()}</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsPurchaseModalOpen(false)}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handlePurchase}>
                Comprar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Success Modal */}
        <Modal 
          isOpen={isSuccessModalOpen} 
          onClose={() => setIsSuccessModalOpen(false)}
          placement="center"
        >
          <ModalContent>
            <ModalBody className="flex flex-col items-center gap-4 py-8">
              <img
                src={emitter?.imagen}
                alt={emitter?.nombre_empresa}
                className="w-20 h-20 rounded-full object-cover"
              />
              <h2 className="text-xl font-bold text-center">
                ¡Felicidades! Ahora eres accionista de {emitter?.nombre_empresa}
              </h2>
              <div className="bg-background p-4 rounded-xl w-full">
                <p className="text-textSecondary text-center">Inversión realizada</p>
                <p className="text-2xl font-bold text-white text-center">
                  ${calculateTotalPrice()}
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="primary" 
                className="w-full" 
                onPress={() => {
                  setIsSuccessModalOpen(false);
                  navigate('/home');
                }}
              >
                Ver mi portafolio
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </MainLayout>
  );
} 