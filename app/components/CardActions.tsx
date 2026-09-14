import { t } from "../core/i18n";

export function CardActions({ title, onEdit, onDelete }: { title: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <footer className="card-actions">
      <button type="button" className="edit-button" onClick={onEdit}>{t("action.edit")}</button>
      <button type="button" className="delete-button" onClick={onDelete} aria-label={`${title}: ${t("action.delete")}`}>×</button>
    </footer>
  );
}
