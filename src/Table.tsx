import { BsPencilSquare, BsTrash3 } from "react-icons/bs";
import type { BookArchive, SavedBook } from "../types/books";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import useAuthStore from "../zustand/usersManager";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useGeneralStore from "../zustand/generalState";
import GeminiAssistantPanel from "./GeminiAssistantPanel";

interface TableProps
{
  bookTs:string;
}

export default function Table({bookTs}:TableProps) {

  const [searchTerm,setSearchTerm] =useState(bookTs);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(bookTs);
  const categories:string[] =["Isbn","Titolo","Autori","Anno di pubblicazione","Casa Editrice","Categoria","Azioni"]; 
  const {user} = useAuthStore();
  const {isOpen,setIsOpen,id,setId,isGeminiOpen,setIsGeminiOpen} = useGeneralStore();
  const userId = user?.uid;
  const navigate = useNavigate();
  const [isbn,setIsbn] = useState("");
  
   const fetchBooks = async () => {
        let libri :any= [];
        const q = query(collection(db, "Books"), where("idUser", "==", userId));
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {       
          libri.push({...doc.data(),id:doc.id})
        });
        return libri;
  };
  
  const {data,refetch} = useQuery({
    queryKey:['books'],
    queryFn: fetchBooks
  });

const filteredData = useMemo(() => {
    if (!debouncedSearchTerm?.trim()) return data;

    const lowercasedTerm = debouncedSearchTerm.toLowerCase();

    return data?.map((book: BookArchive) => {
      const filteredBooks = book.libriSalvati.filter((b) => {
        return (
          b?.Titolo?.toLowerCase().includes(lowercasedTerm) ||
          Array.isArray(b.Categoria) && b.Categoria.some((cat) => cat.toLowerCase().includes(lowercasedTerm)) ||
          Array.isArray(b.tags) && b.tags.some((cat) => cat.toLowerCase().includes(lowercasedTerm))
        );
      });

      return filteredBooks.length ? { ...book, libriSalvati: filteredBooks } : null;
    }).filter(Boolean);
  }, [data, debouncedSearchTerm]);

   const deleteBook = async (bookIdToDelete: string) => {
      if (user?.uid === "undefined") {
         console.error("Missing user ID");
         return;
      }
   
      try {
         const q = query(collection(db, "Books"), where("idUser", "==", user?.uid));
         const querySnapshot = await getDocs(q);
   
         if (querySnapshot.empty) {
         console.warn("No document found for this user.");
         return;
         }
   
         const docRef = querySnapshot.docs[0].ref;
         const docData = querySnapshot.docs[0].data();
         const existingBooks = Array.isArray(docData.libriSalvati) ? docData.libriSalvati : [];
   
         const updatedBooks = existingBooks.filter((book: any) => book.bookId !== bookIdToDelete);
   
         await updateDoc(docRef, {
         libriSalvati: updatedBooks,
         }).then(()=>
         {
             setIsOpen(!isOpen);
             refetch();
         }).catch(()=>
         {
         console.error("Error while removing books");
         })
   
         console.log("Book deleted successfully");
      } catch (error) {
         console.error("Error deleting book:", error);
      }
  };

 useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

 useEffect(() => {
    setSearchTerm(bookTs);
  }, [bookTs]);

 
  return (
  <>
     {  isOpen ? (
               <div className="fixed inset-0 z-50 flex items-center justify-center">

                    <div
                      className="absolute inset-0 bg-black/50"
                      onClick={() => setIsOpen(false)} 
                    ></div>

                    <div className="relative bg-white w-2/6 p-6 rounded-lg shadow-lg z-50 flex flex-col justify-between">
                      <div>
                        <h1 className="font-bold text-lg">Stai per eliminare un libro, sei sicuro?</h1>
                        <p className="pt-5 text-xl">Id: {isbn}</p>
                      </div>

                      <div className="flex flex-row justify-between mt-6">
                        <button
                          className="cursor-pointer h-10 w-1/3 bg-red-400 hover:bg-red-500 rounded text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          <p className="text-xl text-center">Annulla</p>
                        </button>

                        <button
                          className="cursor-pointer h-10 w-1/3 bg-blue-400 hover:bg-blue-500 rounded text-white"
                          onClick={() => deleteBook(id)}
                        >
                          <p className="text-xl text-center">Elimina</p>
                        </button>
                      </div>
                    </div>

              </div>
):(<div></div>)
      }

    { isGeminiOpen ? (<GeminiAssistantPanel/>):(<div></div>)

    }  
      
    {filteredData && filteredData.length > 0 && filteredData.some((book:BookArchive) => book.libriSalvati.length > 0) ? (
      <table className="w-full bg-white shadow-md rounded-lg table-auto">
        <thead className="sticky top-0 z-10">
          <tr className="bg-blue-500 text-white text-left h-16">
            {categories.map((category, index) => (
              <th key={index} className="py-3 px-4">
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((book: BookArchive) =>
            book.libriSalvati.map((b, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50">
                <td className="py-2 px-4">{b.isbn}</td>
                <td className="py-2 px-4">
                  {b.Titolo.length > 39 ? b.Titolo.slice(0, 39) + '…' : b.Titolo}
                </td>
                <td className="py-2 px-4">
                  {Array.isArray(b.Autore) ? b.Autore.join(", ") : b.Autore}
                </td>
                <td className="py-2 px-4">{b.DataUscita}</td>
                <td className="py-2 px-4">{b.casaEditrice}</td>
                <td className="py-2 px-4">{b.Categoria}</td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2 gap-3 cursor-pointer">
                    <button
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => {
                        navigate('/home/modifyBook', {
                          state: { UsId: book.idUser, bookData: b },
                        });
                      }}
                    >
                      <BsPencilSquare size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() =>{
                        setId(b.bookId);
                        setIsbn(b.isbn);
                        setIsOpen(!isOpen);
                      }}
                    >
                      <BsTrash3 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    ) : (
      <div className="text-center py-10 text-gray-500 text-lg">
        📚 Nessun libro trovato, aggiungine uno nell'apposita pagina
      </div>
    )}
  </>
);

}
