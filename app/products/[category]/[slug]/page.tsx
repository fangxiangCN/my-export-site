import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ImageGallery from "./Gallery";
import ProductSidebar from "./ProductSidebar";
import ProductDetailTabs from "./ProductDetailTabs";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
// 👇 1. 引入 PortableText 组件和类型
import type { PortableTextBlock } from "next-sanity";

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
  body?: PortableTextBlock[]; // 👈 富文本类型
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
        <ProductSidebar
          categoryTitle={product.categories?.[0]?.title}
          productTitle={product.title}
          specs={product.keySpecs}
        />
      </div>

      {/* --- 👇 下方区域：详细参数表 + 图文详情 --- */}
      <ProductDetailTabs
        parameterGroups={product.parameterGroups}
        body={product.body}
      />
    </div>
  );
}
