import { useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem } from "@heroui/react";
import { ArrowLeftStartOnRectangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function WithdrawFlow() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(new Set([]));

  const handleWithdraw = () => {
    setIsWithdrawModalOpen(false);
    setIsBankModalOpen(true);
  };

  const handleBankSelection = () => {
    setIsBankModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const colombianBanks = [
    { id: 'bancolombia', name: 'Bancolombia' },
    { id: 'davivienda', name: 'Davivienda' },
    { id: 'bbva', name: 'BBVA Colombia' },
    { id: 'bogota', name: 'Banco de Bogotá' },
    { id: 'occidente', name: 'Banco de Occidente' },
    { id: 'popular', name: 'Banco Popular' },
    { id: 'avvillas', name: 'AV Villas' },
    { id: 'colpatria', name: 'Scotiabank Colpatria' },
    { id: 'itau', name: 'Itaú' },
    { id: 'falabella', name: 'Banco Falabella' }
  ];

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const balance = 50000.04;
  const maxWithdrawal = 45000; 

  return (
    <>
      <Button
        className="bg-primary rounded-full w-full py-7"
        startContent={
          <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-secondary" />
        }
        onPress={() => setIsWithdrawModalOpen(true)}
      >
        <p className="regular-16 text-secondary">Retirar</p>
      </Button>

      {/* Withdraw Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        placement="bottom"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
              <span>Retirar fondos</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm font-medium">Saldo disponible</p>
                <p className="text-lg font-bold">{formatCurrency(balance)}</p>
              </div>

              <Input
                type="number"
                label="Monto a retirar (COP)"
                placeholder="Ingresa el monto"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
              />
              <p className="text-sm text-textSecondary">
                Monto máximo de retiro: {formatCurrency(maxWithdrawal)}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsWithdrawModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleWithdraw}
              isDisabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) <= maxWithdrawal}
            >
              Continuar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bank Selection Modal */}
      <Modal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        placement="bottom"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
              <span>Selecciona tu banco</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm font-medium">Monto a retirar</p>
                <p className="text-lg font-bold">{formatCurrency(withdrawAmount)}</p>
              </div>
              
              <Select
                label="Banco destino"
                placeholder="Elige un banco"
                selectedKeys={selectedBank}
                onSelectionChange={setSelectedBank}
                className="w-full"
              >
                {colombianBanks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </SelectItem>
                ))}
              </Select>
              
              <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-blue-700">
                  El dinero será transferido a la cuenta bancaria asociada a tu perfil en el banco seleccionado.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsBankModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleBankSelection}
              isDisabled={selectedBank.size === 0}
            >
              Confirmar retiro
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
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-center">
              ¡Retiro exitoso!
            </h2>
            <div className="bg-gray-100 p-4 rounded-xl w-full">
              <p className="text-center text-gray-500">Monto retirado</p>
              <p className="text-2xl font-bold text-center">
                {formatCurrency(withdrawAmount)}
              </p>
            </div>
            <p className="text-sm text-center text-gray-500">
              El dinero será transferido a tu cuenta bancaria en las próximas 24 horas hábiles.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="w-full"
              onPress={() => {
                setIsSuccessModalOpen(false);
                setWithdrawAmount('');
                setSelectedBank(new Set([]));
              }}
            >
              Entendido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
