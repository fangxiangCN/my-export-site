import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ImageGallery from "./Gallery";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
// 👇 1. 引入 PortableText 组件和类型
import { PortableText, type PortableTextBlock } from "next-sanity";

// 定义数据接口
interface ProductDetail {
  title: string;
  categories: { title: string; slug: { current: string } }[];
  mainImage: SanityImageSource;
  sliderImages: SanityImageSource[];
  keySpecs: { label: string; values: string[] }[];
  parameterGroups: {
    groupName: string;
    params: { label: string; values: string[] }[];
  }[];
  body: PortableTextBlock[]; // 👈 富文本类型
}

// 生成静态参数
export async function generateStaticParams() {
  const query = `*[_type == "product"]{
    "slug": slug.current,
    "category": categories[0]->slug.current
  }`;
  const products =
    await client.fetch<{ slug: string; category: string }[]>(query);
  return products
    .filter((p) => p.slug && p.category)
    .map((p) => ({ category: p.category, slug: p.slug }));
}

async function getProduct(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    title,
    mainImage,
    sliderImages,
    "categories": categories[]->{ title, slug },
    keySpecs,
    parameterGroups,
    body
  }`;
  return client.fetch<ProductDetail>(query, { slug });
}

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) return notFound();

  return (
    <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-100">
      <div className="grid md:grid-cols-2 gap-12">
        {/* --- 左侧：图片画廊 --- */}
        <div>
          <ImageGallery
            images={
              product.sliderImages ||
              (product.mainImage ? [product.mainImage] : [])
            }
            title={product.title}
          />
        </div>

        {/* --- 右侧：信息与核心参数 --- */}
        <div>
          <span className="text-orange-600 font-bold tracking-wide text-sm uppercase">
            {product.categories?.[0]?.title}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-gray-900">
            {product.title}
          </h1>

          {/* Key Specs */}
          <div className="bg-gray-50 rounded-lg p-5 mb-8 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
              Key Specifications
            </h3>
            <div className="space-y-3">
              {product.keySpecs?.map((spec, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <span className="text-gray-500 text-sm">{spec.label}</span>
                  <div className="font-medium text-gray-900">
                    {spec.values?.join(" / ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold py-4 rounded-lg transition shadow-lg shadow-orange-200">
            Send Inquiry / Get Quote
          </button>
        </div>
      </div>

      {/* --- 👇 下方区域：详细参数表 + 图文详情 --- */}
      <div className="mt-16 grid lg:grid-cols-3 gap-12">
        {/* 1. 详细参数表 (占 2/3 宽度) */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
            Technical Parameters
          </h2>
          <div className="space-y-8">
            {product.parameterGroups?.map((group, idx) => (
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
        </div>

        {/* 2. 图文详情 Body (占 1/3 宽度，或者你可以把它放到最下面独占一行) */}
        {/* 这里我把它放在了侧边，模拟常见的外贸站布局。如果你想独占一行，就把 lg:col-span-1 改为 w-full */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
            Product Description
          </h2>

          {/* 👇 这里就是渲染 product.body 的地方 */}
          {/* prose 是 Tailwind Typography 插件提供的类，能自动美化 HTML 标签 */}
          <div className="prose prose-orange prose-sm max-w-none text-gray-600">
            {product.body ? (
              <PortableText value={product.body} />
            ) : (
              <p className="text-gray-400 italic">
                No detailed description available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
