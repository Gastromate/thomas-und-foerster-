import { useEffect, useState } from 'react';
import './App.css';

import { useDiveScene } from './hooks/useDiveScene';
import DepthText from './components/DepthText/DepthText';
import ParticleText from './components/ParticleText/ParticleText';
import ScrollReveal from './components/ScrollReveal/ScrollReveal';
import SpecularButton from './components/SpecularButton/SpecularButton';
import GradualBlur from './components/GradualBlur/GradualBlur';
import CardSwap, { Card } from './components/CardSwap/CardSwap';
import ProfileCard from './components/ProfileCard/ProfileCard';

import avatarAntwann from './assets/antwann.jpg';
import avatarChristopher from './assets/christopher.jpg';
import gastriotWaste from './assets/gastriot/waste.png';
import gastriotHome from './assets/gastriot/home.png';
import gastriotInventory from './assets/gastriot/inventory.png';
import gastriotPos from './assets/gastriot/pos.png';
import gastriotOrders from './assets/gastriot/orders.png';

const EMBER = '#B85C1F';
const STEEL = '#33566A';

function useThemeColor(varName, fallback) {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback);
  }, [varName, fallback]);
  return value;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

function App() {
  const ember = useThemeColor('--ember', EMBER);
  const steel = useThemeColor('--steel', STEEL);
  const isMobile = useIsMobile();
  const { bgRef, lenisRef, trackRef } = useDiveScene();

  const scrollTo = id => e => {
    e.preventDefault();
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(`#${id}`);
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | sent | error

  const handleContactSubmit = async e => {
    e.preventDefault();
    setFormStatus('sending');
    const form = e.target;
    try {
      const res = await fetch('https://formsubmit.co/ajax/contact@gastriot.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error('failed');
      setFormStatus('sent');
      form.reset();
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <>
      <div ref={bgRef} className="vanta-fixed" />

      <nav className="nav">
        <div className="wordmark serif">
          Förster <span className="amp" style={{ color: ember }}>&amp;</span> Thomas
        </div>
        <ul>
          <li><a href="#approach" onClick={scrollTo('approach')}>Approach</a></li>
          <li><a href="#build" onClick={scrollTo('build')}>Build</a></li>
          <li><a href="#services" onClick={scrollTo('services')}>Services</a></li>
          <li><a href="#proof" onClick={scrollTo('proof')}>Proof</a></li>
        </ul>
        <a className="btn-ghost mono" href="#contact" onClick={scrollTo('contact')}>Get in touch</a>
      </nav>

      <div className="dive-track" ref={trackRef}>
      <div className="dive-stage">

      <header className="hero dive-layer" id="hero">
        <GradualBlur position="bottom" height="8rem" strength={2.5} curve="ease-out" divCount={6} zIndex={1} />
        <div className="hero-inner">
          <div className="eyebrow mono">Bespoke Hospitality Solutions — Berlin</div>
          <div className="hero-particle-text">
            <ParticleText
              text="One kitchen."
              color={steel}
              highlightColor={ember}
              fontFamily="Georgia, 'Iowan Old Style', 'Palatino Linotype', serif"
              fontWeight={700}
              fontSize="clamp(2.8rem, 8vw, 6rem)"
              particleSize={2.4}
              density={1.6}
              trigger="mount"
              glow
            />
          </div>
          <p className="lede">We build the one tool your kitchen actually needs — not the one everyone else is already selling.</p>
          <div className="btnrow">
            <SpecularButton
              size="lg"
              onClick={scrollTo('contact')}
              tint="#F6F4EF"
              tintOpacity={1}
              textColor="#1B1815"
              baseColor="#F6F4EF"
              lineColor={ember}
            >
              Book a 15-minute walkthrough
            </SpecularButton>
            <a className="btn-ghost" href="#approach" onClick={scrollTo('approach')}>See how we work</a>
          </div>
        </div>
      </header>

      <section className="thesis-band dive-layer" id="thesis">
        <div className="shell">
          <ScrollReveal
            containerClassName="thesis-reveal"
            textClassName="thesis-reveal-text"
            baseOpacity={0.15}
            baseRotation={2}
            blurStrength={3}
          >
            Every kitchen has its own pain points. We don't offer the same fix to everyone — we work the floor with you and build a handmade tool for your kitchen alone.
          </ScrollReveal>
        </div>
      </section>

      <section id="approach" className="dive-layer dive-compact">
        <div className="shell">
          <div className="label mono">Founders</div>
          <h2 className="serif">A chef and a systems architect, working the same floor.</h2>

          <div className="founders-grid">
            <div className="founder-col">
              <div className="founder-card-col">
                <ProfileCard
                  avatarUrl={avatarAntwann}
                  name="Antwann Thomas"
                  title="Chef"
                  handle="chef"
                  status="16 years, professional lines"
                  contactText="Email"
                  showUserInfo={false}
                  behindGlowColor="rgba(184, 92, 31, 0.55)"
                  innerGradient="linear-gradient(145deg,#8A441688 0%,#B85C1F44 100%)"
                  onContactClick={scrollTo('contact')}
                />
              </div>
              <div className="founder-block chef">
                <div className="role mono">Chef</div>
                <p className="bio">16 years on professional lines — opening team through a first Michelin star, most recently head chef through VENUE's second-location expansion.</p>
              </div>
            </div>
            <div className="founder-col">
              <div className="founder-card-col">
                <ProfileCard
                  avatarUrl={avatarChristopher}
                  name="Christopher Förster"
                  title="Systems"
                  handle="systems"
                  status="AI Solution Architect"
                  contactText="Email"
                  showUserInfo={false}
                  behindGlowColor="rgba(51, 86, 106, 0.55)"
                  innerGradient="linear-gradient(145deg,#1F3B4A88 0%,#33566A44 100%)"
                  onContactClick={scrollTo('contact')}
                />
              </div>
              <div className="founder-block eng">
                <div className="role mono">Systems</div>
                <p className="bio">Electrical engineer turned AI Solution Architect at Expleo Group — coding agents and production LangGraph systems for enterprise clients.</p>
              </div>
            </div>
          </div>

          <div className="proof-bar" id="proof">
            <span className="stat">
              <DepthText
                text="7TH / 130"
                faceColor={ember}
                depthColor={steel}
                fontSize="30px"
                fontWeight={700}
                layers={20}
                depth={1.3}
                tilt={4}
                perspective={500}
                orbitSpeed={0.25}
              />
            </span>
            <span className="desc">SummerUp Hackathon, Berlin 2026 — the only solo entrant to place.</span>
          </div>
        </div>
      </section>

      <section id="build" className="build-section dive-layer dive-compact">
        <div className="shell">
          <div className="label mono">What we've actually built</div>
          <h2 className="serif">Not a mockup. This runs in a Berlin kitchen right now.</h2>

          <div className="build-gallery">
            <figure className="build-shot">
              <img src={gastriotWaste} alt="Gastriot waste-logging screen, weighing a portion against its target with live variance" loading="lazy" />
              <figcaption>Waste vs. target, live.</figcaption>
            </figure>
            <figure className="build-shot">
              <img src={gastriotHome} alt="Gastriot dashboard showing today's revenue, waste, food cost and inventory value" loading="lazy" />
              <figcaption>Today's numbers.</figcaption>
            </figure>
            <figure className="build-shot">
              <img src={gastriotInventory} alt="Gastriot inventory screen with expiry alerts and par-level warnings" loading="lazy" />
              <figcaption>What's expiring, what's low.</figcaption>
            </figure>
            <figure className="build-shot">
              <img src={gastriotPos} alt="Gastriot menu screen showing each dish's price and live margin" loading="lazy" />
              <figcaption>Margin per dish.</figcaption>
            </figure>
            <figure className="build-shot">
              <img src={gastriotOrders} alt="Gastriot shopping list, auto-populated from items below par" loading="lazy" />
              <figcaption>Shopping list, self-written.</figcaption>
            </figure>
          </div>

          <div className="build-cta">
            <p>Yours might need something different — or exactly this.</p>
            <a className="btn-ghost" href="#contact" onClick={scrollTo('contact')}>See if it fits your kitchen</a>
          </div>
        </div>
      </section>

      <section id="services" className="dive-layer dive-compact">
        <div className="shell">
          <div className="engagement-grid">
            <div className="engagement-col">
              <div className="label mono">Ways to work with us</div>
              <h2 className="serif">Three shapes an engagement usually takes.</h2>

              <div className="services-swap cardswap-host">
                <CardSwap
                  width={isMobile ? 250 : 280}
                  height={isMobile ? 300 : 260}
                  cardDistance={isMobile ? 14 : 16}
                  verticalDistance={isMobile ? 14 : 18}
                  delay={4500}
                  pauseOnHover
                >
                  <Card>
                    <div className="swap-card-body">
                      <span className="tag mono">Audit</span>
                      <h3 className="serif">The Walkthrough</h3>
                      <p>A focused audit of how your kitchen actually runs — prep, ordering, waste, service flow — and a plain-language read on what's costing you the most.</p>
                      <div className="meta mono">Best for: a second opinion before you commit to anything bigger</div>
                    </div>
                  </Card>
                  <Card>
                    <div className="swap-card-body">
                      <span className="tag mono">Build</span>
                      <h3 className="serif">The Fix</h3>
                      <p>One bespoke tool, built for the specific problem the audit surfaces — not a platform, not a subscription you'll outgrow. Built with your team, not just for them.</p>
                      <div className="meta mono">Best for: one clear, expensive problem</div>
                    </div>
                  </Card>
                  <Card>
                    <div className="swap-card-body">
                      <span className="tag mono">Partner</span>
                      <h3 className="serif">The Standard</h3>
                      <p>Ongoing embedded support across locations — for groups scaling the way VENUE did, where the systems have to hold as fast as the second location opens.</p>
                      <div className="meta mono">Best for: multi-location operators mid-expansion</div>
                    </div>
                  </Card>
                </CardSwap>
              </div>
            </div>

            <div className="engagement-col">
              <div className="label mono">How we work</div>
              <h2 className="serif">No off-the-shelf software. Ever.</h2>
              <div className="howwework-swap cardswap-host">
                <CardSwap
                  width={isMobile ? 250 : 280}
                  height={isMobile ? 205 : 190}
                  cardDistance={isMobile ? 14 : 18}
                  verticalDistance={isMobile ? 18 : 22}
                  delay={4000}
                  pauseOnHover
                >
                  <Card>
                    <div className="swap-card-body step-body">
                      <span className="n mono">1</span>
                      <span className="t">We work the floor with you — a real audit of how your kitchen actually runs, not a checklist.</span>
                    </div>
                  </Card>
                  <Card>
                    <div className="swap-card-body step-body">
                      <span className="n mono">2</span>
                      <span className="t">We build the one tool that fixes what's actually broken — built for your kitchen, not sold to everyone.</span>
                    </div>
                  </Card>
                  <Card>
                    <div className="swap-card-body step-body">
                      <span className="n mono">3</span>
                      <span className="t">We stay until your team is running it without us.</span>
                    </div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </div>

          <div className="label mono" style={{ marginTop: 70 }}>Who this is for</div>
          <div className="forwho">
            <span>Independent Berlin restaurants</span>
            <span>Multi-location operators mid-expansion</span>
            <span>Boutique hotels with real kitchens</span>
            <span>Owner-chefs standardizing across sites</span>
          </div>
        </div>
      </section>

      <section className="contact-band dive-layer dive-compact" id="contact">
        <div className="shell">
          <div className="label mono" style={{ color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>Get in touch</div>
          <h2 className="serif">Tell us what's broken. We'll come look.</h2>

          {formStatus === 'sent' ? (
            <div className="contact-sent">
              <p>Got it — we'll get back to you within a day.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <input type="hidden" name="_subject" value="New inquiry — Förster & Thomas" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <div className="contact-form-row">
                <input name="name" type="text" placeholder="Your name" required />
                <input name="restaurant" type="text" placeholder="Restaurant / kitchen" required />
              </div>
              <div className="contact-form-row">
                <input name="email" type="email" placeholder="Email" required />
                <input name="phone" type="tel" placeholder="Phone (optional)" />
              </div>
              <textarea name="message" placeholder="What's costing you the most right now?" rows={3} required />
              <div className="btnrow">
                <button className="btn-solid" type="submit" disabled={formStatus === 'sending'}>
                  {formStatus === 'sending' ? 'Sending…' : 'Request a walkthrough'}
                </button>
                <a className="btn-ghost" href="#approach" onClick={scrollTo('approach')}>Back to top</a>
              </div>
              {formStatus === 'error' && (
                <p className="contact-form-error">Something went wrong — email us directly at contact@gastriot.com instead.</p>
              )}
            </form>
          )}

          <div className="contact-details">Antwann Thomas &amp; Christopher Förster &nbsp;·&nbsp; contact@gastriot.com &nbsp;·&nbsp; Berlin, DE</div>
        </div>
      </section>

      </div>
      </div>

      <footer className="legal">© 2026 Förster &amp; Thomas — Bespoke Hospitality Solutions, Berlin.</footer>
    </>
  );
}

export default App;
