export function Brand() {
  return (
    <aside className="brand">
      <div className="brand__eq" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => <span key={i} style={{ '--i': i } as React.CSSProperties} />)}
      </div>
      <div>
        <h1 className="brand__name">MuzKlub</h1>
        <p className="brand__text">Площадка для музыкантов группы. Создайте профиль, укажите инструмент и гонорар.</p>
      </div>
    </aside>
  );
}
