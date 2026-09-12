import { modules } from "../../core/module-registry";
import { t } from "../../core/i18n";

export function HomeScreen() {
  return (
    <section className="future-home" aria-labelledby="home-title">
      <h1 id="home-title">{t("home.title")}</h1>
      <div>
        {modules.map((module) => (
          <button type="button" key={module.id} disabled={!module.enabled}>{t(module.translationKey)}</button>
        ))}
      </div>
    </section>
  );
}
