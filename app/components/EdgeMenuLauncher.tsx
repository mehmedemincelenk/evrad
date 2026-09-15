export function EdgeMenuLauncher({
  edge,
  label,
  onClick,
}: {
  edge: "top" | "bottom";
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={`edge-menu-launcher is-${edge}`} type="button" aria-label={label} onClick={onClick}>
      <span />
      <span />
      <span />
    </button>
  );
}
