// src/hyBranches.js
export const HY_BRANCHES = {
  HQ: {
    key: "HQ",
    label: "본사",
    codePrefix: "HYHQ", // ← '25' 제거
    address: "서울 강서구 마곡중앙로 171, 1109호",
    tel: "02-741-1000",
    fax: "02-741-0008",
    bank: "신한은행",
    account: "100-021-961562",
    holder: "관세법인 한영",
  },
  GN: {
    key: "GN",
    label: "강남",
    codePrefix: "HYGN",
    address: "서울 강남구 언주로 141길 6, 406호",
    tel: "02-549-8095",
    fax: "02-549-8093",
    bank: "국민은행",
    account: "096301-04-094728",
    holder: "관세법인 한영",
  },
  BS: {
    key: "BS",
    label: "부산",
    codePrefix: "HYBS",
    address: "부산광역시 부산진구 가야대로 749-1, 1701호",
    tel: "051-462-6167",
    fax: "051-465-6168",
    bank: "국민은행",
    account: "947801-01-257824",
    holder: "관세법인 한영 부산지점",
  },
  JA: {
    key: "JA",
    label: "중앙",
    codePrefix: "HYJA",
    address: "부산 중구 광복로97번길 18, 807호",
    tel: "051-414-0811",
    fax: "051-414-0812",
    bank: "국민은행",
    account: "551101-01-494813",
    holder: "관세법인 한영 중앙",
  },
  IC: {
    key: "IC",
    label: "인천",
    codePrefix: "HYIC",
    // “기존 견적서 내용 유지” 요청에 맞춰 현재 Preview 기본값과 동일하게 세팅
    address: "인천광역시 서구 이음4로6 KR법조타워 915호",
    tel: "032-713-4897",
    fax: "032-713-4898",
    bank: "신한은행",
    account: "140-015-193246",
    holder: "관세법인 한영 인천지사",
  },
};

// 문서번호 표기: 접두-번호 (예: HYIC-001)
export function formatDocNo(prefix, docNumber) {
  const num = (docNumber ?? "").toString().trim();
  return `${prefix}-${num || "XXXX"}`;
}


export default HY_BRANCHES;
