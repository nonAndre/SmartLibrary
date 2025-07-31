import { useState } from "react";
import useAuthStore from "../../zustand/usersManager";
import book from "../assets/bluebook.png";
import { IoMdAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, setUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end pt-20 px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="relative  w-3/10 h-3/5 p-6 rounded-lg shadow-lg z-50 flex flex-col  bg-white max-md:w-3/5">
            <div className="flex justify-end w-full h-1/11  items-center">
              <button
                className="flex h-10 w-10 hover:bg-gray-200 justify-center items-center rounded-2xl cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <IoMdClose size={28} />
              </button>
            </div>
            <div className="flex justify-center w-full h-1/11  items-center pt-10 ">
              <div className="flex items-center justify-center w-15 h-15 rounded-full  text-white border-2 border-blue-900 font-bold text-lg  bg-blue-900">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex items-center justify-center pt-9">
              {user?.email}
            </div>
            <div className="flex items-center justify-center h-4/12 ">
              <div className="flex rounded-2xl justify-between  h-1/2 w-full gap-3 max-sm:flex-col">
                <div className="flex w-1/2 flex-row items-center gap-2 justify-center cursor-pointer border-2 border-gray-300 hover:bg-gray-300 rounded-2xl max-sm:w-full">
                  <IoMdAdd size={30} />
                  <p className="text-xl max-lg:text-sm">Add another account</p>
                </div>
                <div
                  className="flex w-1/2 flex-row items-center gap-2 justify-center hover:bg-red-600 cursor-pointer border-2 border-gray-300 rounded-2xl max-sm:w-full hover:text-white hover:font-bold hover:border-red-600"
                  onClick={() => logout()}
                >
                  <IoIosLogOut size={30} />
                  <p className="text-xl max-lg:text-sm">Logout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="relative flex h-1/10 w-full px-4 shadow-md  justify-between">
        <div className="flex flex-row justify-start h-full  items-center  w-1/2 ">
          <div className="flex flex-row w-1/2 h-full items-center">
            <img src={book} className="object-contain h-full" />
            <div className="flex">
              <p className="font-tesla text-2xl text-blue-700 max-sm:text-lg">
                SmartLibrary
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-full w-1/2 justify-end items-center">
          <button
            className="flex items-center justify-center w-15 h-15 max-sm:w-10 max-sm:h-10 max-sm:text-md rounded-full  text-white border-2 border-blue-700 font-bold text-lg  bg-blue-700 cursor-pointer hover:bg-blue-500 hover:border-blue-500 "
            onClick={() => setIsOpen(true)}
          >
            {user?.email?.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </>
  );
}
