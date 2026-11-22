import type { FormEvent } from 'react';

export type AuthMode = 'login' | 'register';

interface Props {
  mode: AuthMode;
  busy: boolean;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AuthForm({ mode, busy, onModeChange, onSubmit }: Props) {
  const isLogin = mode === 'login';
  return (
    <section className="card">
      <div className="tabs" role="tablist" aria-label="Вход или регистрация">
        <button type="button" role="tab" aria-selected={isLogin} className="tab" disabled={busy} onClick={() => onModeChange('login')}>Вход</button>
        <button type="button" role="tab" aria-selected={!isLogin} className="tab" disabled={busy} onClick={() => onModeChange('register')}>Регистрация</button>
      </div>
      <h2 className="card__title">{isLogin ? 'С возвращением' : 'Создайте аккаунт'}</h2>
      <form key={mode} onSubmit={onSubmit}>
        <fieldset disabled={busy}>
          <label className="field">
            <span>Логин</span>
            <input id="username" name="username" required maxLength={150} autoComplete="username" />
          </label>
          <label className="field">
            <span>Пароль</span>
            <input id="password" name="password" type="password" required minLength={isLogin ? undefined : 6} autoComplete={isLogin ? 'current-password' : 'new-password'} />
          </label>
          {!isLogin && <label className="field">
            <span>Повторите пароль</span>
            <input id="password_confirmation" name="password_confirmation" type="password" required minLength={6} autoComplete="new-password" />
          </label>}
          <button type="submit" className="btn btn--primary btn--wide">{isLogin ? 'Войти' : 'Создать аккаунт'}</button>
        </fieldset>
      </form>
    </section>
  );
}
