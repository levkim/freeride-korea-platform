import { Badge } from "@/components/ui/Badge";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <Badge tone="blue">{eyebrow}</Badge>
        <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-normal md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
          {description}
        </p>
      </div>
    </section>
  );
}
