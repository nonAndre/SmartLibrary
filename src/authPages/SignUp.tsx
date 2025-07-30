import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Sarai reindirizzato al login");
      })
      .then(() => {
        setTimeout(() => {
          navigate("/");
        }, 1800);
      })
      .catch(() => {
        toast.error("Error while creating user");
      });
  };

  return (
    <div className="flex h-screen  bg-gradient-to-r from-green-200 to-blue-300 justify-center items-center">
      <div className="flex flex-col w-3/6 h-9/12  rounded-2xl  items-center bg-white max-md:w-4/6 max-sm:w-5/6 max-lg:w-3/6">
        <ToastContainer
          position="top-center"
          autoClose={1800}
          theme="colored"
        />

        <div className="flex h-5/12 w-3/5 max-sm:w-full items-center flex-row  justify-center">
          <p className="text-4xl font-tesla text-blue-500 max-sm:text-2xl">
            SmartLibrary
          </p>
        </div>
        <div className="flex flex-col  w-full h-7/12 gap-9 px-5">
          <p className="flex px-4 pt-5 text-3xl text-blue-500 font-tesla">
            Register
          </p>
          <input
            placeholder="Email"
            className=" flex border-b-2 pt-5 border-gray-300   px-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            className="flex border-b-2 pt-5 border-gray-300  px-4"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col h-2/3 w-full  justify-center px-4 ">
          <button
            className="flex w-full justify-center bg-blue-400 items-center rounded-2xl px-4 h-1/4 cursor-pointer hover:bg-blue-500  hover:font-bold"
            onClick={() => signUp()}
          >
            <p className="text-white text-lg">Sign Up</p>
          </button>
          <div className="flex justify-end px-4 pt-3 gap-2">
            <p className="text-gray-500 text-lg   ">Hai già un account?</p>
            <button
              className="text-blue-500 text-lg hover:border-b-2 cursor-pointer "
              onClick={() => navigate("/")}
            >
              Accedi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
