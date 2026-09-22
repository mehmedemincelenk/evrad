import { RecordEditApp } from "../../../features/collections/RecordEditApp";

export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RecordEditApp moduleId="memorization" itemId={id} />;
}
