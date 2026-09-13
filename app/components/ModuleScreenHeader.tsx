import { formatLongDate } from "../core/date";

export function ModuleScreenHeader({
  eyebrow,
  title,
  tagline,
  today,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  today: Date | null;
}) {
  return (
    <header className="screen-heading">
      <p className="eyebrow">{eyebrow}</p>
      <div>
        <h1 id="page-title">{title}</h1>
        <p className="date-line">{today ? formatLongDate(today) : "\u00a0"}</p>
        <p className="dayline">{tagline}</p>
      </div>
    </header>
  );
}
