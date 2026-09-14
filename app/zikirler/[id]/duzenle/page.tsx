import { DevotionalModuleApp } from "../../../features/devotional/DevotionalModuleApp";

export default async function EditDhikrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DevotionalModuleApp moduleId="dhikr" editorMode={{ type: "edit", id }} />;
}
