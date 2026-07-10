export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-[var(--color-fk-black)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-lg font-black">FREERIDE KOREA</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
            한국 프리라이드 선수 육성, 안전 교육, 투어, 대회 소식, 산악 문화를
            연결하는 공식 플랫폼입니다.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-zinc-400">Values</p>
          <p className="mt-3 text-sm font-bold">Fun · Respect · Safety</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-zinc-400">Position</p>
          <p className="mt-3 text-sm font-bold">Official 60% / Premium Outdoor 40%</p>
        </div>
      </div>
    </footer>
  );
}
