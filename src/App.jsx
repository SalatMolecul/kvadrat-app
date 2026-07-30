import React, { useState } from 'react';
import './index.css';

// Начальные демо-данные (позже привяжем их к Supabase)
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

export default function App() {
  const [activeTab, setActiveTab] = useState('events'); // events | profile | admin
  const [role, setRole] = useState('admin'); // 'user' | 'moderator' | 'admin' | 'owner'
  const [events, setEvents] = useState(INITIAL_EVENTS);
  
  // Состояние модального окна добавления
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Концерты',
    location: '',
    price: '',
    age: '18+',
    image: ''
  });

  // Добавление нового мероприятия
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

  // Удаление
  const handleDeleteEvent = (id) => {
    setEvents(events.filter(item => item.id !== id));
  };

  const isAdminOrOwner = role === 'admin' || role === 'owner';

  return (
    <div style={{ padding: '16px', pb: '80px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
      
      {/* Шапка */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>КВАДРАТ</h1>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Живая Москва</p>
        </div>
        <span style={{ 
          background: '#e0e7ff', 
          color: '#4338ca', 
          padding: '4px 10px', 
          borderRadius: '12px', 
          fontSize: '11px', 
          fontWeight: '700',
          textTransform: 'uppercase'
        }}>
          {role}
        </span>
      </header>

      {/* Переключатель вкладок */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
        <button 
          onClick={() => setActiveTab('events')}
          style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: activeTab === 'events' ? '#fff' : 'transparent', fontWeight: '600', cursor: 'pointer' }}>
          Афиша
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: activeTab === 'profile' ? '#fff' : 'transparent', fontWeight: '600', cursor: 'pointer' }}>
          Профиль
        </button>
      </div>

      {/* Вкладка «Афиша» */}
      {activeTab === 'events' && (
        <div>
          {isAdminOrOwner && (
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                marginBottom: '16px',
                cursor: 'pointer'
              }}>
              + Добавить мероприятие
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map((item) => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: '600', color: '#475569' }}>{item.category}</span>
                    <span style={{ fontSize: '10px', background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '6px', fontWeight: '700' }}>{item.age}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>📍 {item.location}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '15px' }}>{item.price}</span>
                    {isAdminOrOwner && (
                      <button 
                        onClick={() => handleDeleteEvent(item.id)}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
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

      {/* Вкладка «Профиль» */}
      {activeTab === 'profile' && (
        <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Тестовая смена роли</h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Выберите роль, чтобы проверить видимость админ-кнопок:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {['user', 'moderator', 'admin', 'owner'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: role === r ? '2px solid #000' : '1px solid #cbd5e1',
                  background: role === r ? '#f8fafc' : '#fff',
                  fontWeight: '700',
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}>
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно создания карточки */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Новое мероприятие</h2>
            
            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Название" 
                required 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <input 
                type="text" 
                placeholder="Локация (напр. Бар Нюанс)" 
                required 
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Цена (напр. 1 500 ₽)" 
                  value={newEvent.price}
                  onChange={(e) => setNewEvent({...newEvent, price: e.target.value})}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <select 
                  value={newEvent.age}
                  onChange={(e) => setNewEvent({...newEvent, age: e.target.value})}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="0+">0+</option>
                  <option value="12+">12+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                </select>
              </div>
              <input 
                type="url" 
                placeholder="Ссылка на картинку (URL)" 
                value={newEvent.image}
                onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '10px', border: 'none', background: '#f1f5f9', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                  Отмена
                </button>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '10px', border: 'none', background: '#000', color: '#fff', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}