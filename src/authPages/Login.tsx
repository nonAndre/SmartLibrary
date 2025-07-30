import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuthStore from "../../zustand/usersManager";

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
    <div className="flex h-screen  bg-gradient-to-r from-blue-200 to-green-300 justify-center items-center">
      <div className="flex flex-col w-3/6 h-9/12  rounded-2xl  items-center bg-white max-md:w-4/6 max-sm:w-5/6 shadow-2xl max-lg:w-3/6">
        <ToastContainer
          position="top-center"
          autoClose={1800}
          theme="colored"
        />

        <div className="flex h-5/12 w-3/5 max-sm:w-full items-center flex-row  justify-center">
          <p className="text-3xl font-tesla text-blue-500 max-sm:text-2xl max-lg:text-3xl">
            SmartLibrary
          </p>
        </div>
        <div className="flex flex-col  w-full h-7/12 gap-9 px-5">
          <p className="flex px-4 pt-5 text-3xl text-blue-500 font-tesla">
            Login
          </p>
          <input
            placeholder="Email"
            type="email"
            className=" flex border-b-2 pt-5 border-gray-300   px-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            className="flex border-b-2 pt-5 border-gray-300  px-4"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col h-2/3 w-full justify-center px-4">
          <button
            className="flex w-full justify-center bg-blue-400 items-center rounded-2xl px-4 h-1/4 cursor-pointer hover:bg-blue-500 hover:font-bold"
            onClick={() => handleLogin()}
          >
            <p className="text-white text-lg">Login</p>
          </button>
          <div className="flex justify-end px-4 pt-3 gap-2">
            <p className="text-gray-500 text-lg   ">Non sei registrato?</p>
            <button
              className="text-blue-500 text-lg hover:border-b-2 cursor-pointer "
              onClick={() => navigate("/signUp")}
            >
              Registrati
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
