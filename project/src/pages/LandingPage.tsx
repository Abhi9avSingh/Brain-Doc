import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/Logo';
import { CursorGlow } from '@/components/experience/CursorGlow';
import { NeuralScene } from '@/components/experience/NeuralScene';
import { Reveal } from '@/components/experience/Reveal';
import { TiltCard } from '@/components/experience/TiltCard';
import { KnowledgeJourney } from '@/components/experience/KnowledgeJourney';
import type { Page } from '@/types';
import {
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  Database,
  FileText,
  Globe,
  Layers3,
  Link2,
  Lock,
  Menu,
  MessageSquare,
  MousePointer2,
  Network,
  Play,
  Search,
  Shield,
  Sparkles,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const workflow = [
  {
    number: '01',
    label: 'Ingest',
    title: 'Drop in anything',
    copy: 'PDFs, notes, reports, and research enter one private knowledge space.',
    icon: UploadCloud,
  },
  {
    number: '02',
    label: 'Understand',
    title: 'Meaning becomes structure',
    copy: 'BrainDoc chunks, embeds, and links every idea without losing its source.',
    icon: Layers3,
  },
  {
    number: '03',
    label: 'Connect',
    title: 'Relationships surface',
    copy: 'A living graph connects repeated themes, people, decisions, and evidence.',
    icon: Network,
  },
  {
    number: '04',
    label: 'Answer',
    title: 'Ask. Trace. Act.',
    copy: 'Get direct answers with citations you can open and verify in one click.',
    icon: MessageSquare,
  },
];

const demoQuestions = [
  {
    question: 'What changed in our Q3 growth strategy?',
    answer:
      'The strategy shifted toward enterprise expansion. Enterprise subscriptions grew 24%, while acquisition cost fell 15%. The strongest recommendation is to prioritize onboarding and retention over additional paid acquisition.',
    sources: ['Q3 Financial Report · p.12', 'Product Roadmap · p.5'],
  },
  {
    question: 'Summarize the next three product milestones.',
    answer:
      'The next milestones are real-time retrieval in October, voice interaction in November, and team workspaces in December. Voice depends on the streaming infrastructure milestone.',
    sources: ['Product Roadmap · p.7', 'API Architecture · p.4'],
  },
  {
    question: 'Where do the research notes disagree?',
    answer:
      'Two sources disagree on model selection. The architecture note favors a larger general model, while the research memo recommends a smaller domain model for lower latency and more predictable citations.',
    sources: ['Research Notes · p.9', 'API Architecture · p.11'],
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [demoLoading, setDemoLoading] = useState(false);
  const demoTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (demoTimer.current) window.clearTimeout(demoTimer.current);
  }, []);

  const runDemo = (index: number) => {
    if (demoTimer.current) window.clearTimeout(demoTimer.current);
    setSelectedQuestion(index);
    setDemoLoading(true);
    demoTimer.current = window.setTimeout(() => setDemoLoading(false), 760);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const activeFlow = workflow[activeWorkflow];
  const ActiveFlowIcon = activeFlow.icon;
  const activeDemo = demoQuestions[selectedQuestion];

  return (
    <div className="edition-site">
      <div className="edition-scroll-progress" />
      <CursorGlow />

      <nav className="edition-nav" aria-label="Primary navigation">
        <button className="edition-logo-button" onClick={() => scrollTo('top')} aria-label="BrainDoc home">
          <Logo dark />
        </button>

        <div className="edition-nav-links">
          <button onClick={() => scrollTo('journey')}>Experience</button>
          <button onClick={() => scrollTo('workflow')}>How it works</button>
          <button onClick={() => scrollTo('demo')}>Live demo</button>
        </div>

        <div className="edition-nav-actions">
          <button className="edition-text-button" onClick={() => onNavigate('login')}>Sign in</button>
          <button className="edition-nav-cta" onClick={() => onNavigate('dashboard')}>
            Enter BrainDoc
            <ArrowRight />
          </button>
        </div>

        <button
          className="edition-menu-button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {mobileMenuOpen && (
          <div className="edition-mobile-menu">
            <button onClick={() => scrollTo('journey')}>Experience</button>
            <button onClick={() => scrollTo('workflow')}>How it works</button>
            <button onClick={() => scrollTo('demo')}>Live demo</button>
            <button onClick={() => onNavigate('login')}>Sign in</button>
            <button className="edition-mobile-cta" onClick={() => onNavigate('dashboard')}>Enter BrainDoc</button>
          </div>
        )}
      </nav>

      <main id="main-content" tabIndex={-1}>
        <section id="top" className="edition-hero">
          <div className="edition-starfield" aria-hidden="true" />
          <div className="edition-hero-halo" aria-hidden="true" />

          <div className="edition-hero-grid">
            <Reveal className="edition-hero-copy">
              <div className="edition-kicker">
                <span className="edition-kicker-dot" />
                Personal intelligence, reimagined
                <span className="edition-release">Preview 01</span>
              </div>
              <h1>
                Turn every file into a
                <span> living universe.</span>
              </h1>
              <p>
                BrainDoc transforms scattered documents into an interactive knowledge world—searchable,
                connected, and ready to answer with evidence.
              </p>
              <div className="edition-hero-actions">
                <button className="edition-primary-action" onClick={() => onNavigate('dashboard')}>
                  Build your second brain
                  <ArrowRight />
                </button>
                <button className="edition-play-action" onClick={() => scrollTo('demo')}>
                  <span><Play /></span>
                  Explore the demo
                </button>
              </div>
              <div className="edition-trust-row">
                <span><Check /> Source-cited answers</span>
                <span><Check /> Private by design</span>
                <span><Check /> No credit card</span>
              </div>
            </Reveal>

            <Reveal className="edition-hero-stage" delay={140}>
              <div className="edition-stage-frame">
                <div className="edition-stage-index">BD / KNOWLEDGE CORE</div>
                <NeuralScene />
                <div className="edition-stage-footer">
                  <span>Move your cursor</span>
                  <MousePointer2 />
                  <span>to explore</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="edition-marquee" aria-label="BrainDoc capabilities">
            <div>
              <span>UPLOAD</span><i>✦</i><span>UNDERSTAND</span><i>✦</i><span>CONNECT</span><i>✦</i><span>ASK</span><i>✦</i><span>VERIFY</span><i>✦</i>
              <span>UPLOAD</span><i>✦</i><span>UNDERSTAND</span><i>✦</i><span>CONNECT</span><i>✦</i><span>ASK</span><i>✦</i><span>VERIFY</span><i>✦</i>
            </div>
          </div>
        </section>

        <KnowledgeJourney />

        <section className="edition-manifesto">
          <div className="edition-shell">
            <Reveal className="edition-section-meta">
              <span>01</span>
              <p>The knowledge shift</p>
            </Reveal>
            <Reveal>
              <h2>Stop searching folders.<br />Start exploring connections.</h2>
            </Reveal>
            <div className="edition-manifesto-grid">
              <Reveal className="edition-manifesto-copy">
                <p>
                  Traditional storage remembers <em>where</em> a file lives. BrainDoc remembers what it means,
                  what it relates to, and why it matters now.
                </p>
                <button onClick={() => onNavigate('documents')}>
                  See the document experience <ArrowRight />
                </button>
              </Reveal>

              <Reveal className="edition-stack-scene" delay={120}>
                <div className="edition-stack-card stack-card-one">
                  <FileText />
                  <span>Research notes</span>
                  <small>28 connected ideas</small>
                </div>
                <div className="edition-stack-card stack-card-two">
                  <Link2 />
                  <span>Product roadmap</span>
                  <small>11 shared themes</small>
                </div>
                <div className="edition-stack-card stack-card-three">
                  <Brain />
                  <span>New insight</span>
                  <small>Evidence linked</small>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="features" className="edition-features">
          <div className="edition-shell">
            <Reveal className="edition-section-heading">
              <div>
                <span className="edition-overline">02 / The experience</span>
                <h2>Knowledge you can<br />see, touch, and trust.</h2>
              </div>
              <p>
                A spatial interface makes complex knowledge feel simple. Every interaction has depth,
                but every answer stays grounded.
              </p>
            </Reveal>

            <div className="edition-feature-grid">
              <Reveal className="edition-feature-large">
                <TiltCard className="edition-feature-card feature-card-graph" intensity={4} depth={34}>
                  <div className="edition-feature-topline">
                    <span>Semantic graph</span>
                    <Network />
                  </div>
                  <div className="edition-feature-graph">
                    <NeuralScene compact showLabels={false} />
                    <div className="graph-callout graph-callout-a">Q3 growth</div>
                    <div className="graph-callout graph-callout-b">Retention</div>
                    <div className="graph-callout graph-callout-c">Roadmap</div>
                  </div>
                  <div className="edition-feature-copy">
                    <span>01</span>
                    <div>
                      <h3>See how ideas connect.</h3>
                      <p>Explore related concepts across every document, note, and conversation.</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>

              <Reveal delay={80}>
                <TiltCard className="edition-feature-card feature-card-search" intensity={6}>
                  <div className="edition-feature-topline">
                    <span>Meaning-first search</span>
                    <Search />
                  </div>
                  <div className="search-depth-scene" aria-hidden="true">
                    <div className="search-layer search-layer-back">Customer momentum</div>
                    <div className="search-layer search-layer-mid">Enterprise growth</div>
                    <div className="search-layer search-layer-front">
                      <Search />
                      <span>Why did revenue grow?</span>
                    </div>
                  </div>
                  <div className="edition-feature-copy">
                    <span>02</span>
                    <div>
                      <h3>Search by thought.</h3>
                      <p>Find the right passage even when you cannot remember the exact words.</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>

              <Reveal delay={120}>
                <TiltCard className="edition-feature-card feature-card-citations" intensity={6}>
                  <div className="edition-feature-topline">
                    <span>Verifiable answers</span>
                    <Shield />
                  </div>
                  <div className="citation-scene">
                    <div className="citation-answer">Revenue increased <strong>18.4%</strong>, led by enterprise plans.</div>
                    <div className="citation-source"><FileText /> Q3 Financial Report <span>p.12</span></div>
                    <div className="citation-source"><Database /> Forecast Model <span>row 84</span></div>
                  </div>
                  <div className="edition-feature-copy">
                    <span>03</span>
                    <div>
                      <h3>Trust, then verify.</h3>
                      <p>Every important claim points back to the source that supports it.</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>

              <Reveal className="edition-feature-wide" delay={160}>
                <TiltCard className="edition-feature-card feature-card-integrations" intensity={4}>
                  <div className="edition-feature-topline">
                    <span>One connected memory</span>
                    <Globe />
                  </div>
                  <div className="integration-orbit" aria-hidden="true">
                    <div className="integration-center"><Brain /></div>
                    <div className="integration-ring integration-ring-one" />
                    <div className="integration-ring integration-ring-two" />
                    <div className="integration-node integration-node-a">G</div>
                    <div className="integration-node integration-node-b">N</div>
                    <div className="integration-node integration-node-c">S</div>
                    <div className="integration-node integration-node-d">W</div>
                  </div>
                  <div className="edition-feature-copy">
                    <span>04</span>
                    <div>
                      <h3>Bring every source into orbit.</h3>
                      <p>Connect Drive, Gmail, Notion, Slack, and the web without changing how you work.</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="workflow" className="edition-workflow">
          <div className="edition-shell">
            <Reveal className="edition-section-heading edition-heading-light">
              <div>
                <span className="edition-overline">03 / From file to insight</span>
                <h2>One clean flow.<br />Four powerful layers.</h2>
              </div>
              <p>Choose a stage to rotate through the BrainDoc pipeline.</p>
            </Reveal>

            <div className="edition-workflow-grid">
              <div className="edition-workflow-tabs" role="tablist" aria-label="BrainDoc workflow">
                {workflow.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.number}
                      className={activeWorkflow === index ? 'is-active' : ''}
                      onClick={() => setActiveWorkflow(index)}
                      role="tab"
                      aria-selected={activeWorkflow === index}
                    >
                      <span>{item.number}</span>
                      <Icon />
                      <div>
                        <strong>{item.label}</strong>
                        <small>{item.title}</small>
                      </div>
                      <ChevronRight />
                    </button>
                  );
                })}
              </div>

              <div className={`edition-flow-stage flow-stage-${activeWorkflow}`}>
                <div className="flow-stage-grid" aria-hidden="true" />
                <div className="flow-orbit flow-orbit-one" aria-hidden="true" />
                <div className="flow-orbit flow-orbit-two" aria-hidden="true" />
                <div className="flow-object flow-object-back">
                  <span>{workflow[(activeWorkflow + 3) % workflow.length].label}</span>
                </div>
                <div className="flow-object flow-object-mid">
                  <span>{workflow[(activeWorkflow + 1) % workflow.length].label}</span>
                </div>
                <div className="flow-object flow-object-front" key={activeWorkflow}>
                  <div className="flow-object-icon"><ActiveFlowIcon /></div>
                  <span>{activeFlow.number} / {activeFlow.label}</span>
                  <h3>{activeFlow.title}</h3>
                  <p>{activeFlow.copy}</p>
                  <div className="flow-object-status"><i /> System ready</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="edition-demo">
          <div className="edition-shell">
            <Reveal className="edition-demo-heading">
              <span className="edition-overline">04 / Try the intelligence</span>
              <h2>Ask the hard question.</h2>
              <p>The answer arrives with its reasoning trail attached.</p>
            </Reveal>

            <Reveal className="edition-demo-console" delay={100}>
              <div className="demo-console-bar">
                <div><i /><i /><i /></div>
                <span>braindoc / grounded-answer</span>
                <small>LIVE PROTOTYPE</small>
              </div>
              <div className="demo-console-body">
                <div className="demo-prompts">
                  <span>Suggested questions</span>
                  {demoQuestions.map((item, index) => (
                    <button
                      key={item.question}
                      className={selectedQuestion === index ? 'is-active' : ''}
                      onClick={() => runDemo(index)}
                    >
                      <span>0{index + 1}</span>
                      {item.question}
                      <ArrowRight />
                    </button>
                  ))}
                  <button className="demo-open-chat" onClick={() => onNavigate('chat')}>
                    Open full AI chat <ArrowRight />
                  </button>
                </div>

                <div className="demo-answer-panel">
                  <div className="demo-user-query">
                    <span>YOU</span>
                    <p>{activeDemo.question}</p>
                  </div>
                  <div className="demo-ai-answer">
                    <div className="demo-ai-label">
                      <span><Brain /></span>
                      <strong>BRAINDOC</strong>
                      {demoLoading ? <small>retrieving context…</small> : <small>answer grounded</small>}
                    </div>
                    {demoLoading ? (
                      <div className="demo-loading" aria-label="BrainDoc is searching">
                        <span /><span /><span />
                      </div>
                    ) : (
                      <div className="demo-answer-content" key={selectedQuestion}>
                        <p>{activeDemo.answer}</p>
                        <div className="demo-sources">
                          {activeDemo.sources.map((source) => (
                            <button key={source}><FileText /> {source}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="edition-security">
          <div className="edition-shell edition-security-grid">
            <Reveal className="edition-security-copy">
              <span className="edition-overline">Private intelligence</span>
              <h2>Your memory.<br />Your boundaries.</h2>
              <p>
                BrainDoc is designed around explicit access, encrypted storage, and source-level control.
                Your private knowledge is never treated like public data.
              </p>
              <div className="edition-security-points">
                <span><Lock /> Encrypted at rest and in transit</span>
                <span><Shield /> Source-level permissions</span>
                <span><Database /> Delete and export controls</span>
              </div>
            </Reveal>
            <Reveal className="edition-vault" delay={120}>
              <div className="vault-ring vault-ring-one" />
              <div className="vault-ring vault-ring-two" />
              <div className="vault-ring vault-ring-three" />
              <div className="vault-core"><Lock /></div>
              <div className="vault-label">PRIVATE INDEX / LOCKED</div>
            </Reveal>
          </div>
        </section>

        <section className="edition-final">
          <div className="edition-final-noise" aria-hidden="true" />
          <div className="edition-shell">
            <Reveal>
              <span className="edition-overline">Your next layer of intelligence</span>
              <h2>Make your knowledge<br />feel alive.</h2>
              <div className="edition-final-actions">
                <button onClick={() => onNavigate('dashboard')}>
                  Start building free <ArrowRight />
                </button>
                <button onClick={() => onNavigate('login')}>Sign in</button>
              </div>
            </Reveal>
            <div className="edition-final-orb" aria-hidden="true"><Sparkles /></div>
          </div>
        </section>
      </main>

      <footer className="edition-footer">
        <div className="edition-shell">
          <Logo dark />
          <p>Personal knowledge, made explorable.</p>
          <div>
            <button onClick={() => scrollTo('journey')}>Experience</button>
            <button onClick={() => scrollTo('workflow')}>Workflow</button>
            <button onClick={() => scrollTo('demo')}>Demo</button>
          </div>
          <span>© 2026 BrainDoc · MIT License</span>
        </div>
      </footer>
    </div>
  );
}
