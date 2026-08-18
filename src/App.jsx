import { useEffect, useState } from 'react';
import './App.css';

import Particles from './components/Particles/Particles';
import DepthText from './components/DepthText/DepthText';
import ParticleText from './components/ParticleText/ParticleText';
import ScrollReveal from './components/ScrollReveal/ScrollReveal';
import SpecularButton from './components/SpecularButton/SpecularButton';
import GradientWaves from './components/GradientWaves/GradientWaves';
import GradualBlur from './components/GradualBlur/GradualBlur';
import CardSwap, { Card } from './components/CardSwap/CardSwap';

import avatarAntwann from './assets/antwann.jpg';
import avatarChristopher from './assets/christopher.jpg';

const EMBER = '#B85C1F';
const STEEL = '#33566A';

function useThemeColor(varName, fallback) {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback);
  }, [varName, fallback]);
  return value;
}

function App() {
  const ember = useThemeColor('--ember', EMBER);
  const steel = useThemeColor('--steel', STEEL);
  const paper = useThemeColor('--paper', '#F6F4EF');

  const scrollTo = id => e => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="particles-fixed">
        <Particles
          particleCount={55}
          particleSpread={12}
          speed={0.05}
          particleColors={[ember, steel]}
          particleBaseSize={70}
          alphaParticles
          cameraDistance={22}
        />
      </div>

      <nav className="nav">
        <div className="wordmark serif">
          Förster <span className="amp" style={{ color: ember }}>&amp;</span> Thomas
        </div>
        <ul>
          <li><a href="#approach" onClick={scrollTo('approach')}>Approach</a></li>
          <li><a href="#services" onClick={scrollTo('services')}>Services</a></li>
          <li><a href="#proof" onClick={scrollTo('proof')}>Proof</a></li>
        </ul>
        <a className="btn-ghost mono" href="#contact" onClick={scrollTo('contact')}>Get in touch</a>
      </nav>

      <header className="hero">
        <div className="hero-waves">
          <GradientWaves
            horizonColor={paper}
            waveColor={steel}
            crestColor={ember}
            speed={0.4}
            amplitude={3.6}
            waveScale={1.15}
            waveRatio={0.9}
            swell={35}
            turbulence={32.5}
            tilt={0.55}
            zoom={2.4}
            height={1.8}
            fogDepth={28}
            detail="medium"
            brightness={0.85}
            opacity={0.45}
            mouseInteraction
            parallaxStrength={0.7}
            grain
            grainIntensity={0.05}
          />
        </div>
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
              tint="#1B1815"
              tintOpacity={1}
              textColor="#F6F4EF"
              baseColor="#1B1815"
              lineColor={ember}
            >
              Get in touch
            </SpecularButton>
            <a className="btn-ghost" href="#approach" onClick={scrollTo('approach')}>See how we work</a>
          </div>
        </div>
      </header>

      <section className="thesis-band">
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

      <section id="approach">
        <div className="shell">
          <div className="label mono">Founders</div>
          <h2 className="serif">A chef and a systems architect, working the same floor.</h2>
          <p className="section-sub">Sixteen years on professional lines meets AI systems built for real production use — that's the whole firm.</p>

          <div className="founders-swap cardswap-host">
            <CardSwap width={240} height={320} cardDistance={26} verticalDistance={36} delay={5000} pauseOnHover>
              <Card>
                <div className="photo-card">
                  <img src={avatarAntwann} alt="Antwann Thomas" />
                  <div className="cap">
                    <div className="n">Antwann Thomas</div>
                    <div className="r mono">Chef</div>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="photo-card">
                  <img src={avatarChristopher} alt="Christopher Förster" />
                  <div className="cap">
                    <div className="n">Christopher Förster</div>
                    <div className="r mono">Systems</div>
                  </div>
                </div>
              </Card>
            </CardSwap>
          </div>

          <div className="founders-bios">
            <div className="founder-block chef">
              <div className="role mono">Chef</div>
              <p className="bio">16 years on professional lines, from opening a Michelin kitchen to running the floor through a second-location expansion.</p>
              <ul>
                <li>Opening team, garde manger — Tuomé, New York, through their first Michelin star</li>
                <li>Multiple NYC kitchens, including Back Tap Burgers through its expansion across the US</li>
                <li>Head chef, VENUE Neukölln — led systems and operations through the opening of VENUE Steglitz</li>
              </ul>
            </div>
            <div className="founder-block eng">
              <div className="role mono">Systems</div>
              <p className="bio">Electrical engineer turned AI solution architect, building the tools kitchens don't yet know they need.</p>
              <ul>
                <li>AI Solution Architect, Expleo Group — coding agents and LangGraph-based systems for enterprise clients</li>
                <li>M.Sc. Electrical Engineering, Paderborn University — reinforcement learning for autonomous mobile robotics</li>
                <li>Computer vision &amp; systems engineering across automotive and industrial robotics before moving fully into applied AI</li>
              </ul>
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
            <span className="desc">SummerUp Hackathon, Berlin 2026 — the only solo entrant to place, in his first hackathon.</span>
          </div>
        </div>
      </section>

      <section id="services">
        <div className="shell">
          <div className="label mono">Ways to work with us</div>
          <h2 className="serif">Three shapes an engagement usually takes.</h2>
          <p className="section-sub">Every project starts the same way — with time on your floor — and settles into whichever of these actually fits what we find.</p>

          <div className="services-swap cardswap-host">
            <CardSwap width={360} height={260} cardDistance={34} verticalDistance={46} delay={4500} pauseOnHover>
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
      </section>

      <section>
        <div className="shell">
          <div className="label mono">How we work</div>
          <h2 className="serif">No off-the-shelf software. Ever.</h2>
          <div className="howwework-swap cardswap-host">
            <CardSwap width={360} height={200} cardDistance={30} verticalDistance={40} delay={4000} pauseOnHover>
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

          <div className="label mono" style={{ marginTop: 50 }}>Who this is for</div>
          <div className="forwho">
            <span>Independent Berlin restaurants</span>
            <span>Multi-location operators mid-expansion</span>
            <span>Boutique hotels with real kitchens</span>
            <span>Owner-chefs standardizing across sites</span>
          </div>
        </div>
      </section>

      <section className="contact-band" id="contact">
        <div className="shell">
          <div className="label mono" style={{ color: 'color-mix(in srgb, var(--paper) 60%, transparent)' }}>Get in touch</div>
          <h2 className="serif">Tell us what's broken. We'll come look.</h2>
          <p className="section-sub">15 minutes on your floor is enough for us to tell you honestly whether there's something worth building.</p>
          <div className="btnrow">
            <SpecularButton
              size="lg"
              baseColor="#F6F4EF"
              lineColor={ember}
              textColor="#F6F4EF"
              onClick={() => { window.location.href = 'mailto:contact@gastriot.com'; }}
            >
              Email us
            </SpecularButton>
            <a className="btn-ghost" href="#approach" onClick={scrollTo('approach')}>Back to top</a>
          </div>
          <div className="contact-details">Antwann Thomas &amp; Christopher Förster &nbsp;·&nbsp; contact@gastriot.com &nbsp;·&nbsp; Berlin, DE</div>
        </div>
      </section>

      <footer className="legal">© 2026 Förster &amp; Thomas — Bespoke Hospitality Solutions, Berlin.</footer>
    </>
  );
}

export default App;
