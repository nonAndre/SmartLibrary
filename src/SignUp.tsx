import display from "../src/assets/loginImage.jpg"
import { useState } from "react";
import {auth} from "../firebase/firebaseConfig"
import {useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import logo from "../src/assets/bluebook.png"
import { ToastContainer,toast } from "react-toastify";


export default function SignUp() {

  const [email,setEmail]= useState('');
  const [password,setPassword]=useState('');

  const navigate  = useNavigate();

  const getEmail = (event:any) => {
    setEmail(event.target.value);
    console.log(email);
  };


  const getPassword = (event:any) => {
    setPassword(event.target.value);
    console.log(password);
  };
  
  const signUp = async () => {
    await createUserWithEmailAndPassword(auth,email,password)
    .then(()=>
    {
      toast.success("Sarai reindirizzato al login");
    })
    .then(()=>{
      setTimeout(() => {
      navigate('/');
    }, 1800);
    })
    .catch(()=>{
      toast.error("Error while creating user");
    })
  };


  return (
    <div className="flex bg-blue-300 h-screen items-center justify-center">
      <div className="flex bg-white flex-row gap-y-4 items-center h-9/12 w-2/3 justify-between rounded-2xl" >
            <ToastContainer position="top-center" autoClose={1800} theme="colored"/>
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

                          <div className="flex border border-blue-300 w-fit rounded-4xl items-center justify-center h-8 cursor-pointer">
                                  <p className="text-blue-300 px-4">Welcome</p>
                          </div>
                       </div>

                       <h1 className=" font-bold text-3xl pt-4 pb-12">Sign Up</h1>
                                               
                        <p>Email </p>
                        <input type="email" value={email} onChange={getEmail} className="w-3/4 rounded-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 border border-gray-500  text-gray-500 disabled:shadow-none"/> 

                        <p>Password</p>
                        <input type="password"  value={password}  onChange={getPassword} className="w-3/4 rounded-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 border border-gray-500  text-gray-500 disabled:shadow-none"/>
                        
                        <button className="bg-blue-400 rounded-4xl items-center w-3/4 h-12 cursor-pointer" onClick={signUp}>
                              <p className="text-white text-xl">Create Account</p>
                        </button>

                       <div className="flex flex-row pt-15 items-center justify-center">
                           <p className="text-gray-400 text-sm px-2">Sei già iscritto?</p>
                           <button className="items-center cursor-pointer" onClick={()=>{navigate('/')}}>
                              <p className="text-blue-400">Accedi</p>
                            </button>
                        </div>
                </div>
            </div> 
            
            <div className="flex h-9/10 w-2/4 m-5 rounded-2xl">
                  <img className="rounded-sm" src={display} />
            </div>
           
        </div>
    </div>
  )
}
