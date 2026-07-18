import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/public/CategoryDetailPage";
import { categoryContentItems } from "@/content/seed/site-data";
import { getCategoryContentById } from "@/lib/repositories/category-content";

type SafetyEducationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const allowedSubtypes = new Set([
  "Avalanche Safety",
  "Freeriding",
  "Backcountry",
  "WFR",
]);

export function generateStaticParams() {
  return categoryContentItems
    .filter(
      (item) => item.kind === "program" && allowedSubtypes.has(item.subtype),
    )
    .map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: SafetyEducationDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  return {
    title: item ? `${item.title.ko} | FREERIDE KOREA` : "Education",
    description: item?.summary.ko,
  };
}

export default async function SafetyEducationDetailPage({
  params,
}: SafetyEducationDetailPageProps) {
  const { id } = await params;
  const item = await getCategoryContentById(id);

  if (!item || item.kind !== "program" || !allowedSubtypes.has(item.subtype)) {
    notFound();
  }

  return (
    <CategoryDetailPage
      item={item}
      listHref="/safety-education"
      listLabel="교육 목록"
      ctaLabel="교육 문의하기"
    />
  );
}
