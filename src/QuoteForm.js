// QuoteForm.js
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import { HY_BRANCHES } from "./hyBranches";

export default function QuoteForm() {
  const navigate = useNavigate();


  const [state, setState] = useState({

    docType: "invoice", //invoice | quotation
    // 지사 선택 (기본: 인천)
    branchKey: "IC",

    company: "",
    doc_number: "",

    // (1) 거래구조 및 과세자료 제출 범위 검토
    includeBase: false,
    partners: 0,
    importAmount: 1, // 1: 100억 이하, 2: 100~200억, 3: 200~300억, 4: 300억 초과

    // (신규1) 해외거래처별 과세자료 제출 범위 검토
    includeOverseasRange: false,
    overseasPartners: 0,

    // (2) 과세자료 미제출 사유서 작성 지원
    includeReason: false,
    reasonPartners: 0,

    // (2-1) 과세자료 지연제출 사유서 작성 지원
    includeDelayReason: false,
    delayReasonPartners: 0,

    // (3) 과세자료 제출 서류 정비 및 전자제출 대행
    includeDoc: false,
    docPartners: 0,

    // (4) 과세가격 결정 사유 보고서 작성
    includeReport: false,
    reportItems: {
      royalty: false,
      productionSupport: false,
      commission: false,
      freightInsurance: false,
      packaging: false,
      postBenefit: false,
      indirectPayment: false,
      other: false,
    },
    reportCounts: {
      royalty: 0,
      productionSupport: 0,
      commission: 0,
      freightInsurance: 0,
      packaging: 0,
      postBenefit: 0,
      indirectPayment: 0,
      other: 0,
    },
    reportPartners: 0,

    // (5) 특수관계자 거래 분석 및 이전가격 검토 리포트
    includeRelated: false,
    relatedImportAmount: 1, // 1~4

    // (신규2) 공란 항목
    includeCustom: false,
    customLabel: "",
    customQty: 0,
    customUnit: 0,

    note: "",
    discountRate: 0,
  });

  const [costs, setCosts] = useState({
    baseCost: 0,
    overseasRangeCost: 0, // 신규1
    reasonCost: 0,
    delayReasonCost: 0,
    docCost: 0,
    reportCost: 0,
    relatedCost: 0,
    customCost: 0, // 신규2
    subTotal: 0,
    discountAmount: 0,
    vat: 0,
    totalCost: 0,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "checkbox" && name.startsWith("reportItems")) {
      const key = name.split(".")[1];
      setState((prev) => ({
        ...prev,
        reportItems: { ...prev.reportItems, [key]: checked },
      }));
    } else if (type === "checkbox") {
      setState((prev) => ({ ...prev, [name]: checked }));
    } else {
      setState((prev) => ({
        ...prev,
        [name]:
          type === "number" ||
          name === "importAmount" ||
          name === "relatedImportAmount"
            ? Number(value)
            : value,
      }));
    }
  };

  // (1) 기본 항목: 거래처 기준 + 가중치
  const calcBaseCost = (partners, importAmount) => {
    const p = Number(partners) || 0;
    const ia = Number(importAmount) || 1;

    const base =
      p <= 10 ? 1000000 :
      p <= 20 ? 2000000 :
      p <= 50 ? 3000000 :
      5000000;

    const weight = ia === 1 ? 0 : ia === 2 ? 0.2 : ia === 3 ? 0.3 : 0.5;
    return Math.round(base * (1 + weight));
  };

  // (5) 특수관계자 거래: 기본 5,000,000 + 가중치 (거래처 수 미사용)
  const calcRelatedCost = (relatedImportAmount) => {
    const ia = Number(relatedImportAmount) || 1;
    const base = 5000000;
    const weight = ia === 1 ? 0 : ia === 2 ? 0.2 : ia === 3 ? 0.3 : 0.5;
    return Math.round(base * (1 + weight));
  };

  const calculateCosts = useCallback(() => {
    let subTotal = 0;

    // (1) 기본
    let baseCost = 0;
    if (state.includeBase) {
      baseCost = calcBaseCost(state.partners, state.importAmount);
      subTotal += baseCost;
    }

    // (신규1) 해외거래처별 = 거래처 수 × 300,000
    let overseasRangeCost = 0;
    if (state.includeOverseasRange) {
      overseasRangeCost = (Number(state.overseasPartners) || 0) * 300000;
      subTotal += overseasRangeCost;
    }

    // (2) 미제출 사유서 = 거래처 수 × 100,000
    let reasonCost = 0;
    if (state.includeReason) {
      reasonCost = (Number(state.reasonPartners) || 0) * 100000;
      subTotal += reasonCost;
    }

    // (2-1) 지연제출 사유서 = 거래처 수 × 50,000
    let delayReasonCost = 0;
    if (state.includeDelayReason) {
      delayReasonCost = (Number(state.delayReasonPartners) || 0) * 50000;
      subTotal += delayReasonCost;
    }

    // (3) 서류 정비 = 거래처 수 × 50,000
    let docCost = 0;
    if (state.includeDoc) {
      docCost = (Number(state.docPartners) || 0) * 50000;
      subTotal += docCost;
    }

    // (4) 사유 보고서 = 체크된 항목 수 × 거래처 수 × 1,000,000
    let reportCost = 0;
    if (state.includeReport) {
      const checkedCount = Object.values(state.reportItems).filter(Boolean).length;
      reportCost = checkedCount * (Number(state.reportPartners) || 0) * 1000000;
      subTotal += reportCost;
    }

    // (5) 특수관계자 거래 = 5,000,000 × (1 + 가중치)
    let relatedCost = 0;
    if (state.includeRelated) {
      relatedCost = calcRelatedCost(state.relatedImportAmount);
      subTotal += relatedCost;
    }

    // (신규2) 공란 = 수량 × 단가
    let customCost = 0;
    if (state.includeCustom) {
      const q = Number(state.customQty) || 0;
      const u = Number(state.customUnit) || 0;
      customCost = q * u;
      subTotal += customCost;
    }

    const discountAmount = Math.round(subTotal * (state.discountRate / 100));
    const discountedSubTotal = subTotal - discountAmount;
    const vat = Math.round(discountedSubTotal * 0.1);
    const totalCost = discountedSubTotal + vat;

    setCosts({
      baseCost,
      overseasRangeCost,
      reasonCost,
      delayReasonCost,
      docCost,
      reportCost,
      relatedCost,
      customCost,
      subTotal,
      discountAmount,
      vat,
      totalCost,
    });
  }, [state]);

  useEffect(() => { calculateCosts(); }, [calculateCosts]);

  const renderHiddenInputs = () => {
    const inputs = [];

    if (state.includeBase) {
      inputs.push(<input key="service-base" type="hidden" name="service" value="거래구조 및 과세자료 제출 범위 검토" />);
      inputs.push(<input key="price-base" type="hidden" name="price" value={costs.baseCost} />);
    }

    if (state.includeOverseasRange) {
      inputs.push(<input key="service-overseas-range" type="hidden" name="service" value="해외거래처별 과세자료 제출 범위 검토" />);
      inputs.push(<input key="price-overseas-range" type="hidden" name="price" value={costs.overseasRangeCost} />);
    }

    if (state.includeReason) {
      inputs.push(<input key="service-reason" type="hidden" name="service" value="과세자료 미제출 사유서 작성 지원" />);
      inputs.push(<input key="price-reason" type="hidden" name="price" value={costs.reasonCost} />);
    }

    if (state.includeDelayReason) {
      inputs.push(<input key="service-delay" type="hidden" name="service" value="과세자료 지연제출 사유서 작성 지원" />);
      inputs.push(<input key="price-delay" type="hidden" name="price" value={costs.delayReasonCost} />);
    }

    if (state.includeDoc) {
      inputs.push(<input key="service-doc" type="hidden" name="service" value="과세자료 제출 서류 정비 및 전자제출 대행" />);
      inputs.push(<input key="price-doc" type="hidden" name="price" value={costs.docCost} />);
    }

    if (state.includeReport) {
      inputs.push(<input key="service-report" type="hidden" name="service" value="과세가격 결정 사유 보고서 작성" />);
      inputs.push(<input key="price-report" type="hidden" name="price" value={costs.reportCost} />);
    }

    if (state.includeRelated) {
      inputs.push(<input key="service-related" type="hidden" name="service" value="특수관계자 거래 분석 및 이전가격 검토 리포트" />);
      inputs.push(<input key="price-related" type="hidden" name="price" value={costs.relatedCost} />);
    }

    if (state.includeCustom) {
      inputs.push(<input key="service-custom" type="hidden" name="service" value={state.customLabel || "기재없음"} />);
      inputs.push(<input key="price-custom" type="hidden" name="price" value={costs.customCost} />);
    }

    // 메모 & 지사
    inputs.push(<input key="note" type="hidden" name="note" value={state.note || ""} />);
    inputs.push(<input key="branchKey" type="hidden" name="branchKey" value={state.branchKey} />);

    return inputs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 제출 시 동일 산식으로 안전 재계산
    let subTotal = 0;

    let baseCost = 0;
    if (state.includeBase) {
      baseCost = calcBaseCost(state.partners, state.importAmount);
      subTotal += baseCost;
    }

    let overseasRangeCost = 0;
    if (state.includeOverseasRange) {
      overseasRangeCost = (Number(state.overseasPartners) || 0) * 300000;
      subTotal += overseasRangeCost;
    }

    let reasonCost = 0;
    if (state.includeReason) {
      reasonCost = (Number(state.reasonPartners) || 0) * 100000;
      subTotal += reasonCost;
    }

    let delayReasonCost = 0;
    if (state.includeDelayReason) {
      delayReasonCost = (Number(state.delayReasonPartners) || 0) * 50000;
      subTotal += delayReasonCost;
    }

    let docCost = 0;
    if (state.includeDoc) {
      docCost = (Number(state.docPartners) || 0) * 50000;
      subTotal += docCost;
    }

    let reportCost = 0;
    if (state.includeReport) {
      const checkedCount = Object.values(state.reportItems).filter(Boolean).length;
      reportCost = checkedCount * (Number(state.reportPartners) || 0) * 1000000;
      subTotal += reportCost;
    }

    let relatedCost = 0;
    if (state.includeRelated) {
      relatedCost = calcRelatedCost(state.relatedImportAmount);
      subTotal += relatedCost;
    }

    let customCost = 0;
    if (state.includeCustom) {
      const q = Number(state.customQty) || 0;
      const u = Number(state.customUnit) || 0;
      customCost = q * u;
      subTotal += customCost;
    }

    const discountAmount = Math.round(subTotal * (state.discountRate / 100));
    const discountedSubTotal = subTotal - discountAmount;
    const vat = Math.round(discountedSubTotal * 0.1);
    const totalCost = discountedSubTotal + vat;

    navigate("/preview", {
      state: {
        formData: state, // branchKey 포함
        costs: {
          baseCost,
          overseasRangeCost,
          reasonCost,
          delayReasonCost,
          docCost,
          reportCost,
          relatedCost,
          customCost,
          subTotal,
          discountAmount,
          vat,
          totalCost,
        },
      },
    });
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      style={{
        fontFamily: "'Pretendard','Segoe UI','Helvetica Neue',sans-serif",
        backgroundColor: "#fafbfc",
        color: "#222",
        padding: 40,
        maxWidth: "80%",
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >
      {/* 로고 */}
      <div style={{ top: 20, right: 20, width: 200, height: "auto" }}>
        <img
          src={`${process.env.PUBLIC_URL}/images/HYLOGO_NAVY.png`}
          alt="한영 로고"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>

      <h1
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 32,
          marginBottom: 40,
          color: "#1a2e59",
          letterSpacing: "0.02em",
        }}
      >
        과세자료 제출 컨설팅 견적서 생성기
      </h1>

{/* 문서 종류 선택 */}
<div style={{ maxWidth: 900, margin: "0 auto 12px" }}>
  <div style={{ fontWeight: 600, color: "#1a2e59", marginBottom: 8 }}>문서 종류</div>
  <label style={{ marginRight: 16 }}>
    <input
      type="radio"
      name="docType"
      value="invoice"
      checked={state.docType === "invoice"}
      onChange={handleChange}
    /> Invoice
  </label>
  <label>
    <input
      type="radio"
      name="docType"
      value="quotation"
      checked={state.docType === "quotation"}
      onChange={handleChange}
    /> Quotation
  </label>
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
                checked={state.branchKey === b.key}
                onChange={handleChange}
              />
              {b.label}
            </label>
          ))}
        </div>
      </div>

      {/* 회사명 / 문서번호 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
          gap: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <label
            htmlFor="company"
            style={{ fontWeight: 600, marginBottom: 10, color: "#1a2e59", display: "block" }}
          >
            회사명:
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            placeholder="회사명을 입력하세요"
            value={state.company}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 15,
              borderRadius: 8,
              border: "2px solid #ced4da",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            htmlFor="doc_number"
            style={{ fontWeight: 600, marginBottom: 10, color: "#1a2e59", display: "block" }}
          >
            문서번호:
          </label>
          <input
            type="text"
            id="doc_number"
            name="doc_number"
            required
            placeholder="문서번호를 구성할 숫자를 입력해주세요"
            value={state.doc_number}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 15,
              borderRadius: 8,
              border: "2px solid #ced4da",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* 서비스 항목 */}
      <h2
        style={{
          textAlign: "center",
          margin: "50px 0 30px",
          fontSize: 22,
          fontWeight: 700,
          color: "#1a2e59",
borderBottom: "3px solid #3f72af",
          paddingBottom: 10,
          maxWidth: 420,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        서비스 항목 선택
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 12px",
          fontSize: 15,
          color: "#333",
          marginBottom: 20,
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#3f72af",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.04em",
            }}
          >
            <th
              style={{
                borderRadius: "10px 0 0 10px",
                padding: "16px 20px",
                textAlign: "center",
              }}
            >
              ✔
            </th>
            <th style={{ padding: "16px 20px" }}>항목</th>
            <th style={{ padding: "16px 20px" }}>세부내용</th>
            <th style={{ padding: "16px 20px", textAlign: "center" }}>거래처 수(수량)</th>
            <th style={{ padding: "16px 20px", textAlign: "center" }}>단가</th>
            <th
              style={{
                borderRadius: "0 10px 10px 0",
                padding: "16px 20px",
                textAlign: "right",
              }}
            >
              합계
            </th>
          </tr>
        </thead>

        <tbody>
          {/* (1) 거래구조 및 과세자료 제출 범위 검토 */}
          <tr>
            <td
              style={{
                backgroundColor: "white",
                padding: "16px 20px",
                borderRadius: "10px 0 0 10px",
                textAlign: "center",
              }}
            >
              <input
                type="checkbox"
                name="includeBase"
                checked={state.includeBase}
                onChange={handleChange}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              <b>거래구조 및 과세자료 제출 범위 검토</b>
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              연 수입금액:&nbsp;
              <select
                name="importAmount"
                value={state.importAmount}
                onChange={handleChange}
                style={{
                  width: 180,
                  borderRadius: 8,
                  border: "1.8px solid #ced4da",
                  padding: 8,
                }}
              >
                <option value={1}>100억 이하</option>
                <option value={2}>100억 초과 200억 이하</option>
                <option value={3}>200억 초과 300억</option>
                <option value={4}>300억 초과</option>
              </select>
            </td>
            <td
              style={{
                backgroundColor: "white",
                padding: "16px 20px",
                textAlign: "center",
              }}
            >
              <input
                type="number"
                name="partners"
                min="0"
                value={state.partners}
                onChange={handleChange}
                style={{
                  width: 70,
                  borderRadius: 7,
                  border: "1.8px solid #ced4da",
                  padding: 8,
                }}
              />
            </td>
            {/* 단가 비노출 */}
            <td
              style={{
                backgroundColor: "white",
                padding: "16px 20px",
                textAlign: "center",
              }}
            />
            <td
              style={{
                backgroundColor: "white",
                padding: "16px 20px",
                textAlign: "right",
              }}
            >
              {costs.baseCost.toLocaleString()}
            </td>
          </tr>

          {/* (신규1) 해외거래처별 과세자료 제출 범위 검토 */}
          <tr>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="checkbox"
                name="includeOverseasRange"
                checked={state.includeOverseasRange}
                onChange={handleChange}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              <b>해외거래처별 과세자료 제출 범위 검토</b>
            </td>
            {/* 세부내용 없음 */}
            <td style={{ backgroundColor: "white", padding: "16px 20px" }} />
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="number"
                name="overseasPartners"
                min="0"
                value={state.overseasPartners || 0}
                onChange={handleChange}
                style={{ width: 70, borderRadius: 7, border: "1.8px solid #ced4da", padding: 8 }}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              300,000원
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "right" }}>
              {costs.overseasRangeCost.toLocaleString()}
            </td>
          </tr>

          {/* (2) 과세자료 미제출 사유서 작성 지원 */}
          <tr>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="checkbox"
                name="includeReason"
                checked={state.includeReason}
                onChange={handleChange}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              <b>과세자료 미제출 사유서 작성 지원</b>
            </td>
            {/* 세부내용 없음 */}
            <td style={{ backgroundColor: "white", padding: "16px 20px" }} />
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="number"
                name="reasonPartners"
                min="0"
                value={state.reasonPartners || 0}
                onChange={handleChange}
                style={{ width: 70, borderRadius: 7, border: "1.8px solid #ced4da", padding: 8 }}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>100,000원</td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "right" }}>
              {costs.reasonCost.toLocaleString()}
            </td>
          </tr>

          {/* (2-1) 과세자료 지연제출 사유서 작성 지원 */}
          <tr>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="checkbox"
                name="includeDelayReason"
                checked={state.includeDelayReason}
                onChange={handleChange}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              <b>과세자료 지연제출 사유서 작성 지원</b>
            </td>
            {/* 세부내용 없음 */}
            <td style={{ backgroundColor: "white", padding: "16px 20px" }} />
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="number"
                name="delayReasonPartners"
                min="0"
                value={state.delayReasonPartners || 0}
                onChange={handleChange}
                style={{ width: 70, borderRadius: 7, border: "1.8px solid #ced4da", padding: 8 }}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>50,000원</td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "right" }}>
              {costs.delayReasonCost.toLocaleString()}
            </td>
          </tr>

          {/* (3) 과세자료 제출 서류 정비 및 전자제출 대행 (현행 유지) */}
          <tr>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input type="checkbox" name="includeDoc" checked={state.includeDoc} onChange={handleChange} />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              <b>과세자료 제출 서류 정비 및 전자제출 대행</b>
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "left" }} />
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="number"
                name="docPartners"
                min="0"
                value={state.docPartners}
                onChange={handleChange}
                style={{ width: 70, borderRadius: 7, border: "1.8px solid #ced4da", padding: 8 }}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>50,000원</td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "right" }}>
              {costs.docCost.toLocaleString()}
            </td>
          </tr>

          {/* (4) 과세가격 결정 사유 보고서 작성 (현행 유지) */}
          <tr>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input type="checkbox" name="includeReport" checked={state.includeReport} onChange={handleChange} />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              <b>과세가격 결정 사유 보고서 작성</b>
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "left", display: "flex", flexDirection: "column", gap: "6px" }}>
              {Object.keys(state.reportItems).map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    name={`reportItems.${key}`}
                    checked={state.reportItems[key]}
                    onChange={handleChange}
                  />{" "}
                  {key === "royalty"
                    ? "로열티"
                    : key === "productionSupport"
                    ? "생산지원비"
                    : key === "commission"
                    ? "수수료/중개료"
                    : key === "freightInsurance"
                    ? "운임/보험료"
                    : key === "packaging"
                    ? "용기/포장비"
                    : key === "postBenefit"
                    ? "사후귀속이익"
                    : key === "indirectPayment"
                    ? "간접지급금액"
                    : "기타"}
                </label>
              ))}
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="number"
                name="reportPartners"
                min="0"
                value={state.reportPartners || 0}
                onChange={handleChange}
                style={{ width: 70, borderRadius: 7, border: "1.8px solid #ced4da", padding: 8 }}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>1,000,000원 / 항목</td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "right" }}>
              {(() => {
                if (!state.includeReport) return "0";
                const checkedCount = Object.values(state.reportItems).filter(Boolean).length;
                const partners = Number(state.reportPartners || 0);
                const cost = checkedCount * partners * 1000000;
                return cost.toLocaleString();
              })()}
            </td>
          </tr>

          {/* (5) 특수관계자 거래 분석 및 이전가격 검토 리포트 (새 산식) */}
          <tr>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input type="checkbox" name="includeRelated" checked={state.includeRelated} onChange={handleChange} />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              <b>특수관계자 거래 분석 및 이전가격 검토 리포트</b>
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "left" }}>
              연 수입금액:&nbsp;
              <select
                name="relatedImportAmount"
                value={state.relatedImportAmount}
                onChange={handleChange}
                style={{ width: 180, borderRadius: 8, border: "1.8px solid #ced4da", padding: 8 }}
              >
                <option value={1}>100억 이하</option>
                <option value={2}>100억 초과 200억 이하</option>
                <option value={3}>200억 초과 300억</option>
                <option value={4}>300억 초과</option>
              </select>
            </td>
            {/* 거래처 수는 "-" */}
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>-</td>
            {/* 단가 비노출 */}
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>-</td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "right" }}>
              {costs.relatedCost.toLocaleString()}
            </td>
          </tr>

          {/* (신규2) 공란 항목 */}
          <tr>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="checkbox"
                name="includeCustom"
                checked={state.includeCustom}
                onChange={handleChange}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
              <input
                type="text"
                name="customLabel"
                value={state.customLabel}
                onChange={handleChange}
                placeholder="항목명을 입력하세요"
                style={{ width: "100%", borderRadius: 7, border: "1.8px solid #ced4da", padding: 8 }}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px" }} />
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="number"
                name="customQty"
                min="0"
                value={state.customQty}
                onChange={handleChange}
                placeholder="수량"
                style={{ width: 90, borderRadius: 7, border: "1.8px solid #ced4da", padding: 8 }}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "center" }}>
              <input
                type="number"
                name="customUnit"
                min="0"
                value={state.customUnit}
                onChange={handleChange}
                placeholder="단가(숫자)"
                style={{ width: 120, borderRadius: 7, border: "1.8px solid #ced4da", padding: 8 }}
              />
            </td>
            <td style={{ backgroundColor: "white", padding: "16px 20px", textAlign: "right" }}>
              {costs.customCost.toLocaleString()}
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <th colSpan="4" style={{ padding: "16px 20px", textAlign: "right" }}>
              Discount&nbsp;
              <input
                type="number"
                name="discountRate"
                min="0"
                max="100"
                value={state.discountRate}
                onChange={(e) => {
                  handleChange(e);
                  calculateCosts();
                }}
                style={{
                  width: 60,
                  marginLeft: 10,
                  marginRight: 5,
                  borderRadius: 6,
                  padding: "6px 10px",
                  border: "1.8px solid #ced4da",
                  fontSize: 14,
                }}
              />
              %
            </th>
            <th style={{ padding: "16px 20px", textAlign: "right" }}>
              -{costs.discountAmount?.toLocaleString() || 0}원
            </th>
          </tr>

          <tr>
            <th colSpan="4" style={{ padding: "16px 20px", textAlign: "right", borderRadius: "0 0 0 10px" }}>
              V.A.T (10%)
            </th>
            <th style={{ padding: "16px 20px", textAlign: "right" }}>
              {costs.vat.toLocaleString()}
            </th>
          </tr>
          <tr>
            <th colSpan="4" style={{ padding: "16px 20px", textAlign: "right" }}>
              총 합계 (V.A.T 포함)
            </th>
            <th style={{ padding: "16px 20px", textAlign: "right", borderRadius: "0 0 10px 0" }}>
              {costs.totalCost.toLocaleString()}
            </th>
          </tr>
          <tr>
            <td colSpan="5" style={{ padding: "16px 20px" }}>
              <label htmlFor="note" style={{ fontWeight: 600 }}>특이사항 / 비고:</label>
              <br />
              {/* handleNoteChange 없이 처리 */}
              <textarea
                id="note"
                name="note"
                value={state.note}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  marginTop: 6,
                  borderRadius: 8,
                  border: "1.8px solid #ced4da",
                  padding: 12,
                  fontSize: 15,
                  resize: "vertical",
                }}
                placeholder="특이사항이 있으면 자유롭게 기재해 주세요."
              />
            </td>
          </tr>
        </tfoot>
      </table>

      {/* 숨겨진 input들 */}
      {renderHiddenInputs()}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 30,
        }}
      >
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
          type="submit"
          className="submit-btn"
          style={{
            backgroundColor: "#3f72af",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "14px 28px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#315d8f")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3f72af")}
        >
          📄 견적서 생성
        </button>
      </div>
    </form>
  );
}
