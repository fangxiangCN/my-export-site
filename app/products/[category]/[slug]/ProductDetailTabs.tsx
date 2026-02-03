"use client";

import { useState } from "react";
import Image from "next/image";
import { PortableText, type PortableTextBlock } from "next-sanity";
import type { PortableTextReactComponents } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { urlFor } from "@/sanity/lib/image";

type ParameterGroup = {
  groupName: string;
  params: { label: string; values: string[] }[];
};

type Props = {
  parameterGroups?: ParameterGroup[];
  body?: PortableTextBlock[];
};

export default function ProductDetailTabs({ parameterGroups, body }: Props) {
  const [active, setActive] = useState<"params" | "desc">("params");
  const components: Partial<PortableTextReactComponents> = {
    types: {
      image: ({ value }: { value: SanityImageSource & { caption?: string } }) => (
        <figure className="my-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <Image
              src={urlFor(value).width(1200).height(900).url()}
              alt={value?.alt ?? "Product detail image"}
              fill
              className="object-cover"
            />
          </div>
          {value?.caption ? (
            <figcaption className="mt-2 text-xs text-gray-400">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      ),
    },
    marks: {
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noreferrer"
          className="text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div
        role="tablist"
        aria-label="Product details"
        className="flex flex-wrap gap-2 border-b border-gray-100 pb-4"
      >
        <button
          type="button"
          role="tab"
          aria-selected={active === "params"}
          onClick={() => setActive("params")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === "params"
              ? "bg-orange-600 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Technical Parameters
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === "desc"}
          onClick={() => setActive("desc")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === "desc"
              ? "bg-orange-600 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Product Description
        </button>
      </div>

      <div className="pt-6">
        {active === "params" ? (
          parameterGroups?.length ? (
            <div className="space-y-8">
              {parameterGroups.map((group, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 bg-gray-50 p-2 border-l-4 border-orange-500">
                    {group.groupName}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {group.params?.map((param, pIdx) => (
                          <tr
                            key={pIdx}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-gray-500 w-1/3">
                              {param.label}
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-900">
                              {param.values?.join(", ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No technical parameters.</p>
          )
        ) : body?.length ? (
          <div className="prose prose-orange prose-sm max-w-none text-gray-600">
            <PortableText value={body} components={components} />
          </div>
        ) : (
          <p className="text-gray-400 italic">No detailed description.</p>
        )}
      </div>
    </div>
  );
}
