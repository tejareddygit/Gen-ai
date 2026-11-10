import { createBrowserRouter } from "react-router";
import Login from "./Features/Auth/Pages/Login";
import Register from "./Features/Auth/Pages/Register";
import Protected from "./Features/Auth/Components/Protected";
import Home from "./Features/interview/Pages/Home";
import Interview from "./Features/interview/Pages/interview";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
]);
