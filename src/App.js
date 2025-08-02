
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuoteForm from "./QuoteForm";
import Preview from "./Preview";

function App() {
  return (
    <BrowserRouter basename="/cv-react-quotation">
      <Routes>
        <Route path="/" element={<QuoteForm />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
