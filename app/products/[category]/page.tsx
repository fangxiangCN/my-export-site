import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface ProductCard {
  _id: string;
  title: string;
  slug: { current: string };
  categorySlug: string;
  mainImage: SanityImageSource;
  keySpecs: { label: string; values: string[] }[];
}

// 获取分类下的产品
async function getProductsByCategory(slug: string) {
  const query = `*[_type == "product" && $slug in categories[]->slug.current] {
    _id,
    title,
    slug,
    mainImage,
    "categorySlug": categories[0]->slug.current,
    keySpecs
  }`;
  return client.fetch<ProductCard[]>(query, { slug });
}

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const products = await getProductsByCategory(params.category);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-400">
          No products found in this category.
        </h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {params.category.replace("-", " ")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${params.category}/${product.slug.current}`}
            className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {/* 缩略图 */}
            <div className="relative h-48 bg-gray-100">
              {product.mainImage && (
                <Image
                  src={urlFor(product.mainImage).width(400).height(400).url()}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              )}
            </div>

            {/* 简要信息 */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-orange-600">
                {product.title}
              </h3>
              {/* 显示前两个核心参数 */}
              <div className="text-sm text-gray-500 space-y-1">
                {product.keySpecs?.slice(0, 2).map((spec, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{spec.label}:</span>
                    <span className="font-medium text-gray-700">
                      {spec.values?.[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
