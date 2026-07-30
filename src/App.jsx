import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './index.css';

// Ваш Telegram ID для прав администратора
const ADMIN_TELEGRAM_IDS = [5317101537];

// Подключение к Supabase (ВСТАВЬТЕ СВОИ КЛЮЧИ ИЗ SUPABASE)
const SUPABASE_URL = 'https://rxvmeivqdunhpsqsfcvk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pEi3BhUAmLqphqSo_d4zBg_d7UQBXIj';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = [
  'Все',
  'Концерты',
  'Выставки',
  'Lounge & Кальяны',
  'Бары & Рестораны',
  'Крыши & Террасы'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('events'); // events | profile
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');

  // Модалка добавления
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Концерты',
    location: '',
    price: '',
    age: '18+',
    image: ''
  });

  useEffect(() => {
    fetchEvents();

    try {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser) {
          setUser(tgUser);
          if (ADMIN_TELEGRAM_IDS.includes(tgUser.id)) {
            setRole('owner');
          }
        }
      }
    } catch (e) {
      console.log('TG SDK error:', e);
    }
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.location) return;

    const eventToInsert = {
      ...newEvent,
      image: newEvent.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
    };

    const { data, error } = await supabase.from('events').insert([eventToInsert]).select();

    if (!error && data) {
      setEvents([data[0], ...events]);
      setNewEvent({ title: '', category: 'Концерты', location: '', price: '', age: '18+', image: '' });
      setIsModalOpen(false);
    } else {
      alert('Ошибка при сохранении в базу данных');
    }
  };

  const handleDeleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      setEvents(events.filter((item) => item.id !== id));
    }
  };

  const isAdminOrOwner = role === 'admin' || role === 'owner';

  // Фильтрация списка по выбранной категории
  const filteredEvents = selectedCategory === 'Все' 
    ? events 
    : events.filter(item => item.category === selectedCategory);

  return (
    <div style={{ padding: '16px', paddingBottom: '90px', maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Шапка */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', color: '#0f172a', margin: 0 }}>КВАДРАТ</h1>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Живая Москва</p>
        </div>
        {isAdminOrOwner && (
          <span style={{ background: '#000', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
            Администратор
          </span>
        )}
      </header>

      {/* Вкладка: АФИША */}
      {activeTab === 'events' && (
        <div>
          {/* Горизонтальные фильтры-чипсы */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedCategory === cat ? '#000' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#64748b',
                  fontWeight: '700',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: selectedCategory === cat ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  border: selectedCategory === cat ? 'none' : '1px solid #e2e8f0'
                }}>
                {cat}
              </button>
            ))}
          </div>

          {isAdminOrOwner && (
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '700', marginBottom: '16px', cursor: 'pointer' }}>
              + Добавить событие / место
            </button>
          )}

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>Загрузка...</p>
          ) : filteredEvents.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '30px', fontSize: '14px' }}>
              В категории «{selectedCategory}» пока ничего нет
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredEvents.map((item) => (
                <div key={item.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: '600', color: '#475569' }}>{item.category}</span>
                      <span style={{ fontSize: '11px', background: '#fef3c7', color: '#b45309', padding: '3px 6px', borderRadius: '6px', fontWeight: '700' }}>{item.age}</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '4px 0', color: '#0f172a' }}>{item.title}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>📍 {item.location}</p>
                    
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
          )}
        </div>
      )}

      {/* Вкладка: ПРОФИЛЬ */}
      {activeTab === 'profile' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
              {user?.first_name ? user.first_name[0] : 'U'}
            </div>
            <div>
              <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a', margin: 0 }}>
                {user ? `${user.first_name} ${user.last_name || ''}` : 'Гость Telegram'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                {user?.username ? `@${user.username}` : `ID: ${user?.id || 'не определен'}`}
              </p>
            </div>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', fontSize: '13px' }}>
            <p style={{ margin: 0 }}><strong>Статус доступа:</strong> {isAdminOrOwner ? '👑 Организатор / Админ' : '👤 Гость'}</p>
            <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0 0' }}>
              {isAdminOrOwner 
                ? 'Вам доступны функции создания и удаления локаций.' 
                : 'Для получения прав администратора обратитесь к владельцу.'}
            </p>
          </div>
        </div>
      )}

      {/* Нижнее меню (всего 2 понятные вкладки) */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        <button onClick={() => setActiveTab('events')} style={{ background: 'none', border: 'none', color: activeTab === 'events' ? '#000' : '#94a3b8', fontWeight: activeTab === 'events' ? '800' : '600', fontSize: '13px', cursor: 'pointer' }}>
          🔥 Главная / Афиша
        </button>
        <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#000' : '#94a3b8', fontWeight: activeTab === 'profile' ? '800' : '600', fontSize: '13px', cursor: 'pointer' }}>
          👤 Профиль
        </button>
      </nav>

      {/* Модалка добавления */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Новое мероприятие</h2>
            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Название" required value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Локация" required value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  {CATEGORIES.filter(c => c !== 'Все').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newEvent.age} onChange={(e) => setNewEvent({...newEvent, age: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="0+">0+</option>
                  <option value="12+">12+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                </select>
              </div>

              <input type="text" placeholder="Цена (напр. 1 500 ₽)" value={newEvent.price} onChange={(e) => setNewEvent({...newEvent, price: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
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