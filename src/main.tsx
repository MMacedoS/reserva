import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext"; // ajuste o caminho
import { App } from "./App";
import "./index.css"; // ajuste o caminho se necessário 
import { SidebarProvider } from "./contexts/SidebarContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>   
      <AuthProvider>
         <SidebarProvider>
          <App />
        </SidebarProvider>
      </AuthProvider>
  </React.StrictMode>
);
