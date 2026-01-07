import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function QuotationFTA() {
  const navigate = useNavigate();

  const ftaMatrix = useMemo(() => [
    [30000, 25000, 20000, 15000, 10000, 5000, 3000],
    [null, 30000, 25000, 20000, 15000, 10000, 5000],
    [null, 35000, 30000, 25000, 20000, 15000, 10000],
    [null, 40000, 35000, 30000, 25000, 20000, 15000],
    [null, null, 40000, 35000, 30000, 25000, 20000],
    [null, null, 45000, 40000, 35000, 30000, 25000],
  ], []);

  const originMatrix = useMemo(() => [
    [15000, 12000, 10000, 8000, 5000, 3000, 2000],
    [18000, 15000, 12000, 10000, 8000, 5000, 3000],
    [20000, 18000, 15000, 12000, 10000, 8000, 5000],
    [22000, 20000, 18000, 15000, 12000, 10000, 8000],
  ], []);


  const groupOptions = [
    "10개 이하",
    "10개 초과 30개 이하",
    "30개 초과 60개 이하",
    "60개 초과 100개 이하",
    "100개 초과 200개 이하",
    "200개 초과"
  ];

  const itemOptions = [
    "10개 이하",
    "10개 초과 100개 이하",
    "100개 초과 500개 이하",
    "500개 초과 1000개 이하",
    "1000개 초과 3000개 이하",
    "3000개 초과 10000개 이하",
    "10000개 초과"
  ];

  const originGroupOptions = ["10개 이하", "30개 이하", "60개 이하", "60개 초과"];
  const originItemOptions = itemOptions;

  const [form, setForm] = useState({
    company: "",
    doc_number: "",
    groupIndex: 0,
    itemIndex: 0,
    originGroupIndex: 0,
    originItemIndex: 0,
    qtyFTA: 1,
    qtyOrigin: 1,
    discountRate: 0,
    note: "",
    includeFTA: false,
    includeOrigin: false,
  });

  const [costs, setCosts] = useState({
    unitPrice: 0,
    totalAmount: 0,
    discount: 0,
    vat: 0,
    total: 0,
  });

useEffect(() => {
  if (!form.includeFTA && !form.includeOrigin) {
    setCosts({ unitPrice: 0, totalAmount: 0, discount: 0, vat: 0, total: 0 });
    return;
  }

  let raw = 0;
  if (form.includeFTA) {
    const ftaUnit = ftaMatrix[form.groupIndex][form.itemIndex] ?? 0;
    raw += ftaUnit * form.qtyFTA;
  }
  if (form.includeOrigin) {
    const originUnit = originMatrix[form.originGroupIndex][form.originItemIndex] ?? 0;
    raw += originUnit * form.qtyOrigin;
  }

  const discount = Math.round(raw * (form.discountRate / 100));
  const vat = Math.round((raw - discount) * 0.1);
  const total = raw - discount + vat;

  setCosts({
    unitPrice: raw,
    totalAmount: raw,
    discount,
    vat,
    total,
  });
}, [form, ftaMatrix, originMatrix]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "qty" || name === "discountRate"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedData = [];
    if (form.includeFTA) {
      selectedData.push({
        label: "품목분류",
        detail: `품목군수: ${groupOptions[form.groupIndex]}, 품번수: ${itemOptions[form.itemIndex]}`,
        qty: form.qtyFTA,
        value: ftaMatrix[form.groupIndex][form.itemIndex] ?? 0,
        note: form.note,
      });
    }
    if (form.includeOrigin) {
      selectedData.push({
        label: "원산지 판정",
        detail: `평균 원재료수: ${originGroupOptions[form.originGroupIndex]}, 품번수: ${originItemOptions[form.originItemIndex]}`,
        qty: form.qtyOrigin,
        value: originMatrix[form.originGroupIndex][form.originItemIndex] ?? 0,
        note: form.note,
      });
    }
    navigate("/FTApreview", {
      state: {
        formData: {
          company: form.company,
          doc_number: form.doc_number,
          discountRate: form.discountRate,
          note: form.note,
        },
        costs: {
          discountAmount: costs.discount,
          vat: costs.vat,
          totalCost: costs.total,
        },
        selectedData,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: "0 auto", padding: 30, fontFamily: "'Pretendard', sans-serif" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a2e59", marginBottom: 30 }}>FTA 품목분류 견적서</h2>

      {/* 회사명 & 문서번호 */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div style={{ width: "50%" }}>
          <label style={{ fontWeight: 600 }}>업체명</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="업체명을 입력하세요"
            style={{ width: "90%", padding: 10, borderRadius: 6, border: "1.5px solid #ccc" }}
            required
          />
        </div>
        <div style={{ width: "50%" }}>
          <label style={{ fontWeight: 600 }}>문서번호</label>
          <input
            type="text"
            name="doc_number"
            value={form.doc_number}
            onChange={handleChange}
            placeholder="문서번호 입력"
            style={{ width: "90%", padding: 10, borderRadius: 6, border: "1.5px solid #ccc" }}
            required
          />
        </div>
      </div>

      {/* 테이블 */}

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
        <thead>
          <tr style={{ backgroundColor: "#3f72af", color: "#fff" }}>
            <th style={{ padding: 12 }}>✔</th>
            <th style={{ padding: 12 }}>항목</th>
            <th style={{ padding: 12 }}>세부내용</th>
            <th style={{ padding: 12 }}>수량</th>
            <th style={{ padding: 12 }}>금액</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <td style={{ padding: 12, textAlign: "center" }}>
              <input
                type="checkbox"
                name="includeFTA"
                checked={form.includeFTA}
                onChange={handleChange}
              />
            </td>
            <td style={{ padding: 12, textAlign: "center" }}>품목분류</td>
            <td style={{ padding: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span>품목군수:</span>
                <select name="groupIndex" value={form.groupIndex} onChange={handleChange} style={{ padding: 8, borderRadius: 6 }}>
                  {groupOptions.map((opt, i) => (
                    <option key={i} value={i}>{opt}</option>
                  ))}
                </select>
                <span>품번수:</span>
                <select name="itemIndex" value={form.itemIndex} onChange={handleChange} style={{ padding: 8, borderRadius: 6 }}>
                  {itemOptions.map((opt, i) => (
                    <option key={i} value={i}>{opt}</option>
                  ))}
                </select>
              </div>
            </td>
            <td style={{ padding: 12, textAlign: "center" }}>
              <input type="number" name="qtyFTA" value={form.qtyFTA}
                min={1}
                onChange={handleChange}
                style={{ width: 80, padding: 6, borderRadius: 6, textAlign: "right" }}
              />
            </td>
            <td style={{ padding: 12, textAlign: "right" }}>
              {form.includeFTA ? (ftaMatrix[form.groupIndex][form.itemIndex] * form.qtyFTA).toLocaleString() + " 원" : ""}
            </td>
          </tr>

          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <td style={{ padding: 12, textAlign: "center" }}>
              <input
                type="checkbox"
                name="includeOrigin"
                checked={form.includeOrigin}
                onChange={handleChange}
              />
            </td>
            <td style={{ padding: 12, textAlign: "center" }}>원산지 판정</td>
            <td style={{ padding: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span>평균 원재료수:</span>
                <select name="originGroupIndex" value={form.originGroupIndex} onChange={handleChange} style={{ padding: 8, borderRadius: 6 }}>
                  {originGroupOptions.map((opt, i) => (
                    <option key={i} value={i}>{opt}</option>
                  ))}
                </select>
                <span>품번수:</span>
                <select name="originItemIndex" value={form.originItemIndex} onChange={handleChange} style={{ padding: 8, borderRadius: 6 }}>
                  {originItemOptions.map((opt, i) => (
                    <option key={i} value={i}>{opt}</option>
                  ))}
                </select>
              </div>
            </td>
            <td style={{ padding: 12, textAlign: "center" }}>
              <input type="number" name="qtyOrigin" value={form.qtyOrigin}
                min={1}
                onChange={handleChange}
                style={{ width: 80, padding: 6, borderRadius: 6, textAlign: "right" }}
              />
            </td>
            <td style={{ padding: 12, textAlign: "right" }}>
              {form.includeOrigin ? (originMatrix[form.originGroupIndex][form.originItemIndex] * form.qtyOrigin).toLocaleString() + " 원" : ""}
            </td>
          </tr>

        </tbody>
      </table>

      {/* 할인 및 합계 */}
      <div style={{ textAlign: "right", lineHeight: 2, fontSize: 15, marginBottom: 30 }}>
        <div>
          할인율:
          <input
            type="number"
            name="discountRate"
            value={form.discountRate}
            onChange={handleChange}
            style={{ width: 60, marginLeft: 8, padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
          />
          % (-{costs.discount.toLocaleString()} 원)
        </div>
        <div>VAT (10%): {costs.vat.toLocaleString()} 원</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 10 }}>
          최종 합계: {costs.total.toLocaleString()} 원
        </div>
      </div>

      {/* 특이사항 */}
      <div style={{ marginBottom: 30 }}>
        <label style={{ fontWeight: 600 }}>특이사항 / 비고</label>
        <textarea
          name="note"
          rows={4}
          value={form.note}
          onChange={handleChange}
          style={{ width: "100%", borderRadius: 8, border: "1.5px solid #ccc", padding: 12 }}
          placeholder="특이사항이 있다면 작성해 주세요"
        />
      </div>

      {/* 버튼 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ backgroundColor: "#aaa", color: "#fff", padding: "12px 30px", borderRadius: 6, border: "none", cursor: "pointer" }}
        >
          다시하기
        </button>
        <button
          type="submit"
          style={{ backgroundColor: "#3f72af", color: "#fff", padding: "12px 30px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          📄 견적서 생성
        </button>
      </div>
    </form>
  );
}
