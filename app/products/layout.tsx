import { client } from "@/sanity/lib/client";
import Link from "next/link";

// 获取所有分类
async function getCategories() {
  return client.fetch<{ title: string; slug: { current: string } }[]>(
    `*[_type == "category"] | order(title asc) { title, slug }`,
  );
}

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* --- 左侧：侧边栏分类 (Sidebar) --- */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-4">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug.current}>
                  <Link
                    href={`/products/${cat.slug.current}`}
                    className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-orange-600 transition"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* --- 右侧：主要内容区域 (列表或详情) --- */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
