// src/QuotationCustoms.js
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import HY_BRANCHES from "./hyBranches"; // 추가

export default function QuotationCustoms() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    branchKey: "IC", // 지사 기본값
    company: "",
    doc_number: "",
    feeRate: "0.2",
    minFee: "30000",
    maxFee: "",
    correctionFee: "20000",
    ftaApplication: "30000",
    requirementApplication: "",
    exportFeeRate: "0.15",
    exportMinFee: "15000",
    exportMaxFee: "",
    exportCorrectionFee: "10000",
    exportFtaCertificateAuthorized: "50000",
    exportFtaCertificateUnauth: "100000",
    notes: {
      feeRate: "",
      minFee: "",
      maxFee: "",
      correctionFee: "",
      ftaApplication: "",
      requirementApplication: "",
      exportFeeRate: "",
      exportMinFee: "",
      exportMaxFee: "",
      exportCorrectionFee: "포장 수량, 중량에 관한 정정 제외",
      exportFtaCertificateAuthorized: "",
      exportFtaCertificateUnauth: "",
    },
    checked: {
      feeRate: true,
      minFee: true,
      maxFee: false,
      correctionFee: true,
      ftaApplication: false,
      requirementApplication: false,
      exportFeeRate: true,
      exportMinFee: true,
      exportMaxFee: false,
      exportCorrectionFee: true,
      exportFtaCertificateAuthorized: false,
      exportFtaCertificateUnauth: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        checked: {
          ...prev.checked,
          [name]: checked,
        },
      }));
    } else if (name.startsWith("note_")) {
      const key = name.replace("note_", "");
      setForm((prev) => ({
        ...prev,
        notes: {
          ...prev.notes,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedItems = Object.keys(form.checked).filter((k) => form.checked[k]);
    const selectedData = selectedItems.map((item) => ({
      label: item,
      value: form[item],
      note: form.notes[item],
    }));
    navigate("/customspreview", {
      state: {
        selectedData,
        branchKey: form.branchKey,
        company: form.company,
        doc_number: form.doc_number,
      },
    });
  };

  const renderTable = (title, items) => (
    <>
      <h2 style={{ textAlign: "center", fontSize: 20, fontWeight: 700, marginTop: 40 }}>{title}</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
        <thead>
          <tr style={{ backgroundColor: "#3f72af", color: "white" }}>
            <th style={{ padding: 12 }}>✔</th>
            <th style={{ padding: 12 }}>항목</th>
            <th style={{ padding: 12 }}>금액</th>
            <th style={{ padding: 12 }}>비고</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ key, label, suffix }) => (
            <tr key={key} style={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
              <td style={{ textAlign: "center" }}>
                <input type="checkbox" name={key} checked={form.checked[key]} onChange={handleChange} />
              </td>
              <td style={{ padding: 10 }}>{label}</td>
              <td style={{ padding: 10 }}>
                <input
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={`예: ${suffix === "%" ? "0.15" : "30000"}`}
                  style={{ width: 100, padding: 6, marginRight: 6 }}
                />
                {suffix}
              </td>
              <td style={{ padding: 10 }}>
                <input
                  type="text"
                  name={`note_${key}`}
                  value={form.notes[key]}
                  onChange={handleChange}
                  placeholder="비고 입력"
                  style={{ width: "100%", padding: 6 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

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
      {/* 로고 + 타이틀 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ width: 180 }}>
          <img
            src={`${process.env.PUBLIC_URL}/images/HYLOGO_NAVY.png`}
            alt="한영 로고"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a2e59" }}>통관 수수료 견적서</h2>
      </div>

      {/* 지사 선택 라디오 */}
      <div style={{ maxWidth: 900, margin: "0 auto 20px", padding: "12px 0" }}>
        <div style={{ fontWeight: 600, color: "#1a2e59", marginBottom: 8 }}>본지사 선택</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {Object.values(HY_BRANCHES).map((b) => (
            <label key={b.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="branchKey"
                value={b.key}
                checked={form.branchKey === b.key}
                onChange={handleChange}
              />
              {b.label}
            </label>
          ))}
        </div>
      </div>

      {/* 업체명 & 문서번호 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>업체명</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="업체명을 입력하세요"
            style={{ width: "80%", padding: 10, borderRadius: 6, border: "1.5px solid #ccc" }}
            required
          />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>문서번호</label>
          <input
            type="text"
            name="doc_number"
            value={form.doc_number}
            onChange={handleChange}
            placeholder="문서번호 입력"
            style={{ width: "80%", padding: 10, borderRadius: 6, border: "1.5px solid #ccc" }}
            required
          />
        </div>
      </div>

      {renderTable("수입통관 수수료", [
        { key: "feeRate", label: "수수료 요율", suffix: "%" },
        { key: "minFee", label: "MIN", suffix: "원" },
        { key: "maxFee", label: "MAX", suffix: "원" },
        { key: "correctionFee", label: "신고정정", suffix: "원" },
        { key: "ftaApplication", label: "FTA 협정신청", suffix: "원" },
        { key: "requirementApplication", label: "요건신청", suffix: "원" },
      ])}

      {renderTable("수출통관 수수료", [
        { key: "exportFeeRate", label: "수수료 요율", suffix: "%" },
        { key: "exportMinFee", label: "MIN", suffix: "원" },
        { key: "exportMaxFee", label: "MAX", suffix: "원" },
        { key: "exportCorrectionFee", label: "신고정정", suffix: "원" },
        { key: "exportFtaCertificateAuthorized", label: "FTA C/O 발급 (인증수출자)", suffix: "원" },
        { key: "exportFtaCertificateUnauth", label: "FTA C/O 발급 (비인증수출자)", suffix: "원" },
      ])}

      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 30 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#aaa",
            border: "none",
            padding: "12px 30px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
            color: "#fff",
          }}
        >
          다시하기
        </button>
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
    </form>
  );
}
