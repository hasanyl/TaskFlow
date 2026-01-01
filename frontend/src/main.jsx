import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Tailwind CSS ve global font ayarları için kanka

/**
 * Kanka, burada AuthProvider'ı App'in dışına da koyabiliriz 
 * ama biz App.jsx içinde sarmaladığımız için burayı en sade 
 * ve standart haliyle bırakıyoruz. 
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);