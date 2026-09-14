import { t } from "../core/i18n";

export function StorageLoading({ label }: { label?: string }) {
  return (
    <div className="storage-loading" role="status">
      <span className="loading-orb" aria-hidden="true" />
      <span className="sr-only">{label ?? t("loading.storage")}</span>
    </div>
  );
}
