import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router';
import MainLayout from '../Layout/MainLayout';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Input } from '@heroui/react';
import { ArrowLeftIcon, ArrowTrendingDownIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function SellShares() {
  const navigate = useNavigate();
  const [emitters, setEmitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmitter, setSelectedEmitter] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(new Set(["1"]));
  const [customQuantity, setCustomQuantity] = useState('');
  const [selectedFraction, setSelectedFraction] = useState(new Set(["1"]));
  const [showCustomInput, setShowCustomInput] = useState(false);

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
    if (!price) return '0,00';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(price);
  };

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
    
    if (!selectedEmitter) return '0,00';
    
    const lastPriceData = selectedEmitter.precio_actual?.[selectedEmitter.precio_actual.length - 1];
    const price = lastPriceData?.precio || 0;
    const total = quantity * fraction * price;
    return formatPrice(total);
  };

  const handleSell = () => {
    setIsSellModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const openSellModal = (emitter) => {
    setSelectedEmitter(emitter);
    setIsSellModalOpen(true);
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
      <main className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            isIconOnly
            variant="light"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Vender Acciones</h1>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startContent={
              <MagnifyingGlassIcon className="w-5 h-5 text-textSecondary" />
            }
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredEmitters.map((emitter) => {
              const lastPrice = emitter.precio_actual?.[emitter.precio_actual.length - 1];
              const priceChange = calculatePriceChange(emitter.precio_actual);
              
              return (
                <div 
                  key={emitter.id} 
                  className="bg-background rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {emitter.imagen && (
                        <img 
                          src={emitter.imagen} 
                          alt={emitter.nombre_empresa || 'Company'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-white font-semibold text-sm">{emitter.nombre_empresa || 'Sin nombre'}</h3>
                        <p className="text-textSecondary text-xs">{emitter.nemotecnico || 'Sin símbolo'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex flex-col items-end gap-1">
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
                  <Button
                    color="primary"
                    size="sm"
                    className="w-full mt-4 rounded-full"
                    startContent={<ArrowTrendingDownIcon className="w-5 h-5" />}
                    onPress={() => openSellModal(emitter)}
                  >
                    Vender acciones
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Sell Modal */}
        <Modal 
          isOpen={isSellModalOpen} 
          onClose={() => setIsSellModalOpen(false)}
          placement="bottom"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Vender acciones de {selectedEmitter?.nombre_empresa}
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
                  <p className="text-textSecondary">Valor total de venta</p>
                  <p className="text-2xl font-bold text-white">${calculateTotalPrice()}</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsSellModalOpen(false)}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleSell}>
                Vender
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
              <div className="bg-green-500 rounded-full p-4">
                <ArrowTrendingDownIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-center">
                ¡Venta exitosa!
              </h2>
              <div className="bg-background p-4 rounded-xl w-full">
                <p className="text-textSecondary text-center">Valor de la venta</p>
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
                Volver al inicio
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </main>
    </MainLayout>
  );
} 