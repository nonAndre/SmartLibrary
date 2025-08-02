import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuthStore from "../../zustand/usersManager";
import logo from "../assets/bluebook.png";
import photo from "../assets/library-group-study-stockcake.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        navigate("/home");
      })
      .catch(() => {
        toast.error("Wrong Username or Password");
      });
  };

  return (
    <div className="flex h-screen  bg-gradient-to-r from-[#92beee] :via-[#918ddd] to-[#e29bac] justify-center items-center">
      <div className="flex flex-row w-4/6 h-9/12  rounded-2xl  items-center bg-white max-md:w-4/6 max-sm:w-5/6 shadow-2xl max-lg:w-5/6">
        <ToastContainer
          position="top-center"
          autoClose={1800}
          theme="colored"
        />
        <div className="flex w-1/2 h-full flex-col bg-white items-center max-sm:w-full max-md:w-full">
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-row w-1/4 items-center">
              <img src={logo} className="self-center object-contain" />
              <div className="flex flex-col w-full max-sm:hidden max-lg:hidden">
                <p>The books</p>
                <p>Archive</p>
              </div>
            </div>

            <button
              onClick={() => {
                navigate("/signUp");
              }}
              className="flex  w-fit rounded-4xl items-center justify-center h-8 cursor-pointer"
            >
              <p className="text-blue-600 px-4 text-3xl max-sm:text-xl">
                SmartLibrary
              </p>
            </button>
          </div>
          <div className="flex flex-col items-center w-full h-full gap-10">
            <h1 className=" font-bold text-3xl pt-8 pb-8">Welcome</h1>
            <div className="flex flex-col justify-center items-center w-full gap-4">
              <p>Email </p>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-3/4  rounded-md invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 border border-gray-500  text-gray-500 disabled:shadow-none"
              />
            </div>
            <div className="flex flex-col justify-center items-center  w-full gap-4">
              <p>Password</p>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-3/4 px-2 rounded-md invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 border border-gray-500  text-gray-500 disabled:shadow-none"
              />
            </div>
            <button
              className="bg-blue-400 rounded-4xl items-center w-3/4 h-12 cursor-pointer hover:bg-blue-700 hover:font-bold"
              onClick={handleLogin}
            >
              <p className="text-white text-xl">Login</p>
            </button>
            <div className="flex justify-center gap-2 w-full items-center h-2/12">
              <p className="text-gray-500 text-lg   ">First time here?</p>
              <button
                className="text-blue-500 text-lg hover:border-b-2 cursor-pointer "
                onClick={() => navigate("/signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <div className="flex h-9/10 w-1/2  rounded-2xl px-4 m-5 max-sm:hidden max-md:hidden">
          <img className="rounded-md object-cover " src={photo} />
        </div>
      </div>
    </div>
  );
}
