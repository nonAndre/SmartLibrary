import "./style.css";
import useAuthStore from "../zustand/usersManager.ts";
import book from "./assets/bluebook.png";
import { BsPlus} from "react-icons/bs";
import Table from "./Table.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RiGeminiLine } from "react-icons/ri";
import useGeneralStore from "../zustand/generalState.ts";


function HomePage() {
  const {user,setUser} = useAuthStore();
  const navigate = useNavigate();
  const [search,setSearch] = useState("");
  const {isGeminiOpen,setIsGeminiOpen}=useGeneralStore();
  
  const logout =()=>
  {
     setUser(null);
     navigate('/');
  }

  const getBookToSearch = (event:any)=>
  {
    setSearch(event.target.value);
  }

  return( 
    <div className="flex h-screen bg-blue-300 items-center justify-center">
      <div className="flex bg-white h-9/10 w-9/10 flex-col items-center ">
      
        <div className="flex w-full h-1/9 pt-4 px-6 justify-between items-center">
            <div className="flex flex-row justify-center h-full">
                    <div className="flex w-">
                       <img src={book} className="object-fill"/>
                    </div>
                    <div className="">
                          <p>The</p>
                          <p>books</p>
                          <p>Archive</p>
                    </div>
            </div>
             <div className="flex items-center space-x-4">
                <button className="flex bg-red-500 rounded-xl items-center justify-center px-4 cursor-pointer hover:bg-red-600 w-fit" onClick={()=>{logout()}}>  
                   <p className="text-white font-bold">Logout</p>
                </button>

                <div className="flex flex-row w-fit h-1/3 items-center border border-black rounded-md cursor-pointer hover:bg-blue-300 hover:border-blue-300" onClick={()=>setIsGeminiOpen(!isGeminiOpen)}>
                     <RiGeminiLine />
                     <p className="px-2 font-bold">Vuoi dei consigli? Chiedi a Gemini</p>
                </div>

                <button className="flex items-center justify-center h-10 w-10 bg-blue-500 rounded-full text-white font-bold cursor-pointer">
                  <p>{user?.email?.[0]?.toUpperCase() || 'U'}</p>
                </button>
             </div>           
      </div>
      <div className="flex flex-col items-center w-9/10 h-8/10 pt-6 ">
         <div className="flex h-1/9 w-full items-center justify-end gap-5">
            <input className="border border-gray-400 rounded-md px-2" placeholder="cerca nell'archivio..." onChange={getBookToSearch}></input> 
            
            <button className="flex flex-row h-2/5 rounded-md items-center  bg-blue-600  justify-center cursor-pointer hover:bg-blue-800" onClick={()=>navigate('/home/addBook')}>
                <BsPlus color="white" size={24}/>
                <p className="text-white px-4">Aggiungi un libro</p>
            </button>
           

         </div>

         <div className="flex h-full w-full overflow-auto rounded-2xl">
           <Table bookTs={search}/>   
         </div>
      </div>
      

               </div>
   </div>  
  );
 

}

export default HomePage;
