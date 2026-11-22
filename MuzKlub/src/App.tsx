import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, ApiError } from './services/api';
import type { Choice, User } from './services/api';
import { DEFAULT_INSTRUMENTS } from './constants/instruments';
import { Brand } from './components/Brand';
import { Notice } from './components/Notice';
import { AuthForm } from './components/AuthForm';
import type { AuthMode } from './components/AuthForm';
import { ProfileCard } from './components/ProfileCard';
import { ProfileForm } from './components/ProfileForm';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AuthMode>('login');
  const [editing, setEditing] = useState(false);
  const [choices, setChoices] = useState<Choice[]>(DEFAULT_INSTRUMENTS);
  const [loading, setLoading] = useState('Загрузка...');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.specializations().then(setChoices).catch(() => {
      setMessage('Не удалось загрузить список инструментов. Обновите страницу.');
    });
    api.profile().then(setUser).catch((error: unknown) => {
      if (!(error instanceof ApiError) || ![401, 403].includes(error.status)) {
        setMessage('Не удалось загрузить профиль. Попробуйте ещё раз.');
      }
    }).finally(() => setLoading(''));
  }, []);

  function showError(error: unknown) {
    if (error instanceof ApiError && error.status === 401 && user) {
      setUser(null);
      setEditing(false);
      setMode('login');
      setMessage('Сессия закончилась. Войдите снова.');
      return;
    }
    setMessage(error instanceof Error ? error.message : 'Произошла ошибка.');
  }

  function changeMode(next: AuthMode) {
    setMode(next);
    setMessage('');
  }

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    const username = String(form.get('username')).trim();
    const password = String(form.get('password'));
    if (mode === 'register' && password !== form.get('password_confirmation')) {
      setMessage('Пароли не совпадают.');
      return;
    }
    setLoading('Загрузка...');
    setMessage('');
    try {
      if (mode === 'register') await api.register(username, password);
      else await api.login(username, password);
      setUser(await api.profile());
      setEditing(mode === 'register');
      setMessage(mode === 'register' ? 'Аккаунт создан.' : 'Вы вошли в аккаунт.');
    } catch (error) {
      showError(error);
    } finally {
      setLoading('');
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    setLoading('Сохранение...');
    setMessage('');
    try {
      await api.updateProfile({
        first_name: String(form.get('first_name')).trim(),
        specialization: String(form.get('specialization')),
        bio: String(form.get('bio')).trim(),
        fee: String(form.get('fee')),
      });
      setUser(await api.profile());
      setEditing(false);
      setMessage('Изменения сохранены.');
    } catch (error) {
      showError(error);
    } finally {
      setLoading('');
    }
  }

  async function logout() {
    if (loading) return;
    setLoading('Выход...');
    setMessage('');
    try {
      await api.logout();
      setUser(null);
      setEditing(false);
      setMode('login');
      setMessage('Вы вышли из аккаунта.');
    } catch (error) {
      showError(error);
    } finally {
      setLoading('');
    }
  }

  const busy = !!loading;

  return (
    <div className="layout">
      <Brand />
      <main className="panel">
        <Notice loading={loading} message={message} />
        {!user
          ? <AuthForm mode={mode} busy={busy} onModeChange={changeMode} onSubmit={authenticate} />
          : editing
            ? <ProfileForm user={user} choices={choices} busy={busy} onSubmit={saveProfile} onCancel={() => { setEditing(false); setMessage(''); }} />
            : <ProfileCard user={user} busy={busy} onEdit={() => { setEditing(true); setMessage(''); }} onLogout={logout} />}
      </main>
    </div>
  );
}
