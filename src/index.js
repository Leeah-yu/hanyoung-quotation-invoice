// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/hanyoung-quotation-invoice">  {/* ← 배포 경로에 맞춰 수정 */}
    <App />
  </BrowserRouter>
);
