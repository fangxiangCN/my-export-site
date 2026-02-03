"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SpecOptions from "./SpecOptions";

type KeySpec = {
  label: string;
  values: string[];
};

type Selection = Record<string, string | null>;

type Props = {
  categoryTitle?: string;
  productTitle: string;
  specs?: KeySpec[];
};

function buildSelection(specs: KeySpec[]) {
  return Object.fromEntries(specs.map((spec) => [spec.label, null]));
}

export default function ProductSidebar({
  categoryTitle,
  productTitle,
  specs = [],
}: Props) {
  const router = useRouter();
  const initialSelection = useMemo(() => buildSelection(specs), [specs]);
  const [selected, setSelected] = useState<Selection>(initialSelection);

  const selectedPairs = useMemo(
    () =>
      Object.entries(selected)
        .filter(([, value]) => value)
        .map(([label, value]) => `${label}: ${value}`),
    [selected],
  );

  const inquiryHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("product", productTitle);
    if (categoryTitle) params.set("category", categoryTitle);
    if (selectedPairs.length) params.set("specs", selectedPairs.join("; "));

    const query = params.toString();
    return query ? `/inquiry?${query}` : "/inquiry";
  }, [categoryTitle, productTitle, selectedPairs]);

  const handleSelect = (label: string, value: string | null) => {
    setSelected((prev) => ({ ...prev, [label]: value }));
  };

  const handleInquiryClick = () => {
    router.push(inquiryHref);
  };

  return (
    <div className="space-y-6">
      <div>
        {categoryTitle ? (
          <span className="text-orange-600 font-bold tracking-wide text-sm uppercase">
            {categoryTitle}
          </span>
        ) : null}
        <h1 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">
          {productTitle}
        </h1>
      </div>

      {specs.length ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <h3 className="font-semibold text-gray-900">
              Optional Specifications
            </h3>
            <span className="text-xs font-medium text-gray-400">
              Select if needed
            </span>
          </div>
          <SpecOptions
            specs={specs}
            selected={selected}
            onSelect={handleSelect}
          />
          <div className="mt-4 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700">
            {selectedPairs.length
              ? `Selected: ${selectedPairs.join("; ")}`
              : "Selected: (none)"}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleInquiryClick}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold py-4 rounded-lg transition shadow-lg shadow-orange-200"
        data-inquiry={inquiryHref}
      >
        Send Inquiry / Get Quote
      </button>
      <p className="text-xs text-gray-400">
        Selections are optional and will be included in the inquiry.
      </p>
    </div>
  );
}
