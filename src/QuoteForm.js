import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";




const baseMatrix = [
  [300000, 400000, 500000, 600000, 700000],
  [400000, 500000, 600000, 700000, 800000],
  [600000, 700000, 800000, 900000, 1000000],
  [800000, 900000, 1000000, 1100000, 1200000],
];

const relatedMatrix = [
  [3000000, 4000000, 5000000, 6000000, 7000000],
  [4000000, 5000000, 6000000, 7000000, 8000000],
  [5000000, 6000000, 7000000, 8000000, 9000000],
  [6000000, 7000000, 8000000, 9000000, 10000000],
];

export default function QuoteForm() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    company: "",
    doc_number: "",
    includeBase: false,
    partners: 0,
    importAmount: 1,
    includeReason: false,
    reasonType: "basic",
    missingItems: 0,
    includeDoc: false,
    docPartners: 0,
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
    includeRelated: false,
    relatedPartners: 0,
    relatedImportAmount: 1,
    note: "", // 특이사항 상태 추가
    discountRate: 0,
  });

  const [costs, setCosts] = useState({
    baseCost: 0,
    reasonCost: 0,
    docCost: 0,
    reportCost: 0,
    relatedCost: 0,
    subTotal: 0, // 합산 (세금 제외)
    discountAmount: 0, // ✅ 추가
    vat: 0,      // 10% 부가세
    totalCost: 0,
  });


  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "checkbox" && name.startsWith("reportItems")) {
      const key = name.split(".")[1];
      setState((prev) => ({
        ...prev,
        reportItems: {
          ...prev.reportItems,
          [key]: checked,
        },
      }));
    } else if (type === "checkbox") {
      setState((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  // 특이사항(비고) 입력 처리
  const handleNoteChange = (e) => {
    setState((prev) => ({
      ...prev,
      note: e.target.value,
    }));
  };

const calculateCosts = useCallback(() => {
  let subTotal = 0;
  let baseCost = 0, reasonCost = 0, docCost = 0, reportCost = 0, relatedCost = 0;

  if (state.includeBase) {
    const row = state.partners <= 10 ? 0 : state.partners <= 30 ? 1 : state.partners <= 100 ? 2 : 3;
    baseCost = baseMatrix[row][state.importAmount - 1];
    subTotal += baseCost;
  }

  if (state.includeReason) {
    reasonCost = state.reasonType === "basic"
      ? 100000 * (state.reasonPartners || 0)
      : 100000 * (state.reasonPartners || 0) + 30000 * (state.missingItems || 0);
    subTotal += reasonCost;
  }

  if (state.includeDoc) {
    docCost = state.docPartners * 50000;
    subTotal += docCost;
  }

  if (state.includeReport) {
    const checkedCount = Object.values(state.reportItems).filter(Boolean).length;
    reportCost = checkedCount * (state.reportPartners || 0) * 1000000;
    subTotal += reportCost;
  }

  if (state.includeRelated) {
    const row = state.relatedPartners <= 10 ? 0 : state.relatedPartners <= 30 ? 1 : state.relatedPartners <= 50 ? 2 : 3;
    relatedCost = relatedMatrix[row][state.relatedImportAmount - 1];
    subTotal += relatedCost;
  }

  const discountAmount = Math.round(subTotal * (state.discountRate / 100));
  const discountedSubTotal = subTotal - discountAmount;
  const vat = Math.round(discountedSubTotal * 0.1);
  const totalCost = discountedSubTotal + vat;

  setCosts({
    baseCost,
    reasonCost,
    docCost,
    reportCost,
    relatedCost,
    subTotal,
    discountAmount,
    vat,
    totalCost,
  });
}, [state]);


  useEffect(() => {
    calculateCosts();
  }, [calculateCosts]);


  // 숨겨진 input 생성 함수 (기존 유지)
  const renderHiddenInputs = () => {
    const inputs = [];

    if (state.includeBase) {
      inputs.push(
        <input key="service-base" type="hidden" name="service" value="거래구조 및 과세자료 제출 범위 검토" />
      );
      inputs.push(
        <input key="price-base" type="hidden" name="price" value={costs.baseCost} />
      );
    }
    if (state.includeReason) {
      inputs.push(
        <input key="service-reason" type="hidden" name="service" value="과세자료 미제출 사유서 작성 지원" />
      );
      inputs.push(
        <input key="price-reason" type="hidden" name="price" value={costs.reasonCost} />
      );
    }
    if (state.includeDoc) {
      inputs.push(
        <input key="service-doc" type="hidden" name="service" value="과세자료 제출 서류 정비 및 전자제출 대행" />
      );
      inputs.push(
        <input key="price-doc" type="hidden" name="price" value={costs.docCost} />
      );
    }
    if (state.includeReport) {
      inputs.push(
        <input key="service-report" type="hidden" name="service" value="과세가격 결정 사유 보고서 작성" />
      );
      inputs.push(
        <input key="price-report" type="hidden" name="price" value={costs.reportCost} />
      );
    }
    if (state.includeRelated) {
      inputs.push(
        <input key="service-related" type="hidden" name="service" value="특수관계자 거래 분석 및 이전가격 검토 리포트" />
      );
      inputs.push(
        <input key="price-related" type="hidden" name="price" value={costs.relatedCost} />
      );
    }

    // 특이사항 숨겨진 input 추가
    inputs.push(
      <input key="note" type="hidden" name="note" value={state.note || ""} />
    );

    return inputs;
  };

  // 폼 제출 핸들러 (견적서 생성 버튼 클릭시)
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateCosts();
    // 비용이 계산되는 setCosts가 비동기라서,
    // 바로 navigate하면 이전 비용 상태가 넘어갈 수 있으므로, 
    // calculateCosts 후 navigate는 비용을 직접 계산해서 넘김으로 처리
    let subTotal = 0;
    let baseCost = 0;
    if(state.includeBase){
      let row = state.partners <= 10 ? 0 : state.partners <= 30 ? 1 : state.partners <= 100 ? 2 : 3;
      baseCost = baseMatrix[row][state.importAmount - 1];
      subTotal += baseCost;
    }

    let reasonCost = 0;
    if(state.includeReason){
      reasonCost = state.reasonType === "basic" ? 100000 : 100000 + state.missingItems * 30000;
      subTotal += reasonCost;
    }

    let docCost = 0;
    if(state.includeDoc){
      docCost = state.docPartners * 50000;
      subTotal += docCost;
    }

    let reportCost = 0;
    if(state.includeReport){
      const checkedCount = Object.values(state.reportItems).filter(Boolean).length;
      reportCost = checkedCount * 1000000;
      subTotal += reportCost;
    }

    let relatedCost = 0;
    if(state.includeRelated){
      let row = state.relatedPartners <= 10 ? 0 : state.relatedPartners <= 30 ? 1 : state.relatedPartners <= 50 ? 2 : 3;
      relatedCost = relatedMatrix[row][state.relatedImportAmount - 1];
      subTotal += relatedCost;
    }

// 할인 계산
const discountAmount = Math.round(subTotal * (state.discountRate / 100));
const discountedSubTotal = subTotal - discountAmount;
const vat = Math.round(discountedSubTotal * 0.1);
const totalCost = discountedSubTotal + vat;

// navigate
navigate("/preview", {
  state: {
    formData: state,
    costs: {
      baseCost,
      reasonCost,
      docCost,
      reportCost,
      relatedCost,
      subTotal,
      discountAmount, // ✅ 오류 해결: 정의된 변수를 전달
      vat,
      totalCost
    }
  }
});

  };

  return (
<form
  method="post"
  onSubmit={handleSubmit}
  style={{
    fontFamily: "'Pretendard', 'Segoe UI', 'Helvetica Neue', sans-serif",
    backgroundColor: "#fafbfc",
    color: "#222",
    padding: 40,
    maxWidth: "80%",       // 80% 너비 지정
    margin: "0 auto",
    lineHeight: 1.6,
  }}
>

        {/* 로고 추가 */}
<div
  style={{

    top: 20,
    right: 20,
    width: 200,
    height: "auto",
  }}
>
  <img
    src={`${process.env.PUBLIC_URL}/images/logo_color.png`}
    alt="한영 로고"
    style={{
      width: "100%",      // 부모 div 기준 100%
      height: "auto",
      objectFit: "contain",
    }}
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

  {/* 회사명과 문서번호를 가로 한 줄에 배치 */}
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
        placeholder="숫자 3자리 입력"
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

      {/* ...생략... */}
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
      <th style={{ padding: "16px 20px", textAlign: "center" }}>
        거래처 수(수량)
      </th>
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
    {/* 세부내용: 수입금액 드롭다운 */}
        연 수입금액:{" "}

    <select
      name="importAmount"
      value={state.importAmount}
      onChange={handleChange}
      style={{
        width: 130,
        borderRadius: 8,
        border: "1.8px solid #ced4da",
        padding: 8,
      }}
    >
      <option value={1}>50억 미만</option>
      <option value={2}>50~100억</option>
      <option value={3}>100~200억</option>
      <option value={4}>200~500억</option>
      <option value={5}>500억 이상</option>
    </select>
  </td>
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    {/* 거래처 수 입력란, 기본 0 */}
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
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    -
  </td>
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


<tr>
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
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

  {/* 세부내용 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <label>
      <input
        type="radio"
        name="reasonType"
        value="basic"
        checked={state.reasonType === "basic"}
        onChange={handleChange}
      />{" "}
      거래 사실 없음
    </label>
    <label>
      <input
        type="radio"
        name="reasonType"
        value="missing"
        checked={state.reasonType === "missing"}
        onChange={handleChange}
      />{" "}
      비과세 거래
      <br />
      항목 수:{" "}
      <input
        type="number"
        name="missingItems"
        min="0"
        value={state.missingItems}
        onChange={handleChange}
        style={{
          width: 70,
          marginLeft: 10,
          borderRadius: 7,
          border: "1.8px solid #ced4da",
          padding: 8,
        }}
      />
    </label>
  </td>

  {/* 거래처 수(수량) */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    <input
      type="number"
      name="reasonPartners"
      min="0"
      value={state.reasonPartners || 0}
      onChange={handleChange}
      style={{
        width: 70,
        borderRadius: 7,
        border: "1.8px solid #ced4da",
        padding: 8,
      }}
    />
  </td>

  {/* 단가 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    기본 100,000   <br />+ 비과세거래 / 항목 30,000
  </td>

  {/* 합계 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "right",
    }}
  >
{(() => {
  const partners = state.reasonPartners || 0;
  const missingCount = state.missingItems || 0;
  if (!state.includeReason) return 0;
  if (state.reasonType === "basic") {
    return (100000 * partners).toLocaleString();
  } else if (state.reasonType === "missing") {
    const sum = 100000 * partners + 30000 * missingCount;
    return sum.toLocaleString();
  }
  return 0;
})()}

  </td>
</tr>






    {/* 과세자료 제출 서류 정비 및 전자제출 대행 */}
    <tr>
      <td
        style={{
          backgroundColor: "white",
          padding: "16px 20px",
          textAlign: "center",
        }}
      >
        <input
          type="checkbox"
          name="includeDoc"
          checked={state.includeDoc}
          onChange={handleChange}
        />
      </td>
      <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
        <b>과세자료 제출 서류 정비 및 전자제출 대행</b>
      </td>
      <td
        style={{
          backgroundColor: "white",
          padding: "16px 20px",
          textAlign: "left",
        }}
      >
        
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
          name="docPartners"
          min="0"
          value={state.docPartners}
          onChange={handleChange}
          style={{
            width: 70,
            borderRadius: 7,
            border: "1.8px solid #ced4da",
            padding: 8,
          }}
        />
      </td>
      <td
        style={{
          backgroundColor: "white",
          padding: "16px 20px",
          textAlign: "center",
        }}
      >
        50,000원
      </td>
      <td
        style={{
          backgroundColor: "white",
          padding: "16px 20px",
          textAlign: "right",
        }}
      >
        {costs.docCost.toLocaleString()}
      </td>
    </tr>



{/* 과세가격 결정 사유 보고서 작성 */}

{/* 과세가격 결정 사유 보고서 작성 */}
<tr>
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    <input
      type="checkbox"
      name="includeReport"
      checked={state.includeReport}
      onChange={handleChange}
    />
  </td>
  <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
    <b>과세가격 결정 사유 보고서 작성</b>
  </td>

  {/* 세부내용: 체크박스 8개 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    }}
  >
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

  {/* 거래처 수(수량): 숫자 입력란 1개 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    <input
      type="number"
      name="reportPartners"
      min="0"
      value={state.reportPartners || 0}
      onChange={handleChange}
      style={{
        width: 70,
        borderRadius: 7,
        border: "1.8px solid #ced4da",
        padding: 8,
      }}
    />
  </td>

  {/* 단가 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    1,000,000원 / 항목
  </td>

  {/* 합계 계산: 체크된 항목 수 * 거래처 수 * 1,000,000 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "right",
    }}
  >
    {(() => {
      if (!state.includeReport) return "0";
      const checkedCount = Object.values(state.reportItems).filter(Boolean).length;
      const partners = Number(state.reportPartners || 0);
      const cost = checkedCount * partners * 1000000;
      return cost.toLocaleString();
    })()}
  </td>
</tr>


{/* 특수관계자 거래 분석 및 이전가격 검토 리포트 */}
<tr>
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    <input
      type="checkbox"
      name="includeRelated"
      checked={state.includeRelated}
      onChange={handleChange}
    />
  </td>
  <td style={{ backgroundColor: "white", padding: "16px 20px" }}>
    <b>특수관계자 거래 분석 및 이전가격 검토 리포트</b>
  </td>

  {/* 세부내용: 연 수입금액 텍스트 + 드롭다운 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "left",
    }}
  >
    연 수입금액:{" "}
    <select
      name="relatedImportAmount"
      value={state.relatedImportAmount}
      onChange={handleChange}
      style={{
        width: 130,
        borderRadius: 8,
        border: "1.8px solid #ced4da",
        padding: 8,
      }}
    >
      <option value={1}>50억 미만</option>
      <option value={2}>50~100억</option>
      <option value={3}>100~200억</option>
      <option value={4}>200~500억</option>
      <option value={5}>500억 이상</option>
    </select>
  </td>

  {/* 거래처 수(수량): 숫자 입력란 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    <input
      type="number"
      name="relatedPartners"
      min="0"
      value={state.relatedPartners || 0}
      onChange={handleChange}
      style={{
        width: 70,
        borderRadius: 7,
        border: "1.8px solid #ced4da",
        padding: 8,
      }}
    />
  </td>

  {/* 단가 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "center",
    }}
  >
    -
  </td>

  {/* 합계 */}
  <td
    style={{
      backgroundColor: "white",
      padding: "16px 20px",
      textAlign: "right",
    }}
  >
    {costs.relatedCost.toLocaleString()}
  </td>
</tr>




  </tbody>

        <tfoot>

<tr>
  <th
    colSpan="4"
    style={{
      padding: "16px 20px",
      textAlign: "right",
    }}
  >
Discount&nbsp;
<input
  type="number"
  name="discountRate"
  min="0"
  max="100"
  value={state.discountRate}
  onChange={(e) => {
    handleChange(e);
    calculateCosts(); // 할인율 바뀔 때 실시간으로 계산
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
  <th
    style={{
      padding: "16px 20px",
      textAlign: "right",
    }}
  >
    -{costs.discountAmount?.toLocaleString() || 0}원
  </th>
</tr>


          <tr>
            <th
              colSpan="4"
              style={{
                padding: "16px 20px",
                textAlign: "right",
                borderRadius: "0 0 0 10px",
              }}
            >
              V.A.T (10%)
            </th>
            <th
              style={{
                padding: "16px 20px",
                textAlign: "right",
              }}
            >
              {costs.vat.toLocaleString()}
            </th>
          </tr>
          <tr>
            <th
              colSpan="4"
              style={{
                padding: "16px 20px",
                textAlign: "right",
              }}
            >
              총 합계 (V.A.T 포함)
            </th>
            <th
              style={{
                padding: "16px 20px",
                textAlign: "right",
                borderRadius: "0 0 10px 0",
              }}
            >
              {costs.totalCost.toLocaleString()}
            </th>
          </tr>
          <tr>
            <td colSpan="5" style={{ padding: "16px 20px" }}>
              <label htmlFor="note" style={{ fontWeight: 600 }}>
                특이사항 / 비고:
              </label>
              <br />
              <textarea
                id="note"
                name="note"
                value={state.note}
                onChange={handleNoteChange}
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
{/* 숨겨진 input들 */}
{renderHiddenInputs()}

<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 20, // 버튼 사이 간격
    marginTop: 30,
  }}
>


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
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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