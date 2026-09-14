import { DevotionalModuleApp } from "../../../features/devotional/DevotionalModuleApp";

export default async function EditPrayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DevotionalModuleApp moduleId="prayers" editorMode={{ type: "edit", id }} />;
}
