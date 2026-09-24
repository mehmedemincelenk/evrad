import { t } from "../core/i18n";

export function FormActions({ saving, error, onClose }: { saving: boolean; error: string | null; onClose: () => void }) {
  return <>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    <footer className="form-actions">
      <button className="secondary-button" type="button" onClick={onClose} disabled={saving}>{t("action.cancel")}</button>
      <button className="primary-button" type="submit" disabled={saving}>{t("action.save")}</button>
    </footer>
  </>;
}
