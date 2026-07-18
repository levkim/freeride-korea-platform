import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/public/CategoryDetailPage";
import { categoryContentItems } from "@/content/seed/site-data";
import { getCategoryContentById } from "@/lib/repositories/category-content";

type ShopDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return categoryContentItems
    .filter((item) => item.kind === "shop")
    .map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: ShopDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  return {
    title: item ? `${item.title.ko} | FREERIDE KOREA` : "Shop",
    description: item?.summary.ko,
  };
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  if (!item || item.kind !== "shop") {
    notFound();
  }

  return (
    <CategoryDetailPage
      item={item}
      listHref="/shop"
      listLabel="샵 목록"
      ctaLabel="문의하기"
    />
  );
}
