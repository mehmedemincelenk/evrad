import { redirect } from "next/navigation";
import { defaultModule, shouldShowHome } from "./core/module-registry";
import { HomeScreen } from "./features/home/HomeScreen";

export default function Home() {
  if (!shouldShowHome) redirect(defaultModule.route);
  return <HomeScreen />;
}
