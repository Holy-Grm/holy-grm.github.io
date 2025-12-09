
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { AutoVisuPage } from "./components/AutoVisuPage";
import { PdfMergePage } from "./components/PdfMergePage";
import { PdfTrimmerPage } from "./components/PdfTrimmerPage";
import { NotFoundPage } from "./components/NotFoundPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/autovisu" element={<AutoVisuPage />} />
      <Route path="/pdfmerge" element={<PdfMergePage />} />
      <Route path="/pdfTrim" element={<PdfTrimmerPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </HashRouter>
);
  
