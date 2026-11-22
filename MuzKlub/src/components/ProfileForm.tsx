import type { FormEvent } from 'react';
import type { Choice, User } from '../services/api';

interface Props {
  user: User;
  choices: Choice[];
  busy: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function ProfileForm({ user, choices, busy, onSubmit, onCancel }: Props) {
  const { profile } = user;
  return (
    <section className="card">
      <h2 className="card__title">Редактирование профиля</h2>
      <form onSubmit={onSubmit}>
        <fieldset disabled={busy}>
          <label className="field">
            <span>Имя</span>
            <input id="first_name" name="first_name" defaultValue={profile.first_name} maxLength={100} />
          </label>
          <div className="row">
            <label className="field">
              <span>Инструмент</span>
              <select id="specialization" name="specialization" defaultValue={profile.specialization || 'other'}>
                {choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Гонорар</span>
              <input id="fee" name="fee" type="number" min="0" max="99999999.99" step="0.01" required defaultValue={profile.fee || '0.00'} />
            </label>
          </div>
          <label className="field">
            <span>О себе</span>
            <textarea id="bio" name="bio" rows={4} defaultValue={profile.bio} />
          </label>
          <div className="actions">
            <button type="submit" className="btn btn--primary">Сохранить</button>
            <button type="button" className="btn" onClick={onCancel}>Отмена</button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
