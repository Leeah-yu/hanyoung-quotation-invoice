// src/consultingpreview.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { HY_BRANCHES, formatDocNo } from "./hyBranches";

export default function ConsultingPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedData = [],
    company = "",
    doc_number = "",
    discountRate = 0,
    discountAmount = 0,
    vat = 0,
    totalCost = 0,
    note = "",
    type = "quotation",
    branchKey = "IC",
    showTotals = true, // ✅ 추가
  } = location.state || {};

  const branch =
    (HY_BRANCHES && HY_BRANCHES[branchKey]) ||
    Object.values(HY_BRANCHES || {})[0] ||
    {};

  const today = new Date();
  const dateString = `${String(today.getFullYear()).slice(2)}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const input = document.getElementById("invoice-content");

    const safeName = company ? company.replace(/[^가-힣a-zA-Z0-9]/g, "") : "고객사";
    const fileLabel = type === "invoice" ? "컨설팅 청구서" : "컨설팅 견적서";
    const filename = `[관세법인한영] ${safeName}_${fileLabel}_${dateString}.pdf`;

    html2canvas(input, {
      scale: 1.2,        // ⬅️ 가장 중요 (2 → 1.2)
      useCORS: true,     // ⬅️ 로고 깨짐 방지
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.85); // ⬅️ PNG → JPEG
      const pdfWidth = doc.internal.pageSize.getWidth() - 40;
      const imgProps = doc.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, "JPEG", 20, 20, pdfWidth, pdfHeight);
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 60,
          }}
        >
          <div>
            <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 10 }}>
              {type === "invoice" ? "Invoice" : "Quotation"}
            </h1>
            <p style={{ fontSize: 14 }}>
              No. {formatDocNo(branch?.codePrefix || "HY", doc_number || "XXXX")} /{" "}
              {today.toLocaleDateString("ko-KR")}
            </p>
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
            <p>관세법인 한영 {branch?.label ? `(${branch.label})` : ""}</p>
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
                <td style={{ width: "30%", padding: 10, textAlign: "center" }}>
                  {item.label}
                </td>
                <td style={{ width: "10%", padding: 10, textAlign: "center" }}>
                  {item.qty}
                </td>
                <td style={{ width: "15%", padding: 10, textAlign: "center" }}>
                  {Number(item.unit || 0).toLocaleString()}
                </td>
                <td style={{ width: "15%", padding: 10, textAlign: "center" }}>
                  {Number(item.value || 0).toLocaleString()}
                </td>
                <td style={{ width: "30%", padding: 10, textAlign: "center" }}>
                  {item.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
{/* Note & Summary */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    fontSize: 15,
    lineHeight: 2,
    marginTop: 20,
  }}
>
  {/* Left: Note */}
  <div style={{ flex: 1, marginRight: 20 }}>
    {note && (
      <>
        <strong>Note</strong>
        <p style={{ whiteSpace: "pre-line" }}>{note}</p>
      </>
    )}
  </div>

  {/* Right: Summary (조건부) */}
  {showTotals ? (
    <div style={{ textAlign: "right" }}>
      {discountRate > 0 && (
        <p>
          Discount: {discountRate}% ({Number(discountAmount || 0).toLocaleString()} 원)
        </p>
      )}
      <p>VAT (10%): {Number(vat || 0).toLocaleString()} 원</p>
      <h3 style={{ fontSize: 20, marginTop: 10 }}>
        Total: {Number(totalCost || 0).toLocaleString()} 원
      </h3>
    </div>
  ) : (
    <div style={{ width: 260 }} /> /* 오른쪽 Summary 자리 폭 고정 */
  )}
</div>



        {/* 지사별 하단 정보: 좌(은행정보) / 우(유효기간·주소·TEL·FAX) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
            fontSize: 12,
          }}
        >
          {/* Left: Bank info (계좌번호 노출 없음) */}
          <div style={{ lineHeight: 1.3 }}>
            <p>
              <strong>Bank:</strong> {branch?.bank || ""}
            </p>
            <p>
              <strong>Account:</strong> {branch?.account || ""}
            </p>
            <p>
              <strong>Holder:</strong> {branch?.holder || ""}
            </p>
          </div>

          {/* Right: Valid Until, Address, TEL/FAX */}
          <div
            style={{
              textAlign: "right",
              fontSize: 12,
              color: "#666",
              lineHeight: 1.3,
              whiteSpace: "pre-line",
            }}
          >
            <p>
              <strong>Valid Until:</strong>{" "}
              {new Date(today.getTime() + 15 * 86400000).toLocaleDateString("ko-KR")}
            </p>
            <p>{branch?.address || ""}</p>
            <p>
              {branch?.tel ? `TEL: ${branch.tel}` : ""}
              {branch?.tel && branch?.fax ? " / " : ""}
              {branch?.fax ? `FAX: ${branch.fax}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <button
          onClick={() => navigate("/consulting")}
          style={{
            backgroundColor: "#aaa",
            border: "none",
            padding: "10px 30px",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 600,
          }}
        >
          다시하기
        </button>
        <button
          onClick={downloadPDF}
          style={{
            backgroundColor: "#111",
            border: "none",
            padding: "10px 30px",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          📥 PDF 다운로드
        </button>
      </div>
    </>
  );
}
