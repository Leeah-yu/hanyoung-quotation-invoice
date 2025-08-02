import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state?.formData || {};
  const costs = location.state?.costs || {};

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
    const filename = `[관세법인한영] ${companyNameSafe} 과세자료 컨설팅 견적서_${dateString}.pdf`;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth() - 40;
      const imgProps = doc.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);
      doc.save(filename);
    });
  };

  const importAmountMap = {
    1: "10억 미만",
    2: "10억 이상 ~ 50억 미만",
    3: "50억 이상",
  };

  const reportItemLabels = {
    royalty: "로열티",
    productionSupport: "생산지원비",
    freightInsurance: "운임/보험료",
    commission: "커미션",
    tools: "금형비/무상제공",
    others: "기타",
  };

  const serviceItems = [
    {
      label: "거래구조 및 과세자료 제출 범위 검토",
      checked: formData.includeBase,
      quantity: formData.partners || 1,
      total: costs.baseCost,
      details: `연 수입금액: ${importAmountMap[formData.importAmount] || "미입력"}`,
    },
    {
      label: "과세자료 미제출 사유서 작성 지원",
      checked: formData.includeReason,
      quantity: formData.reasonPartners || 1,
      total: costs.reasonCost,
      details:
        formData.reasonType === "basic"
          ? "거래 사실 없음"
          : `비과세 거래 (항목 수: ${formData.missingItems || 0})`,
    },
    {
      label: "과세자료 제출 서류 정비 및 전자제출 대행",
      checked: formData.includeDoc,
      quantity: formData.docPartners || 1,
      total: costs.docCost,
      details: ``,
    },
    {
      label: "과세가격 결정 사유 보고서 작성",
      checked: formData.includeReport,
      quantity:
        Object.values(formData.reportItems || {}).filter(Boolean).length *
        (formData.reportPartners || 1),
      total: costs.reportCost,
      details: `${
        Object.entries(formData.reportItems || {})
          .filter(([_, value]) => value)
          .map(([key]) => reportItemLabels[key] || key)
          .join(", ") || "없음"
      }`,
    },
    {
      label: "특수관계자 거래 분석 및 이전가격 검토 리포트",
      checked: formData.includeRelated,
      quantity: formData.relatedPartners || 1,
      total: costs.relatedCost,
      details: `연 수입금액: ${importAmountMap[formData.relatedImportAmount] || "미입력"}`,
    },
  ];

  const selectedServices = serviceItems.filter((item) => item.checked);

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
          minHeight: "1122px", // A4 height (297mm at 96dpi)
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 60 }}>
  <div>
    <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 10 }}>Invoice</h1>
    <p style={{ fontSize: 14, color: '#555' }}>No. HY25{formData.doc_number || 'XXXX'} &nbsp; / &nbsp; {today.toLocaleDateString('ko-KR')}</p>
  </div>
  <div style={{ width: 170, height: 'auto' }}>
    <img
      src={`${process.env.PUBLIC_URL}/images/HYLOGO_NAVY.png`}
      alt="한영 로고"
      style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
    />
  </div>
</div>





        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <strong>Client</strong>
            <p style={{ fontSize: 14 }}>{formData.company || "Client Name"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <strong>Issued By</strong>
            <p style={{ fontSize: 14 }}>관세법인 한영</p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40, fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Description</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Details</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>Overseas Partners</th>
              <th style={{ padding: "12px 8px", textAlign: "right" }}>Rate (₩)</th>
            </tr>
          </thead>
          <tbody>
            {selectedServices.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px 8px" }}>{item.label}</td>
                <td style={{ padding: "12px 8px" }}>{item.details}</td>
                <td style={{ padding: "12px 8px", textAlign: "center" }}>{item.quantity}</td>
                <td style={{ padding: "12px 8px", textAlign: "right" }}>{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 40 }}>
          <div>
            <strong>Note</strong>
            <p style={{ whiteSpace: "pre-line" }}>{formData.note?.trim() || ""}</p>
          </div>

 <div style={{ textAlign: "right" }}>
    {Number(formData.discountRate) > 0 && (
      <p>Discount: {formData.discountRate}% ({costs.discountAmount?.toLocaleString()} 원)</p>
    )}
    <p>VAT (10%): {costs.vat.toLocaleString()} 원</p>
    <h3 style={{ fontSize: 20, marginTop: 10 }}>Total: {costs.totalCost.toLocaleString()} 원</h3>
  </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <div>
            <p><strong>Bank:</strong> 신한은행</p>
            <p><strong>Account:</strong> 140-015-193246</p>
            <p><strong>Holder:</strong> 관세법인 한영 인천지사</p>
          </div>
          <div style={{ textAlign: "right", fontSize: 13, color: "#666" }}>
            <p><strong>Valid Until:</strong> {new Date(today.getTime() + 15 * 86400000).toLocaleDateString("ko-KR")}</p>
            <p>인천광역시 서구 이음4로6 KR법조타워 915호</p>
            <p>TEL: 032-713-4897 / FAX: 032-713-4898</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 20 }}>
        <button onClick={() => navigate("/")} style={{ backgroundColor: "#aaa", border: "none", padding: "10px 30px", borderRadius: 6, cursor: "pointer", fontWeight: "600", color: "#fff" }}>다시하기</button>
        <button onClick={downloadPDF} style={{ backgroundColor: "#111", border: "none", padding: "10px 30px", borderRadius: 6, cursor: "pointer", fontWeight: "700", color: "#fff" }}>📥 PDF 다운로드</button>
      </div>
    </>
  );
}
