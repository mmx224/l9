import type { User } from '../services/api';

interface Props {
  user: User;
  busy: boolean;
  onEdit: () => void;
  onLogout: () => void;
}

export function ProfileCard({ user, busy, onEdit, onLogout }: Props) {
  const { profile } = user;
  const name = profile.first_name || user.username;
  return (
    <section className="card">
      <header className="person">
        <div className="avatar" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h2 className="card__title">{name}</h2>
          <p className="muted">@{user.username}</p>
        </div>
      </header>
      <dl className="facts">
        <div><dt>Инструмент</dt><dd><span className="chip">{profile.specialization_display || 'Не указан'}</span></dd></div>
        <div><dt>Гонорар</dt><dd>{profile.fee}</dd></div>
        <div className="facts__wide"><dt>О себе</dt><dd>{profile.bio || 'Пока пусто. Расскажите о своём опыте.'}</dd></div>
      </dl>
      <div className="actions">
        <button type="button" className="btn btn--primary" disabled={busy} onClick={onEdit}>Редактировать</button>
        <button type="button" className="btn" disabled={busy} onClick={onLogout}>Выйти</button>
      </div>
    </section>
  );
}
