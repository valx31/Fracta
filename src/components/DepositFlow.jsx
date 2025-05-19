import { useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem } from "@heroui/react";
import { BanknotesIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function DepositFlow() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isPseModalOpen, setIsPseModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(new Set([]));

  const handleDeposit = () => {
    setIsDepositModalOpen(false);
    setIsPseModalOpen(true);
  };

  const handlePsePayment = () => {
    setIsPseModalOpen(false);
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

  return (
    <>
      <Button
        className="bg-secondary rounded-full w-full py-7"
        startContent={
          <BanknotesIcon className="w-6 h-6 text-primary" />
        }
        onPress={() => setIsDepositModalOpen(true)}
      >
        <p className="regular-16 text-primary">Depositar</p>
      </Button>

      {/* Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        placement="bottom"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5" />
              <span>Depositar fondos</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                type="number"
                label="Monto a depositar (COP)"
                placeholder="Ingresa el monto"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
              />
              <p className="text-sm text-textSecondary">
                Monto mínimo de depósito: $50.000 COP
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsDepositModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleDeposit}
              isDisabled={!depositAmount || parseInt(depositAmount) < 50000}
            >
              Continuar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* PSE Bank Selection Modal */}
      <Modal
        isOpen={isPseModalOpen}
        onClose={() => setIsPseModalOpen(false)}
        placement="bottom"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <img
                src="https://images.seeklogo.com/logo-png/42/1/pse-logo-png_seeklogo-428096.png"
                alt="PSE Logo"
                className="h-14"
              />
              <span>Pago PSE</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm font-medium">Monto a depositar</p>
                <p className="text-lg font-bold">{formatCurrency(depositAmount)}</p>
              </div>
              
              <Select
                label="Selecciona tu banco"
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
                  Serás redirigido al portal de tu banco para completar la transacción de forma segura.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsPseModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handlePsePayment}
              isDisabled={selectedBank.size === 0}
            >
              Ir al banco
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
              ¡Depósito exitoso!
            </h2>
            <div className="bg-gray-100 p-4 rounded-xl w-full">
              <p className="text-center text-gray-500">Monto depositado</p>
              <p className="text-2xl font-bold text-center">
                {formatCurrency(depositAmount)}
              </p>
            </div>
            <p className="text-sm text-center text-gray-500">
              El dinero estará disponible en tu cuenta en los próximos minutos.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="w-full"
              onPress={() => {
                setIsSuccessModalOpen(false);
                setDepositAmount('');
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
