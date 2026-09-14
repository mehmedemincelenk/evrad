export function StorageLoading({ label }: { label: string }) {
  return (
    <div className="storage-loading" role="status">
      <span className="loading-orb" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
