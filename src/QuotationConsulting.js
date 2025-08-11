import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QuotationConsulting() {
  const navigate = useNavigate();


  
  const [form, setForm] = useState({
    company: "",
    doc_number: "",
    discountRate: 0,
      type: "quotation", // 기본값

    items: [{ id: 1, label: "", qty: "", unit: "", amount: 0, note: "" }],
  });

  const handleChange = (e, id, field) => {
    const value = e.target.value;
    const updatedItems = form.items.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        const qty = parseFloat(newItem.qty) || 0;
        const unit = parseFloat(newItem.unit) || 0;
        newItem.amount = qty * unit;
        return newItem;
      }
      return item;
    });
    setForm({ ...form, items: updatedItems });
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "discountRate" ? Number(value) : value });
  };

  const addRow = () => {
    const newId = form.items.length ? form.items[form.items.length - 1].id + 1 : 1;
    setForm({
      ...form,
      items: [
        ...form.items,
        { id: newId, label: "", qty: "", unit: "", amount: 0, note: "" },
      ],
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedData = form.items
      .filter((item) => item.label || item.amount)
      .map((item) => ({
        label: item.label,
        qty: item.qty,
        unit: item.unit,
        value: item.amount,
        note: item.note,
      }));

    const subtotal = form.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const discountAmount = Math.round(subtotal * (form.discountRate / 100));
    const discounted = subtotal - discountAmount;
    const vat = Math.round(discounted * 0.1);
    const totalCost = discounted + vat;

    navigate("/consultingpreview", {
      state: {
        selectedData,
        company: form.company,
        doc_number: form.doc_number,
        discountRate: form.discountRate,
        discountAmount,
        vat,
        totalCost,
        note: form.note || "",
            type: form.type, // <-- 추가

      },
    });
  };


  const subtotal = form.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const discount = Math.round(subtotal * (form.discountRate / 100));
  const discounted = subtotal - discount;
  const vat = Math.round(discounted * 0.1);
  const total = discounted + vat;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 30,
        fontFamily: "'Pretendard', sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
      }}
    >
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ width: 180 }}>
          <img
            src={`${process.env.PUBLIC_URL}/images/HYLOGO_NAVY.png`}
            alt="한영 로고"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a2e59" }}>컨설팅 견적서</h2>
      </div>

{/* 문서 타입 선택 (Invoice / Quotation) */}
<div style={{ marginBottom: 20 }}>
  <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
    문서 유형 선택:
  </label>
  <label style={{ marginRight: 20 }}>
    <input
      type="radio"
      name="type"
      value="invoice"
      checked={form.type === "invoice"}
      onChange={handleBasicChange}
      style={{ marginRight: 6 }}
    />
    Invoice
  </label>
  <label>
    <input
      type="radio"
      name="type"
      value="quotation"
      checked={form.type === "quotation"}
      onChange={handleBasicChange}
      style={{ marginRight: 6 }}
    />
    Quotation
  </label>
</div>


      {/* 업체명, 문서번호 */}
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        <div style={{ width: "50%" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>업체명</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleBasicChange}
            placeholder="업체명을 입력하세요"
            style={{ width: "90%", padding: 10, borderRadius: 6, border: "1.5px solid #ccc" }}
            required
          />
        </div>
        <div style={{ width: "50%" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>문서번호</label>
          <input
            type="text"
            name="doc_number"
            value={form.doc_number}
            onChange={handleBasicChange}
            placeholder="문서번호 입력"
            style={{ width: "90%", padding: 10, borderRadius: 6, border: "1.5px solid #ccc" }}
            required
          />
        </div>
      </div>

      {/* 테이블 */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
        <thead>
          <tr style={{ backgroundColor: "#3f72af", color: "#fff" }}>
            <th style={{ padding: 12, width: "40%" }}>항목</th>
            <th style={{ padding: 12, width: "10%" }}>수량</th>
            <th style={{ padding: 12, width: "15%" }}>단가</th>
            <th style={{ padding: 12, width: "10%" }}>금액</th>
            <th style={{ padding: 12, width: "25%" }}>비고</th>
          </tr>
        </thead>
        <tbody>
          {form.items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: 10 }}>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleChange(e, item.id, "label")}
                  placeholder="항목 입력"
                  style={{ width: "100%", padding: 6 }}
                />
              </td>
              <td style={{ padding: 10 }}>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleChange(e, item.id, "qty")}
                  placeholder="수량"
                  style={{ width: "100%", padding: 6, textAlign: "right" }}
                />
              </td>
              <td style={{ padding: 10 }}>
                <input
                  type="number"
                  value={item.unit}
                  onChange={(e) => handleChange(e, item.id, "unit")}
                  placeholder="단가"
                  style={{ width: "60%", padding: 6, textAlign: "right" }}
                />
              </td>
              <td style={{ padding: 10, textAlign: "right" }}>
                {item.amount.toLocaleString()} 원
              </td>
              <td style={{ padding: 10 }}>
                <input
                  type="text"
                  value={item.note}
                  onChange={(e) => handleChange(e, item.id, "note")}
                  placeholder="비고 입력"
                  style={{ width: "100%", padding: 6 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ➕ 버튼 */}
      <div style={{ textAlign: "left", marginBottom: 30 }}>
        <button
          type="button"
          onClick={addRow}
          style={{
            backgroundColor: "#1a2e59",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ➕ 항목 추가
        </button>
      </div>

      {/* 할인율 입력 및 합계 */}
      <div
  style={{
    textAlign: "right",
    fontSize: 15,
    marginBottom: 30,
    lineHeight: 2,           // 행간 조정
    display: "flex",
    flexDirection: "column",
    gap: 8,                  // 각 줄 간격 추가
  }}
>
  <div>총 합계: {subtotal.toLocaleString()} 원</div>

  <div>
    할인율:&nbsp;
    <input
      type="number"
      name="discountRate"
      min="0"
      max="100"
      value={form.discountRate}
      onChange={handleBasicChange}
      style={{
        width: 60,
        padding: 6,
        borderRadius: 6,
        border: "1px solid #ccc",
        marginRight: 6,
      }}
    />
    % (-{discount.toLocaleString()} 원)
  </div>

  <div>VAT (10%): {vat.toLocaleString()} 원</div>

  <div style={{ fontWeight: 700, fontSize: 16, marginTop: 10 }}>
    최종 합계: {total.toLocaleString()} 원
  </div>
</div>

{/* 특이사항 / 비고 입력란 */}
<div style={{ marginBottom: 30 }}>
  <label htmlFor="note" style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
    특이사항 / 비고:
  </label>
  <textarea
    id="note"
    name="note"
    value={form.note}
    onChange={handleBasicChange}
    rows={4}
    style={{
      width: "100%",
      borderRadius: 8,
      border: "1.8px solid #ced4da",
      padding: 12,
      fontSize: 15,
      resize: "vertical",
    }}
    placeholder="특이사항이 있으면 자유롭게 기재해 주세요."
  />
</div>


<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 20, // 버튼 사이 간격
    marginTop: 30,
  }}
>
  <button
    onClick={() => navigate("/")}
    style={{
      backgroundColor: "#aaa",
      border: "none",
      padding: "12px 30px", // 높이 맞추기 위해 수정
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 16, // 글자 크기 맞추기
      color: "#fff",
    }}
  >
    다시하기
  </button>

      {/* 제출 */}
      <div style={{ textAlign: "center" }}>
        <button
          type="submit"
          style={{
            backgroundColor: "#3f72af",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "12px 30px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📄 견적서 생성
        </button>
      </div>
      </div>
    </form>
  );
}
