export function EdgeMenuLauncher({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="edge-menu-launcher" type="button" aria-label={label} onClick={onClick}>
      <span />
      <span />
      <span />
    </button>
  );
}
