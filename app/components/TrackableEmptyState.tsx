export function TrackableEmptyState({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-light" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{body}</p>
      {actionLabel && actionHref ? <Link className="primary-button" href={actionHref}>{actionLabel}</Link> : null}
    </div>
  );
}
import Link from "next/link";
