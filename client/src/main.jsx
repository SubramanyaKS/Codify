import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./store/auth.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastContainer } from "react-toastify";
import {PopupProvider} from "./context/PopupContext.jsx"
import { QuestionsProvider } from "./context/QuestionContext.jsx";
// import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PopupProvider>
          <QuestionsProvider>
              <App />
              <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
          </QuestionsProvider>
        </PopupProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
