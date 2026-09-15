export function ModuleScreenHeader({
  eyebrow,
  title,
  tagline,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
}) {
  return (
    <header className="screen-heading">
      <p className="eyebrow">{eyebrow}</p>
      <div>
        <h1 id="page-title">{title}</h1>
        <p className="dayline">{tagline}</p>
      </div>
    </header>
  );
}
