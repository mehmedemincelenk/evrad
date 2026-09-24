import { t } from "../core/i18n";
import { ActionDialog } from "./ActionDialog";

export type CollectionChoice = "bag" | "virds" | "both";

export function CollectionChoiceModal({ title, body, choices, onCancel, onChoose }: {
  title: string;
  body: string;
  choices: CollectionChoice[];
  onCancel: () => void;
  onChoose: (choice: CollectionChoice) => void | boolean | Promise<void | boolean>;
}) {
  return <ActionDialog title={title} body={<p>{body}</p>} cancelLabel={t("action.cancel")} onCancel={onCancel}
    actions={choices.map((choice) => ({ label: t(`collection.${choice}`), run: () => onChoose(choice) }))} />;
}
