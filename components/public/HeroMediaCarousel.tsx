"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

const mediaItems = [
  {
    label: "훈련",
    title: "선수 성장 루트",
    ko: "선수 훈련과 성장 루트",
    src: "/brand/hero-training.png",
  },
  {
    label: "투어",
    title: "프리라이드 투어",
    ko: "프리라이드 투어와 원정",
    src: "/brand/hero-tour.png",
  },
  {
    label: "안전",
    title: "눈사태 안전교육",
    ko: "눈사태 안전교육과 WFR",
    src: "/brand/hero-safety.png",
  },
  {
    label: "대회",
    title: "대회 아카이브",
    ko: "대회 참가와 공식 소식",
    src: "/brand/hero-event.png",
  },
  {
    label: "영상",
    title: "뉴스와 영상",
    ko: "영상, 뉴스, 현장 기록",
    src: "/brand/hero-video.png",
  },
];

export function HeroMediaCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = mediaItems[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % mediaItems.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="fk-reveal relative">
      <div className="absolute -right-6 top-10 hidden h-28 w-28 border border-[var(--color-fk-red)] bg-white/60 md:block" />
      <div className="relative overflow-hidden border border-zinc-200 bg-white/80 p-4 shadow-[var(--shadow-diffused)] backdrop-blur">
        <div className="relative aspect-[4/5] overflow-hidden border border-zinc-100 bg-[var(--color-fk-black)] md:aspect-[0.86]">
          {mediaItems.map((item, index) => (
            <Image
              key={item.src}
              src={item.src}
              alt={`${item.title} visual`}
              width={860}
              height={1000}
              priority={index === 0}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out",
                index === activeIndex
                  ? "scale-100 opacity-100"
                  : "scale-[1.04] opacity-0",
              )}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,16,0.08)_0%,rgba(11,13,16,0.18)_42%,rgba(11,13,16,0.82)_100%)]" />
          <div className="absolute left-5 top-5">
            <Badge tone={activeItem.label === "안전" ? "red" : "blue"}>
              {activeItem.label}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="fk-nav-type text-4xl leading-none">{activeItem.title}</p>
            <p className="mt-3 text-base font-black">{activeItem.ko}</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-200">
              대회, 투어, 훈련, 안전교육, 영상 썸네일이 순환되는 메인 미디어
              영역입니다.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-4 border-t border-zinc-200 pt-4">
          <div>
            <p className="text-xs font-black uppercase text-zinc-500">
              메인 미디어
            </p>
            <p className="mt-1 text-sm font-bold text-zinc-700">
              대회, 투어, 훈련, 안전 교육, 영상 콘텐츠를 순환 노출합니다.
            </p>
          </div>
          <div className="flex gap-1.5">
            {mediaItems.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-label={`${item.label} 보기`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2.5 transition-all duration-300",
                  index === activeIndex
                    ? "w-8 bg-[var(--color-fk-red)]"
                    : "w-2.5 bg-zinc-300 hover:bg-zinc-500",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
