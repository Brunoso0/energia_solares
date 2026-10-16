import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./telas-grandes.css";

const root = createRoot(document.getElementById("root"));
flushSync(() => root.render(<App />));

// O motor lê o DOM já pronto: só entra depois que o React terminou de desenhar.
const motor = document.createElement("script");
motor.src = "/sites-incriveis.js";
document.body.appendChild(motor);
