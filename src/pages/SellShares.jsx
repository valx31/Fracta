import { useState } from 'react';
import { useNavigate } from 'react-router';
import MainLayout from '../Layout/MainLayout';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Input } from '@heroui/react';
import { ArrowLeftIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export default function SellShares() {
  const navigate = useNavigate();
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(new Set(["1"]));
  const [customQuantity, setCustomQuantity] = useState('');
  const [selectedFraction, setSelectedFraction] = useState(new Set(["1"]));
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Mock data for owned shares
  const ownedShares = [
    { id: '1', name: 'Apple Inc.', symbol: 'AAPL', price: 150.00, quantity: 5 },
    { id: '2', name: 'Microsoft', symbol: 'MSFT', price: 250.00, quantity: 3 },
    { id: '3', name: 'Amazon', symbol: 'AMZN', price: 100.00, quantity: 2 }
  ];

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
    const price = ownedShares[0]?.price || 0;
    const total = quantity * fraction * price;
    return formatPrice(total);
  };

  const handleSell = () => {
    setIsSellModalOpen(false);
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
          <h1 className="text-xl font-bold">Vender Acciones</h1>
        </div>

        {/* Owned Shares List */}
        <div className="flex flex-col gap-4">
          {ownedShares.map((share) => (
            <div key={share.id} className="bg-background rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">{share.name}</h2>
                  <p className="text-textSecondary">{share.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${formatPrice(share.price)}</p>
                  <p className="text-textSecondary">{share.quantity} acciones</p>
                </div>
              </div>
              <Button
                color="primary"
                size="lg"
                className="w-full mt-4"
                startContent={<ArrowTrendingDownIcon className="w-5 h-5" />}
                onPress={() => setIsSellModalOpen(true)}
              >
                Vender acciones
              </Button>
            </div>
          ))}
        </div>

        {/* Sell Modal */}
        <Modal 
          isOpen={isSellModalOpen} 
          onClose={() => setIsSellModalOpen(false)}
          placement="bottom"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Vender acciones de {ownedShares[0]?.name}
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
      </div>
    </MainLayout>
  );
} 