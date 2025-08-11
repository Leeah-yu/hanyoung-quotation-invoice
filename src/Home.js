import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  // Pretendard 웹폰트 로드
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const styles = {
    container: {
      maxWidth: '960px',
      margin: '80px auto',
      padding: '40px',
      textAlign: 'center',
      fontFamily: '"Pretendard Variable", sans-serif',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '60px',
      color: '#333',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      padding: '0 20px',
    },
    card: {
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '40px 20px',
      textDecoration: 'none',
      color: '#111',
      fontSize: '18px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: '1 / 1',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    },
  };

  // 마우스 호버 스타일 적용을 위한 inline 방식 (간단한 방식 사용)
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#f0f0f0';
    e.currentTarget.style.borderColor = '#aaa';
    e.currentTarget.style.color = '#000';
    e.currentTarget.style.transform = 'translateY(-4px)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = '#fff';
    e.currentTarget.style.borderColor = '#ddd';
    e.currentTarget.style.color = '#111';
    e.currentTarget.style.transform = 'none';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>견적서 생성기</h1>
      <div style={styles.grid}>
        <Link to="/customs" style={styles.card} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          1. 통관
        </Link>
        <Link to="/consulting" style={styles.card} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          2. 컨설팅
        </Link>
        <Link to="/fta" style={styles.card} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          3. FTA
        </Link>
        <Link to="/form" style={styles.card} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          4. 과세자료 제출
        </Link>
      </div>
    </div>
  );
}

export default Home;
