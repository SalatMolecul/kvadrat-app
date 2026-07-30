import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './index.css';

// 👑 СПИСОК ДОСТУПОВ (Укажите Telegram ID)
const OWNER_IDS = [5317101537]; // Вы (Главный админ)
const MODERATOR_IDS = [];       // ID модераторов/админов: [5317101537, 789012]

// Подключение к Supabase
const SUPABASE_URL = 'https://rxvmeivqdunhpsqsfcvk.supabase.co';
const SUPABASE_ANON_KEY = 'ВАШ_PUBLISHABLE_KEY'; 
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
  const [activeTab, setActiveTab] = useState('events');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); // owner | moderator | venue_owner | user

  // Модалка создания/редактирования
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Концерты',
    location: '',
    price: '',
    age: '18+',
    image: '',
    is_featured: false,
    owner_telegram_id: ''
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
          
          if (OWNER_IDS.includes(tgUser.id)) {
            setUserRole('owner');
          } else if (MODERATOR_IDS.includes(tgUser.id)) {
            setUserRole('moderator');
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

  // Проверка прав на редактирование конкретной карточки
  const canEditEvent = (item) => {
    if (userRole === 'owner' || userRole === 'moderator') return true;
    if (user && item.owner_telegram_id && String(item.owner_telegram_id) === String(user.id)) return true;
    return false;
  };

  const canCreateNew = userRole === 'owner' || userRole === 'moderator';

  // Открытие модалки для создания
  const handleOpenCreateModal = () => {
    setEditingEventId(null);
    setFormData({
      title: '',
      category: 'Концерты',
      location: '',
      price: '',
      age: '18+',
      image: '',
      is_featured: false,
      owner_telegram_id: ''
    });
    setIsModalOpen(true);
  };

  // Открытие модалки для редактирования
  const handleOpenEditModal = (item) => {
    setEditingEventId(item.id);
    setFormData({
      title: item.title || '',
      category: item.category || 'Концерты',
      location: item.location || '',
      price: item.price || '',
      age: item.age || '18+',
      image: item.image || '',
      is_featured: item.is_featured || false,
      owner_telegram_id: item.owner_telegram_id || ''
    });
    setIsModalOpen(true);
  };

  // Сохранение (Создание или Обновление)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location) return;

    const payload = {
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      owner_telegram_id: formData.owner_telegram_id ? Number(formData.owner_telegram_id) : null
    };

    if (editingEventId) {
      // Обновление
      const { error } = await supabase.from('events').update(payload).eq('id', editingEventId);
      if (!error) {
        setEvents(events.map(item => item.id === editingEventId ? { ...item, ...payload } : item));
        setIsModalOpen(false);
      }
    } else {
      // Создание нового
      const { data, error } = await supabase.from('events').insert([payload]).select();
      if (!error && data) {
        setEvents([data[0], ...events]);
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Удалить эту карточку?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      setEvents(events.filter((item) => item.id !== id));
    }
  };

  const featuredEvents = events.filter(item => item.is_featured);
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
        {userRole !== 'user' && (
          <span style={{ background: '#000', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
            {userRole === 'owner' ? 'Владелец' : 'Модератор'}
          </span>
        )}
      </header>

      {/* Вкладка: АФИША */}
      {activeTab === 'events' && (
        <div>
          {/* Фильтры */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
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
                  border: selectedCategory === cat ? 'none' : '1px solid #e2e8f0'
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Кнопка добавления для админов/модераторов */}
          {canCreateNew && (
            <button 
              onClick={handleOpenCreateModal}
              style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '700', marginBottom: '20px', cursor: 'pointer' }}>
              + Добавить событие / заведение
            </button>
          )}

          {/* БЛОК: События недели (Показывается только во вкладке "Все") */}
          {selectedCategory === 'Все' && featuredEvents.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔥 События & Анонсы недели
              </h2>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {featuredEvents.map((item) => (
                  <div key={`feat-${item.id}`} style={{ minWidth: '240px', width: '240px', background: '#000', color: '#fff', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '120px', objectFit: 'cover', opacity: 0.85 }} />
                    <div style={{ padding: '12px' }}>
                      <span style={{ fontSize: '10px', background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', textTransform: 'uppercase' }}>Анонс</span>
                      <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '6px 0 2px 0', color: '#fff' }}>{item.title}</h4>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>📍 {item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ОСНОВНОЙ СПИСОК */}
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>
            {selectedCategory === 'Все' ? 'Все заведения и мероприятия' : selectedCategory}
          </h2>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>Загрузка...</p>
          ) : filteredEvents.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '30px' }}>В этой категории пока ничего нет</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredEvents.map((item) => {
                const isEditable = canEditEvent(item);
                return (
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
                        
                        {/* Кнопки управления для Админа/Владельца карточки */}
                        {isEditable && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={() => handleOpenEditModal(item)}
                              style={{ background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                              ✏️ Ред.
                            </button>
                            {(userRole === 'owner' || userRole === 'moderator') && (
                              <button 
                                onClick={() => handleDeleteEvent(item.id)}
                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                Удалить
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                {user?.id ? `ID: ${user.id}` : 'Telegram WebApp'}
              </p>
            </div>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', fontSize: '13px' }}>
            <p style={{ margin: 0 }}><strong>Роль:</strong> {userRole === 'owner' ? '👑 Владелец платформы' : userRole === 'moderator' ? '🛡️ Модератор' : '👤 Посетитель'}</p>
          </div>
        </div>
      )}

      {/* Нижнее меню */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        <button onClick={() => setActiveTab('events')} style={{ background: 'none', border: 'none', color: activeTab === 'events' ? '#000' : '#94a3b8', fontWeight: activeTab === 'events' ? '800' : '600', fontSize: '13px', cursor: 'pointer' }}>
          🔥 Главная / Афиша
        </button>
        <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#000' : '#94a3b8', fontWeight: activeTab === 'profile' ? '800' : '600', fontSize: '13px', cursor: 'pointer' }}>
          👤 Профиль
        </button>
      </nav>

      {/* Модалка СОЗДАНИЯ / РЕДАКТИРОВАНИЯ */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              {editingEventId ? 'Редактировать карточку' : 'Новое мероприятие'}
            </h2>
            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Название" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Локация (адрес)" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  {CATEGORIES.filter(c => c !== 'Все').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="0+">0+</option>
                  <option value="12+">12+</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                </select>
              </div>

              <input type="text" placeholder="Цена (напр. 1 500 ₽)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="url" placeholder="Ссылка на картинку" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />

              {/* Опции только для Главного админа/Модератора */}
              {(userRole === 'owner' || userRole === 'moderator') && (
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.is_featured} 
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} 
                    />
                    🔥 Добавить в «Анонсы недели»
                  </label>

                  <input 
                    type="number" 
                    placeholder="Telegram ID владельца заведения" 
                    value={formData.owner_telegram_id} 
                    onChange={(e) => setFormData({...formData, owner_telegram_id: e.target.value})} 
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} 
                  />
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Если указать ID владельца, он сможет сам редактировать эту карточку.</span>
                </div>
              )}

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