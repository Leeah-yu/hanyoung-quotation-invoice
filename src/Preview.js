// Preview.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { HY_BRANCHES, formatDocNo } from "./hyBranches";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state?.formData || {};
  const costs = location.state?.costs || {};
  const branch = HY_BRANCHES[formData.branchKey || "IC"]; // 기본 인천

  // 문서 타입: invoice | quotation
  const docType = formData.docType || "invoice";
  const title = docType === "quotation" ? "Quotation" : "Invoice";
  const fileLabel = docType === "quotation" ? "과세자료 컨설팅 견적서" : "과세자료 컨설팅 청구서";

  const today = new Date();
  const dateString = `${String(today.getFullYear()).slice(2)}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const input = document.getElementById("invoice-content");

    const companyNameSafe = formData.company
      ? formData.company.replace(/[^가-힣a-zA-Z0-9\s]/g, "")
      : "업체명없음";
    const filename = `[관세법인한영] ${companyNameSafe} ${fileLabel}_${dateString}.pdf`;

    html2canvas(input, { scale: 1.2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth() - 40;
      const imgProps = doc.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, "JPEG", 20, 20, pdfWidth, pdfHeight);
      doc.save(filename);
    });
  };

  const amountMap4 = {
    1: "100억 이하",
    2: "100억 초과 200억 이하",
    3: "200억 초과 300억",
    4: "300억 초과",
  };

  const reportItemLabels = {
    royalty: "로열티",
    productionSupport: "생산지원비",
    freightInsurance: "운임/보험료",
    commission: "수수료/중개료",
    packaging: "용기/포장비",
    postBenefit: "사후귀속이익",
    indirectPayment: "간접지급금액",
    other: "기타",
  };

  const serviceItems = [
    {
      label: "거래구조 및 과세자료 제출 범위 검토",
      checked: formData.includeBase,
      quantity: formData.partners || 0,
      total: costs.baseCost,
      details: `연 수입금액: ${amountMap4[formData.importAmount] || "미입력"}`,
    },
    {
      label: "해외거래처별 과세자료 제출 범위 검토",
      checked: formData.includeOverseasRange,
      quantity: formData.overseasPartners || 0,
      total: costs.overseasRangeCost,
      details: ``,
    },
    {
      label: "과세자료 미제출 사유서 작성 지원",
      checked: formData.includeReason,
      quantity: formData.reasonPartners || 0,
      total: costs.reasonCost,
      details: ``,
    },
    {
      label: "과세자료 지연제출 사유서 작성 지원",
      checked: formData.includeDelayReason,
      quantity: formData.delayReasonPartners || 0,
      total: costs.delayReasonCost,
      details: ``,
    },
    {
      label: "과세자료 제출 서류 정비 및 전자제출 대행",
      checked: formData.includeDoc,
      quantity: formData.docPartners || 0,
      total: costs.docCost,
      details: ``,
    },
    {
      label: "과세가격 결정 사유 보고서 작성",
      checked: formData.includeReport,
      quantity:
        Object.values(formData.reportItems || {}).filter(Boolean).length *
        (formData.reportPartners || 0),
      total: costs.reportCost,
      details: `${
        Object.entries(formData.reportItems || {})
          .filter(([_, v]) => v)
          .map(([k]) => reportItemLabels[k] || k)
          .join(", ") || "없음"
      }`,
    },
    {
      label: "특수관계자 거래 분석 및 이전가격 검토 리포트",
      checked: formData.includeRelated,
      quantity: "-",
      total: costs.relatedCost,
      details: `연 수입금액: ${amountMap4[formData.relatedImportAmount] || "미입력"}`,
    },
    {
      label: formData.includeCustom ? (formData.customLabel || "공란") : "공란",
      checked: formData.includeCustom,
      quantity: formData.customQty || 0,
      total: costs.customCost,
      details: ``,
    },
  ];

  const selectedServices = serviceItems.filter((i) => i.checked);

  return (
    <>
      <div
        id="invoice-content"
        style={{
          fontFamily: "'Pretendard', 'Helvetica Neue', sans-serif",
          backgroundColor: "#fff",
          color: "#222",
          padding: 60,
          maxWidth: 800,
          margin: "60px auto",
          lineHeight: 1.7,
          border: "1px solid #ddd",
          minHeight: "1122px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* 상단 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 60,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>
              {title}
            </h1>
            <p style={{ fontSize: 12, color: "#555" }}>
              No. {formatDocNo(branch.codePrefix, formData.doc_number)} &nbsp; / &nbsp;{" "}
              {today.toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div style={{ width: 170, height: "auto" }}>
            <img
              src={`${process.env.PUBLIC_URL}/images/HYLOGO_NAVY.png`}
              alt="한영 로고"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* 클라이언트/발행처 */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <strong>Client</strong>
            <p style={{ fontSize: 14 }}>{formData.company || "Client Name"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <strong>Issued By</strong>
            <p style={{ fontSize: 14 }}>관세법인 한영 ({branch.label})</p>
          </div>
        </div>

        {/* 서비스 테이블 */}
<table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40, fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>Description</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>Details</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>Overseas Partners</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>Amount (₩)</th>
            </tr>
          </thead>
          <tbody>
            {selectedServices.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px 8px", textAlign: "center" }}>{item.label}</td>
                <td style={{ padding: "12px 8px", textAlign: "center" }}>{item.details}</td>
                <td style={{ padding: "12px 8px", textAlign: "center" }}>{item.quantity}</td>
                <td style={{ padding: "12px 8px", textAlign: "center" }}>
                  {item.total?.toLocaleString?.() ?? "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 메모 & 합계 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            marginBottom: 40,
          }}
        >
          <div>
            <strong>Note</strong>
            <p style={{ whiteSpace: "pre-line" }}>{formData.note?.trim() || ""}</p>
          </div>

          <div style={{ textAlign: "right" }}>
            {Number(formData.discountRate) > 0 && (
              <p>
                Discount: {formData.discountRate}% (
                {costs.discountAmount?.toLocaleString() ?? "0"} 원)
              </p>
            )}
            <p>VAT (10%): {costs.vat?.toLocaleString?.() ?? "0"} 원</p>
            <h3 style={{ fontSize: 16, marginTop: 10 }}>
              Grand Total: {costs.totalCost?.toLocaleString?.() ?? "0"} 원
            </h3>
          </div>
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
          {/* Left: Bank info */}
          <div style={{ lineHeight: 1.3 }}>
            <p>
              <strong>Bank:</strong> {branch.bank}
            </p>
            <p>
              <strong>Account:</strong> {branch.account}
            </p>
            <p>
              <strong>Holder:</strong> {branch.holder}
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
            <p>{branch.address}</p>
            <p>
              TEL: {branch.tel} / FAX: {branch.fax}
            </p>
          </div>
        </div>
      </div>

      {/* 버튼들 */}
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
