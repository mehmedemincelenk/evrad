"use client";

import { useState, type ReactNode } from "react";
import { Accordion } from "./Accordion";
import { ChevronDown } from "lucide-react";
import { t } from "../core/i18n";

export function ModuleScreenHeader({
  eyebrow,
  title,
  tagline,
  filters,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  filters?: ReactNode;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <header className="screen-heading">
      <p className="eyebrow">{eyebrow}</p>
      <div className="screen-heading-main">
        <h1>{title}</h1>
        <p className="dayline">{tagline}</p>
      </div>
      {filters ? (
        <button
          className="filter-toggle"
          type="button"
          aria-label={t("filter.contexts")}
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <ChevronDown aria-hidden="true" />
        </button>
      ) : null}
      {filters ? (
        <Accordion open={filtersOpen} className="header-filters-accordion">{filters}</Accordion>
      ) : null}
    </header>
  );
}
