// app/page.js — Premium landing (the showpiece)
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import TiltCard from "@/components/TiltCard";
import BrandLogo from "@/components/BrandLogo";

// Three.js is lazy-loaded to keep initial bundle small
const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), { ssr: false });

const menuItems = [
  {
    name: "Paneer Tikka Roll",
    desc: "Smoky, spiced, wrapped warm",
    price: "₹149",
    tag: "Bestseller",
    grad: "from-amber/25 via-ember/15 to-crimson/20",
    image: "/menu/paneer-tikka-roll.png",
    imageClassName: "object-contain p-4 sm:p-5 scale-[1.06]",
  },
  {
    name: "Classic Bubble Tea",
    desc: "Creamy, chilled, chewy pearls",
    price: "₹179",
    tag: "House blend",
    grad: "from-crimson/25 via-ember/10 to-amber/20",
    image: "/menu/bubble-tea.png",
    imageClassName: "object-contain p-6 sm:p-7 scale-[1.02]",
  },
  {
    name: "House Mojito",
    desc: "Crushed mint, island lime",
    price: "₹129",
    tag: "Free at 3",
    grad: "from-lime/20 via-amber/10 to-ember/15",
    image: "/menu/house-mojito.png",
    imageClassName: "object-contain p-5 sm:p-6 scale-[1.02]",
  },
  {
    name: "Chicken Shawarma",
    desc: "Charred, garlicky, generous",
    price: "₹189",
    tag: "New",
    grad: "from-ember/25 via-crimson/10 to-amber/20",
    image: "/menu/chicken-shawarma.png",
    imageClassName: "object-contain p-4 sm:p-5 scale-[1.08]",
  },
];

const brandSections = [
  {
    id: "our-story",
    label: "Our Story",
    title: "Our Story 🍽️",
    intro: "City Rolls started with one simple idea: serve street food that actually feels premium.",
    body: [
      "What began as a small kitchen turned into a growing food spot loved for fresh rolls, bold flavors, and quick bites that hit every time.",
      "From classic wraps to loaded creations, every item is made with quality ingredients and that extra care you can taste.",
      "We're not just serving food. We're building a vibe that's fast, fresh, and full of flavor.",
    ],
  },
  {
    id: "franchise",
    label: "Franchise",
    title: "Franchise 🚀",
    intro: "Want to grow with City Rolls?",
    body: [
      "We're expanding and looking for passionate partners to bring our brand to new locations.",
      "With a proven menu, strong branding, and growing demand, City Rolls is built to scale.",
    ],
    bullets: [
      "Low complexity setup",
      "High demand street food category",
      "Full support from our team",
    ],
    contacts: [
      { label: "Call/WhatsApp", href: "tel:+917352521146", text: "+91 73525 21146" },
      { label: "Email", href: "mailto:businesscityrolls@gmail.com", text: "businesscityrolls@gmail.com" },
    ],
    outro: "Let's build something big together.",
  },
  {
    id: "careers",
    label: "Careers",
    title: "Careers 👨‍🍳",
    intro: "Join the City Rolls squad.",
    body: [
      "We're always looking for energetic, hardworking people who love food and fast-paced environments.",
      "Whether you're in the kitchen or handling customers, you're part of the experience we deliver.",
    ],
    bullets: [
      "Friendly work culture",
      "Growth opportunities",
      "Learn real food business skills",
    ],
    outro: "If you've got the hunger to grow, we've got a place for you.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-5 sm:px-8 z-10 overflow-hidden">
        <HeroCanvas />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="tag"><span className="tag-dot" /> Now open · Noida</div>
            </Reveal>

            <h1 className="mt-8 text-[clamp(3rem,9vw,7.5rem)] text-bone">
              <Reveal><span className="display block">Hand-rolled.</span></Reveal>
              <Reveal delay={0.1}><span className="display block">Fresh-pressed.</span></Reveal>
              <Reveal delay={0.2}><span className="display-italic block text-amber">Unforgettable.</span></Reveal>
            </h1>

            <Reveal delay={0.3}>
              <p className="mt-8 max-w-xl text-bone/60 text-lg leading-relaxed">
                Seventy handcrafted rolls, bubble-brewed teas, and a drink list that doesn't
                apologize. Made loud, plated calm, remembered longer.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <MagneticButton>
                  <Link href="/login" className="btn-primary">
                    <span>Unlock free Mojito</span>
                    <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                </MagneticButton>
                <a href="#menu" className="btn-ghost">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>See the menu</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg pt-8 border-t border-bone/10">
                <div>
                  <div className="stat-num text-4xl text-bone">70<span className="text-amber">+</span></div>
                  <div className="text-xs text-bone/50 mt-1 uppercase tracking-widest">Signature items</div>
                </div>
                <div>
                  <div className="stat-num text-4xl text-bone">4.8<span className="text-amber italic">★</span></div>
                  <div className="text-xs text-bone/50 mt-1 uppercase tracking-widest">Swiggy rated</div>
                </div>
                <div>
                  <div className="stat-num text-4xl text-bone">&lt;15<span className="text-amber text-2xl">m</span></div>
                  <div className="text-xs text-bone/50 mt-1 uppercase tracking-widest">Avg prep time</div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — 3D floating card */}
          <Reveal delay={0.2} className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
              <div className="absolute inset-4 glass rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-bone/40 uppercase tracking-widest">Featured today</div>
                    <div className="display text-2xl mt-1">Paneer Tikka Roll</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-bone/40 uppercase tracking-widest">From</div>
                    <div className="display text-2xl text-amber">₹149</div>
                  </div>
                </div>

                <div className="relative flex-1 flex items-center justify-center py-8">
                  <div className="relative w-full max-w-[19rem] aspect-[2/3]">
                    <div className="absolute -inset-12 bg-gradient-to-br from-ember/40 via-amber/20 to-transparent rounded-full blur-3xl" />
                    <Image
                      src="/menu/paneer-tikka-roll.png"
                      alt="Paneer Tikka Roll"
                      fill
                      priority
                      sizes="(min-width: 1024px) 19rem, 16rem"
                      className="relative object-contain -translate-y-16 sm:-translate-y-20 drop-shadow-[0_24px_48px_rgba(255,107,26,0.35)]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime" />
                    <span className="text-xs text-bone/60">Veg · 320 kcal</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full border border-bone/20 bg-amber/20 flex items-center justify-center text-[10px] font-bold">AK</div>
                    <div className="w-7 h-7 rounded-full border border-bone/20 bg-crimson/20 flex items-center justify-center text-[10px] font-bold">RS</div>
                    <div className="w-7 h-7 rounded-full border border-bone/20 bg-lime/20 flex items-center justify-center text-[10px] font-bold">+8</div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 top-10 glass px-3 py-1.5 rounded-full text-xs flex items-center gap-2 animate-float-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" /> Fresh daily
              </div>
              <div className="absolute -right-2 bottom-32 glass px-3 py-1.5 rounded-full text-xs flex items-center gap-2 animate-float-1">
                🔥 Chef's pick
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative z-10 py-12 border-y border-bone/5 bg-soot/40">
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} aria-hidden={k === 1} className="flex items-center gap-6 px-6 text-bone/50 text-2xl sm:text-3xl whitespace-nowrap">
                <span className="display-italic text-amber">Paneer Tikka Roll</span>
                <span className="text-bone/20">◆</span>
                <span className="display">Egg Shawarma</span>
                <span className="text-bone/20">◆</span>
                <span className="display-italic text-crimson">Bubble Tea</span>
                <span className="text-bone/20">◆</span>
                <span className="display">Virgin Mojito</span>
                <span className="text-bone/20">◆</span>
                <span className="display-italic text-amber">Chicken Tandoori</span>
                <span className="text-bone/20">◆</span>
                <span className="display">Mango Shake</span>
                <span className="text-bone/20">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10 py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 mb-20">
            <div className="lg:col-span-5">
              <Reveal><div className="tag"><span className="tag-dot" /> The ritual</div></Reveal>
              <Reveal>
                <h2 className="display mt-6 text-[clamp(2.5rem,6vw,4.5rem)] text-bone">
                  Three bills.<br />
                  <span className="display-italic text-amber">One free drink.</span>
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <Reveal>
                <p className="text-bone/55 text-lg leading-relaxed">
                  Our loyalty program is built on one simple rule — the more you roll with us,
                  the more we roll back. No apps to download. No cards to lose. Just real food,
                  real rewards.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Order anything", d: "Walk in, scan, or swipe. Any order from any of our 70+ menu items counts.", c: "text-amber",
                i: <path d="M14 3v4a1 1 0 001 1h4M5 8v11a2 2 0 002 2h10a2 2 0 002-2V8l-5-5H7a2 2 0 00-2 2v3zM9 13h6M9 17h4" /> },
              { n: "02", t: "Upload the bill", d: "Snap your receipt, upload it in ten seconds. We verify and count it automatically.", c: "text-ember",
                i: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" /></> },
              { n: "03", t: "Sip for free", d: "After three bills, your fourth visit gets a house Mojito — on us. That's the deal.", c: "text-crimson",
                i: <polyline points="20 6 9 17 4 12" /> },
            ].map((card, i) => (
              <Reveal key={card.n} delay={i * 0.1}>
                <TiltCard className="glass rounded-3xl p-7 h-full">
                  <div className="tilt-pop flex items-center justify-between mb-10">
                    <div className={`stat-num text-6xl ${card.c}`}>{card.n}</div>
                    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={card.c}>
                        {card.i}
                      </svg>
                    </div>
                  </div>
                  <h3 className="tilt-pop display text-2xl mb-2">{card.t}</h3>
                  <p className="tilt-pop text-bone/55 text-sm leading-relaxed">{card.d}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="relative z-10 py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <Reveal><div className="tag"><span className="tag-dot" /> Signatures</div></Reveal>
              <Reveal>
                <h2 className="display mt-6 text-[clamp(2.5rem,6vw,4.5rem)] text-bone">
                  House <span className="display-italic text-amber">favourites.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal>
              <Link href="/menu" className="btn-ghost">
                <span>View full menu</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              </Link>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {menuItems.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.1}>
                <article className="group cursor-pointer">
                  <div className={`aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br ${item.grad} relative transition-transform duration-700 group-hover:scale-[1.02]`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,237,224,0.12),transparent_65%)]" />
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 40vw, 90vw"
                      className={`${item.imageClassName} transition-transform duration-700 group-hover:scale-110`}
                    />
                    <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest">
                      {item.tag}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="display text-xl">{item.name}</h3>
                      <p className="text-bone/50 text-sm mt-1">{item.desc}</p>
                    </div>
                    <span className="display text-amber text-xl">{item.price}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REWARDS CTA */}
      <section id="rewards" className="relative z-10 py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative glass rounded-[2.5rem] p-10 sm:p-16 lg:p-24 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,199,44,0.25), transparent 60%)" }} />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(230,57,70,0.2), transparent 60%)" }} />

            <div className="relative grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <Reveal><div className="tag"><span className="tag-dot" /> Membership · free</div></Reveal>
                <Reveal>
                  <h2 className="display mt-6 text-[clamp(2.5rem,7vw,5.5rem)] text-bone leading-[0.95]">
                    Taste will <span className="display-italic text-amber">bring you</span><br />
                    back again.
                  </h2>
                </Reveal>
                <Reveal>
                  <p className="mt-6 text-bone/60 text-lg max-w-xl leading-relaxed">
                    Scan once. Earn forever. Join a growing list of regulars already sipping free drinks on us.
                  </p>
                </Reveal>
                <Reveal>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <MagneticButton>
                      <Link href="/login" className="btn-primary">
                        <span>Start earning</span>
                        <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </MagneticButton>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.2} className="lg:col-span-5">
                <TiltCard className="glass rounded-3xl p-7">
                  <div className="tilt-pop flex justify-between items-start mb-6">
                    <div>
                      <div className="text-xs text-bone/40 uppercase tracking-widest">Your reward</div>
                      <div className="display text-3xl mt-1">House Mojito 🍹</div>
                    </div>
                    <div className="glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-amber">Locked</div>
                  </div>
                  <div className="tilt-pop mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-bone/60">2 of 3 bills verified</span>
                      <span className="text-amber">67%</span>
                    </div>
                    <div className="h-2 rounded-full bg-bone/10 overflow-hidden">
                      <div className="h-full progress-fill rounded-full" style={{ width: "67%" }} />
                    </div>
                  </div>
                  <div className="tilt-pop flex gap-1.5 mt-5">
                    <div className="flex-1 h-1 rounded-full bg-amber" />
                    <div className="flex-1 h-1 rounded-full bg-amber" />
                    <div className="flex-1 h-1 rounded-full bg-bone/15" />
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <Reveal><div className="tag"><span className="tag-dot" /> City Rolls</div></Reveal>
              <Reveal>
                <h2 className="display mt-6 text-[clamp(2.5rem,6vw,4.5rem)] text-bone">
                  Built to <span className="display-italic text-amber">grow.</span>
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <Reveal>
                <p className="text-bone/55 text-lg leading-relaxed">
                  From the kitchen line to new locations, City Rolls is shaped by people who care about speed, quality, and flavor.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {brandSections.map((section, i) => (
              <Reveal key={section.id} delay={i * 0.1}>
                <article id={section.id} className="glass rounded-3xl p-7 h-full">
                  <div className="text-xs uppercase tracking-widest text-bone/40 mb-5">{section.label}</div>
                  <h3 className="display text-3xl mb-4">{section.title}</h3>
                  <p className="text-bone/88 text-base leading-relaxed mb-4">{section.intro}</p>

                  <div className="space-y-4 text-bone/60 text-sm leading-relaxed">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets && (
                    <div className="mt-6 space-y-2 text-bone text-sm">
                      {section.bullets.map((bullet) => (
                        <div key={bullet} className="flex gap-2">
                          <span className="text-amber">+</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.contacts && (
                    <div className="mt-6 space-y-2 text-sm">
                      {section.contacts.map((contact) => (
                        <p key={contact.label} className="text-bone/70">
                          <span className="text-bone/45">{contact.label}: </span>
                          <a href={contact.href} className="text-amber hover:underline break-all">
                            {contact.text}
                          </a>
                        </p>
                      ))}
                    </div>
                  )}

                  {section.outro && (
                    <p className="mt-6 text-bone/90 text-sm leading-relaxed">{section.outro}</p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="visit" className="relative z-10 py-20 px-5 sm:px-8 border-t border-bone/5 mt-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="mb-6">
              <BrandLogo variant="footer" />
            </div>
            <p className="text-bone/50 max-w-sm leading-relaxed">
              Made loud, plated calm. A neighborhood kitchen in Noida serving rolls, teas, and reasons to come back.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-widest text-bone/40 mb-4">Menu</div>
            <ul className="space-y-2 text-bone/70 text-sm">
              <li><Link href="/menu#rolls" className="hover:text-amber transition-colors">Rolls</Link></li>
              <li><Link href="/menu#ice-tea" className="hover:text-amber transition-colors">Bubble teas</Link></li>
              <li><Link href="/menu#beverages" className="hover:text-amber transition-colors">Shakes</Link></li>
              <li><Link href="/menu#beverage" className="hover:text-amber transition-colors">Mojitos</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-widest text-bone/40 mb-4">Brand</div>
            <ul className="space-y-2 text-bone/70 text-sm">
              <li><a href="#our-story" className="hover:text-amber transition-colors">Our story</a></li>
              <li><a href="#franchise" className="hover:text-amber transition-colors">Franchise</a></li>
              <li><a href="#careers" className="hover:text-amber transition-colors">Careers</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-widest text-bone/40 mb-4">Visit us</div>
            <p className="text-bone/70 text-sm leading-relaxed">
              Bhutani City Centre 32<br />
              Sector 32, Noida, Uttar Pradesh<br />
              Open daily · 11am – 12am<br />
              <a href="tel:+917352521146" className="text-amber hover:underline">+91 73525 21146</a>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-bone/5 flex flex-wrap justify-between items-center gap-4 text-xs text-bone/40">
          <div>© 2026 City Roll. Made with 🔥 in Noida.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-amber">Privacy</a>
            <a href="#" className="hover:text-amber">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}
