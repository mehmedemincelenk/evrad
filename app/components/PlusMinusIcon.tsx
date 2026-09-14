export function PlusMinusIcon({ minus = false }: { minus?: boolean }) {
  return <span className={`plus-minus-icon${minus ? " is-minus" : ""}`} aria-hidden="true" />;
}
