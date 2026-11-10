import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.router.jsx";
import { AuthProvider } from "./Features/Auth/auth.context.jsx";
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
