import { Compass, ListChecks } from "lucide-react";

export function NavigationGlyph({ name }: { name: "virds" | "favorites" | "discover" }) {
  if (name === "favorites") return <span className="navigation-heart" aria-hidden="true">🫀</span>;
  const Glyph = name === "virds" ? ListChecks : Compass;
  return <Glyph className={`navigation-glyph is-${name}`} aria-hidden="true" strokeWidth={1.8} />;
}
