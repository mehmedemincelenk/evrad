export function StorageLoading({ label }: { label: string }) {
  return (
    <div className="storage-loading" role="status" aria-live="polite">
      <div className="loading-basmala" dir="rtl" lang="ar" aria-label="Bismillahirrahmanirrahim">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
      <span className="loading-orb" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
