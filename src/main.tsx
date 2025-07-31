import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./style.css";
import HomePage from "../src/pages/HomePage.tsx";
import AddBookPage from "../src/pages/AddBookPage.tsx";
import Login from "../src/authPages/Login.tsx";
import SignUp from "../src/authPages/SignUp.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ModifyBookPage from "../src/pages/ModifyBookPage.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/home/addBook",
    element: <AddBookPage />,
  },
  {
    path: "/home/modifyBook",
    element: <ModifyBookPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
