import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/public/CategoryDetailPage";
import { categoryContentItems } from "@/content/seed/site-data";
import { getCategoryContentById } from "@/lib/repositories/category-content";

type AthleteProgramDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const allowedSubtypes = new Set(["Freeride"]);

export function generateStaticParams() {
  return categoryContentItems
    .filter(
      (item) => item.kind === "program" && allowedSubtypes.has(item.subtype),
    )
    .map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: AthleteProgramDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  return {
    title: item ? `${item.title.ko} | FREERIDE KOREA` : "Athlete Program",
    description: item?.summary.ko,
  };
}

export default async function AthleteProgramDetailPage({
  params,
}: AthleteProgramDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  if (!item || item.kind !== "program" || !allowedSubtypes.has(item.subtype)) {
    notFound();
  }

  return (
    <CategoryDetailPage
      item={item}
      listHref="/athlete-program"
      listLabel="선수 프로그램 목록"
      ctaLabel="프로그램 문의"
    />
  );
}
