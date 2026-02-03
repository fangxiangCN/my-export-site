import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";

// 1. 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("❌ 环境变量缺失");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// 图片上传辅助函数
async function uploadImage(imageUrl: string) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Download failed: ${imageUrl}`);
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buffer));
    return asset._id;
  } catch (err) {
    console.error(`图片上传失败: ${imageUrl}`, err);
    return null;
  }
}

async function main() {
  console.log("🗑️  正在清空旧数据 (Category & Product)...");
  // 删除旧数据，防止重复
  await client.delete({
    query: '*[_type == "product" || _type == "category"]',
  });
  console.log("✅ 旧数据已清空");

  console.log("🚀 开始导入新数据...");

  // --- 1. 创建分类 ---
  const catCommercial = {
    _id: "cat-commercial",
    _type: "category",
    title: "Commercial Rice Mill",
    slug: { _type: "slug", current: "commercial-rice-mill" },
  };
  const catCombined = {
    _id: "cat-combined",
    _type: "category",
    title: "Combined Rice Mill",
    slug: { _type: "slug", current: "combined-rice-mill" },
  };
  const catRiceMill = {
    _id: "cat-rice-mill",
    _type: "category",
    title: "Rice Mill",
    slug: { _type: "slug", current: "rice-mill" },
  };

  await client.create(catCommercial);
  await client.create(catCombined);
  await client.create(catRiceMill);
  console.log("✅ 分类创建完成");

  // --- 2. 准备图片素材 ---
  console.log("⬇️  正在下载并上传图片素材 (可能需要几秒)...");

  // 产品1的图片组
  const img1_thumb = await uploadImage(
    "https://placehold.co/600x600/22c55e/white?text=CTNM15B+Thumb",
  );
  const img1_slide1 = await uploadImage(
    "https://placehold.co/800x600/22c55e/white?text=CTNM15B+Front+View",
  );
  const img1_slide2 = await uploadImage(
    "https://placehold.co/800x600/16a34a/white?text=CTNM15B+Side+View",
  );
  const img1_slide3 = await uploadImage(
    "https://placehold.co/800x600/15803d/white?text=CTNM15B+Back+View",
  );
  const img1_detail = await uploadImage(
    "https://placehold.co/800x400/orange/white?text=Structure+Chart",
  );
  const img1_detail2 = await uploadImage(
    "https://placehold.co/800x600/f97316/white?text=Control+Panel",
  );
  const img1_detail3 = await uploadImage(
    "https://placehold.co/800x600/ea580c/white?text=Packing+Area",
  );
  const img1_body = await uploadImage(
    "https://placehold.co/1200x800/0ea5e9/white?text=CTNM15B+In+Use",
  );
  const img1_body2 = await uploadImage(
    "https://placehold.co/1200x800/14b8a6/white?text=CTNM15B+Detail+Shot",
  );

  // 产品2的图片组
  const img2_thumb = await uploadImage(
    "https://placehold.co/600x600/3b82f6/white?text=100TPD+Plant+Thumb",
  );
  const img2_slide1 = await uploadImage(
    "https://placehold.co/800x600/3b82f6/white?text=Plant+Overview",
  );
  const img2_slide2 = await uploadImage(
    "https://placehold.co/800x600/2563eb/white?text=Silo+System",
  );
  const img2_slide3 = await uploadImage(
    "https://placehold.co/800x600/1e40af/white?text=Sorter+Section",
  );
  const img2_slide4 = await uploadImage(
    "https://placehold.co/800x600/1e3a8a/white?text=Packaging+Line",
  );
  const img2_detail1 = await uploadImage(
    "https://placehold.co/800x600/1d4ed8/white?text=Factory+Layout",
  );
  const img2_detail2 = await uploadImage(
    "https://placehold.co/800x600/0ea5e9/white?text=Workflow+Diagram",
  );
  const img2_detail3 = await uploadImage(
    "https://placehold.co/800x600/38bdf8/white?text=Quality+Inspection",
  );
  const img2_body = await uploadImage(
    "https://placehold.co/1200x800/22d3ee/white?text=100TPD+Plant+Site",
  );
  const img2_body2 = await uploadImage(
    "https://placehold.co/1200x800/0f766e/white?text=Automation+Control+Room",
  );

  // --- 3. 创建产品 ---

  // 产品 A: Combined Rice Mill
  await client.create({
    _type: "product",
    title: "CTNM15B Complete Set Combined Rice Mill",
    slug: { _type: "slug", current: "ctnm15b-combined-rice-mill" },
    categories: [{ _type: "reference", _ref: "cat-combined", _key: "c1" }],

    // 列表缩略图
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: img1_thumb },
    },

    // 详情页轮播图 (3张)
    sliderImages: [
      {
        _type: "image",
        _key: "s1",
        asset: { _type: "reference", _ref: img1_slide1 },
      },
      {
        _type: "image",
        _key: "s2",
        asset: { _type: "reference", _ref: img1_slide2 },
      },
      {
        _type: "image",
        _key: "s3",
        asset: { _type: "reference", _ref: img1_slide3 },
      },
    ],

    // 更多细节图
    gallery: [
      {
        _type: "image",
        _key: "g1",
        asset: { _type: "reference", _ref: img1_detail },
        caption: "Technical Flow Chart",
      },
      {
        _type: "image",
        _key: "g2",
        asset: { _type: "reference", _ref: img1_detail2 },
        caption: "Control Panel",
      },
      {
        _type: "image",
        _key: "g3",
        asset: { _type: "reference", _ref: img1_detail3 },
        caption: "Packing Area",
      },
    ],

    // 核心参数 (多选演示)
    keySpecs: [
      {
        _key: "k1",
        label: "Power Options",
        values: ["15 kW", "22 kW", "30 kW"],
      }, // 多选
      { _key: "k2", label: "Capacity", values: ["1000 kg/h"] },
      { _key: "k3", label: "Voltage", values: ["220V", "380V", "440V"] }, // 多选
    ],

    // 详细参数表
    parameterGroups: [
      {
        _key: "pg1",
        groupName: "Technical Data",
        params: [
          { _key: "p1", label: "Model", values: ["CTNM15B", "CTNM15C"] },
          { _key: "p2", label: "Weight", values: ["1200 kg", "1400 kg"] },
          { _key: "p3", label: "Dimension", values: ["2800x1500x2900 mm"] },
        ],
      },
    ],
    body: [
      {
        _key: "b1",
        _type: "block",
        children: [
          {
            _key: "c1",
            _type: "span",
            text: "Compact combined rice mill designed for small to medium processors.",
          },
        ],
        style: "normal",
      },
      {
        _key: "b2",
        _type: "block",
        children: [{ _key: "c2", _type: "span", text: "Overview" }],
        style: "h2",
      },
      {
        _key: "b3",
        _type: "block",
        children: [
          {
            _key: "c3",
            _type: "span",
            text: "Integrates cleaning, hulling, and whitening in a compact footprint with quick setup.",
          },
        ],
        style: "normal",
      },
      {
        _key: "b4",
        _type: "block",
        children: [{ _key: "c4", _type: "span", text: "Key Advantages" }],
        style: "h3",
      },
      {
        _key: "b5",
        _type: "block",
        children: [
          { _key: "c5", _type: "span", text: "Low energy consumption per ton" },
        ],
        listItem: "bullet",
        level: 1,
        style: "normal",
      },
      {
        _key: "b6",
        _type: "block",
        children: [{ _key: "c6", _type: "span", text: "Easy maintenance access" }],
        listItem: "bullet",
        level: 1,
        style: "normal",
      },
      {
        _key: "b7",
        _type: "block",
        children: [{ _key: "c7", _type: "span", text: "Stable output quality" }],
        listItem: "bullet",
        level: 1,
        style: "normal",
      },
      {
        _key: "b8",
        _type: "block",
        children: [{ _key: "c8", _type: "span", text: "Process Flow" }],
        style: "h3",
      },
      {
        _key: "b9",
        _type: "block",
        children: [{ _key: "c9", _type: "span", text: "1. Pre-cleaning" }],
        listItem: "number",
        level: 1,
        style: "normal",
      },
      {
        _key: "b10",
        _type: "block",
        children: [{ _key: "c10", _type: "span", text: "2. Husk removal" }],
        listItem: "number",
        level: 1,
        style: "normal",
      },
      {
        _key: "b11",
        _type: "block",
        children: [{ _key: "c11", _type: "span", text: "3. Whitening & grading" }],
        listItem: "number",
        level: 1,
        style: "normal",
      },
      {
        _key: "b12",
        _type: "block",
        children: [
          {
            _key: "c12",
            _type: "span",
            text: "Recommended for workshop-style installations and rapid commissioning.",
            marks: ["strong"],
          },
        ],
        markDefs: [],
        style: "blockquote",
      },
      {
        _key: "b13",
        _type: "image",
        asset: { _type: "reference", _ref: img1_body },
      },
      {
        _key: "b14",
        _type: "block",
        children: [
          {
            _key: "c14",
            _type: "span",
            text: "Flexible installation layouts support both single-phase and three-phase power setups.",
            marks: ["em"],
          },
        ],
        style: "normal",
      },
      {
        _key: "b15",
        _type: "block",
        children: [
          {
            _key: "c15",
            _type: "span",
            text: "Recommended accessories include dust collection and lightweight packing scales.",
            marks: ["strong"],
          },
        ],
        style: "normal",
      },
      {
        _key: "b16",
        _type: "image",
        asset: { _type: "reference", _ref: img1_body2 },
      },
    ],
  });
  console.log("✅ 产品 1 (CTNM15B) 创建完成");

  // 产品 B: Commercial Plant
  await client.create({
    _type: "product",
    title: "100TPD Fully Automatic Commercial Rice Mill Plant",
    slug: { _type: "slug", current: "100tpd-commercial-plant" },
    categories: [{ _type: "reference", _ref: "cat-commercial", _key: "c2" }],

    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: img2_thumb },
    },

    sliderImages: [
      {
        _type: "image",
        _key: "s1",
        asset: { _type: "reference", _ref: img2_slide1 },
      },
      {
        _type: "image",
        _key: "s2",
        asset: { _type: "reference", _ref: img2_slide2 },
      },
      {
        _type: "image",
        _key: "s3",
        asset: { _type: "reference", _ref: img2_slide3 },
      },
      {
        _type: "image",
        _key: "s4",
        asset: { _type: "reference", _ref: img2_slide4 },
      },
    ],

    gallery: [
      {
        _type: "image",
        _key: "g1",
        asset: { _type: "reference", _ref: img2_detail1 },
        caption: "3D Layout",
      },
      {
        _type: "image",
        _key: "g2",
        asset: { _type: "reference", _ref: img2_detail2 },
        caption: "Workflow Diagram",
      },
      {
        _type: "image",
        _key: "g3",
        asset: { _type: "reference", _ref: img2_detail3 },
        caption: "Quality Inspection",
      },
    ],

    keySpecs: [
      { _key: "k1", label: "Daily Output", values: ["100 Tons", "150 Tons"] },
      {
        _key: "k2",
        label: "Automation Level",
        values: ["Fully Automatic", "Semi-Automatic"],
      },
    ],

    parameterGroups: [
      {
        _key: "pg1",
        groupName: "Installation",
        params: [
          { _key: "p1", label: "Workshop Size", values: ["30m * 10m * 8m"] },
          { _key: "p2", label: "Warranty", values: ["2 Years"] },
        ],
      },
    ],
    body: [
      {
        _key: "b1",
        _type: "block",
        children: [
          {
            _key: "c1",
            _type: "span",
            text: "Large-scale commercial plant with full automation and centralized control.",
          },
        ],
        style: "normal",
      },
      {
        _key: "b2",
        _type: "block",
        children: [{ _key: "c2", _type: "span", text: "System Highlights" }],
        style: "h2",
      },
      {
        _key: "b3",
        _type: "block",
        children: [
          {
            _key: "c3",
            _type: "span",
            text: "Designed for continuous 100TPD throughput with modular expansion capability.",
          },
        ],
        style: "normal",
      },
      {
        _key: "b4",
        _type: "block",
        children: [{ _key: "c4", _type: "span", text: "Typical Scope" }],
        style: "h3",
      },
      {
        _key: "b5",
        _type: "block",
        children: [{ _key: "c5", _type: "span", text: "Paddy intake & pre-cleaning" }],
        listItem: "bullet",
        level: 1,
        style: "normal",
      },
      {
        _key: "b6",
        _type: "block",
        children: [{ _key: "c6", _type: "span", text: "Husking, whitening, and grading" }],
        listItem: "bullet",
        level: 1,
        style: "normal",
      },
      {
        _key: "b7",
        _type: "block",
        children: [{ _key: "c7", _type: "span", text: "Color sorting & packaging line" }],
        listItem: "bullet",
        level: 1,
        style: "normal",
      },
      {
        _key: "b8",
        _type: "block",
        children: [{ _key: "c8", _type: "span", text: "Quality & Compliance" }],
        style: "h3",
      },
      {
        _key: "b9",
        _type: "block",
        children: [
          {
            _key: "c9",
            _type: "span",
            text: "Inline inspection points and data logging improve traceability and reduce rework.",
          },
        ],
        style: "normal",
      },
      {
        _key: "b10",
        _type: "block",
        children: [
          {
            _key: "c10",
            _type: "span",
            text: "Suitable for export-oriented processing with stable output quality.",
            marks: ["strong"],
          },
        ],
        markDefs: [],
        style: "blockquote",
      },
      {
        _key: "b11",
        _type: "image",
        asset: { _type: "reference", _ref: img2_body },
      },
      {
        _key: "b12",
        _type: "block",
        children: [
          {
            _key: "c12",
            _type: "span",
            text: "Centralized HMI panels simplify operator training and improve shift handover efficiency.",
          },
        ],
        style: "normal",
      },
      {
        _key: "b13",
        _type: "block",
        children: [
          {
            _key: "c13",
            _type: "span",
            text: "Optional monitoring modules provide remote alerts and batch traceability.",
            marks: ["strong"],
          },
        ],
        style: "normal",
      },
      {
        _key: "b14",
        _type: "image",
        asset: { _type: "reference", _ref: img2_body2 },
      },
    ],
  });
  console.log("✅ 产品 2 (100TPD Plant) 创建完成");

  console.log("🎉 所有数据重置并导入成功！");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
