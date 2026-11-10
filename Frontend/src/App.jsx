import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.router.jsx";
import { AuthProvider } from "./Features/Auth/auth.context.jsx";
import { InterviewProvider } from "./Features/interview/interview.context.jsx";
const App = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
};

export default App;
