// sanity/schemaTypes/category.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category (分类)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "分类名称",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL 路径",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
