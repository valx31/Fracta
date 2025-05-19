import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Accordion, AccordionItem, Input, Button } from "@heroui/react";
import MainLayout from "../Layout/MainLayout";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function GlosarioPage() {
  const [glosarioItems, setGlosarioItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGlosario = async () => {
      try {
        const glosarioCollection = collection(db, "glosario");
        const glosarioSnapshot = await getDocs(glosarioCollection);
        const glosarioList = glosarioSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort items alphabetically by title
        const sortedList = [...glosarioList].sort((a, b) => {
          const titleA = a.titulo?.toLowerCase() || '';
          const titleB = b.titulo?.toLowerCase() || '';
          return titleA.localeCompare(titleB);
        });
        
        setGlosarioItems(sortedList);
        setFilteredItems(sortedList);
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
        <div className="flex items-center justify-between">
          <Button
            isIconOnly
            variant="light"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Glosario</h1>
        </div>
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
