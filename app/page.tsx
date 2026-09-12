import { redirect } from "next/navigation";
import { shouldShowHome } from "./core/module-registry";
import { HomeScreen } from "./features/home/HomeScreen";

export default function Home() {
  if (!shouldShowHome) redirect("/zikirler");
  return <HomeScreen />;
}
