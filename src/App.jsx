import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [role, setRole] = useState('admin');

  const events = [
    { id: 1, title: 'Выставка VR ART', price: 'Бесплатно', age: '0+', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600&auto=format&fit=crop' },
    { id: 2, title: 'Музыкальный мир фэнтези: Уэнсдей', price: '800 ₽', age: '18+', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop' },
    { id: 3, title: 'StandUp & Action (Стендап + Джаз)', price: '1200 ₽', age: '16+', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop' }
  ];

  const places = [
    { id: 1, title: 'Стрелка', rating: '4.5', age: '18+', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop' },
    { id: 2, title: 'Great smoke', rating: '4.2', age: '18+', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop' }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '420px', minHeight: '100vh', backgroundColor: '#ffffff', position: 'relative', paddingBottom: '90px', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', margin: '0 auto' }}>
      
      {/* Шапка */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>☰</button>
        <h1 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '3px', color: '#5B4DFB' }}>КВАДРАТ</h1>
        <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', position: 'relative' }}>
          🔔
          <span style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
        </button>
      </header>

      {/* Контент */}
      <main style={{ padding: '20px' }}>
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Топ мероприятий */}
            <section>
              <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#1e293b' }}>
                Топ 5 мероприятий недели 🔥
              </h2>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {events.map((e) => (
                  <div key={e.id} style={{ minWidth: '180px', height: '230px', borderRadius: '20px', position: 'relative', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                    <img src={e.image} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%)', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <span style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px' }}>{e.age}</span>
                      <div>
                        <h3 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', lineHeight: '1.2' }}>{e.title}</h3>
                        <p style={{ color: '#cbd5e1', fontSize: '11px', marginTop: '4px' }}>{e.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Карточка Билета (Подарок) */}
            <section style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '24px', padding: '20px', color: '#fff', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, fontWeight: 'bold' }}>Ваш подарок 🎁</p>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px', lineHeight: '1.3' }}>Билет на алко-тур 🍷<br />по Москве</h3>
                <p style={{ fontSize: '11px', marginTop: '12px', opacity: 0.7, fontFamily: 'monospace' }}>25.10.2026</p>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px', fontFamily: 'monospace' }}>
                  QR CODE
                </div>
              </div>
            </section>

            {/* Популярные места */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>Популярные места ✨</h2>
                <span style={{ fontSize: '12px', color: '#5B4DFB', fontWeight: 'bold', cursor: 'pointer' }}>Все &gt;</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {places.map((p) => (
                  <div key={p.id} style={{ height: '170px', borderRadius: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <h3 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{p.title}</h3>
                      <p style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 'bold', marginTop: '2px' }}>★ {p.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {activeTab === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Категории</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ height: '120px', borderRadius: '16px', backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop)', backgroundSize: 'cover', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '12px', color: '#fff', fontWeight: 'bold' }}>Lounge</div>
              <div style={{ height: '120px', borderRadius: '16px', backgroundImage: 'url(https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop)', backgroundSize: 'cover', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '12px', color: '#fff', fontWeight: 'bold' }}>Выставки</div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Найти место или событие..." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['Кальян-бар', 'Ночной', 'Настолки', 'Авторская кухня', 'Анти-кафе'].map((c) => (
                <span key={c} style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', whitespace: 'nowrap', fontWeight: '600' }}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', paddingTop: '10px' }}>
            <div>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', margin: '0 auto' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>Арина Соколова</h2>
              <span style={{ display: 'inline-block', fontSize: '10px', padding: '4px 12px', backgroundColor: '#e0e7ff', color: '#5B4DFB', fontWeight: 'bold', borderRadius: '12px', marginTop: '6px', textTransform: 'uppercase' }}>{role}</span>
            </div>

            <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', padding: '12px', borderRadius: '16px', fontSize: '12px', textAlign: 'left' }}>
              <p style={{ fontWeight: 'bold', color: '#92400e' }}>Переключение ролей (Тест):</p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                {['admin', 'moderator', 'owner', 'user'].map((r) => (
                  <button key={r} onClick={() => setRole(r)} style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: role === r ? '#d97706' : '#fff', color: role === r ? '#fff' : '#92400e' }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {role === 'owner' && (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '16px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>Панель Владельца</h3>
                <button style={{ width: '100%', padding: '10px', backgroundColor: '#5B4DFB', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', marginTop: '10px', cursor: 'pointer' }}>Редактировать меню и промокоды</button>
              </div>
            )}

            {role === 'admin' && (
              <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '16px', borderRadius: '16px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>Панель Администратора</h3>
                <button style={{ width: '100%', padding: '10px', backgroundColor: '#5B4DFB', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', marginTop: '10px', cursor: 'pointer' }}>+ Добавить в Афишу</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Навигация */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 50 }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: activeTab === 'home' ? '#5B4DFB' : '#94a3b8' }}>
          <span style={{ fontSize: '18px' }}>🏠</span>
          <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Главная</span>
        </button>
        <button onClick={() => setActiveTab('categories')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: activeTab === 'categories' ? '#5B4DFB' : '#94a3b8' }}>
          <span style={{ fontSize: '18px' }}>📅</span>
          <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Категории</span>
        </button>
        <button onClick={() => setActiveTab('search')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: activeTab === 'search' ? '#5B4DFB' : '#94a3b8' }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Поиск</span>
        </button>
        <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: activeTab === 'profile' ? '#5B4DFB' : '#94a3b8' }}>
          <span style={{ fontSize: '18px' }}>👤</span>
          <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Профиль</span>
        </button>
      </nav>

    </div>
  );
}
