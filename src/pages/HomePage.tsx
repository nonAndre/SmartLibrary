import useAuthStore from "../../zustand/usersManager.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { RiGeminiLine } from "react-icons/ri";
import useGeneralStore from "../../zustand/generalState.ts";
import Header from "./../components/Header.tsx";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks, deleteBook } from "../utils/firebaseUtils.ts";
import type { BookArchive, SavedBook } from "../../types/books.ts";

import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";

function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();
  const userId = user?.uid;
  const [isOpen, setIsOpen] = useState(false);
  const [appoUid, setAppoUid] = useState("");
  const [appoBookUid, setAppoBookUid] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  //const { isGeminiOpen, setIsGeminiOpen } = useGeneralStore();

  const categories: string[] = [
    "Isbn",
    "Titolo",
    "Autori",
    "Anno di pubblicazione",
    "Casa Editrice",
    "Categoria",
    "Azioni",
  ];

  const deleteActions = (userId: string, bookId: string) => {
    setAppoUid(userId);
    setAppoBookUid(bookId);
    setIsOpen(true);
  };

  const { data, refetch } = useQuery({
    queryKey: ["books", userId],
    queryFn: ({ queryKey }) => {
      const [_key, uid] = queryKey;
      if (!uid) throw new Error("Missing user ID");
      return fetchBooks(uid);
    },
    enabled: !!userId,
  });

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm?.trim()) return data;

    const lowercasedTerm = debouncedSearchTerm.toLowerCase();

    return data
      ?.map((book: BookArchive) => {
        const filteredBooks = book.libriSalvati.filter((b) => {
          return (
            b?.Titolo?.toLowerCase().includes(lowercasedTerm) ||
            (Array.isArray(b.Categoria) &&
              b.Categoria.some((cat) =>
                cat.toLowerCase().includes(lowercasedTerm)
              )) ||
            (Array.isArray(b.tags) &&
              b.tags.some((cat) => cat.toLowerCase().includes(lowercasedTerm)))
          );
        });

        return filteredBooks.length
          ? { ...book, libriSalvati: filteredBooks }
          : null;
      })
      .filter(Boolean);
  }, [data, debouncedSearchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="relative bg-white w-2/6 p-6 rounded-lg shadow-lg z-50 flex flex-col justify-between">
            <div>
              <h1 className="font-bold text-lg">
                Stai per eliminare un libro, sei sicuro?
              </h1>
              <p className="pt-5 text-xl">Id: {appoBookUid}</p>
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
                onClick={() =>
                  deleteBook(appoUid, appoBookUid)
                    .then(() => {
                      setIsOpen(false);
                      refetch();
                    })
                    .catch(() => toast.error("Delete failed"))
                }
              >
                <p className="text-xl text-center">Elimina</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div className="flex flex-col h-screen bg-white">
        <Header />
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-row justify-between items-center px-10 h-[10%]">
            <div className="flex w-1/2">
              <p className="text-2xl">All Books</p>
            </div>
            <div className="flex flex-row items-center w-1/2 justify-end gap-10">
              <div className="flex flex-row items-center w-2/6 border border-gray-300 rounded-md px-2 cursor-pointer">
                <CiSearch size={20} className="text-gray-500" />
                <input
                  className="w-full px-2 py-1 outline-none"
                  placeholder="Look for a book"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                className="flex flex-row items-center justify-center gap-2 w-1/5 bg-blue-700 rounded-md px-4 py-2 hover:bg-blue-500 cursor-pointer"
                onClick={() => {
                  navigate("/home/addBook");
                }}
              >
                <IoAdd size={30} color="white" />
                <p className="text-white text-xl">Add book</p>
              </button>
            </div>
          </div>

          <div className="px-8 py-6 overflow-auto w-full ">
            <div className="grid grid-cols-7 gap-4 bg-white px-4 py-3 rounded-md font-bold">
              {categories.map((item, index) => (
                <div key={index} className="text-start">
                  {item}
                </div>
              ))}
            </div>

            {filteredData?.map((item: BookArchive, index: number) =>
              item.libriSalvati.map((libro: SavedBook, idx: number) => (
                <div
                  key={`${index}-${idx}`}
                  className="grid grid-cols-7 gap-4 border-b border-b-gray-400 px-4 py-2 text-start hover:bg-gray-200"
                >
                  <p>{libro.isbn}</p>
                  <p>{libro.Titolo}</p>
                  <p>
                    {Array.isArray(libro.Autore)
                      ? libro.Autore.map((author, i) => (
                          <span key={i}>
                            {author}
                            <br />
                          </span>
                        ))
                      : libro.Autore}
                  </p>
                  <p>{libro.DataUscita}</p>
                  <p>{libro.casaEditrice}</p>
                  <p>{libro.Categoria}</p>
                  <div className="flex flex-row gap-10">
                    <div
                      className="p-2 rounded-full hover:bg-blue-200 cursor-pointer transition"
                      onClick={() =>
                        navigate("/home/modifyBook", {
                          state: { UsId: userId, bookData: libro },
                        })
                      }
                    >
                      <MdModeEdit size={25} className="cursor-pointer" />
                    </div>
                    <div className="p-2 rounded-full hover:bg-red-200 cursor-pointer transition">
                      <MdDelete
                        size={25}
                        className="cursor-pointer"
                        color="red"
                        onClick={() => deleteActions(item.idUser, libro.bookId)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
