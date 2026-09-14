import { DevotionalModuleApp } from "../../../features/devotional/DevotionalModuleApp";

export default async function EditMemorizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DevotionalModuleApp moduleId="memorization" editorMode={{ type: "edit", id }} />;
}
