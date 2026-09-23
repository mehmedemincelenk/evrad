import Link from "next/link";
import { Settings } from "lucide-react";
import { SaveIcon } from "./SaveIcon";
import { t } from "../core/i18n";

export function AppFooter({ label, saving, onBackup, onSelectSettings }: {
  label: string;
  saving: boolean;
  onBackup: () => void;
  onSelectSettings?: () => void;
}) {
  return (
    <footer className="app-footer">
      <div className="footer-nav-row">
        <button className="footer-backup-button" type="button" onClick={onBackup} aria-busy={saving} disabled={saving}>
          <SaveIcon />
          <span>{label}</span>
        </button>
        <Link
          href="/ayarlar"
          className="footer-settings-button"
          aria-label={t("menu.settings")}
          title={t("menu.settings")}
          onClick={
            onSelectSettings
              ? (e) => {
                  e.preventDefault();
                  onSelectSettings();
                }
              : undefined
          }
        >
          <Settings size={14} aria-hidden="true" />
          <span>{t("menu.settings")}</span>
        </Link>
      </div>
      <p className="footer-kufi-praise" dir="rtl" lang="ar" aria-label="Elhamdülillah">
        الحمد لله
      </p>
      <p className="beta-note">{t("app.betaNote")}</p>
    </footer>
  );
}

