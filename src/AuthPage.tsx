import display from "../src/assets/loginImage.jpg"
import logo from "../src/assets/bluebook.png"
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom";
import { ToastContainer ,toast } from "react-toastify";
import useAuthStore from "../zustand/usersManager"
export default function AuthPage() {

  const [username,setUsername]= useState('');
  const [password,setPassword]=useState('');
  const {setUser} = useAuthStore();
  const navigate  = useNavigate();

  const getUsername = (event:any) => {
    setUsername(event.target.value);
    console.log(username);
  };


  const getPassword = (event:any) => {
    setPassword(event.target.value);
    console.log(password);
  };
  
 

  const handleLogin = () => {
    signInWithEmailAndPassword(auth,username,password)
    .then((userCredential)=>{
      setUser(userCredential.user);
      navigate('/home');
    })
    .catch(()=>{
      toast.error("Wrong Username or Password");
    })
  };
  
   return (
    <div className="flex bg-blue-300 h-screen items-center justify-center">
      <div className="flex bg-white flex-row gap-y-4 items-center h-9/12 w-2/3 justify-between rounded-2xl" >
          <ToastContainer position="top-center" autoClose={2500} theme="colored"/>

            <div className="flex flex-col gap-4 pt-4 px-4 items-center w-2/4 h-9/10 m-5 rounded-2xl">

                 <div className="flex flex-col gap-5 h-9/10 w-7/8 items-center">
                       <div className="flex flex-row justify-between w-full items-center">
                          <div className="flex flex-row w-1/4">
                              <img src={logo} className="self-center"/>
                              <div className="flex flex-col w-full">
                                  <p>The books</p>
                                  <p>Archive</p>
                              </div>
                            </div>

                          <button onClick={()=>{navigate('/signUp')}} className="flex border border-blue-300 w-fit rounded-4xl items-center justify-center h-8 cursor-pointer">
                                  <p className="text-blue-300 px-4">Sign Up</p>
                          </button>
                       </div>

                       <h1 className=" font-bold text-3xl pt-4 pb-12">Welcome</h1>
                                               
                        <p>Email </p>
                        <input type="email" value={username} onChange={getUsername} className="w-3/4 rounded-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 border border-gray-500  text-gray-500 disabled:shadow-none"/> 

                        <p>Password</p>
                        <input type="password"  value={password}  onChange={getPassword} className="w-3/4 rounded-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 border border-gray-500  text-gray-500 disabled:shadow-none"/>
                        
                        <button className="bg-blue-400 rounded-4xl items-center w-3/4 h-12 cursor-pointer" onClick={handleLogin}>
                              <p className="text-white text-xl">Login</p>
                        </button>
                </div>
            </div> 
            
            <div className="flex h-9/10 w-2/4 m-5 rounded-2xl">
                  <img className="rounded-sm" src={display} />
            </div>
           
        </div>
    </div>
  ) 
}
