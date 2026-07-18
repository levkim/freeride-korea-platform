import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/public/CategoryDetailPage";
import { categoryContentItems } from "@/content/seed/site-data";
import { getCategoryContentById } from "@/lib/repositories/category-content";

type CultureDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const allowedKinds = new Set(["culture", "marketplace", "resource"]);

export function generateStaticParams() {
  return categoryContentItems
    .filter((item) => allowedKinds.has(item.kind))
    .map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: CultureDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  return {
    title: item ? `${item.title.ko} | FREERIDE KOREA` : "Culture",
    description: item?.summary.ko,
  };
}

export default async function CultureDetailPage({
  params,
}: CultureDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  if (!item || !allowedKinds.has(item.kind)) {
    notFound();
  }

  return (
    <CategoryDetailPage
      item={item}
      listHref="/culture"
      listLabel="컬쳐 목록"
      ctaLabel="참여 문의"
    />
  );
}
