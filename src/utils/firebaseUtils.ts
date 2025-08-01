import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const fetchBooks = async (userId:string) => {
    
    let libri: any = [];
    const q = query(collection(db, "Books"), where("idUser", "==", userId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      libri.push({ ...doc.data(), id: doc.id });
    });

    console.log("UserId"+userId);
    console.log(libri);
    
    return libri;
  };

 export  const deleteBook = async (userId:string,bookIdToDelete: string) => {
     if (userId=== "undefined") {
       console.error("Missing user ID");
       return;
     }
 
     try {
       const q = query(
         collection(db, "Books"),
         where("idUser", "==", userId)
       );
       const querySnapshot = await getDocs(q);
 
       if (querySnapshot.empty) {
         console.warn("No document found for this user.");
         return;
       }
 
       const docRef = querySnapshot.docs[0].ref;
       const docData = querySnapshot.docs[0].data();
       const existingBooks = Array.isArray(docData.libriSalvati)
         ? docData.libriSalvati
         : [];
 
       const updatedBooks = existingBooks.filter(
         (book: any) => book.bookId !== bookIdToDelete
       );
 
       await updateDoc(docRef, {
         libriSalvati: updatedBooks,
       })
              } catch (error) {
       console.error("Error deleting book:", error);
     }
   }; 

   