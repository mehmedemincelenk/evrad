import type { DevotionalItem } from "../../core/types";

export function DailySelectionSection({ title, items, kind }: { title: string; items: DevotionalItem[]; kind: "dhikr" | "prayer" | "surah" | "poem" }) {
  if (!items.length) return null;
  return (
    <section className={`daily-selection-section is-${kind}`}>
      <h2>{title}</h2>
      <div className="daily-selection-items">
        {items.map((item) => <DailySelectionItem key={item.id} item={item} />)}
      </div>
    </section>
  );
}

function DailySelectionItem({ item }: { item: DevotionalItem }) {
  return (
    <article className="daily-selection-item">
      {item.name ? <h3>{item.name}</h3> : null}
      {item.arabic ? <p className="daily-original" dir="auto">{item.arabic}</p> : null}
      {item.translation ? <p className="daily-translation">{item.translation}</p> : null}
      {item.details ? <p className="daily-details">{item.details}</p> : null}
      {item.source ? <p className="daily-source">— {item.source}</p> : null}
    </article>
  );
}
