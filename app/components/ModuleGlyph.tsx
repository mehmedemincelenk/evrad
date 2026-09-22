import type { IconName } from "../core/types";

const glyphs: Record<IconName, string> = {
  dhikr: "📿",
  prayer: "🤲",
  memory: "🧠",
  surah: "۞",
  book: "📖",
  poetry: "❦",
  bag: "◒",
  game: "✦",
};

export function ModuleGlyph({ icon }: { icon: IconName }) {
  return <span className={`module-glyph is-${icon}`} aria-hidden="true">{glyphs[icon]}</span>;
}
