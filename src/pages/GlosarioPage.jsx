import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Accordion, AccordionItem, Input } from "@heroui/react";
import MainLayout from "../Layout/MainLayout";

export default function GlosarioPage() {
  const [glosarioItems, setGlosarioItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlosario = async () => {
      try {
        const glosarioCollection = collection(db, "glosario");
        const glosarioSnapshot = await getDocs(glosarioCollection);
        const glosarioList = glosarioSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGlosarioItems(glosarioList);
        setFilteredItems(glosarioList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching glosario data:", error);
        setLoading(false);
      }
    };

    fetchGlosario();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(glosarioItems);
    } else {
      const filtered = glosarioItems.filter(item => 
        item.titulo?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, glosarioItems]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <MainLayout>
      <main className="">
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="semibold-24">Glosario</h1>
          <Input
            type="text"
            placeholder="Buscar término..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            }
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-center regular-16 text-textSecondary">
            No hay términos disponibles en el glosario.
          </p>
        ) : (
          <section className="flex flex-col gap-4">
            <Accordion>
              {filteredItems.map((item) => (
                <AccordionItem key={item.id} title={item.titulo}>
                  <div>
                    <p className="regular-16 text-textPrimary">
                      {item.significado}
                    </p>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}
      </main>
    </MainLayout>
  );
}
