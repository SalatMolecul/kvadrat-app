import React, { useState, useEffect } from 'react';
import './index.css';

// 🛑 Укажите здесь ваш Telegram ID (число без кавычек или в кавычках)
// Узнать свой ID можно в Telegram у бота @userinfobot
const ADMIN_TELEGRAM_IDS = [Salat_Molecul]; 

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Закрытый джазовый вечер",
    category: "Концерты",
    location: "Lounge Bar №4",
    price: "3 500 ₽",
    age: "18+",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Подземная выставка иммерсивного искусства",
    category: "Выставки",
    location: "Галерея КВАДРАТ",
    price: "1 200 ₽",
    age: "16+",
    image: "https://images.unsplash.com/photo-1508997449629-303059a039c0?auto=format&fit=crop&w=800&q=80"
  }
];

const CATEGORIES = [
  { id: 'all', title: 'Все места' },
  { id: 'lounge', title: 'Lounge & Кальяны' },
  { id: 'events', title: 'Мероприятия' },
  { id: 'bars', title: 'Бары & Рестораны' },
  { id: 'roofs', title: 'Крыши & Террасы' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('events'); // events | categories | profile
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user'); // По умолчанию простой пользователь

  // Модальное окно создания
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Концерты',
    location: '',
    price: '',
    age: '18+',
    image: ''
  });

  // Определение пользователя из Telegram WebApp SDK
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        setUser(tgUser);
        // Если ID пользователя есть в списке админов — выдаем роль owner/admin
        if (ADMIN_TELEGRAM_IDS.includes(tgUser.id)) {
          setRole('owner');
        }
      }
    }
  }, []);

  // Добавление карточки
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.location) return;

    const created = {
      ...newEvent,
      id: Date.now(),
      image: newEvent.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
    };

    setEvents([created, ...events]);
    setNewEvent({ title: '', category: 'Концерты', location: '', price: '', age: '18+', image: '' });
    setIsModalOpen(false);
  };

  // Удаление карточки
  const handleDeleteEvent = (id) => {
    setEvents(events.filter(item => item.id !== id));
  };

  const isAdminOrOwner = role === 'admin' || role === 'owner';

  return (
    <div style={{ padding: '16px', paddingBottom: '90px', maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Шапка */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', color: '#0f172a' }}>КВАДРАТ</h1>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Живая Москва</p>
        </div>
        {isAdminOrOwner && (
          <span style={{ 
            background: '#000', 
            color: '#fff', 
            padding: '4px 10px', 
            borderRadius: '12px', 
            fontSize: '11px', 
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            Администратор
          </span>
        )}
      </header>

      {/* Вкладка: АФИША */}
      {activeTab === 'events' && (
        <div>
          {isAdminOrOwner && (
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '700',
                marginBottom: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
              + Добавить событие / место
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map((item) => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: '600', color: '#475569' }}>{item.category}</span>
                    <span style={{ fontSize: '11px', background: '#fef3c7', color: '#b45309', padding: '3px 6px', borderRadius: '6px', fontWeight: '700' }}>{item.age}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>📍 {item.location}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a' }}>{item.price}</span>
                    {isAdminOrOwner && (
                      <button 
                        onClick={() => handleDeleteEvent(item.id)}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Вкладка: КАТЕГОРИИ */}
      {activeTab === 'categories' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>Категории заведений</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                style={{ 
                  background: selectedCategory === cat.id ? '#000' : '#fff', 
                  color: selectedCategory === cat.id ? '#fff' : '#0f172a',
                  padding: '16px', 
                  borderRadius: '14px', 
                  fontWeight: '700',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}>
                <span>{cat.title}</span>
                <span>→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Вкладка: ПРОФИЛЬ */}
      {activeTab === 'profile' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
              {user ? user.first_name[0] : 'U'}
            </div>
            <div>
              <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a' }}>
                {user ? `${user.first_name} ${user.last_name || ''}` : 'Гость Telegram'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                {user?.username ? `@${user.username}` : 'ID не определен'}
              </p>
            </div>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', fontSize: '13px' }}>
            <p style={{ marginBottom: '4px' }}><strong>Статус доступа:</strong> {isAdminOrOwner ? '👑 Организатор / Админ' : '👤 Гость'}</p>
            <p style={{ color: '#64748b', fontSize: '11px' }}>
              {isAdminOrOwner 
                ? 'Вам доступны функции создания и удаления локаций.' 
                : 'Для получения прав администратора обратитесь к владельцу.'}
            </p>
          </div>
        </div>
      )}

      {/* Нижнее меню навигации */}
      <nav style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: '#fff',
        borderTop: '1px solid #e2e8f0',
        padding: '8px 16px',
        display: 'flex',
        justify: 'space-around',
        zIndex: 100
      }}>
        <button 
          onClick={() => setActiveTab('events')}
          style={{ background: 'none', border: 'none', color: activeTab === 'events' ? '#000' : '#94a3b8', fontWeight: activeTab === 'events' ? '800' : '600', fontSize: '12px', cursor: 'pointer' }}>
          Афиша
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{ background: 'none', border: 'none', color: activeTab === 'categories' ? '#000' : '#94a3b8', fontWeight: activeTab === 'categories' ? '800' : '600', fontSize: '12px', cursor: 'pointer' }}>
          Категории
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#000' : '#94a3b8', fontWeight: activeTab === 'profile' ? '800' : '600', fontSize: '12px', cursor: 'pointer' }}>
          Профиль
        </button>
      </nav>

      {/* Модальное окно создания */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
        }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Новое мероприятие</h2>
            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Название" required value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Локация" required value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Цена" value={newEvent.price} onChange={(e) => setNewEvent({...newEvent, price: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <select value={newEvent.age} onChange={(e) => setNewEvent({...newEvent, age: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="0+">0+</option>
                  <option value="12+">12+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                </select>
              </div>
              <input type="url" placeholder="Ссылка на картинку" value={newEvent.image} onChange={(e) => setNewEvent({...newEvent, image: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '10px', border: 'none', background: '#f1f5f9', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Отмена</button>
                <button type="submit" style={{ flex: 1, padding: '10px', border: 'none', background: '#000', color: '#fff', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}