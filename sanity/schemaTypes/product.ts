import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product (产品)",
  type: "document",
  groups: [
    { name: "basic", title: "基础信息" },
    { name: "media", title: "图片管理" },
    { name: "specs", title: "规格参数" },
    { name: "content", title: "详细描述" },
  ],
  fields: [
    // --- 1. 基础信息 ---
    defineField({
      name: "title",
      title: "产品名称",
      type: "string",
      group: "basic",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL 路径",
      type: "slug",
      group: "basic",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "所属分类",
      type: "array",
      group: "basic",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.required(),
    }),

    // --- 2. 图片管理 (升级版) ---
    defineField({
      name: "mainImage",
      title: "列表页缩略图 (Thumbnail)",
      description:
        "这张图仅在“产品列表页”或“首页推荐”时显示，建议使用白底清晰图。",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sliderImages",
      title: "详情页轮播主图 (Main Slider)",
      description:
        "这里上传 3-5 张产品大图，用户打开详情页第一眼看到的就是这个轮播。",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "gallery",
      title: "更多细节/场景图 (Detail Gallery)",
      description: "放在页面下方的图片，如结构图、场景图、证书等。",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "图片说明",
              type: "string",
              description: "如: Internal Structure / Working Site",
            },
          ],
        },
      ],
    }),

    // --- 3. 规格参数 (升级为多选) ---
    defineField({
      name: "keySpecs",
      title: "核心参数 (Key Specs)",
      group: "specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "参数名 (如 Power)", type: "string" },
            {
              name: "values", // 改名复数
              title: "参数值 (可填多个)",
              type: "array",
              of: [{ type: "string" }],
              description: "输入后回车，可添加多个值 (如: 10W, 20W, 30W)",
            },
          ],
          preview: {
            select: { title: "label", subtitle: "values.0" },
          },
        },
      ],
    }),
    defineField({
      name: "parameterGroups",
      title: "详细参数表 (Detailed Table)",
      group: "specs",
      type: "array",
      of: [
        {
          type: "object",
          title: "参数组",
          fields: [
            { name: "groupName", title: "组名 (如 Engine)", type: "string" },
            {
              name: "params",
              title: "组内参数",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", title: "参数项", type: "string" },
                    {
                      name: "values",
                      title: "数值 (支持多个)",
                      type: "array",
                      of: [{ type: "string" }],
                    },
                  ],
                  preview: {
                    select: { title: "label", subtitle: "values.0" },
                  },
                },
              ],
            },
          ],
        },
      ],
    }),

    // --- 4. 详细描述 ---
    defineField({
      name: "body",
      title: "图文详情",
      type: "array",
      group: "content",
      of: [{ type: "block" }, { type: "image" }],
    }),
  ],
});
