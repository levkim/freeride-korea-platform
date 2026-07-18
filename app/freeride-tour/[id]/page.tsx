import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/public/CategoryDetailPage";
import { categoryContentItems } from "@/content/seed/site-data";
import { getCategoryContentById } from "@/lib/repositories/category-content";

type FreerideTourDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return categoryContentItems
    .filter((item) => item.kind === "tour")
    .map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: FreerideTourDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  return {
    title: item ? `${item.title.ko} | FREERIDE KOREA` : "Freeride Tour",
    description: item?.summary.ko,
  };
}

export default async function FreerideTourDetailPage({
  params,
}: FreerideTourDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  if (!item || item.kind !== "tour") {
    notFound();
  }

  return (
    <CategoryDetailPage
      item={item}
      listHref="/freeride-tour"
      listLabel="투어 목록"
      ctaLabel="투어 문의"
    />
  );
}
