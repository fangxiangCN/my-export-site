"use client";

import { useMemo } from "react";

type KeySpec = {
  label: string;
  values: string[];
};

type Selection = Record<string, string | null>;

type Props = {
  specs: KeySpec[];
  selected: Selection;
  onSelect: (label: string, value: string | null) => void;
};

function normalizeValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export default function SpecOptions({ specs, selected, onSelect }: Props) {
  const normalizedSpecs = useMemo(
    () =>
      specs.map((spec) => ({
        ...spec,
        values: normalizeValues(spec.values ?? []),
      })),
    [specs],
  );

  if (!normalizedSpecs.length) return null;

  return (
    <div className="space-y-6">
      {normalizedSpecs.map((spec) => {
        const current = selected[spec.label] ?? null;
        const groupId = `spec-${spec.label.replace(/\s+/g, "-").toLowerCase()}`;

        if (!spec.values?.length) return null;

        return (
          <fieldset key={spec.label} className="space-y-3">
            <legend
              id={groupId}
              className="text-sm font-semibold text-gray-800"
            >
              {spec.label}
              <span className="ml-2 text-xs font-medium text-gray-400">
                Optional
              </span>
            </legend>
            <div
              role="radiogroup"
              aria-labelledby={groupId}
              className="grid grid-cols-2 gap-2 sm:grid-cols-3"
            >
              {spec.values.map((value) => {
                const isActive = current === value;

                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => onSelect(spec.label, isActive ? null : value)}
                    className={`rounded-md border px-3 py-2 text-center text-xs font-semibold transition ${
                      isActive
                        ? "border-orange-600 bg-orange-600 text-white shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
