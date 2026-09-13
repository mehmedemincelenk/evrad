import { t } from "../core/i18n";

export function StorageLoading() {
  return (
    <div className="storage-loading" role="status">
      <span className="loading-orb" aria-hidden="true" />
      <span className="sr-only">{t("loading.storage")}</span>
    </div>
  );
}
