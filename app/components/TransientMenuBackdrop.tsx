export function TransientMenuBackdrop({ label, onClose }: { label: string; onClose: () => void }) {
  return <button className="menu-scrim" aria-label={label} type="button" onClick={onClose} />;
}
