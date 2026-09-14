import { t } from "../core/i18n";

export function AppNotifications({
  message,
  updateReady,
  onActivateUpdate,
}: {
  message: string | null;
  updateReady: boolean;
  onActivateUpdate: () => void;
}) {
  if (!message && !updateReady) return null;

  return (
    <div className="notification-rail" role="region" aria-label={t("notification.label")}>
      {message ? <div className="toast" role="status">{message}</div> : null}
      {updateReady ? (
        <div className="update-banner" role="status">
          <span>{t("toast.updateReady")}</span>
          <button type="button" onClick={onActivateUpdate}>{t("toast.reload")}</button>
        </div>
      ) : null}
    </div>
  );
}
