interface Props {
  loading: string;
  message: string;
}

export function Notice({ loading, message }: Props) {
  if (!loading && !message) return null;
  return (
    <div className="notices" role="status" aria-live="polite">
      {loading && <p className="notice notice--loading"><span className="spinner" aria-hidden="true" />{loading}</p>}
      {message && <p className="notice">{message}</p>}
    </div>
  );
}
