export function TrackableEmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-light" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{body}</p>
      {actionLabel && onAction ? <button className="primary-button" type="button" onClick={onAction}>{actionLabel}</button> : null}
    </div>
  );
}
