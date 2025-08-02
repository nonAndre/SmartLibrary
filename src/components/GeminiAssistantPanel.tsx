import { useEffect, useRef, useState } from "react";
import { FaLongArrowAltUp } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import useGeneralStore from "../../zustand/generalState";
import { gemini } from "../../gemini-Ai/geminiManager";
import { useQuery } from "@tanstack/react-query";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../zustand/usersManager";
import type { BookArchive } from "../../types/books";

export default function GeminiAssistantPanel() {
  const { isGeminiOpen, setIsGeminiOpen } = useGeneralStore();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Ciao! Come posso aiutarti oggi?" },
  ]);
  const intention =
    "Capisci dal contesto se si tratta di una richiesta di ricerca nell'archivio dei libri posseduti o di altro. Rispondi solo RICERCA se si tratta di una ricerca e solo con ALTRO se si tratta di altro. Richiesta: ";
  const getTitlesPrompt =
    "Estrai dalla richiesta che segue i titoli/il titolo dei libri richiesti e rispondi dando SOLO l'elenco degli stessi nella forma titolo1,titolo2 e così via";
  const [input, setInput] = useState("");
  const { user } = useAuthStore();
  const userId = user?.uid;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchBooks = async () => {
    let libri: any = [];
    const q = query(collection(db, "Books"), where("idUser", "==", userId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      libri.push({ ...doc.data(), id: doc.id });
    });
    return libri;
  };

  const { data } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  function checkInArchive(titles: string[]): string {
    const savedTitles = data.flatMap((entry: BookArchive) =>
      entry.libriSalvati.map((book) => book.Titolo.toLowerCase())
    );

    const results = titles.map((title) => {
      const lowerTitle = title.toLowerCase();
      const isPresent = savedTitles.includes(lowerTitle);

      if (isPresent) {
        return `\nIl libro: ${title} e' presente nell'archivio`;
      }
      return `\nIl libro: ${title} non  e' presente nell'archivio`;
    });

    return results.join("\n");
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setInput("");
    setMessages(newMessages);

    try {
      const response = await gemini(intention + input);

      if (response.trim().toUpperCase() === "ALTRO") {
        const fullReply = await gemini(input);
        setMessages((prev) => [...prev, { sender: "bot", text: fullReply }]);
      } else {
        const estrazioneTitoli = await gemini(getTitlesPrompt + input);

        const descArray = estrazioneTitoli
          .toLowerCase()
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);

        const checkResult = checkInArchive(descArray);

        setMessages((prev) => [...prev, { sender: "bot", text: checkResult }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Errore nel recupero della risposta." },
      ]);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-end p-4 modal">
      <div className="relative bg-white w-[25%] h-[60%] p-4 rounded-2xl  z-50 flex flex-col border border-gray-200 max-xl:w-3/5 shadow-2xl max-sm:w-full">
        <div className="flex flex-row mb-4 items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Gemini Assistant
          </h1>
          <IoCloseSharp
            className="cursor-pointer"
            size={24}
            onClick={() => setIsGeminiOpen(!isGeminiOpen)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-gray-200 self-end text-right text-gray-900 ml-auto"
                  : "bg-blue-100 text-blue-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex items-center gap-2 border rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            placeholder="Chiedi qualcosa a Gemini..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 outline-none text-sm"
          />
          <button
            onClick={handleSend}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <FaLongArrowAltUp className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
