import { t } from "../../core/i18n";
import { bagCategories, type BagCategory } from "./bag-categories";

export function BagCategoryChips({ active, onChange }: { active: BagCategory; onChange: (category: BagCategory) => void }) {
  return (
    <div className="context-chips bag-category-chips" role="tablist" aria-label={t("bag.categories")}>
      {bagCategories.map((category) => (
        <button key={category} type="button" role="tab" className={`context-chip is-bag-${category}${active === category ? " is-selected" : ""}`} aria-selected={active === category} onClick={() => onChange(category)}>
          {t(`bag.${category}`)}
        </button>
      ))}
    </div>
  );
}
