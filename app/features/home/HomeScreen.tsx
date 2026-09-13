import { modules } from "../../core/module-registry";
import { t } from "../../core/i18n";
import Link from "next/link";

export function HomeScreen() {
  return (
    <section className="future-home" aria-labelledby="home-title">
      <h1 id="home-title">{t("home.title")}</h1>
      <div>
        {modules.map((module) => module.enabled ? (
          <Link href={module.route} key={module.id}>{t(module.translationKey)}</Link>
        ) : (
          <button type="button" key={module.id} disabled>{t(module.translationKey)}</button>
        ))}
      </div>
    </section>
  );
}
