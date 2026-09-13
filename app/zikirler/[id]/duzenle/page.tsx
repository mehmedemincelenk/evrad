import { DhikrApp } from "../../../features/dhikr/DhikrApp";

export default async function EditDhikrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DhikrApp editorMode={{ type: "edit", id }} />;
}
