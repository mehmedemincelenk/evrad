import { StorageLoading } from "./components/StorageLoading";

export default function Loading() {
  return (
    <main className="app-screen-loading">
      <StorageLoading label="Yükleniyor..." />
    </main>
  );
}
