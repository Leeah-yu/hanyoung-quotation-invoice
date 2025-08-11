// App.js
import React, { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";

const QuoteForm           = lazy(() => import("./QuoteForm"));
const Preview             = lazy(() => import("./Preview"));
const QuotationCustoms    = lazy(() => import("./QuotationCustoms"));
const QuotationConsulting = lazy(() => import("./QuotationConsulting"));
const QuotationFTA        = lazy(() => import("./QuotationFTA"));
const CustomsPreview      = lazy(() => import("./customspreview"));
const ConsultingPreview   = lazy(() => import("./ConsultingPreview"));

function App() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>로딩 중…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<QuoteForm />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/customs" element={<QuotationCustoms />} />
        <Route path="/consulting" element={<QuotationConsulting />} />
        <Route path="/fta" element={<QuotationFTA />} />
        <Route path="/customspreview" element={<CustomsPreview />} />
        <Route path="/consultingpreview" element={<ConsultingPreview />} />
        <Route
          path="*"
          element={
            <div style={{ padding: 40 }}>
              페이지를 찾을 수 없습니다. <Link to="/">홈으로</Link>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
