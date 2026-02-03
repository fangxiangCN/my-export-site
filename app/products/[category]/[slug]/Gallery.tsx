"use client"; // 必须是 Client Component

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export default function ImageGallery({
  images,
  title,
}: {
  images: SanityImageSource[];
  title: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="h-96 bg-gray-100 flex items-center justify-center">
        No Image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 大图显示区 */}
      <div className="relative h-80 md:h-96 w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={urlFor(activeImage).width(800).height(800).url()}
          alt={title}
          fill
          className="object-contain" // 保证机械图片完整显示，不裁剪
          priority
        />
      </div>

      {/* 底部缩略图列表 */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((img: SanityImageSource, i: number) => (
          <button
            key={i}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition ${
              activeImage === img
                ? "border-orange-500 ring-2 ring-orange-200"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <Image
              src={urlFor(img).width(150).height(150).url()}
              alt={`thumbnail-${i}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
