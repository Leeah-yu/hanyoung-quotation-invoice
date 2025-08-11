import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ConsultingPreview() {
const location = useLocation();
const navigate = useNavigate();
const { type = "quotation" } = location.state || {};


const {
  selectedData = [],
  company = "",
  doc_number = "",
  discountRate = 0,
  discountAmount = 0,
  vat = 0,
  totalCost = 0,
  note = "",
} = location.state || {};

  const today = new Date();
  const dateString = `${String(today.getFullYear()).slice(2)}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const input = document.getElementById("invoice-content");

    const safeName = company ? company.replace(/[^가-힣a-zA-Z0-9]/g, "") : "고객사";
    const filename = `[관세법인한영] ${safeName}_컨설팅 견적서_${dateString}.pdf`;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth() - 40;
      const imgProps = doc.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);
      doc.save(filename);
    });
  };

  return (
    <>
      <div
        id="invoice-content"
        style={{
          fontFamily: "'Pretendard', sans-serif",
          backgroundColor: "#fff",
          color: "#222",
          padding: 60,
          maxWidth: 800,
          margin: "60px auto",
          border: "1px solid #ddd",
          lineHeight: 1.7,
          minHeight: "1122px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
          <div>
<h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 10 }}>
  {type === "invoice" ? "Invoice" : "Quotation"}
</h1>
            <p style={{ fontSize: 14 }}>No. HY25{doc_number || "XXX"} / {today.toLocaleDateString("ko-KR")}</p>
          </div>
          <div style={{ width: 170 }}>
            <img
              src={`${process.env.PUBLIC_URL}/images/HYLOGO_NAVY.png`}
              alt="한영 로고"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Client Info */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <strong>Client</strong>
            <p>{company || "업체명 없음"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <strong>Issued By</strong>
            <p>관세법인 한영</p>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40, fontSize: 14 }}>
          <thead>
            <tr style={{ backgroundColor: "#f9f9f9", borderBottom: "1px solid #ccc" }}>
    <th style={{ width: "30%", padding: 10, textAlign: "center" }}>항목</th>
    <th style={{ width: "10%", padding: 10, textAlign: "center" }}>수량</th>
    <th style={{ width: "15%", padding: 10, textAlign: "center" }}>단가</th>
    <th style={{ width: "15%", padding: 10, textAlign: "center" }}>금액</th>
    <th style={{ width: "30%", padding: 10 }}>비고</th>
            </tr>
          </thead>
<tbody>
  {selectedData.map((item, idx) => (
    <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ width: "30%", padding: 10 , textAlign: "center" }}>{item.label}</td>
      <td style={{ width: "10%", padding: 10, textAlign: "center" }}>{item.qty}</td>
      <td style={{ width: "15%", padding: 10, textAlign: "center" }}>
        {Number(item.unit || 0).toLocaleString()}
      </td>
      <td style={{ width: "15%", padding: 10, textAlign: "center" }}>
        {Number(item.value || 0).toLocaleString()}
      </td>
      <td style={{ width: "30%", padding: 10, textAlign: "center"  }}>{item.note}</td>
    </tr>
  ))}
</tbody>

        </table>

<div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, lineHeight: 2, marginTop: 20 }}>
  {/* 왼쪽: Note */}
  <div style={{ flex: 1, marginRight: 20 }}>
    {note && (
      <>
        <strong>Note</strong>
        <p style={{ whiteSpace: "pre-line" }}>{note}</p>
      </>
    )}
  </div>

  {/* 오른쪽: Summary */}
  <div style={{ textAlign: "right" }}>
    {discountRate > 0 && (
      <p>Discount: {discountRate}% ({Number(discountAmount || 0).toLocaleString()} 원)</p>
    )}
    <p>VAT (10%): {Number(vat || 0).toLocaleString()} 원</p>
    <h3 style={{ fontSize: 20, marginTop: 10 }}>
      Total: {Number(totalCost || 0).toLocaleString()} 원
    </h3>
  </div>
</div>


        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 60, fontSize: 13 }}>
          <div>
            <p><strong>Bank:</strong> 신한은행</p>
            <p><strong>Account:</strong> 140-015-193246</p>
            <p><strong>Holder:</strong> 관세법인 한영 인천지사</p>
          </div>
          <div style={{ textAlign: "right", color: "#666" }}>
            <p><strong>Valid Until:</strong> {new Date(today.getTime() + 15 * 86400000).toLocaleDateString("ko-KR")}</p>
            <p>인천 서구 이음4로 6, KR법조타워 915호</p>
            <p>TEL: 032-713-4897 / FAX: 032-713-4898</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 20 }}>
        <button onClick={() => navigate("/consulting")} style={{ backgroundColor: "#aaa", border: "none", padding: "10px 30px", borderRadius: 6, color: "#fff", fontWeight: 600 }}>다시하기</button>
        <button onClick={downloadPDF} style={{ backgroundColor: "#111", border: "none", padding: "10px 30px", borderRadius: 6, color: "#fff", fontWeight: 700 }}>📥 PDF 다운로드</button>
      </div>
    </>
  );
}
