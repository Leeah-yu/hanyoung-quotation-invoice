// src/customspreview.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { HY_BRANCHES, formatDocNo } from "./hyBranches";

export default function CustomsPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedData, company, doc_number, branchKey } = location.state || {};
  const today = new Date();

  // 지사 객체 (없으면 첫 지사로 폴백)
  const branch = (branchKey && HY_BRANCHES[branchKey]) || Object.values(HY_BRANCHES)[0] || {};

  const dateString = `${String(today.getFullYear()).slice(2)}${String(today.getMonth() + 1).padStart(2, "0")}${String(
    today.getDate()
  ).padStart(2, "0")}`;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const input = document.getElementById("invoice-content");

    const companyNameSafe = company?.replace(/[^가-힣a-zA-Z0-9\s]/g, "") || "업체명없음";
    const filename = `[관세법인한영] ${companyNameSafe} 통관 수수료 견적서_${dateString}.pdf`;

    html2canvas(input, { scale: 1.2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth() - 40;
      const imgProps = doc.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, "JPEG", 20, 20, pdfWidth, pdfHeight);
      doc.save(filename);
    });
  };

  const labelMap = {
    feeRate: "수수료 요율",
    minFee: "MIN",
    maxFee: "MAX",
    correctionFee: "신고정정",
    ftaApplication: "FTA 협정신청",
    requirementApplication: "요건신청",
    exportFeeRate: "수수료 요율",
    exportMinFee: "MIN",
    exportMaxFee: "MAX",
    exportCorrectionFee: "신고정정",
    exportFtaCertificateAuthorized: "FTA C/O 발급 (인증수출자)",
    exportFtaCertificateUnauth: "FTA C/O 발급 (비인증수출자)",
  };

  const importItems = selectedData?.filter((item) => !item.label.startsWith("export")) || [];
  const exportItems = selectedData?.filter((item) => item.label.startsWith("export")) || [];

  const renderTable = (title, items) => (
    <div style={{ marginTop: 30, marginBottom: 30 }}>
      <h3 style={{ fontSize: 18, marginBottom: 10, color: "#1a2e59" }}>{title}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
            <th style={{ padding: "10px 6px", width: "35%", textAlign: "center" }}>항목</th>
            <th style={{ padding: "10px 6px", width: "25%", textAlign: "center" }}>금액</th>
            <th style={{ padding: "10px 6px", width: "40%", textAlign: "center" }}>비고</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px 6px", textAlign: "center", backgroundColor: "#f9f9f9", fontWeight: 500 }}>
                {labelMap[item.label] || item.label}
              </td>
              <td style={{ padding: "10px 6px", textAlign: "center" }}>
                {item.label.includes("Rate") ? `${item.value}%` : `${Number(item.value).toLocaleString()} 원`}
              </td>
              <td style={{ padding: "10px 6px", textAlign: "center" }}>{item.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div
        id="invoice-content"
        style={{
          fontFamily: "'Pretendard', 'Helvetica Neue', sans-serif",
          backgroundColor: "#fff",
          color: "#222",
          padding: 60,
          paddingTop: 30,
          maxWidth: 800,
          margin: "45px auto",
          lineHeight: 1.7,
          border: "1px solid #ddd",
          minHeight: "1122px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>Quotation</h1>
            <p style={{ fontSize: 14, color: "#555" }}>
              {/* 지사 코드 포함 문서번호 */}
              No. {formatDocNo(branch?.codePrefix || "HY", doc_number)} / {today.toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div style={{ width: 170 }}>
            <img
              src={`${process.env.PUBLIC_URL}/images/HYLOGO_NAVY.png`}
              alt="한영 로고"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* 고객/발행자(지사) */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 0 }}>
          <div>
            <strong>Client</strong>
            <p style={{ fontSize: 14 }}>{company || "Client Name"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <strong>Issued By</strong>
            <p style={{ fontSize: 14 }}>
              {/* 관세법인 한영 (본사/인천/…) */}
              관세법인 한영 {branch?.label ? `(${branch.label})` : ""}
            </p>
          </div>
        </div>

        {/* 수입/수출 테이블 */}
        <div style={{ marginTop: 25 }}>
          {importItems.length > 0 && renderTable("수입통관 수수료", importItems)}
          {exportItems.length > 0 && renderTable("수출통관 수수료", exportItems)}
        </div>

        <div style={{ textAlign: "right", fontSize: 14, fontWeight: 600, marginBottom: 40 }}>※ V.A.T 별도</div>

        {/* 좌하단: 지사 표기(계좌 제외) + 우측 유효기간 */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666" }}>
          <div>
            {/* holder / address / TEL/FAX */}
            <p>
              <strong>{branch?.holder || "관세법인 한영"}</strong>
            </p>
            {branch?.address && <p>{branch.address}</p>}
            {(branch?.tel || branch?.fax) && (
              <p>
                {branch.tel ? `TEL: ${branch.tel}` : ""}
                {branch.tel && branch.fax ? " / " : ""}
                {branch.fax ? `FAX: ${branch.fax}` : ""}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 13, color: "#666" }}>
            <p>
              <strong>Valid Until:</strong>{" "}
              {new Date(today.getTime() + 15 * 86400000).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 20 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#aaa",
            border: "none",
            padding: "10px 30px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "600",
            color: "#fff",
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
            cursor: "pointer",
            fontWeight: "700",
            color: "#fff",
          }}
        >
          📥 PDF 다운로드
        </button>
      </div>
    </>
  );
}
