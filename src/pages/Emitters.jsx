import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import MainLayout from '../Layout/MainLayout';
import Header from '../components/Header';

export default function Emitters() {
  const [emitters, setEmitters] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <MainLayout>
      <Header />
      <main className="flex flex-col gap-8 p-6">
        <h1 className="text-2xl font-bold text-white">Acciones Disponibles</h1>
        
        {loading ? (
          <div className="text-white">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-background rounded-lg">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-4 text-white">Empresa</th>
                  <th className="p-4 text-white">Nemo</th>
                  <th className="p-4 text-white">Descripción</th>
                  <th className="p-4 text-white">Precio</th>
                  <th className="p-4 text-white">Dividendos</th>
                  <th className="p-4 text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {emitters.map((emitter) => {
                  const lastPrice = emitter.precio_actual[emitter.precio_actual.length - 1];
                  return (
                    <tr key={emitter.id} className="border-b border-gray-700">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {emitter.imagen && (
                            <img 
                              src={emitter.imagen} 
                              alt={emitter.nombre_empresa}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <span className="text-white">{emitter.nombre_empresa}</span>
                        </div>
                      </td>
                      <td className="p-4 text-white">{emitter.nemotecnico}</td>
                      <td className="p-4 text-white">{emitter.descripcion}</td>
                      <td className="p-4 text-white">${lastPrice.precio}</td>
                      <td className="p-4 text-white">${emitter.dividendos_por_accion}</td>
                      <td className="p-4 text-white">{emitter.acciones_en_circulacion.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </MainLayout>
  );
} 