import type { ReactNode } from "react";

interface TrackableModuleLayoutProps {
  header: ReactNode;
  loading: boolean;
  hasItems: boolean;
  loadingState: ReactNode;
  emptyState: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  status?: ReactNode;
}

export function TrackableModuleLayout({
  header,
  loading,
  hasItems,
  loadingState,
  emptyState,
  children,
  footer,
  status,
}: TrackableModuleLayoutProps) {
  return (
    <>
      <section className="module-screen" aria-labelledby="page-title">
        {header}
        {loading ? loadingState : hasItems ? <div className="trackable-list">{children}</div> : emptyState}
        {footer}
      </section>
      {status}
    </>
  );
}
