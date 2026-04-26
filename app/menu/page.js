import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { menuHighlights, menuSections } from "@/lib/menuData";

export const metadata = {
  title: "Full Menu | City Roll",
  description: "Browse the complete City Roll menu with rolls, burgers, snacks, drinks, wraps, and add-ons.",
};

const menuPreviewBoards = [
  { src: "/menu/boards/veg-rolls-board.png", alt: "Veg rolls board", label: "Veg Rolls" },
  { src: "/menu/boards/non-veg-rolls-board.png", alt: "Non-veg rolls board", label: "Non-Veg Rolls" },
  { src: "/menu/boards/beverages-board.png", alt: "Beverages board", label: "Beverages" },
  { src: "/menu/boards/wraps-board.png", alt: "Wraps board", label: "Wraps" },
];

function PriceStack({ prices }) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-2 text-right">
      {prices.map((price) => (
        <div key={`${price.label || "main"}-${price.amount}`}>
          <div className="display text-lg text-amber">{price.amount}</div>
          {price.label && (
            <div className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-bone/35">
              {price.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function MenuPage() {
  return (
    <>
      <Navbar showLinks={false} />

      <section className="relative z-10 overflow-hidden px-5 pb-20 pt-32 sm:px-8">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 20% 15%, rgba(255,107,26,0.22), transparent 28%), radial-gradient(circle at 82% 22%, rgba(255,199,44,0.18), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.015), transparent 55%)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="tag">
                <span className="tag-dot" /> Full menu
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-8 text-[clamp(3rem,7.5vw,6.3rem)] text-bone">
                <span className="display block">Every counter.</span>
                <span className="display block">Every section.</span>
                <span className="display-italic block text-amber">One proper menu.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone/60">
                This menu is rebuilt from your complete City Roll board, with rolls, burgers,
                snacks, beverages, wraps, and add-ons all available in one clean route.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/" className="btn-primary">
                  <span>Back to home</span>
                  <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M11 5l-7 7 7 7" />
                  </svg>
                </Link>
                <Link href="/login" className="btn-ghost">
                  <span>Unlock rewards</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-14 grid max-w-2xl gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { n: "70+", t: "Items listed" },
                  { n: "Veg", t: "and non-veg" },
                  { n: "Drinks", t: "from mojitos to lassi" },
                  { n: "Add-ons", t: "built in" },
                ].map((stat) => (
                  <div key={stat.t} className="glass rounded-2xl p-4">
                    <div className="display text-2xl text-bone">{stat.n}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-bone/40">
                      {stat.t}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-wrap gap-3">
                {menuSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="rounded-full border border-bone/10 bg-bone/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-bone/70 transition-colors hover:border-amber/40 hover:text-amber"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-6">
            <TiltCard className="glass overflow-hidden rounded-[2rem]">
              <div className="relative overflow-hidden p-5 sm:p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-bone/10 bg-bone/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone/55">
                  Supplied menu board
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {menuPreviewBoards.map((board) => (
                    <div key={board.label} className="overflow-hidden rounded-2xl border border-bone/8 bg-[#efbf40]">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={board.src}
                          alt={board.alt}
                          fill
                          priority
                          sizes="(min-width: 1024px) 20vw, 44vw"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="border-t border-bone/8 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-ink/75">
                        {board.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="display text-3xl text-bone sm:text-4xl">Counter-ready lineup</div>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-bone/55">
                      Organized for browsing, anchored by the same categories from the original menu.
                    </p>
                  </div>
                  <div className="hidden rounded-2xl border border-bone/10 bg-ink/70 px-4 py-3 text-right backdrop-blur sm:block">
                    <div className="display text-2xl text-amber">Noida</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-bone/40">
                      Bhutani City Centre 32
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <Reveal>
              <div>
                <div className="tag">
                  <span className="tag-dot" /> House picks
                </div>
                <h2 className="display mt-6 text-[clamp(2.4rem,5vw,4rem)] text-bone">
                  Start with the <span className="display-italic text-amber">favorites.</span>
                </h2>
              </div>
            </Reveal>
            <Reveal>
              <p className="max-w-xl text-sm leading-relaxed text-bone/50">
                These are the image-led highlights already featured on the homepage, now tied directly into
                the full menu structure below.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {menuHighlights.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.07}>
                <Link href={item.href} className="group block">
                  <article className="overflow-hidden rounded-3xl border border-bone/8 bg-bone/3 transition-transform duration-500 group-hover:-translate-y-1">
                    <div className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${item.grad}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,237,224,0.12),transparent_65%)]" />
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 768px) 42vw, 90vw"
                        className={`${item.imageClassName} transition-transform duration-700 group-hover:scale-110`}
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="display text-2xl text-bone">{item.name}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-bone/50">{item.blurb}</p>
                        </div>
                        <div className="display text-2xl text-amber">{item.price}</div>
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {menuSections.map((section, sectionIndex) => (
        <section
          key={section.id}
          id={section.id}
          className="relative z-10 px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-5">
                <Reveal>
                  <div className="tag">
                    <span className="tag-dot" /> {section.label}
                  </div>
                </Reveal>
                <Reveal delay={0.04}>
                  <h2 className="display mt-6 text-[clamp(2.4rem,5vw,4.3rem)] text-bone">
                    {section.title}
                  </h2>
                </Reveal>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <Reveal delay={0.08}>
                  <p className="text-lg leading-relaxed text-bone/58">{section.description}</p>
                  <p className="mt-4 text-sm leading-relaxed text-bone/42">{section.note}</p>
                </Reveal>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr,1.45fr]">
              <Reveal>
                <div className="glass sticky top-28 overflow-hidden rounded-[2rem]">
                  <div className="relative aspect-[4/3] bg-[#efbf40]">
                    <Image
                      src={section.boardImage}
                      alt={`${section.label} menu board`}
                      fill
                      sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 38vw, 100vw"
                      className="object-contain p-4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="rounded-3xl border border-bone/10 bg-ink/70 p-5 backdrop-blur">
                        <div className="text-xs uppercase tracking-[0.22em] text-bone/40">
                          Section overview
                        </div>
                        <div className="display mt-2 text-3xl text-bone">{section.label}</div>
                        <p className="mt-3 text-sm leading-relaxed text-bone/55">{section.note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="grid gap-5 md:grid-cols-2">
                {section.groups.map((group, groupIndex) => (
                  <Reveal key={group.id} delay={groupIndex * 0.06}>
                    <article
                      id={group.id}
                      className="glass rounded-3xl border border-bone/8 p-6"
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.22em] text-bone/45">
                            Category
                          </div>
                          <div className="display mt-1 text-3xl text-bone">{group.title}</div>
                        </div>
                        <div className={`rounded-full border border-bone/10 bg-bone/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${group.accentClassName}`}>
                          {group.badge}
                        </div>
                      </div>

                      {group.note && (
                        <p className="mb-5 text-xs leading-relaxed text-bone/42">{group.note}</p>
                      )}

                      <div className="space-y-4">
                        {group.items.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-start justify-between gap-4 border-b border-bone/8 pb-4 last:border-b-0 last:pb-0"
                          >
                            <div className="min-w-0">
                              <h3 className="text-base font-medium text-bone">{item.name}</h3>
                            </div>
                            <PriceStack prices={item.prices} />
                          </div>
                        ))}
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {sectionIndex < menuSections.length - 1 && (
            <div className="mx-auto mt-20 h-px max-w-7xl bg-bone/6" />
          )}
        </section>
      ))}
    </>
  );
}
