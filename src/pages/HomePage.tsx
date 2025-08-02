import useAuthStore from "../../zustand/usersManager.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { IoAdd } from "react-icons/io5";
import useGeneralStore from "../../zustand/generalState.ts";
import Header from "./../components/Header.tsx";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks, deleteBook } from "../utils/firebaseUtils.ts";
import type { BookArchive } from "../../types/books.ts";

import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import GeminiAssistantPanel from "../components/GeminiAssistantPanel.tsx";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isGeminiOpen, setIsGeminiOpen } = useGeneralStore();
  const userId = user?.uid;
  const [isOpen, setIsOpen] = useState(false);
  const [appoUid, setAppoUid] = useState("");
  const [appoBookUid, setAppoBookUid] = useState("");
  const [appoBookIsbn, setAppoBookIsbn] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  //const { isGeminiOpen, setIsGeminiOpen } = useGeneralStore();

  const categories: string[] = [
    "Isbn",
    "Title",
    "Authors",
    "Release Year",
    "Publisher",
    "Genre",
    "Actions",
  ];

  const deleteActions = (userId: string, bookId: string, isbn: string) => {
    setAppoUid(userId);
    setAppoBookUid(bookId);
    setAppoBookIsbn(isbn);
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

          <div className="relative bg-white w-2/6 p-6 rounded-lg shadow-lg z-50 flex flex-col justify-between max-sm:w-3/4">
            <div>
              <h1 className="font-bold text-lg">
                You are about to delete a book,are you sure?
              </h1>
              <p className="pt-5 text-xl">Isbn: {appoBookIsbn}</p>
            </div>

            <div className="flex flex-row justify-between mt-6">
              <button
                className="cursor-pointer h-10 w-1/3 bg-red-500 hover:bg-red-700 rounded text-white"
                onClick={() => setIsOpen(false)}
              >
                <p className="text-xl text-center">Cancel</p>
              </button>

              <button
                className="cursor-pointer h-10 w-1/3 bg-blue-500 hover:bg-blue-700 rounded text-white"
                onClick={() =>
                  deleteBook(appoUid, appoBookUid)
                    .then(() => {
                      setIsOpen(false);
                      refetch();
                    })
                    .catch(() => toast.error("Delete failed"))
                }
              >
                <p className="text-xl text-center">Delete</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div className="flex flex-col h-screen bg-white">
        <Header />
        <div className="flex flex-col flex-1 px-10 py-6 max-sm:px-5">
          {isGeminiOpen ? <GeminiAssistantPanel /> : <div></div>}
          <div className="flex items-center justify-between mb-6 max-sm:flex-col max-sm:items-start">
            <h1 className="text-2xl font-semibold ">All Books</h1>
            <div className="flex items-center gap-6 max-sm:py-4">
              <div className="flex items-center border border-gray-300 rounded-md px-2">
                <CiSearch size={20} className="text-gray-500" />
                <input
                  className="w-48 px-2 py-1 outline-none max-sm:w-30"
                  placeholder="Look for a book"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => navigate("/home/addBook")}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                <IoAdd size={24} />
                <span className="text-md">Add book</span>
              </button>
            </div>
          </div>

          <div className="flex text-lg font-medium text-gray-700 py-2 border-b border-gray-300 max-md:hidden">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`px-2 ${cat === "Azioni" ? "w-1/6" : "w-1/6"}`}
              >
                {cat}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto ">
            {filteredData?.map((item: BookArchive, idx: number) =>
              item.libriSalvati.map((book, i) => (
                <div
                  key={`${idx}-${i}`}
                  className="flex flex-row items-center  border-b border-gray-200 hover:bg-gray-100 transition py-5 max-md:flex-col max-md:gap-2"
                >
                  <div className="flex-row flex max-md:gap-3 w-1/6 px-2 text-md max-md:w-full ">
                    <p className="hidden max-md:block max-md:font-bold">
                      Isbn:{" "}
                    </p>
                    {book.isbn}
                  </div>
                  <div className="flex-row flex max-md:gap-3 w-1/6 px-2 text-md max-md:w-full">
                    <p className="hidden max-md:block max-md:font-bold">
                      Title:{" "}
                    </p>

                    {book.Titolo}
                  </div>
                  <div className="flex-row flex max-md:gap-3 w-1/6 px-2 text-md max-md:w-full">
                    <p className="hidden max-md:block max-md:font-bold">
                      Authors:{" "}
                    </p>

                    {Array.isArray(book.Autore)
                      ? book.Autore.join(", ")
                      : book.Autore}
                  </div>
                  <div className="flex-row flex max-md:gap-3 w-1/6 px-2 text-md max-md:w-full">
                    <p className="hidden max-md:block max-md:font-bold">
                      Release Year:{" "}
                    </p>

                    {book.DataUscita}
                  </div>
                  <div className="flex-row flex max-md:gap-3 w-1/6 px-2 text-md max-md:w-full">
                    <p className="hidden max-md:block max-md:font-bold">
                      Publisher:{" "}
                    </p>

                    {book.casaEditrice}
                  </div>
                  <div className="flex-row flex max-md:gap-3 w-1/6 px-2 text-md max-md:w-full">
                    <p className="hidden max-md:block max-md:font-bold">
                      Genre:{" "}
                    </p>

                    {Array.isArray(book.Categoria)
                      ? book.Categoria.join(", ")
                      : book.Categoria}
                  </div>
                  <div className="flex flex-row gap-1 justify-start w-1/6 max-md:w-full">
                    <div
                      className="p-2 rounded-full hover:bg-blue-200 cursor-pointer transition"
                      onClick={() =>
                        navigate("/home/modifyBook", {
                          state: { UsId: userId, bookData: book },
                        })
                      }
                    >
                      <MdModeEdit
                        size={25}
                        className="cursor-pointer"
                        color="blue"
                      />
                    </div>
                    <div className="p-2 rounded-full hover:bg-red-200 cursor-pointer transition">
                      <MdDelete
                        size={25}
                        className="cursor-pointer"
                        color="red"
                        onClick={() =>
                          deleteActions(item.idUser, book.bookId, book.isbn)
                        }
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
