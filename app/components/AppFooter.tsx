import { SaveIcon } from "./SaveIcon";

export function AppFooter({ label, saving, onBackup }: {
  label: string;
  saving: boolean;
  onBackup: () => void;
}) {
  return (
    <footer className="app-footer">
      <button className="footer-backup-button" type="button" onClick={onBackup} aria-busy={saving} disabled={saving}>
        <SaveIcon />
        <span>{label}</span>
      </button>
    </footer>
  );
}
