import { useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/usersManager";
import book from "../assets/bluebook.png";
import { useState } from "react";
import { BsTrash3, BsClipboardCheck } from "react-icons/bs";
import {
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import type { GoogleBooksResponse, SavedBook } from "../../types/books";
import { ToastContainer, toast } from "react-toastify/unstyled";
import { getBooksData } from "../../googleBooksManager/BooksFunctions";
import { gemini } from "../../gemini-Ai/geminiManager";
import GeminiAssistantPanel from "../components/GeminiAssistantPanel";
import { RiGeminiLine } from "react-icons/ri";
import useGeneralStore from "../../zustand/generalState";

export default function AddBookPage() {
  const { user, setUser } = useAuthStore();
  const userId = user?.uid;
  const navigate = useNavigate();
  const [isbn, setIsbn] = useState("");
  const [authors, setAuthors] = useState<string[] | undefined>([""]);
  const [title, setTitle] = useState("");
  const [relaseYear, setrelaseYear] = useState<string | undefined>("");
  const [casaEditrice, setCasaEditrice] = useState<string | undefined>("");
  const [category, setCategory] = useState<string[] | undefined>([""]);
  const [bookId, setbookId] = useState("");
  const [tag, setTags] = useState("");
  const { isGeminiOpen, setIsGeminiOpen } = useGeneralStore();

  const addAuthor = () => {
    setAuthors([...(authors ?? []), ""]);
  };

  const removeAuthor = (indexToRemove: number) => {
    setAuthors(authors?.filter((_, index) => index !== indexToRemove));
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...(authors ?? [])];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const getTitle = (event: any) => {
    setTitle(event.target.value);
  };

  const getYear = (event: any) => {
    setrelaseYear(event.target.value);
  };

  const getCasaEd = (event: any) => {
    setCasaEditrice(event.target.value);
  };

  const getCategory = (event: any) => {
    setCategory(event.target.value);
  };

  const getIsbn = (event: any) => {
    setIsbn(event.target.value);
  };

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  const clearFields = () => {
    setTags("");
    setbookId("");
    setIsbn("");
    setTitle("");
    setAuthors([""]);
    setrelaseYear("");
    setCasaEditrice("");
    setCategory([""]);
  };

  const addBookToArchive = async () => {
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }

    if (
      !title.trim() ||
      !relaseYear?.trim() ||
      category?.length == 0 ||
      !casaEditrice?.trim() ||
      authors?.length === 0 ||
      authors?.some((author) => !author.trim()) ||
      !isbn.trim()
    ) {
      toast.error("Completa tutti  i campi");
      return;
    }

    let geminiResponse = "";
    try {
      geminiResponse = await gemini(
        `quali possono essere dei tag descrittivi ma genereci del libro <<${title}>> per fini di ricerca?La riposta deve essere nel formato:  cat1,cat2... e basta`
      );
    } catch (error) {
      toast.error("GEMINI ERROR");
      return;
    }

    const descArray = geminiResponse
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setTags(geminiResponse);

    const newBook: SavedBook = {
      isbn: isbn,
      bookId: bookId,
      Titolo: title,
      Autore: authors,
      DataUscita: relaseYear,
      Categoria: category,
      casaEditrice: casaEditrice,
      tags: descArray,
    };

    const q = query(collection(db, "Books"), where("idUser", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const newDocRef = doc(collection(db, "Books"));
      await setDoc(newDocRef, {
        idUser: userId,
        libriSalvati: [newBook],
      })
        .then(() => {
          toast.success("Libro aggiunto con successo");
          clearFields();
        })
        .catch(() => {
          toast.error("Errore nella creazione del documento");
        });
    } else {
      const docRef = querySnapshot.docs[0].ref;
      const docData = querySnapshot.docs[0].data();

      const existingBooks = Array.isArray(docData.libriSalvati)
        ? docData.libriSalvati
        : [];

      const updatedBooks = [...existingBooks, newBook];

      await updateDoc(docRef, {
        ...docData,
        libriSalvati: updatedBooks,
      })
        .then(() => {
          toast.success("Libro aggiunto con successo");
          clearFields();
        })
        .catch(() => {
          toast.error("Errore nell'inserimento ");
        });
    }
  };

  const fillFields = async (isbn: string) => {
    await getBooksData(isbn)
      .then((bookInfo: GoogleBooksResponse) => {
        console.log(bookInfo);
        bookInfo.items.map((item) => {
          setbookId(item.id);
          setTitle(item.volumeInfo.title);
          setAuthors(item.volumeInfo.authors);
          setCasaEditrice(item.volumeInfo.publisher);
          setrelaseYear(item.volumeInfo.publishedDate);
          setCategory(item.volumeInfo.categories);
        });
      })
      .catch(() => {
        toast.error("Libro non trovato");
      });
  };

  return (
    <div className="flex h-screen bg-blue-300 items-center justify-center pt-16 ">
      <div className="flex h-full w-9/10 flex-col items-center bg-white ">
        <ToastContainer
          position="top-center"
          autoClose={2500}
          theme="colored"
        />

        <div className="flex w-full h-1/9 pt-4 px-6 justify-between items-center">
          <div className="flex flex-row justify-center h-full">
            <div className="flex w-">
              <img src={book} className="object-fill" />
            </div>
            <div className="">
              <p>The</p>
              <p>books</p>
              <p>Archive</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="flex bg-red-500 rounded-xl items-center justify-center px-4 cursor-pointer hover:bg-red-600 w-fit"
              onClick={() => {
                logout();
              }}
            >
              <p className="text-white font-bold">Logout</p>
            </button>

            <div
              className="flex flex-row w-fit h-1/3 items-center border border-black rounded-md cursor-pointer hover:bg-blue-300 hover:border-blue-300"
              onClick={() => setIsGeminiOpen(!isGeminiOpen)}
            >
              <RiGeminiLine />
              <p className="px-2 font-bold">
                Vuoi dei consigli? Chiedi a Gemini
              </p>
            </div>

            <button className="flex items-center justify-center h-10 w-10 bg-blue-500 rounded-full text-white font-bold cursor-pointer">
              <p>{user?.email?.[0]?.toUpperCase() || "U"}</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center w-9/10 h-9/10 pt-6">
          <div className="flex h-1/9 w-full justify-between items-center">
            <p className="text-xl font-bold">Aggiungi un libro</p>
          </div>

          <div className="flex flex-col items-center w-9/10 h-full pt-6 px-6">
            {isGeminiOpen ? <GeminiAssistantPanel /> : <div></div>}
            <form className="flex flex-col w-full space-y-4">
              <h1 className="font-bold">
                Inserisci ISBN per inserimento automatico oppure compila i campi
                sottostanti
              </h1>
              <div className="flex flex-row gap-5 items-center">
                <input
                  type="text"
                  placeholder="ISBN Code"
                  className="border border-gray-400 rounded-md px-3 py-2 w-8/10"
                  onChange={getIsbn}
                  value={isbn}
                />
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    fillFields(isbn);
                  }}
                >
                  <BsClipboardCheck size={24} />
                </div>
              </div>
              <h1 className="font-bold pt-4">
                Inserisci l'autore o gli autori del libro
              </h1>
              <input
                type="text"
                placeholder="Titolo"
                className="border border-gray-400 rounded-md px-3 pt-2  w-8/10"
                onChange={getTitle}
                value={title}
              />

              <div className="space-y-2 pt-4">
                <h1 className="font-bold">
                  Inserisci ISBN per inserimento automatico oppure compila i
                  campi sottostanti
                </h1>
                {authors?.map((author, index) => (
                  <div className="flex flex-row items-center gap-5" key={index}>
                    <input
                      key={index}
                      type="text"
                      value={author}
                      onChange={(e) =>
                        handleAuthorChange(index, e.target.value)
                      }
                      placeholder={`Autore ${index + 1}`}
                      className="border border-gray-400 rounded-md px-3 py-2 w-8/10"
                    />
                    <BsTrash3
                      size={24}
                      color="red"
                      className="cursor-pointer"
                      onClick={() => removeAuthor(index)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAuthor}
                  className="text-blue-500 hover:underline"
                >
                  + Aggiungi un autore
                </button>
              </div>

              <h1 className="font-bold">
                Inserisci l'anno di uscita del libro
              </h1>
              <input
                type="string"
                placeholder="Anno di pubblicazione"
                className="border border-gray-400 rounded-md px-3 py-2  w-8/10"
                onChange={getYear}
                value={relaseYear}
              />
              <h1 className="font-bold">
                Inserisci la casa editrice del libro
              </h1>

              <input
                type="text"
                placeholder="Casa Editrice"
                className="border border-gray-400 rounded-md px-3 py-2  w-8/10"
                onChange={getCasaEd}
                value={casaEditrice}
              />
              <h1 className="font-bold">Inserisci la categoria del libro</h1>
              <input
                type="text"
                placeholder="Categoria"
                className="border border-gray-400 rounded-md px-3 py-2  w-8/10"
                onChange={getCategory}
                value={category}
              />

              <div className="flex flex-row justify-between  w-8/10 py-2">
                <button
                  type="button"
                  className="flex mt-4 bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 cursor-pointer"
                  onClick={() => {
                    clearFields();
                    navigate("/home");
                  }}
                >
                  Annulla
                </button>
                <button
                  type="button"
                  className="flex mt-4 bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 cursor-pointer"
                  onClick={() => addBookToArchive()}
                >
                  Aggiungi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
