import { t } from "../core/i18n";
import { bagCategories, type BagCategory } from "../core/record-categories";

export function RecordCategoryChips({ selected, onToggle }: { selected: readonly BagCategory[]; onToggle: (category: BagCategory) => void }) {
  return (
    <div className="context-chips bag-category-chips" role="group" aria-label={t("bag.categories")}>
      {bagCategories.map((category) => (
        <button key={category} type="button" className={`context-chip is-bag-${category}${selected.includes(category) ? " is-selected" : ""}`} aria-pressed={selected.includes(category)} onClick={() => onToggle(category)}>
          {t(`bag.${category}`)}
        </button>
      ))}
    </div>
  );
}
