import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: SanityImageSource;
  categorySlug: string; // 修正类型
}

async function getProducts() {
  // 获取最新产品，包含分类 slug
  const query = `*[_type == "product"] | order(_createdAt desc) [0...8] {
    _id,
    title,
    slug,
    mainImage,
    "categorySlug": categories[0]->slug.current
  }`;
  return client.fetch<Product[]>(query, {}, { next: { revalidate: 60 } });
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      {/* Banner */}
      <section className="bg-slate-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Advanced Rice Milling Solutions
        </h1>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
          Complete commercial plants & compact combined mills for modern
          agriculture.
        </p>
        <Link
          href="/products/commercial-rice-mill" // 引导去其中一个分类
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition"
        >
          View All Products
        </Link>
      </section>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Machinery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              href={`/products/${product.categorySlug}/${product.slug.current}`}
              key={product._id}
              className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition overflow-hidden border border-gray-100"
            >
              <div className="relative h-56 w-full bg-gray-50">
                {product.mainImage && (
                  <Image
                    src={urlFor(product.mainImage).width(400).height(400).url()}
                    alt={product.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition duration-500"
                  />
                )}
              </div>
              <div className="p-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 truncate">
                  {product.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
