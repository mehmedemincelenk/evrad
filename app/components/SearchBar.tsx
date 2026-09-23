"use client";

import { Search, X } from "lucide-react";
import { t } from "../core/i18n";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: SearchBarProps) {
  const hasValue = value.length > 0;

  return (
    <div className="search-bar-wrap">
      <Search className="search-bar-icon" aria-hidden="true" />
      <input
        type="search"
        className="search-bar-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("discover.searchPlaceholder")}
        aria-label={ariaLabel ?? placeholder ?? t("discover.searchPlaceholder")}
        autoComplete="off"
        spellCheck="false"
      />
      {hasValue ? (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => onChange("")}
          aria-label={t("discover.searchClear")}
        >
          <X aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

