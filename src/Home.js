import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  // Pretendard 웹폰트 로드 (기존 유지)
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <>
      {/* 페이지 전용 스타일 */}
      <style>{`
        :root{
          --bg:#f6f7fb;
          --text:#111827;
          --muted:#6b7280;
          --card:#ffffff;
          --border:#e5e7eb;
          --shadow:0 10px 20px rgba(0,0,0,.05);
          --radius:18px;
          --radius-sm:12px;
        }
        .home{
          min-height:100vh;
          background:var(--bg);
          font-family:"Pretendard Variable", system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", sans-serif;
          color:var(--text);
        }
        .wrap{
          max-width:1200px;
          margin:0 auto;
          padding:56px 20px 80px;
          display:grid;
          grid-template-columns: 360px 1fr;
          gap:24px;
          align-items:start;
        }
        /* 좌측 히어로 */
        .hero{
          position:sticky;
          top:24px;
        }
        .headline{
          font-size:32px;
          line-height:1.25;
          font-weight:800;
          letter-spacing:-.01em;
        }
        .headline strong{
          display:block;
          margin-top:6px;
          font-size:36px;
        }
        .sub{
          margin-top:14px;
          color:var(--muted);
          font-size:15px;
        }
        .quick{
          margin-top:22px;
          display:grid;
          gap:12px;
        }
        .quick a{
          display:flex; align-items:center; gap:10px;
          background:var(--card);
          border:1px solid var(--border);
          border-radius:var(--radius-sm);
          padding:12px 14px;
          text-decoration:none;
          color:var(--text);
          font-weight:600;
          box-shadow:var(--shadow);
          transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .quick a:hover{
          transform:translateY(-2px);
          box-shadow:0 16px 30px rgba(0,0,0,.08);
          background:#fafafa;
        }
        .chip{
          display:inline-block;
          font-size:12px;
          font-weight:700;
          color:#374151;
          background:#eef2ff;
          border:1px solid #e0e7ff;
          border-radius:999px;
          padding:4px 10px;
        }

        /* 우측 카드 그리드 */
        .grid{
          display:grid;
          grid-template-columns:repeat(2,minmax(260px,1fr));
          gap:20px;
        }
        @media (min-width: 1160px){
          .grid{ grid-template-columns:repeat(4, 1fr); }
        }
        @media (max-width: 960px){
          .wrap{ grid-template-columns:1fr; }
          .hero{ position:static; }
        }

        .card{
          background:var(--card);
          border:1px solid var(--border);
          border-radius:var(--radius);
          padding:22px;
          box-shadow:var(--shadow);
          display:flex;
          flex-direction:column;
          gap:14px;
          transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          min-height:220px;
        }
        .card:hover{
          transform:translateY(-4px);
          box-shadow:0 18px 36px rgba(0,0,0,.10);
          border-color:#d1d5db;
        }
        .top{
          display:flex; align-items:center; justify-content:space-between;
        }
        .icon{
          width:48px; height:48px; border-radius:14px; display:grid; place-items:center;
          color:#fff;
        }
        .g-purple{ background:linear-gradient(135deg,#7c3aed,#a78bfa); }
        .g-blue{ background:linear-gradient(135deg,#2563eb,#60a5fa); }
        .g-green{ background:linear-gradient(135deg,#059669,#34d399); }
        .g-orange{ background:linear-gradient(135deg,#ea580c,#f59e0b); }

        .eyebrow{ font-size:13px; font-weight:800; color:#4b5563; letter-spacing:.02em; }
        .title{ font-size:20px; font-weight:800; line-height:1.25; }
        .desc{ color:var(--muted); font-size:14px; }

        .btn{
          margin-top:auto;
          display:flex; align-items:center; justify-content:space-between;
          gap:8px;
          text-decoration:none; color:var(--text);
          border:1px solid var(--border); border-radius:14px;
          padding:12px 14px; font-weight:700; background:#fff;
          transition:background .18s ease, transform .18s ease;
        }
        .btn:hover{ background:#f3f4f6; transform:translateY(-1px); }
        .btn.secondary{ font-weight:600; background:#fafafa; }
        .arrow{
          width:18px; height:18px; flex:0 0 18px;
        }
        .btnrow{ display:grid; gap:10px; }
      `}</style>

      <main className="home">
        <div className="wrap">
          {/* 좌측 영역 */}
          <section className="hero">
            <div className="chip">견적서 ㅣ 청구서 생성기</div>
            <h1 className="headline">
              관세법인 한영
              <strong>견적서 및 청구서</strong>
              <strong>작성 프로그램</strong>

            </h1>
            <p className="sub">본 프로그램은 관세법인 한영 본·지사 전용입니다. <br></br>사용 시 보안에 유의하시기 바랍니다.</p>

            {/* <div className="quick">
              <Link to="/guide">
                <span>📘 </span>
              </Link>
            </div> */}
          </section>

          {/* 우측 카드 그리드 */}
          <section className="grid">
            {/* 1. 통관 */}
            <article className="card">
              <div className="top">
                <span className="eyebrow">통관</span>
                <div className="icon g-purple" aria-hidden>
                  {/* 계산기 아이콘 */}
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M7 2h10a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H7zm1 3h8v4H8V7zM8 13h2v2H8v-2zm0 3h2v2H8v-2zm4-3h2v2h-2v-2zm0 3h2v2h-2v-2zm4-3h2v2h-2v-2zm0 3h2v2h-2v-2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="title">수출입 통관</h3>
              <p className="desc">기본 통관수수료에 대한 견적서 생성기입니다.</p>
              <div className="btnrow">
                <Link to="/customs" className="btn">
                  견적서 만들기
                  <svg className="arrow" viewBox="0 0 20 20" fill="currentColor"><path d="M7.293 14.707a1 1 0 0 1 0-1.414L9.586 11H4a1 1 0 1 1 0-2h5.586L7.293 6.707A1 1 0 1 1 8.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z"/></svg>
                </Link>
              </div>
            </article>

            {/* 2. 컨설팅 */}
            <article className="card">
              <div className="top">
                <span className="eyebrow">컨설팅</span>
                <div className="icon g-blue" aria-hidden>
                  {/* 문서아이콘 */}
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M14 2H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8l-6-6zM7 4h6v4a2 2 0 0 0 2 2h4v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm7 0 5 5h-3a2 2 0 0 1-2-2V4z"/>
                  </svg>
                </div>
              </div>
              <h3 className="title">컨설팅</h3>
              <p className="desc">컨설팅에 대한 견적서와 청구서를 생성합니다.</p>
              <div className="btnrow">
                <Link to="/consulting" className="btn">
                  견적서 만들기
                  <svg className="arrow" viewBox="0 0 20 20" fill="currentColor"><path d="M7.293 14.707a1 1 0 0 1 0-1.414L9.586 11H4a1 1 0 1 1 0-2h5.586L7.293 6.707A1 1 0 1 1 8.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z"/></svg>
                </Link>
              </div>
            </article>

            {/* 3. 품목분류 & FTA */}
            <article className="card">
              <div className="top">
                <span className="eyebrow">품목분류 & FTA</span>
                <div className="icon g-green" aria-hidden>
                  {/* 체크리스트 */}
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M9 2a2 2 0 0 0-2 2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-2a2 2 0 0 0-2-2H9zm0 2h6v2H9V4zm-2 6h10v2H7v-2zm0 4h6v2H7v-2zM5 10h1v2H5v-2zm0 4h1v2H5v-2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="title">품목분류 & FTA</h3>
              <p className="desc">품번·원재료 수 기준으로 자동 계산합니다.(미완성)</p>
              <div className="btnrow">
                <Link to="/fta" className="btn">
                  견적서 만들기
                  <svg className="arrow" viewBox="0 0 20 20" fill="currentColor"><path d="M7.293 14.707a1 1 0 0 1 0-1.414L9.586 11H4a1 1 0 1 1 0-2h5.586L7.293 6.707A1 1 0 1 1 8.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z"/></svg>
                </Link>
              </div>
            </article>

            {/* 4. 과세자료 제출 */}
            <article className="card">
              <div className="top">
                <span className="eyebrow">과세자료 제출</span>
                <div className="icon g-orange" aria-hidden>
                  {/* 말풍선 */}
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M4 4h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 4v2h12V8H6zm0 4v2h9v-2H6z"/>
                  </svg>
                </div>
              </div>
              <h3 className="title">과세자료 제출</h3>
              <p className="desc">과세자료 제출에 관한 견적서 생성기입니다.</p>
              <div className="btnrow">
                <Link to="/form" className="btn">
                  견적서 만들기
                  <svg className="arrow" viewBox="0 0 20 20" fill="currentColor"><path d="M7.293 14.707a1 1 0 0 1 0-1.414L9.586 11H4a1 1 0 1 1 0-2h5.586L7.293 6.707A1 1 0 1 1 8.707 5.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z"/></svg>
                </Link>
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}

export default Home;
