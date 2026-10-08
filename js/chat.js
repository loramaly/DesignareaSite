
/* Scripted chat - answers pre-written, keyword+variation matching, warm fallback */
const AVATAR='assets/images/avatar.webp';
const KB = [
  {
    chip:"What's your AI work?",
    hidden:true,
    keys:['ai','artificial','ml','machine','decision support'],
    text:'My AI work focuses on decision support and Human-in-the-Loop architectures in complex enterprise environments. At Partner, I designed AI Call Summary - an agent that condenses customer calls into summaries reps and managers use daily, always linked back to the source. I also redesigned technician field dispatch from tables to a live map with prioritization - assignment went from ~8 to ~4 minutes, and it\'s in daily use. On top of it I designed an agentic layer as a concept, where multi-agent workflows evaluate real-time variables - traffic patterns, weather constraints, technician schedules, admin priorities - to generate route recommendations. My focus was the UX logic: managing latency, building user trust, handling edge cases, and keeping the dispatcher in control. Beyond product features, I use AI daily in my design process - Claude and ChatGPT for research and synthetic user testing, Midjourney and Runway for quick conceptual assets, and rapid prototyping tools. I\'m always transparent about what is live in production versus conceptual exploration.',
    tags:['Assignment ~8 to ~4 min','Agentic layer - concept']
  },
  {
    chip:'How do you design AI agents?',
    keys:['agent','agents','ai agents','agentic','autonomous','trust','confidence','loop','hitl','control'],
    text:'I approach agentic design through four core principles. \n\n**Control & Boundaries:** the agent automates complex logic, but the human retains decision authority - especially for high-stakes or irreversible actions.\n\n**Explainability & Trust:** instead of a black box, the system clearly presents its reasoning - why a specific decision or route was generated, based on real-time constraints like weather, traffic or user preferences.\n\n**Latency & Uncertainty:** clear visual feedback for processing times, with confidence indicators so users know when a suggestion needs quick verification.\n\n**Graceful Override:** a great agent UX makes it seamless to adjust, tweak or completely override suggestions without breaking the workflow.',
    tags:['Human-in-the-loop by default','Concept work - clearly labeled']
  },
  {
    chip:'What do people say about you?',
    chipShort:'What do people say?',
    keys:['people say','colleagues','managers','references','recommend','testimonial','feedback about','\u05d4\u05de\u05dc\u05e6\u05d5\u05ea','\u05de\u05de\u05dc\u05d9\u05e6\u05d9\u05dd','\u05e7\u05d5\u05dc\u05d2\u05d5\u05ea'],
    text:'Here is what colleagues and clients wrote about working with me on LinkedIn.',
    people:[
      {name:'Ronen Chen', role:'CEO \u00b7 DoubleRo (ElephantStock)', img:'assets/images/ronen.jpeg',
       quote:'I had the pleasure of working with Larisa and she\u2019s easily one of the best designers I\u2019ve worked with. Larisa is the full package, she nails everything from UX and branding to high level creative direction. What always impressed me most was her pace: she is super fast and somehow always delivers top notch work even on crazy deadlines. Any team would be super lucky to have her. I\u2019d jump at the chance to work with her again!'},
      {name:'Stas Birman', role:'IT SOA/EAI Development Team Leader at Partner Israel', img:'assets/images/stanislav.jpeg',
       quote:'She has a rare talent for bridging design and complex architecture. She asks the right questions, understands system constraints, and builds systems that are intuitive for users and streamlined for developers.'},
      {name:'Michael Chachashvili', role:'Founder @ Shopping Ads Solutions & Customer acquisition specialist', img:'assets/images/Michael.jpeg',
       quote:'An exceptional Product Design Lead. She brings deep systemic thinking, solves heavy B2B data challenges, and leads product strategy with incredible professionalism and dedication.'}
    ],
    outro:'Full references and contacts are available on request - write me and I\u2019ll connect you.',
    tags:['References on request']
  },
  {
    chip:'What is your methodology?',
    hidden:true,
    keys:['methodology','process','method','approach','production-ready','production ready','dev-ready','how do you work','workflow','design process','research','ux','user experience','ux design','\u05de\u05ea\u05d5\u05d3\u05d5\u05dc\u05d5\u05d2\u05d9\u05d4','\u05ea\u05d4\u05dc\u05d9\u05da','\u05e2\u05d9\u05e6\u05d5\u05d1'],
    text:'My methodology is built for complex, data-heavy systems where clarity and precision are non-negotiable. \n\n**Domain & Data Alignment:** I start by mapping the business logic, backend constraints and data flows with tech leads and product managers, so feasibility is checked early.\n\n**OOUX & Information Architecture:** I use Object-Oriented UX to structure complex entities and workflows into clear, scalable mental models.\n\n**Validation & Iteration:** I test assumptions with real user feedback, analytics and AI-assisted research before finalizing pixels.\n\n**Systemic & Dev-Ready Design:** production-ready interfaces on advanced Figma architecture - tokens, variables, clear state management - for a seamless handoff.',
    more:'Day to day it looks like this:\n\n**Brief & Scope:** I take a high-level brief, define success metrics with Product, evaluate scope with management and set the timeline - operating with high autonomy and regular check-ins.\n\n**Alignment:** I partner with PMs, system architects and tech leads to analyze requirements and constraints; depending on the feature I present to focused teams or run workshops with up to 30 cross-department stakeholders.\n\n**Research & Design:** I interview users and observe real workflows, then move from low-fidelity sketches to high-fidelity through our design system.\n\n**Build & Rollout:** I hand off full specs, run UX/UI QA during the build, and before rollout we pilot with select teams in a dedicated war room - frontend, backend and product together - until production is smooth.',
    tags:['Research \u2192 OOUX \u2192 HITL patterns']
  },
  {
    chip:'What shipped at Partner?',
    chipShort:'Your work at Partner?',
    keys:['partner','ship','telecom','crm','erp','electric','launch','built at','\u05e4\u05e8\u05d8\u05e0\u05e8'],
    text:'Cross-Functional Design Lead: Sole design lead on every new project across the full IT organization - designing the products for Communications, ERP, DevOps, Engineering, Fintech and CRM. Between 2022 and 2026, I built a company-wide design system adopted across products, shipped the Partner Electric platform in a record 2 months, and shipped AI Call Summary - an AI feature reps and managers use daily. For field teams I redesigned fiber technician dispatch into a live map - assignment from ~8 to ~4 minutes, in daily use - and designed and demoed an agentic layer on top as a concept. On the sales side, I redesigned the bundled cellular order flow - average handling time went from 9 minutes to 1.5.',
    more:'The main pillars in more detail:\n\n**Fiber Dispatch & AI Decision Support:** technician dispatch redesigned from tables to a live map with prioritization - the assignment loop dropped from ~8 to ~4 minutes, estimated with ops, and it\'s in daily use. On top of it, an agentic decision-support layer designed and demoed as a concept, integrating real-time inputs (traffic, weather, technician availability) with Human-in-the-Loop UX.\n\n**Core CRM & Sales Platform:** Partner\'s operational backbone with role- and department-based views - serving a subscriber base that covers roughly a third of Israel. Includes the bundled cellular order redesign: 9 minutes down to 1.5 per order.\n\n**B2B Provisioning & Billing:** complex telecom projects - nested orders, engineering, automation - dense specs turned into simple quotes. Throughput up ~30%; billing leakage closed from ~10% to zero.\n\n**Partner Electric:** end-to-end design for Partner\'s entry into the electricity market - concept to live production in 2 months, with full regulatory and billing compliance.\n\n**Unified Design System:** tokens and component libraries adopted across internal and customer-facing products, dramatically accelerating design-to-dev handoffs.\n\n**Operational Portals:** dense administrative tools for call centers and operations, turned from legacy screens into modern, task-focused workflows.',
    tags:['Launched in 2 months','Order time: 9 min to 1.5','Design system adopted across products']
  },
  {
    chip:'Have you led a team?',
    keys:['lead','team','manage','management','mentor','head','hire','grew','leadership','\u05e6\u05d5\u05d5\u05ea','\u05e0\u05d9\u05d4\u05d5\u05dc'],
    text:'Yes.\n\n**Building at ElephantStock:** At ElephantStock I was Head of UX/UI & Creative - I built and led the design team from scratch while the company grew from 30 to 200+ employees, contributing to 3x revenue growth and our Top 10 selection for Google\'s E-commerce Growth Lab.\n\n**Right now:** At the Lead level, I drive impact less through direct management and more through systemic UX standards, design systems, and close partnership with dev and product leads.',
    more:'What building that team actually involved:\n\n**Hiring & Mentoring:** recruiting, structuring and mentoring designers and a video creator, plus managing external freelancers to scale when needed.\n\n**Standards:** setting a high bar for UI/UX quality, design-system adoption and design-to-dev handoff.\n\n**Business Alignment:** working directly with executive leadership, PMs and engineering leads to tie design to business KPIs.\n\n**Scaling:** building workflows that let the team scale smoothly alongside 30-to-200+ growth.',
    tags:['3x revenue growth','Team built from zero']
  },
  {
    chip:'Have you built a design system?',
    chipShort:'Design systems?',
    keys:['design system','design systems','tokens','variables','dark mode','light mode','color modes','theming','themes','component library','ui language','atomic','\u05d3\u05d9\u05d6\u05d9\u05d9\u05df\u0020\u05e1\u05d9\u05e1\u05d8\u05dd','\u05de\u05e2\u05e8\u05db\u05ea\u0020\u05e2\u05d9\u05e6\u05d5\u05d1'],
    text:'Yes. At Partner I built and scaled a unified design system adopted across CRM, ERP and Fintech products, which significantly streamlined design-to-dev handoffs. I structure systems with Atomic Design principles and Figma variables - raw primitives mapped to semantic tokens, then production-ready components. This exact architecture powers both Partner\'s ecosystem and this portfolio site.',
    tags:['Adopted across products','Shorter design-to-dev cycles']
  },
  {
    chip:'How do you measure success?',
    hidden:true,
    keys:['measure','success','metrics','kpi','impact','results','data','analytics','numbers'],
    text:'By concrete impact on business goals and user efficiency. In B2C and e-commerce, success is conversion rates, A/B testing and revenue growth. In enterprise SaaS it\'s operational: cutting handling time (9 minutes down to 1.5 per cellular order at Partner; technician assignment from ~8 to ~4 minutes), closing billing leakage, reducing manual errors, and streamlining complex daily workflows for operations teams.',
    more:'The metric sets I track, by world:\n\n**Enterprise operations:** task-efficiency (reduction in handling time and friction), error reduction and trust (how often recommendations are accepted without manual overrides), and system adoption across call centers and field teams.\n\n**E-commerce:** conversion and revenue validated through strict A/B testing across a 200K+ SKU catalog, plus funnel optimization - drop-off points, engagement, checkout completion.',
    tags:['A/B tested conversion lifts','Order time: 9 min to 1.5']
  },
  {
    chip:'How do you use AI day to day?',
    hidden:true,
    keys:['use ai','daily','tools','tool','figma','stack','software','photoshop','illustrator','chatgpt','claude','midjourney','workflow ai','prototype','prototypes','high-fidelity prototypes','high fidelity prototypes','framer','copilot','claude design','lovable','\u05e4\u05d9\u05d2\u05de\u05d4','\u05db\u05dc\u05d9\u05dd'],
    text:'I use AI as a core operational layer in my daily workflow.\n\n**Research, strategy and logic:** Claude, ChatGPT and Copilot to analyze dense requirements, map edge cases, synthesize research and stress-test information architecture before touching pixels.\n\n**Rapid prototyping:** Claude Code, Claude Design, Framer and Lovable to build functional, interactive prototypes early.\n\n**Visual exploration and motion:** Midjourney, Runway and Kling for conceptual assets, alongside Lottie for lightweight UI micro-animations.\n\nAI drastically accelerates my discovery and execution - but every architectural, UX and strategic decision remains human-led.',
    tags:['This site is the demo']
  },
  {
    chip:'What are you looking for?',
    hidden:true,
    keys:['looking for','next role','company','what role','job','position','seeking','\u05de\u05d7\u05e4\u05e9\u05ea','\u05de\u05e9\u05e8\u05d4'],
    text:'**The role:** I\'m looking for my next challenge as a Senior or Lead Product Designer - a role where I can build complex, meaningful products I believe in.\n\n**The team:** I want a collaborative, strong team that values product vision, holds onto its why, and ships with impact - while keeping a healthy work-life balance.\n\n**The domain:** I thrive on deep systems and AI-driven platforms, with leading Israeli companies or global teams.\n\nWhat\'s the product you\'re hiring for?',
    tags:['Senior / Lead \u00b7 AI focus']
  },
  {
    chip:'How can I reach you?',
    hidden:true,
    keys:['contact','email','hire','available','start','remote','salary','location','reach','\u05e7\u05e9\u05e8','\u05d8\u05dc\u05e4\u05d5\u05df','\u05de\u05d9\u05d9\u05dc','\u05e9\u05db\u05e8'],
    text:'The fastest way to reach me is email at larisamalyd@gmail.com, or phone / WhatsApp at +972-50-6763066. I\'m based in Israel and typically respond very quickly.',
    tags:['larisamalyd@gmail.com']
  },
  {
    chip:null,
    keys:['failure','fail','failed','tell me about a failure','what didn\'t work','a project that failed','have you ever failed','biggest challenge','something you couldn\'t ship','a project that never launched','hardest constraint you faced','how do you handle regulation','a project you gave up on'],
    text:'At Partner, fixed-line services, internet, and TV already come together in a single order. Cellular, however, lives in a separate world - plans, devices, accessories, and equipment, each with its own flow. That\'s how the industry has always worked, and no carrier in Israel has successfully unified both worlds into a single order.\n\nWe saw an opportunity hidden in this friction. Customers ready to buy everything still had to complete two separate journeys - exactly the kind of moment where sales are lost. Our vision was simple: one order, both worlds.\n\nUnfortunately, the project never launched. The blocker wasn\'t the user experience - it was the combination of architectural limitations, legacy systems, and regulatory constraints. The vision was sound, but the technology ecosystem wasn\'t ready to support it.\n\nWe\'re still hopeful that as technology evolves, the opportunity will return - and when it does, this vision will finally become possible.',
    tags:[]
  },
  {
    chip:null,
    keys:['real','really','fake','prove','actually','buzzword','believe','honest'],
    text:'I completely understand the skepticism - there\'s a lot of hype around AI design that is often just surface-level decoration.\n\n**Here\'s how I maintain transparency:** live production products are explicitly marked as shipped, while speculative work is clearly labeled as a concept; operational estimates are stated as estimates, not absolute facts; and every process, OOUX architecture and AI-assisted workflow I present is grounded in real execution.\n\nIf you\'d like to dive into any case, metric or prototype - I\'m happy to walk you through the exact process.',
    tags:['Shipped marked shipped \u00b7 concepts marked concept']
  },
  {
    chip:null,
    keys:['why hire','why you','better than','special','stand out','why should','hire you','should i hire'],
    text:'That\'s the right question to ask - you\'re evaluating strong talent.\n\n**What I bring is a specific, battle-tested combination:** 13+ years in complex systems - enterprise SaaS, OOUX, CRM, ERP and dense data-heavy architectures; a rich background in branding, graphic design and marketing strategy, which lets me align product experience and brand identity into one high-end narrative; real UI craft - I care how a product looks and feels, not only how it works; proven team leadership - building, mentoring and scaling a design team through hyper-growth; and practical AI execution - integrating AI as a functional, trustworthy layer in real products rather than decorative hype.\n\nIf you need a lead who solves deep systems while elevating the brand - let\'s talk.',
    tags:['larisamalyd@gmail.com']
  },
  {
    chip:null,
    keys:['generic','boring','not impressed','seen this','nothing special','unimpressive'],
    text:'Fair - and honestly, useful feedback. Portfolios naturally flatten real-world complexity: the tight constraints, system trade-offs, edge cases and high-stakes decisions behind every screen. Pick any project here and ask me the hardest technical or UX question you have about it - that\'s where the true depth lives. And if something specific felt generic, I\'d genuinely love to hear it: larisamalyd@gmail.com.',
    tags:['Ask me the hardest question']
  },
  {
    chip:null,
    keys:['replace','obsolete','ai will','no need designers','replace designers','end of design'],
    text:'Honestly? It will replace generic layout generation and designers who only push pixels.\n\n**Where the real challenge shifts:** As AI produces interface components faster than ever, the real challenge shifts to systemic architecture, information architecture, human psychology, edge-case management and strategic alignment.\n\n**What still requires human judgment:** AI is an extraordinary accelerator for execution and visual exploration - but defining the why, creating intuitive OOUX structures, and earning trust in complex enterprise workflows still requires deep human judgment.\n\nDesigners who master AI won\'t be replaced; they\'ll lead.',
    tags:['Designing the judgment layer']
  },
  {
    chip:null,
    keys:['hi','hello','hey','good morning','good evening','shalom'],
    text:'Hi! Good to have you here :) Feel free to ask me anything about my experience, my products, or my AI workflows - or start with one of the questions below.',
    tags:[]
  },
  {
    chip:null,
    keys:['thanks','thank you','thx','thank'],
    text:'My pleasure! Anything else you\u2019re curious about? :)',
    tags:[]
  },
  {
    chip:null,
    keys:['nice site','cool site','great site','love this','awesome','beautiful','impressive'],
    text:'Thank you - that genuinely made my day \ud83d\udc9c It was fun to build. Anything you\u2019d like to ask?',
    tags:[]
  },
  {
    chip:null,
    keys:['who are you','what is this','this chat','how was this site','built this site','are you a bot','are you ai','chatbot','who made'],
    text:'I\u2019m Lora - well, the scripted version of me. I designed this site in Figma on a full design system and built it iteratively with AI tools as a working partner. Every answer here was written by me in advance; no live AI behind it. A fair sample of how I work: structure first, then craft.',
    tags:['Written in advance \u00b7 no live AI']
  },
  {
    chip:null,
    keys:['how are you','how r u','whats up',"what's up",'how is it going'],
    text:'Doing great - my portfolio just launched and someone\u2019s actually talking to it. How are you? :)',
    tags:[]
  },
  {
    chip:null,
    keys:['cv','resume','download resume','your cv','see your resume','\u05e7\u05d5\u05e8\u05d5\u05ea\u0020\u05d7\u05d9\u05d9\u05dd','\u05e8\u05d6\u05d5\u05de\u05d4'],
    text:'Of course - the Resume tab up top has the full story, with a PDF download inside. The short version: 13+ years, complex systems, AI-driven design.',
    tags:[]
  },
  {
    chip:null,
    keys:['position','role','opportunity','job offer','recruiter','we are looking','open role','vacancy','hiring for'],
    text:'That\u2019s exactly why I\u2019m here. Tell me about the role at larisamalyd@gmail.com or 050-6763066 - and I\u2019ll answer honestly whether I\u2019m the right fit. I respond quickly.',
    tags:['larisamalyd@gmail.com \u00b7 050-6763066']
  },
  {
    chip:null,
    keys:['larisa or lora','lora or larisa','why lora','real name','your name'],
    text:'Good eye. Larisa is the official version, Lora is what friends call me - and if you\u2019re here asking questions, you\u2019re leaning Lora already.',
    tags:[]
  },
  {
    chip:null,
    keys:['sudo'],
    text:'Permission granted. \u2714 Deploying: larisamalyd@gmail.com',
    tags:[]
  },
  {
    chip:null,
    keys:['ui','visual design','interface design','visual','craft','pixel','ui craft','visual craft','ui craftsmanship','craftsmanship','attention to detail','small details','design details','detail oriented','typography','fonts','composition','hierarchy','visual hierarchy','layout','spacing','color','colors','visual rhythm','iconography','icons','grid','polished','polish','high-fidelity','high fidelity','perceived quality','pixel perfect','look and feel','aesthetics','ui designer','senior ui designer','ui focus','premium','look premium','interface','good interface','grids','font','with fonts','typefaces','mockups','visual skills','visual designer'],
    text:'UI craft is what I do best. I design interfaces with intention. Every spacing, weight and color is a decision. The small details are where a product starts to feel premium - and that\'s where I invest my time.',
    tags:[]
  },
  {
    chip:null,
    keys:['design qa','ui qa','ux qa','qa','implementation','check the implementation','developers','with developers','build it right','after handoff','quality assurance','design review','implementation review','after release','build review'],
    text:'I stay with my design through development. I review the real build in the browser, compare it with the design down to spacing, type and states, and close the gaps together with the developers. After release I keep improving it in rounds, based on feedback and findings from real use.',
    tags:[]
  },
  {
    chip:null,
    keys:['detailed states','states','error message','error messages','loading','empty and error','ui states','component states','interaction states','hover','focus state','pressed','loading state','loading states','error state','error states','success state','disabled','disabled state'],
    text:'I design every state of a component, so the interface is clear at each moment.\n\n**Hover, focus and pressed** show what is interactive and that the click registered.\n**Loading** keeps the layout stable and shows progress.\n**Error** says what happened and how to fix it.\n**Success** confirms the action.\n**Disabled** stays readable and explains why.\n**Empty** guides the next step.',
    tags:[]
  },
  {
    chip:null,
    keys:['visual direction','direction','design style','your style','style','taste','own look','look and identity','art direction','creative direction','branding','brand','brand identity','visual identity','visual language','imagery'],
    text:'I set the visual direction of a product: color, typography, imagery, and the idea that ties them together. As Head of UX/UI & Creative at ElephantStock I led branding and creative strategy and guided the visual and UX direction across product, front-end and art teams, so the brand felt like one experience everywhere. My background in graphic design and advertising is the base for this.',
    tags:[]
  },
  {
    chip:'Are you more UI or UX?',
    chipShort:'More UI or UX?',
    keys:['ui or ux','ux or ui','ui or','or ux','ui better','ux better','than your ux','than your ui','better at ui','better at ux','kind of designer','type of designer','what designer','ux designer','ux balance','ui balance','visual or','ui or a ux','ux or a ui','ux vs ui','ui vs ux','ui/ux balance','ui ux balance','ux/ui balance','more ui','more ux','ux and ui','ui and ux','both ux and ui','both ui and ux','main strength','strongest skill','strength','stronger','generalist','specialist','end-to-end','end to end','visual or product','ux or visual'],
    text:'UI or UX? Both, fifty-fifty, and that is my strength.\n\nUX is how I think. UI is my big love. I do them together, so the product works well and looks great.',
    more:'UX is where I start: the user, the flow and the logic of the system. I bring order to complex products with many roles, rules and data, so people reach their goal fast and with confidence.\n\nUI is where I bring the craft. Every spacing, weight and color is a decision, and each product gets its own visual idea. The small details make it feel premium.\n\nIf I have to choose one, UI craft is where I stand out. And my UI is strong because the UX under it is solid.',
    tags:[]
  },
  {
    chip:null,
    keys:['choose one','had to choose','have to choose','pick one','if you had to','only one'],
    text:'UI craft is where I stand out. And my UI is strong because the UX under it is solid.',
    tags:[]
  },
  {
    chip:null,
    keys:['good ux','ux mean','ux means','what is ux','great ux','ux to you'],
    text:'The user reaches the goal fast, with confidence, in a complex system too.',
    tags:[]
  },
  {
    chip:null,
    /* 'ui','ui craft','craft' repeat the UI craft entry's keys on purpose:
       a plain "ui craft" ties and the main answer (listed first) wins; only
       the "mean to you" phrasing adds the extra point that lands here */
    keys:['ui','ui craft','craft','craft mean','craft means','ui craft mean','ui craft means','what is ui craft','craft to you'],
    text:'Every spacing, weight and color is a decision. The small details make a product feel premium.',
    tags:[]
  },
  {
    chip:null,
    keys:['start with','do you start','which one do you start','where do you start','start first','ux first','ui first','which first','begin with'],
    text:'Always UX: the problem, the flow, the structure. Then UI gives it clarity and character.',
    tags:[]
  },
  {
    chip:null,
    keys:['strengths','your strengths','best at','you best at','superpower','super power','what makes you different','makes you different','biggest strength'],
    text:'I make complex products clear and beautiful. I think in UX and I craft in UI, so one person takes a product from logic to the last pixel. I work fast, I stay calm under pressure, and I follow my design all the way into the build.',
    tags:[],
    link:{href:'#works',label:'See my work'}
  },
  {
    chip:null,
    keys:['weaknesses','weakness','your weakness','areas to improve','area to improve','improve in yourself','what is hard for you','hard for you','biggest weakness'],
    text:'I take a lot of responsibility for the result. In every role I held, a lot rested on me, so I got used to carrying everything myself and checking that it all went well. Today I work differently: I bring people in early, agree on clear checkpoints, and trust the team between them. The result is better and faster.',
    tags:[]
  },
  {
    chip:null,
    /* the B2B-inside-the-CRM story (Partner, B2B provisioning) - answers the
       conflict / pushback / persuasion / difficult-stakeholder family. Plain
       'disagree' stays on the PM answer; the past-tense story forms land here */
    chip:'A conflict you solved?',
    keys:['conflict','conflicts','disagreed','disagreement','disagreements','stakeholder disagreement','push back','pushback','pushed back','say no','said no','convince','convinced','changed someone','change someone','changed their mind','without authority','difficult stakeholder','difficult stakeholders','conflicting needs','in trouble','refused','accept your design','don\'t accept','not accept','technical constraints','tough constraints','constraints','simplified','complex process'],
    text:'At Partner, the B2B sales managers refused to work inside our shared CRM. It was built around consumer sales, they wanted a separate system, and they had rejected every solution before I joined. I disagreed: orders, catalog and pricing had to live in one place. So I sat with each team, asked what they wanted, and designed a B2B flow inside the existing CRM. I showed it as a prototype they could click through, and the argument ended. It shipped and is in use today.',
    more:'Their work is complex: one deal is a project with many orders, products, engineering involvement and branch addresses. The consumer flow demanded all of it up front - every form and compliance step - before a quote could go out.\n\nThe new flow lets a rep quote quickly, keeps the order flexible, moves forms and compliance to the stage where they\'re needed, and gives engineering a structured place in the project.\n\n**The result:** throughput up an estimated 30%, and billing leakage down from about 10% to zero once the manual steps were automated.\n\nThey were right about the problem, not about the solution. Listening first, then a prototype people can try, resolves more than any debate.',
    tags:['Throughput up an estimated ~30%','Billing leakage ~10% to zero']
  },
  {
    chip:null,
    keys:['earlier solutions','previous solutions','part of the earlier','were you part','before you joined'],
    text:'No. I joined the project later, after those had been rejected.',
    tags:[]
  },
  {
    chip:null,
    keys:['separate system','own system','their own system','why couldn\'t they','why not a separate'],
    text:'Orders, catalog and pricing had to live in one place. Splitting them into a second system would have broken that.',
    tags:[]
  },
  {
    chip:null,
    keys:['how was the 30','the 30','30 percent','thirty percent','measure the 30','throughput'],
    text:'It\'s an estimate, and I always present it that way. The leakage number, about 10% to zero, came from automating the manual steps.',
    tags:[]
  },
  {
    chip:null,
    keys:['compliance steps','compliance removed','remove compliance','removed compliance','skip compliance','compliance'],
    text:'No. They moved to the stage where they\'re actually needed - nothing was dropped.',
    tags:[]
  },
  {
    chip:null,
    keys:['partner electric','partner','electric','electricity','under pressure','pressure','tight deadline','tight deadlines','deadline','deadlines','in 2 months','2 months','two months','outsource','outsourced'],
    text:'Partner Electric was Partner\'s entry into the electricity market. The plan was to outsource it - everyone assumed it was too complex for our CRM and would take half a year and a big budget. We took it on instead. Research showed we could run it through the existing CRM and adapt what was needed, even though selling electricity works nothing like selling telecom. It went live in 2 months, with full regulatory and billing compliance.',
    tags:['Live in 2 months']
  },
  {
    chip:null,
    keys:['international teams','international','us teams','american teams','global teams','worked remotely','remotely','time zones','time zone','abroad','overseas'],
    text:'Yes. At ElephantStock I worked from Israel with US teams - the company and the market were American. Working across time zones taught me to write clearly, decide fast in the hours we shared, and leave nothing open overnight.',
    tags:[]
  },
  {
    chip:null,
    keys:['video','videos','ai video','video creation','capcut','kling','runway','google flow','social media','ads','advertising','reels','commercials'],
    text:'Yes - I create video for marketing, social and ads, from concept to the final cut. I work with AI video tools like Kling, Runway and Google Flow, and edit in CapCut. At ElephantStock I led creative across campaigns, email and video, so I know video has to work for the brand, not just look good.',
    tags:[]
  },
  {
    chip:null,
    keys:['adapt','adaptable','adaptability','adapt to change','handle change','new domain','new domains','learn fast','learn quickly'],
    text:'Very. I\'ve moved between recruitment SaaS, US e-commerce, telecom, fintech and AI - and between being a team of one and leading a team. Each time the domain changed, the way I work stayed: learn the field fast, find the people who know it, and start delivering early.',
    tags:[]
  },
  {
    chip:null,
    keys:['gap','gaps','career gap','gap in your resume','gap in your cv','why the gap','2018','2019','between 2018','maternity','maternity leave','career break','time off','year off'],
    text:'Between mid-2018 and mid-2019 I was on maternity leave. I came back straight into building a design team from scratch at ElephantStock.',
    tags:[]
  },
  {
    chip:null,
    keys:['elephantstock','elephant stock','elephant','head of ux','head of creative','home decor','home d\u00e9cor','wall art'],
    text:'At ElephantStock - a US direct-to-consumer brand for art and home décor - I was Head of UX/UI & Creative from 2019 to 2022. I built, hired and mentored the design team from scratch, and led UX, product, branding and creative strategy - campaigns, email and video. I cut the mobile-first checkout from 5 steps to 3 across a 200K+ SKU catalog, lifting conversion through A/B testing, polls and funnel analytics. I contributed to 3x revenue growth as the company scaled from 30 to 200+ employees, worked from Israel with US teams, and we were selected Top 10 in Google\'s E-commerce Growth Lab.',
    tags:['2019-2022 \u00b7 Head of UX/UI & Creative']
  },
  {
    chip:null,
    keys:['call summary','ai call summary','summary','summaries','summarization','summarize','call recording','shipped ai','ai in production','in production','production ai','ai feature','shipped','is any of your ai','ai work live','work live','ai live'],
    text:'AI Call Summary is an AI feature I designed at Partner, and reps and managers use it daily. An AI agent listens to the call with the customer and condenses the recording into a summary. The user picks the depth - a short part, the full summary, or the call itself - and every summary links back to the source, so nobody trusts it blind.',
    tags:['Live - used daily']
  },
  {
    chip:null,
    keys:['b2b','enterprise','business to business','internal tools','operational'],
    text:'Most of my career is rooted in complex B2B and enterprise SaaS - recruitment platforms at Niloosoft, and deep operational, dispatch, CRM and ERP systems at Partner.\n\n**In B2B, UX is directly tied to business value:** professionals rely on these platforms for hours every day, so reducing friction and flattening learning curves drives adoption, cuts training and support costs, and reduces churn.\n\nDesigning for B2B means turning systemic complexity into a scalable, revenue-driving asset.',
    tags:['CRM \u00b7 ERP \u00b7 Fintech at Partner']
  },
  {
    chip:null,
    keys:['b2c','consumer','customers','shoppers'],
    text:'My deepest B2C experience was at ElephantStock - a US e-commerce platform with over 200,000 products. Consumer design is a completely different discipline: you have seconds to capture attention, emotion drives decisions, and conversion is the scoreboard. We scaled through continuous A/B testing and performance analytics - which taught me to respect data the way B2B taught me to respect complex workflows.',
    tags:['200K+ SKU \u00b7 A/B-driven']
  },
  {
    chip:null,
    keys:['mobile','tablet','responsive','phone','app','ios','android'],
    text:'Mobile has always been part of my process, tailored to the environment.\n\n**At ElephantStock:** strict mobile-first for high-volume B2C users, where conversion, speed and touch UX were top priorities.\n\n**At Niloosoft:** a dedicated mobile video-interviewing app, letting candidates complete live or recorded interviews from their phones.\n\n**At Partner:** the Core CRM adapted for tablet and mobile, plus a standalone tablet rapid-sales system - so field and store reps work on the go without losing system capability.',
    tags:['Mobile-first e-commerce \u00b7 responsive systems']
  },
  {
    chip:null,
    keys:['dashboard','dashboards','charts','charts & dashboards','monitoring','kpi screen','incident','incidents','incident management'],
    text:'Dashboards are my home turf - operational systems live and die by them. My approach shifts dashboards from passive visualization to decision-making engines: complex data packaged into clear decision units that answer three questions instantly:\n\n**Is everything okay?** system health at a glance.\n**What needs attention now?** urgency and SLA risks.\n**What action do I take?** contextual, one-click resolution. In my fiber-network operations project I redesigned technician dispatch from tables to a live map with prioritization - the assignment loop went from ~8 to ~4 minutes, and it\'s in daily use.',
    tags:['Assignment ~8 to ~4 min'],
    link:{href:'case-aft/aft-timeline.html',label:'See the AFT Timeline case'}
  },
  {
    chip:null,
    keys:['data visualization','data viz','viz','complex data','dataviz','visualization','visualisation','visualize','infographic','infographics','animated infographics','animated infographic','animated charts'],
    text:'I turn complex data into visuals people read at a glance. I design custom infographics with their own visual idea, static and animated. Motion guides the eye and shows how the numbers connect. Every label, scale and color is a decision.',
    tags:[]
  },
  {
    chip:null,
    keys:['fiber','dispatch','dispatcher','dispatchers','dispatching','technician','technicians','syncops','field dispatch','field service','live map'],
    text:'Fiber Dispatch was one of my Partner projects. Dispatchers were assigning technicians from tables. I redesigned it into a live map with prioritization - the assignment loop dropped from ~8 to ~4 minutes, estimated with ops, and it\'s in daily use. Then I designed and demoed an agentic layer on top, as a concept: the agent proposes, the admin decides. It\'s designed to halve that time again - a target, not a result yet.',
    tags:['Assignment ~8 to ~4 min','Agentic layer - concept'],
    link:{href:'case-syncops/syncops.html',label:'See the SyncOps case'}
  },
  {
    chip:null,
    keys:['ecommerce','e-commerce','conversion','shop','store','checkout','funnel','online store','retail','growth lab','google lab','cro','conversion rate'],
    text:'Three years at ElephantStock at scale - a 200K+ product catalog with high-volume, mobile-first traffic where conversion was the daily metric. We worked strictly evidence-first with A/B testing and funnel analytics. One key win: redesigning the checkout flow from 5 complex steps down to 3, which significantly reduced cart abandonment and lifted conversion. E-commerce taught me that design opinions are cheap; tested ones are not.',
    tags:['3x revenue growth \u00b7 A/B tested']
  },
  {
    chip:null,
    keys:['fintech','finance','banking','payments','financial','billing','invoice','invoices','invoicing','pricing','regulation','regulatory','regulated'],
    text:'At Partner I worked on B2B provisioning and billing - nested enterprise orders turned into simple quotes, throughput up ~30%, billing leakage from ~10% to zero. I also designed Partner Electric, live in 2 months with full regulatory and billing compliance.\n\nMy latest fintech work goes into high-stakes lending - AI-driven loan underwriting, risk prediction and cross-organizational loan syndications. In these environments, clarity is money: I streamline dense application forms, map multi-stakeholder approval flows, and use AI to parse incoming data into actionable decision scores. When a mistake costs real money, smart UX patterns, clear verification and transparent AI reasoning are what create trust.',
    tags:[]
  },
  {
    chip:null,
    keys:['accessibility','a11y','elephantstock','wcag','contrast','inclusive','accessible','accessible design','inclusive design','keyboard navigation','accessibility standards'],
    text:'Accessibility is part of my process on every project, including when nobody asks for it. My foundation comes from ElephantStock, where we trained with a US accessibility expert to bring the product up to standard for the American market. Since then I bring each design as close to the standard as possible: readable contrast, clear focus states, comfortable text sizes and touch targets, keyboard navigation, and meaning that is carried by more than color.',
    tags:[]
  },
  {
    chip:null,
    keys:['empty state','empty states','empty','onboarding','first use','blank'],
    text:'Empty states are often treated as an afterthought - but in complex SaaS and AI products they are the most critical onboarding moment. A blank screen creates hesitation. I design empty states as active guides: actionable entry points, clear next steps, or suggested AI prompts that build immediate trust and momentum. The first interaction sets the tone for the whole product.',
    tags:[]
  },
  {
    chip:null,
    keys:['education','study','studies','studied','degree','diploma','college','university','courses','learned design'],
    text:'My background combines design, code and sales psychology.\n\n**Formal education:** a Diploma in Graphic Design & Visual Communication from Western Galilee College.\n\n**Additional studies:** UX/UI and UX strategy, front-end development with Angular, video creation, web production, motion animation and AI Security. Google\'s E-commerce Growth Lab - selected Top 10 cohort.\n\n**And a unique specialty:** certified Expert Marketing & Sales Coach - a deep program in sales psychology and marketing strategy.\n\nI treat education as ongoing; that mix is what fuels my product strategy today.',
    tags:['Google E-commerce Growth Lab \u00b7 Top 10']
  },
  {
    chip:null,
    keys:['a/b','ab test','ab tests','ab testing','a/b testing','a/b tests','split test','split tests','experiment','experiments'],
    text:'Plenty - at ElephantStock A/B testing was our daily language: layouts, flows and content tested on real traffic, and the results decided. It taught me healthy humility; the version I loved didn\u2019t always win.',
    tags:['200K+ SKU platform']
  },
  {
    chip:null,
    keys:['usability','usability test','war room','war rooms','pilot','pilots','usability testing','user testing','test with users'],
    text:'Continuously, and as early as possible. Beyond formal tests, I run live pilots and set up war rooms to watch how real users behave under pressure. A rough prototype in front of five real operators beats a month of internal debate - they find the edge cases and friction points no one else can.',
    tags:[]
  },
  {
    chip:null,
    keys:['user interview','user interviews','field studies','field study','field research','in the field','field','interview users','talk to users','user research'],
    text:'User interviews and field research are where real product clarity happens. Beyond surveys, I go directly to the field and talk with people inside the actual workflow - watching how they operate under pressure. Requirements documents tell you what to build; real users reveal the hidden friction, unstated needs and operational shortcuts that actually define the strategy.',
    tags:[]
  },
  {
    chip:null,
    keys:['ux strategy','strategy','strategic','design strategy'],
    text:'UX strategy means connecting design decisions directly to business metrics.\n\n**In high-scale e-commerce:** that means driving conversion - data and A/B testing across a 200K+ catalog.\n\n**In enterprise and B2B it\'s operational:** turning complex data into clear decision workflows, reducing cognitive load, preventing costly mistakes.\n\n**My framework is consistent:** research defines the real problem, OOUX structures the architecture, a robust design system scales it, and business metrics confirm whether it worked.',
    tags:['Strategy = a number that moves']
  },
  {
    chip:null,
    keys:['stay current','trends','keep up','up to date','how do you learn'],
    text:'I stay ahead by combining hands-on building with deep industry study. AI tooling evolves monthly, so I experiment by shipping real projects - this site is the current example. In parallel I follow research and documentation from AI leaders like Anthropic, engage with the design-systems community, and study how serious enterprise platforms handle trust, explainability and AI interaction patterns. Learning, for me, is a daily discipline.',
    tags:[]
  },
  {
    chip:null,
    keys:['code','coding','programming','develop','html','css','angular','typescript','technical','handoff','specs','hand off','gitlab'],
    text:'**The technical side:** I write frontend code and understand the architecture inside out - Angular, TypeScript, HTML and CSS, including how components, data structures and state actually behave. I also build components and feature prototypes in Claude Code, and work in GitLab.\n\n**Where my focus sits:** In my role, though, my focus is product strategy and UX architecture - the technical depth is there to bridge the gap with engineering.\n\n**Why it matters for handoff:** I design within realistic constraints from day one, so handoffs are seamless and developers never have to say \'this can\'t be built.\'',
    tags:[]
  },
  {
    chip:null,
    keys:['proud','proudest','favorite project','best project','highlight','best work'],
    text:'The decision-support timeline for Partner\'s operations. We transformed fragmented operational data into clear, actionable decision units - and on top of it I designed an AI decision-support concept with confidence scores and human-in-the-loop control. The part I\'m proudest of: treating operator trust as a design requirement, not a hope.',
    tags:['Agentic layer - concept, clearly labeled']
  },
  {
    chip:null,
    keys:['intuition','gut','instinct','data or','intuition or data','or data','decision','decisions','decide'],
    text:'Intuition generates the hypothesis; data validates it. After 13+ years in product design my intuition is grounded in deep pattern recognition - it lets me map solutions quickly. But data keeps us honest: high-scale A/B testing taught me to test assumptions early, and when data isn\'t available yet, I run rapid usability pilots to learn and adapt fast.',
    tags:[]
  },
  {
    chip:null,
    keys:['executives','stakeholders','presentation','buy-in','get buy-in','buy-in for','sell design','present design'],
    text:'I frame design as business strategy, not visual critique. With executives and cross-functional teams I lead with the core problem, the trade-offs I evaluated, and the rationale behind the chosen architecture. Grounding every decision in operational goals, system constraints and clear metrics makes alignment happen naturally - stakeholders become partners, not approvers.',
    tags:[]
  },
  {
    chip:null,
    keys:['ethics','ethical','red lines','dark pattern','dark patterns','responsible ai'],
    text:'Ethics in product design come down to building long-term user trust rather than taking short-term shortcuts. When business goals push for aggressive conversion, my role as a senior designer is to advocate for transparent frameworks that protect both the user and the brand. In AI-driven platforms that means three rules: keep system actions transparent, let operators easily override recommendations, and present AI confidence honestly instead of hiding uncertainty.',
    tags:['The human can always override']
  },
  {
    chip:null,
    keys:['90 days','first days','first month','onboarding you','your first'],
    text:'In an ideal world you get time to onboard, research and map everything first. In reality, companies usually hire a senior designer because there\'s immediate friction waiting for solutions.\n\n**First month:** Having worked in high-velocity environments like Partner, I adapt to the ground truth: if there\'s urgency, I jump straight in - interviewing key operators, identifying pain points, and putting actionable concepts on the table fast.\n\n**Second month:** In parallel, as those early wins ship, I map the deeper architecture, build cross-functional alignment.\n\n**Third month:** and construct the long-term design framework that moves the business numbers.',
    tags:[]
  },
  {
    chip:null,
    keys:['why ai','chose ai','specialty','specialize','why this field'],
    text:'AI is redefining the very nature of product architecture - we\'re moving from designing passive screens to orchestrating intelligent systems that actively partner with human operators. Beyond removing manual friction, the real breakthrough is augmented intelligence: turning raw data into confident decisions. Shaping how humans interact with, trust, and lead AI systems is the most transformative design territory today - and it aligns naturally with my architectural background.',
    tags:[]
  },
  {
    chip:null,
    keys:['languages','english','hebrew','russian','speak'],
    text:'English - fluent. Hebrew and Russian - native. Here I answer in English for now - but write me in any of the three: larisamalyd@gmail.com',
    tags:[]
  }
,
  {
    chip:null,
    keys:['experience','years','how long','since when','background','career','\u05e0\u05d9\u05e1\u05d9\u05d5\u05df','\u05e9\u05e0\u05d5\u05ea','\u05e8\u05e7\u05e2'],
    text:'I bring 13+ years of experience in product design, design systems and complex product architecture, across high-velocity scale-ups and enterprise environments.\n\n**Where I add the most value:** My strength is transforming deep operational and technical complexity - dense data, multi-role permissions, heavy workflows - into intuitive, high-impact systems.\n\n**That work has consistently driven measurable outcomes:** faster task completion, scalable design systems that accelerate delivery, fewer operator errors.\n\n**And the craft:** I\'m as strong in UI as in UX - the details are where a product earns trust.\n\n**Now:** Today I apply it to AI-driven interfaces - decision-support tools that reduce friction and move core business metrics.',
    tags:['Designing since 2013']
  },
  {
    chip:null,
    keys:['pm','product manager','product managers','work with product','disagree'],
    text:'**I view the PM relationship as a strategic partnership:** the PM drives business strategy and priorities, I make sure the solution is architecturally sound, scalable and intuitive.\n\n**Where disagreements come from:** Disagreements usually come from competing priorities - speed to market versus product complexity. I don\'t treat it as a battle of opinions.\n\n**I map the trade-offs clearly:** impact on user workflows, technical risk, future scalability.\n\nThe goal is a pragmatic solution or a phased rollout that meets the deadline without compromising the system\'s long-term integrity.',
    tags:[]
  }
,
  {
    chip:null,
    keys:['measured','measure the','how did you get','that number','fifty percent','50%','50 percent','the 50','how do you measure numbers','8 to 4','4 minutes','8 minutes'],
    text:'Together with the ops team. On Fiber Dispatch we watched how dispatchers actually work and compared how long an assignment took before and after the change - from ~8 minutes with tables to ~4 with the live map, about 50% faster. It\'s an estimate made with ops, and I present it that way. For the agentic layer the measuring stick is defined before it\'s built, so its number will be measured, not estimated.',
    tags:['Estimated with ops - labeled that way on purpose']
  },
  {
    chip:null,
    keys:['why','tell me more','more detail','more details','elaborate','go deeper','example'],
    text:'Absolutely. I can take you through the specific architecture decisions, how we handled edge cases, or what almost went wrong and how we pivoted. Which angle would be most helpful for you right now?',
    tags:[]
  },
  {
    chip:null,
    keys:['love about','enjoy','favorite part','what do you love','passion'],
    text:'I love the moment deep complexity turns into complete clarity. Taking dense data, heavy workflows and complex AI logic, and orchestrating them into a system where users instantly feel in control - that\'s the most rewarding part of my work. After 13+ years, solving that puzzle never gets old.',
    tags:[]
  },
  {
    chip:null,
    keys:['hardest','hard about','difficult','challenge','struggle'],
    text:'The hardest part - and the most rewarding - is balancing technical complexity with user clarity, especially in AI-driven platforms. You\'re designing for unpredictable outputs and high-stakes workflows, where users need both speed and total trust. Navigating the trade-offs between technical capability, business constraints and human trust takes constant precision - and that\'s exactly what makes the work matter.',
    tags:[]
  },
  {
    chip:null,
    keys:['stuck','blocked','no ideas','creative block','out of ideas'],
    text:'I step away from the screen and shift perspective - back to the object map, quick notes on paper, or a look at unexpected domains for fresh inspiration. Being stuck usually means I\'m solving the wrong layer: the interface resists when the logic underneath it isn\'t right yet.',
    tags:[]
  }
,
  {
    chip:null,
    keys:['wow','amazing','great','brilliant','perfect','excellent','love it','gorgeous','stunning','well done','good job','fantastic'],
    text:'Thank you! :) If anything here made you curious - ask away.',
    tags:[]
  }
,
  {
    chip:null,
    keys:['ooux','object oriented','object-oriented','information architecture','objects'],
    text:'Object-Oriented UX is my primary tool for taming complexity. Before drawing any screens, I map the system\'s core objects: what they are, what data they contain, how they relate. It ensures the system mirrors how users actually think - not how the database tables happen to be structured. Every complex architecture I design starts right there.',
    tags:['Structure before screens']
  },
  {
    chip:null,
    keys:['niloosoft','hunter','hrms','white label','white-label','recruitment','saas','first job'],
    text:'Niloosoft is where I started, as the first and only designer. I built the product and the brand from zero - Hunter HRMS, a multilingual enterprise HR platform. High-volume hiring end to end: a filtering engine, a results matrix, permissions and roles - one product serving recruiters, hiring managers, employees and candidates. I also designed white-label career websites for client companies and a mobile video interview app.',
    tags:['2013-2018 \u00b7 Enterprise SaaS']
  },
  {
    chip:null,
    keys:['motion','animation','micro-interactions','microinteractions','transitions','animate','motion design','interaction design','interactions','motion in ui','ui motion','interaction details','visual feedback','interaction feedback','do you animate'],
    text:'I design the small moments of an interface: a button that responds, a smooth transition, a clear confirmation. Each one has a purpose. It gives feedback, guides the eye, and makes the product feel alive. I come from a background in animation, so for me motion is feedback, never decoration. This site is a live sample: the entrance choreography, the floating cases, the typing rhythm in this chat.',
    tags:['This site is the sample']
  }
,
  {
    chip:null,
    keys:['freelance','part time','part-time','consulting','contract','fractional','engagement model','full time','full-time'],
    text:'I\u2019m primarily motivated by the product, the challenge and the impact - so I\u2019m open to different collaboration models for the right project: a full-time Senior or Lead role, fractional design leadership, or specialized consulting. If the product and the vision align, I\u2019m flexible about the configuration.',
    tags:[]
  }
,
  {
    chip:null,
    keys:['leave','leaving','left','quit','resign','resigned','departure','leave partner','leaving partner','left partner','why did you leave','why are you leaving','\u05e2\u05d6\u05d1\u05ea','\u05e2\u05d5\u05d6\u05d1\u05ea'],
    text:'My role at Partner changed substantially, and it felt like the right point to close a full cycle: the design system is adopted, Partner Electric is live, the AI systems are working. Now I\'m looking for a place where AI is the product itself - that\'s where the experience I\'ve built is worth the most, and where I want to keep growing.',
    tags:[]
  }
,
  {
    chip:null,
    keys:['critera','\u05e7\u05e8\u05d9\u05d9\u05d8\u05e8\u05d4','real estate','real-estate','estate','lending','loan','loans','underwriting','mortgage','proptech','due diligence','property','marketplace','credit','project finance','finance','borrower','lender','lenders','\u05e0\u05d3\u05dc\u05df','\u05d4\u05dc\u05d5\u05d5\u05d0\u05d4'],
    text:'My latest client work is Critera - an AI-assisted marketplace for corporate credit and project finance. One borrower request meets a panel of institutional lenders competing for it - all working from a unified underwriting file built by an AI engine. I designed both sides: the borrower submits the full deal in one place, lenders get a structured decision view - risk signals, automated due diligence, the journey tracked on a timeline. The system suggests, the human decides.',
    tags:['Real client work','Human-in-the-loop']
  }
];
const FALLBACKS = [
  'You found the edge of my script - I like how you think. The unscripted version: larisamalyd@gmail.com.',
  'I love that you\u2019re digging deeper - that one\u2019s beyond my scripted answers. Write me at larisamalyd@gmail.com and I\u2019ll answer personally, usually same day.',
  'You\u2019ve officially out-asked my script - which I take as a compliment. The real Larisa answers at larisamalyd@gmail.com.',
  'Great question - it deserves a real answer, not a scripted one. I\u2019d genuinely enjoy discussing it: larisamalyd@gmail.com.',
  'Some things you only discover in a real conversation - this is one of them. Invite me to one: larisamalyd@gmail.com.'
];
const FALLBACK = { get text(){ return FALLBACKS[Math.floor(Math.random()*FALLBACKS.length)]; }, tags:[] };
const thread=document.getElementById('thread'),chipsEl=document.getElementById('chips'),
      input=document.getElementById('q'),sendBtn=document.getElementById('send');
let busy=false;
function renderChip(k){
  const b=document.createElement('button');
  b.className='chip';
  /* desktop reads the full, human question; phones get the short label so
     more of them fit the row (css swaps the two spans at 900px) */
  if(k.chipShort){
    const l=document.createElement('span');l.className='lbl-long';l.textContent=k.chip;
    const s=document.createElement('span');s.className='lbl-short';s.textContent=k.chipShort;
    b.append(l,s);
  } else b.textContent=k.chip;
  b.onclick=()=>ask(k.chip,k);
  return b;
}
let chipIdx=0;
/* the visible row, in this order - short labels so they fit; anything not
   listed (the auto-opened agents question) keeps its place at the end */
const CHIP_ORDER=['Are you more UI or UX?','A conflict you solved?','What shipped at Partner?','What do people say about you?','Have you built a design system?','Have you led a team?'];
const chipRank=k=>{const i=CHIP_ORDER.indexOf(k.chip);return i<0?99:i;};
KB.filter(k=>!k.hidden && k.chip).sort((a,b)=>chipRank(a)-chipRank(b)).forEach((k,i)=>{
  const b=renderChip(k);
  if(i>=4) b.classList.add('vis-5plus');   // mobile shows only the first four
  b.classList.add('chip-in');
  b.style.animationDelay=(0.45+chipIdx*0.09)+'s';
  chipIdx++;
  chipsEl.appendChild(b);
});
const moreBtn=document.createElement('button');
moreBtn.className='chip more';
const extraVisible=KB.filter(k=>!k.hidden && k.chip).length-4;
function moreCount(){
  const mobile=window.matchMedia('(max-width:900px)').matches;
  return KB.filter(k=>k.hidden).length + (mobile?Math.max(0,extraVisible):0);
}
const hiddenCount=KB.filter(k=>k.hidden).length;
moreBtn.textContent=moreCount()+' more';
moreBtn.classList.add('chip-in');
moreBtn.style.animationDelay=(0.45+chipIdx*0.09)+'s';
window.addEventListener('resize',()=>{
  if(moreBtn.getAttribute('aria-expanded')!=='true') moreBtn.textContent=moreCount()+' more';
});
moreBtn.setAttribute('aria-expanded','false');
let extraChips=[];
moreBtn.onclick=()=>{
  const expanded = moreBtn.getAttribute('aria-expanded')==='true';
  if (!expanded) {
    extraChips = KB.filter(k=>k.hidden && k.chip).map(k=>{
      const b=renderChip(k);
      chipsEl.insertBefore(b, moreBtn);
      return b;
    });
    chipsEl.classList.add('expanded');
    moreBtn.textContent='less';
    moreBtn.setAttribute('aria-expanded','true');
  } else {
    extraChips.forEach(b=>b.remove());
    extraChips=[];
    chipsEl.classList.remove('expanded');
    moreBtn.textContent=moreCount()+' more';
    moreBtn.setAttribute('aria-expanded','false');
  }
};
chipsEl.appendChild(moreBtn);
function scrollDown(){thread.scrollTop=thread.scrollHeight}
const PROFANITY=['fuck','fucking','fucked','shit','shitty','bitch','asshole','bastard','dick','cunt','whore','slut','stupid','idiot','moron','dumb','sucks','crap','wtf','stfu','loser','ugly','trash','garbage'];
function hasProfanity(q){
  q=q.toLowerCase();
  return PROFANITY.some(w=>new RegExp('\\b'+w+'\\b').test(q));
}
const RUDE={
  text:'I\u2019ll treat that as a stress-test question - those exist in real interviews too. If there\u2019s something you actually want to know about my work, I\u2019m all ears. Otherwise, enjoy the site.',
  tags:[]
};
function isGibberish(q){
  const words=q.trim().split(/\s+/);
  const real=words.filter(w=>{
    if(/[\u0590-\u05FF]/.test(w)) return true;               // Hebrew - a real attempt
    if(/[a-z]/i.test(w) && /\d/.test(w)) return false;        // letter+digit mash (asdf123)
    const letters=w.replace(/[^a-z]/gi,'');
    return letters.length>=2 && /[aeiouy]/i.test(letters);     // has vowels - looks like a word
  });
  return real.length===0;
}
const GIBBERISH={
  text:'Sorry - I didn\u2019t quite catch that. Could you rephrase it? Or pick one of the questions below.',
  tags:[]
};
function match(q){
  q=q.toLowerCase();let best=null,score=0;
  KB.forEach(k=>{
    const sc=k.keys.reduce((n,w)=>{
      if(/[\u0590-\u05FF]/.test(w)) return n+(q.includes(w)?1:0);
      const re=new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b');
      return n+(re.test(q)?1:0);
    },0);
    if(sc>score){score=sc;best=k}
  });
  return score>0?best:null;
}
function ask(label,entry){
  if(busy)return;busy=true;
  const u=document.createElement('div');u.className='msg user';u.textContent=label;
  thread.appendChild(u);scrollDown();
  const row=document.createElement('div');row.className='bot-row';
  const av=document.createElement('img');av.className='avatar';av.src=AVATAR;av.alt='Lora';
  const col=document.createElement('div');col.className='bot-col';
  row.appendChild(av);row.appendChild(col);
  const h=document.createElement('div');h.className='msg bot';
  h.innerHTML='<span class="typing"><i></i><i></i><i></i></span>';
  col.appendChild(h);
  thread.appendChild(row);scrollToBubbleTop(row);
  let data=entry;
  if(!data && hasProfanity(label)){ data=RUDE; }
  if(!data){
    if(/[\u0590-\u05FF]/.test(label)){
      const hm=match(label);
      if(hm){
        data={text:'\u05e2\u05d1\u05e8\u05d9\u05ea\u003f\u0020\u05db\u05de\u05d5\u05d1\u05df\u0020\u003a\u0029\u0020\u05d0\u05e0\u05d9\u0020\u05e2\u05d5\u05e0\u05d4\u0020\u05d1\u05d0\u05e0\u05d2\u05dc\u05d9\u05ea\u0020\u002d\u0020'+hm.text, tags:hm.tags, link:hm.link};
      } else {
        data={text:'\u05e2\u05d1\u05e8\u05d9\u05ea? \u05db\u05de\u05d5\u05d1\u05df :) \u05db\u05d0\u05df \u05d0\u05e0\u05d9 \u05e2\u05d5\u05e0\u05d4 \u05d1\u05d9\u05e0\u05ea\u05d9\u05d9\u05dd \u05d1\u05d0\u05e0\u05d2\u05dc\u05d9\u05ea - \u05d0\u05d1\u05dc \u05dc\u05de\u05d9\u05d9\u05dc \u05d0\u05e4\u05e9\u05e8 \u05dc\u05db\u05ea\u05d5\u05d1 \u05dc\u05d9 \u05d1\u05db\u05dc \u05e9\u05e4\u05d4: larisamalyd@gmail.com', tags:[]};
      }
    } else if(/[\u0400-\u04FF]/.test(label)){
      data={text:'\u0414\u0430, \u044f \u0433\u043e\u0432\u043e\u0440\u044e \u043f\u043e-\u0440\u0443\u0441\u0441\u043a\u0438 :) Here I answer in English for now - write me in any language: larisamalyd@gmail.com', tags:[]};
    } else if(/[\u0600-\u06FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0E00-\u0E7F\u0900-\u097F]/.test(label)){
      data={text:'I wish I spoke your language! Here I answer in English for now - but you can write to me in any language at larisamalyd@gmail.com and I\u2019ll answer.', tags:[]};
    } else {
      const mm=match(label);
      data = mm || (isGibberish(label)?GIBBERISH:FALLBACK);
    }
  }
  // split long answers into two bubbles at the first sentence break
  function splitAnswer(t){
    if(t.indexOf('\n')>=0) return [t];   // structured answers stay whole (headings render inside)
    if(t.length<150) return [t];
    const m=t.slice(40,190).match(/[.!?](\s)/);
    if(!m) return [t];
    const cut=40+m.index+1;
    return [t.slice(0,cut).trim(), t.slice(cut).trim()];
  }
  const parts=splitAnswer(data.text);
  const think=Math.min(1000, 450+data.text.length*1.5);
  setTimeout(()=>{
    h.innerHTML='';
    const p=document.createElement('div');h.appendChild(p);
    typeText(p,parts[0],()=>{
      function finish(lastBubble){
        if(data.more){
          // sits right under the answer text, above tags/feedback - clicking it inserts the
          // extra content right above itself, so it (and the tags/feedback below it) get
          // pushed down instead of the button disappearing
          const mb=document.createElement('button');
          mb.className='more-chip';
          mb.setAttribute('aria-expanded','false');
          mb.innerHTML='Tell me more<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
          let hm=null,opened=false,transitioning=false;
          mb.onclick=()=>{
            if(transitioning) return;
            transitioning=true;
            mb.disabled=true;
            if(!opened){
              opened=true;
              mb.classList.add('open');
              mb.setAttribute('aria-expanded','true');
              setTimeout(()=>{
                mb.firstChild.textContent='Tell me less';
                mb.disabled=false;
                if(hm){ hm.hidden=false; followTyping(mb); transitioning=false; return; }
                hm=document.createElement('div');hm.className='more-content';
                hm.innerHTML='<span class="typing"><i></i><i></i><i></i></span>';
                lastBubble.insertBefore(hm,mb);followTyping(hm);
                setTimeout(()=>{
                  hm.innerHTML='';
                  const pm=document.createElement('div');hm.appendChild(pm);
                  typeText(pm,data.more,()=>{followTyping(mb);transitioning=false});
                },500);
              },220);
            } else {
              opened=false;
              mb.classList.remove('open');
              mb.setAttribute('aria-expanded','false');
              mb.firstChild.textContent='Tell me more';
              if(hm) hm.hidden=true;
              mb.disabled=false;
              transitioning=false;
            }
          };
          lastBubble.appendChild(mb);
        }
        if(data.people&&data.people.length){
          // one block per person: face + name + title on a line, quote beneath
          data.people.forEach(pr=>{
            const b=document.createElement('div');b.className='msg-person-block';
            const head=document.createElement('div');head.className='msg-person';
            const im=document.createElement('img');
            im.src=pr.img;im.alt=pr.name;im.loading='lazy';
            const cap=document.createElement('div');cap.className='msg-person-id';
            cap.innerHTML='<b>'+pr.name+'</b><span>'+pr.role+'</span>';
            head.appendChild(im);head.appendChild(cap);
            b.appendChild(head);
            if(pr.quote){
              const qp=document.createElement('p');qp.className='msg-person-quote';
              qp.textContent='\u201C'+pr.quote+'\u201D';
              b.appendChild(qp);
            }
            lastBubble.appendChild(b);
          });
        }
        if(data.outro){
          const op=document.createElement('p');op.className='msg-p msg-outro';
          op.textContent=data.outro;
          lastBubble.appendChild(op);
        }
        if(data.tags&&data.tags.length){
          const ev=document.createElement('div');ev.className='evidence';
          const tagIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.82z"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg>';
          data.tags.forEach(t=>{const sp=document.createElement('span');sp.className='tag';sp.innerHTML=tagIcon;sp.appendChild(document.createTextNode(t));ev.appendChild(sp)});
          lastBubble.appendChild(ev);
        }
        if(data.link){
          const a=document.createElement('a');a.className='msg-link';
          a.href=data.link.href;a.textContent=data.link.label+' \u2192';
          lastBubble.appendChild(a);
        }
        addFeedback(lastBubble, label);
        // nudge into view rather than jump - tags/link/feedback just grew the bubble a bit more
        followTyping(lastBubble);
        busy=false;
      }
      if(parts.length===1){finish(h);return}
      const h2=document.createElement('div');h2.className='msg bot';
      h2.innerHTML='<span class="typing"><i></i><i></i><i></i></span>';
      col.appendChild(h2);followTyping(h2);
      setTimeout(()=>{
        h2.innerHTML='';
        const p2=document.createElement('div');h2.appendChild(p2);
        typeText(p2,parts[1],()=>finish(h2));
      },500);
    });
  },think);
}
function addFeedback(holder, questionLabel){
  const row=document.createElement('div');row.className='feedback';
  const upSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
  const downSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>';
  const up=document.createElement('button');up.className='fb';up.innerHTML=upSvg;up.setAttribute('aria-label','Helpful');
  const down=document.createElement('button');down.className='fb';down.innerHTML=downSvg;down.setAttribute('aria-label','Not helpful');
  row.appendChild(up);row.appendChild(down);
  holder.appendChild(row);
  function react(chosen, other, positive){
    chosen.classList.add('active');other.classList.add('dimmed');
    chosen.onclick=null;other.onclick=null;
    const note=document.createElement('span');note.className='fb-note';
    note.innerHTML = positive
      ? 'Noted, thanks!'
      : 'Fair - the unscripted me does better: <a href="mailto:larisamalyd@gmail.com">larisamalyd@gmail.com</a>';
    row.appendChild(note);scrollDown();
    if (positive) {
      setTimeout(()=>{ note.classList.add('fade'); setTimeout(()=>note.remove(), 700); }, 30000);
    }
    /* Feedback hook: currently stays in the visitor's browser only.
       To receive it, POST to a form endpoint (e.g. Formspree) here: */
    // fetch('[FEEDBACK-ENDPOINT]',{method:'POST',body:JSON.stringify({q:questionLabel,helpful:positive})});
  }
  up.onclick=()=>react(up,down,true);
  down.onclick=()=>react(down,up,false);
}
function fmt(t){
  // escape, then apply **bold**; \n\n starts a new paragraph (own margin), single \n is a soft break
  let h=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  h=h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  return h.split(/\n\n+/).map(p=>'<p class="msg-p">'+p.replace(/\n/g,'<br>')+'</p>').join('');
}

function scrollToBubbleTop(node){
  try{
    const row=node.closest('.bot-row')||node;
    const prev=row.previousElementSibling;
    // anchor on the user question above the row (if present) so the whole Q&A pair
    // clears the top fade mask (38px) instead of landing inside it, half-hidden
    const anchor=(prev&&prev.classList.contains('msg')&&prev.classList.contains('user'))?prev:row;
    const top=anchor.offsetTop-44;
    thread.scrollTo({top:top,behavior:'smooth'});
  }catch(e){}
}
// nudges the thread down just enough to keep a growing bubble's bottom edge in view -
// called on every typing tick so the reveal rises line by line instead of typing
// off-screen and jump-scrolling once at the end
function followTyping(el){
  try{
    const overflow=el.getBoundingClientRect().bottom-(thread.getBoundingClientRect().bottom-44);
    if(overflow>0){
      // force instant - CSS scroll-behavior:smooth queues/animates each of these frequent
      // ticks, and once retargeted faster than the animation can keep up, some browsers
      // stall and then snap to the latest value in one visible jump instead of a steady rise
      const prevBehavior=thread.style.scrollBehavior;
      thread.style.scrollBehavior='auto';
      thread.scrollTop+=overflow;
      thread.style.scrollBehavior=prevBehavior;
    }
  }catch(e){}
}
function typeText(el,text,done){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){el.innerHTML=fmt(text);done();followTyping(el);return}
  let i=0;
  (function step(){
    el.innerHTML=fmt(text.slice(0,i)).replace(/<\/p>$/,'<span class="caret"></span></p>');
    i+=3;
    followTyping(el);
    if(i<=text.length+2){setTimeout(step,12)}else{el.innerHTML=fmt(text);done()}
  })();
}
sendBtn.onclick=()=>{
  const v=input.value.trim();
  if(busy)return;
  if(!v){
    const rowEl=input.closest('.inputrow');
    /* on a phone focus() throws the keyboard up - together with Android's
       clipboard strip of past copied links - right over the hint this click is
       meant to show. Touch devices get the glow + placeholder line only; the
       keyboard opens when she actually taps the field. */
    if(!window.matchMedia('(pointer:coarse)').matches)input.focus();
    rowEl.classList.remove('nudge');void rowEl.offsetWidth;
    rowEl.classList.add('nudge');
    input.placeholder='Waiting for your question - I\u2019m all ears :)';
    clearTimeout(input._ph);
    input._ph=setTimeout(()=>{input.placeholder='Write a question...';rowEl.classList.remove('nudge')},3000);
    return;
  }
  input.value='';ask(v,null);
};
input.addEventListener('keydown',e=>{if(e.key==='Enter')sendBtn.onclick()});



// hamburger / side menu
const burger=document.getElementById('hamburger');
const mainNav=document.getElementById('mainNav');
const navOverlay=document.getElementById('navOverlay');
function setMenu(open){
  burger.classList.toggle('open',open);
  mainNav.classList.toggle('open',open);
  navOverlay.classList.toggle('show',open);
  burger.setAttribute('aria-expanded',open);
  document.body.classList.toggle('menu-open',open);
  document.body.style.overflow=open?'hidden':'';
}
burger.addEventListener('click',()=>setMenu(!mainNav.classList.contains('open')));
navOverlay.addEventListener('click',()=>setMenu(false));
mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
window.addEventListener('resize',()=>{if(window.innerWidth>900)setMenu(false)});


// surprise pool - the dice draws from here, no repeats until exhausted
const SURPRISES=[
  'Selected Top 10 in Google\'s E-commerce Growth Lab.',
  'I served as the sole Lead Designer for Partner\'s IT division - supporting 300+ developers and cross-functional teams.',
  'I designed an e-commerce platform handling 200,000+ products. I still can\'t look at empty walls without scaling them.',
  'Partner Electric went from zero to launch in 2 months. Fast, intense, zero regrets.',
  'Yes, I write frontend code - Angular included. Knowing how it\'s built under the hood makes design handoffs painless.',
  'Outside of design, I perform in a competitive Latin dance troupe - 20+ years dancing, first-place national titles. Systems and stage routines both run on timing, balance and structure.',
  'I built a design team from scratch while the company scaled from 30 to 200+ people.',
  'ElephantStock tripled its revenue during my tenure. E-commerce keeps score honestly.',
  'I think in English, Hebrew and Russian. Bad UX frustrates me in all three.',
  'My core rule for AI interfaces: the system suggests, the human decides. Non-negotiable.',
  'I map system objects before drawing a single screen. OOUX is my architectural secret weapon.',
  'This site runs on a real design system - Figma variables, semantic tokens, two color modes. Ask me why that matters.',
  'Every answer in this chat was written by me in advance. You\'re reading preparation, not AI.',
  'I\'ve designed for recruitment, telecom, fintech and AI. Domains change; navigating complexity stays the same.',
  'I redesigned Partner\'s bundled cellular order flow - average handling time dropped from 9 minutes to 1.5.',
  'The CRM I led design for serves a subscriber base covering roughly a third of Israel.',
  'I\'m the one who notices the 2px misalignment. Then I fix it.',
  'My newest client work: a credit marketplace where one borrower request meets competing institutional lenders - underwriting structured by AI.'
];
let surpriseBag=[];
function nextSurprise(){
  if(!surpriseBag.length) surpriseBag=[...SURPRISES].sort(()=>Math.random()-.5);
  return surpriseBag.pop();
}

// dice: drop a surprise into the conversation
const diceBtn=document.getElementById('dice');
if(diceBtn){
  // white and pale lavender are invisible on the light theme, so the palette
  // follows the theme rather than being fixed
  const SPARK_COLORS = document.documentElement.getAttribute('data-theme') === 'light'
    ? ['#6C3FE8','#8C55FF','#B277FF','#5A31CF']
    : ['#FFFFFF','#C3A7FF','#8C55FF','#B277FF'];
  function sparkBurst(){
    for(let i=0;i<14;i++){
      const p=document.createElement('span');
      p.className='dice-spark';
      p.textContent=Math.random()<.5?'\u2726':'\u2727';
      p.style.color=SPARK_COLORS[Math.floor(Math.random()*SPARK_COLORS.length)];
      const ang=Math.random()*Math.PI*2;
      const dist=38+Math.random()*42;
      p.style.setProperty('--dx',Math.cos(ang)*dist+'px');
      p.style.setProperty('--dy',Math.sin(ang)*dist+'px');
      p.style.setProperty('--dur',(550+Math.random()*350)+'ms');
      diceBtn.appendChild(p);
      p.addEventListener('animationend',()=>p.remove());
    }
  }
  diceBtn.addEventListener('click',()=>{
    sparkBurst();
    ask('Surprise me', {text:nextSurprise(), tags:[]});
  });
  // entrance: roll in after the chips, then one sparkle burst
  const rollDelay=0.45+(chipIdx+1)*0.09+0.1;
  diceBtn.classList.add('dice-in');
  diceBtn.style.animationDelay=rollDelay+'s';
  setTimeout(sparkBurst,(rollDelay+0.68)*1000);
}

// scroll reveal for the case cards (progressive - without JS everything stays visible)
const revealEls=[...document.querySelectorAll('.case-card'), ...document.querySelectorAll('.works h2'), ...document.querySelectorAll('.rec-card')].filter(Boolean);
revealEls.forEach(el=>el.classList.add('js-reveal'));
const revealIO=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');revealIO.unobserve(e.target)}
  });
},{threshold:.15});
revealEls.forEach(el=>revealIO.observe(el));

/* The reveal runs with animation-fill-mode:both, so once it finishes the browser
   keeps applying its last keyframe - transform:none - from the animation origin,
   which outranks every normal declaration including :hover. That silently killed
   the hover lift on the cards. Hand the element back to the plain cascade as soon
   as the entrance is over. (If animations are off for reduced motion the event
   never fires, and .js-reveal.in already sets opacity:1 on its own.) */
const REVEAL_ANIMS=new Set(['cardReveal','recInLeft','recInRight']);
revealEls.forEach(el=>{
  el.addEventListener('animationend',ev=>{
    if(ev.target!==el||!REVEAL_ANIMS.has(ev.animationName))return;   // ignore the floating screenshot
    el.classList.remove('js-reveal','in');
    el.classList.add('revealed');
  });
});

// --- chat controls: chips collapse (-/+), conversation clear, drag-resize ---
const chipsToggle=document.getElementById('chipsToggle');
const chatReset=document.getElementById('chatReset');
const shareBtn=document.getElementById('shareBtn');
const shareMenu=document.getElementById('shareMenu');
const downloadBtn=document.getElementById('downloadBtn');
let closeShareMenu=()=>{}; // real implementation wired up further below, once the menu exists
const dragHandle=document.getElementById('dragHandle');
const sideHandle=document.getElementById('sideHandle');
const chatEl=document.querySelector('.chat');
chipsToggle.innerHTML='<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><line class="vbar" x1="12" y1="5" x2="12" y2="19"/></svg>';
chipsToggle.setAttribute('aria-expanded','true');
chipsToggle.addEventListener('click',()=>{
  const collapsed=chipsEl.classList.toggle('chips-collapsed');
  chipsToggle.setAttribute('aria-expanded',String(!collapsed));
  chipsToggle.title=collapsed?'Show questions':'Hide questions';
});
function updateChatButtons(){
  const has=thread.children.length>0;
  chatReset.hidden=!has;
  shareBtn.hidden=!has;
  downloadBtn.hidden=!has;
  dragHandle.style.display=has?'flex':'none';
  sideHandle.hidden=!has;
  if(!has) closeShareMenu();
}
new MutationObserver(updateChatButtons).observe(thread,{childList:true});
updateChatButtons();
chatReset.addEventListener('click',()=>{
  if(!thread.children.length) return;
  thread.classList.add('clearing');
  setTimeout(()=>{
    thread.innerHTML='';
    thread.classList.remove('clearing');
    thread.style.height='';thread.style.maxHeight='';
    chatEl.classList.remove('is-sized');
    setChatExtend(0);
    busy=false;
    surpriseBag=[];
    chipsEl.classList.remove('chips-collapsed');
    chipsToggle.setAttribute('aria-expanded','true');
    chipsToggle.title='Hide questions';
    updateChatButtons();
    document.querySelector('.chat').scrollIntoView({behavior:'smooth',block:'start'});
  },220);
});

// --- transcript: read the live thread into plain Q/A pairs, skipping anything hidden (collapsed "more") ---
function isRowVisible(el,stopAt){
  let n=el;
  while(n&&n!==stopAt){ if(n.hidden) return false; n=n.parentElement; }
  return true;
}
function buildTranscript(){
  const pairs=[];
  [...thread.children].forEach(row=>{
    if(row.classList.contains('user')){
      pairs.push({q:row.textContent.trim(),a:''});
    } else if(row.classList.contains('bot-row')&&pairs.length){
      const paras=row.querySelectorAll('.bot-col .msg-p');
      const text=[...paras].filter(p=>isRowVisible(p,row)).map(p=>p.textContent.trim()).join('\n');
      pairs[pairs.length-1].a=text;
    }
  });
  return pairs;
}
function transcriptText(){
  const pairs=buildTranscript();
  const body=pairs.map(p=>`Q: ${p.q}\nA: ${p.a}`).join('\n\n');
  return `Conversation with Lora Maly\n\n${body}\n\n${location.href}`;
}

// --- share popover - reusable for both the chat's share button and the portfolio's ---
const openShareMenus=[];
function setupShareMenu(btn,menu,getText,subject){
  function close(){
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  }
  openShareMenus.push(close);
  btn.addEventListener('click',(e)=>{
    e.stopPropagation();
    openShareMenus.forEach(c=>{if(c!==close)c()}); // only one open at a time
    const open=menu.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  });
  menu.querySelectorAll('.share-opt').forEach(opt=>{
    opt.addEventListener('click',()=>{
      const text=getText();
      const network=opt.dataset.network;
      if(network==='whatsapp'){
        window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
      } else if(network==='telegram'){
        window.open('https://t.me/share/url?url='+encodeURIComponent(location.href)+'&text='+encodeURIComponent(text),'_blank');
      } else if(network==='email'){
        location.href='mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(text);
      }
      close();
    });
  });
  return close;
}
document.addEventListener('click',(e)=>{
  if(!e.target.closest('.share-wrap')) openShareMenus.forEach(c=>c());
});
document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape') openShareMenus.forEach(c=>c());
});
closeShareMenu=setupShareMenu(shareBtn,shareMenu,transcriptText,'My conversation with Lora Maly');
const portfolioShareBtn=document.getElementById('portfolioShareBtn');
const portfolioShareMenu=document.getElementById('portfolioShareMenu');
if(portfolioShareBtn&&portfolioShareMenu){
  setupShareMenu(portfolioShareBtn,portfolioShareMenu,
    ()=>`Lora Maly - Senior AI Product Designer, AI & Agentic UX\n${location.href}`,
    "Lora Maly's portfolio");
}
const recsShareBtn=document.getElementById('recsShareBtn');
const recsShareMenu=document.getElementById('recsShareMenu');
if(recsShareBtn&&recsShareMenu){
  setupShareMenu(recsShareBtn,recsShareMenu,
    ()=>`Recommendations for Lora Maly - Senior AI Product Designer\n${location.href}#recommendations`,
    "Recommendations for Lora Maly");
}

// --- download as PDF - fills the print-only container, then opens the browser's print dialog ---
downloadBtn.addEventListener('click',()=>{
  const pairs=buildTranscript();
  const pt=document.getElementById('printTranscript');
  const date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  pt.innerHTML='<div class="pt-brand">Hello</div><h1>Conversation with Lora Maly</h1><div class="pt-date">'+date+'</div><hr class="pt-rule">'+
    pairs.map(p=>'<div class="pt-q">'+fmt(p.q)+'</div><div class="pt-a">'+fmt(p.a)+'</div>').join('');
  window.print();
});

// --- resize: the divider grip sets the conversation's height, the side grip
// moves the panel's LEFT edge (title included): out over the photo column up
// to the hero's padding - the same 50px air it keeps on its right - or in,
// down to a 400px panel ---
const chatCol=chatEl.closest('.v1-right');
const CHAT_MIN_W=400;
let drag=null;      // {axis:'y'|'x', start, size} while a grip is held
let chatExtend=0;   // px the column has moved left (negative = narrower)
function setChatExtend(px){
  const hero=chatCol.closest('.hero');
  const edge=hero.getBoundingClientRect().left+parseFloat(getComputedStyle(hero).paddingLeft);
  const r=chatCol.getBoundingClientRect();
  const naturalLeft=r.left+chatExtend, naturalW=r.width-chatExtend;
  const max=Math.max(0, naturalLeft-edge), min=Math.min(0, CHAT_MIN_W-naturalW);
  chatExtend=Math.round(Math.max(min, Math.min(max, px)));
  chatCol.style.setProperty('--chat-extend', chatExtend+'px');
  chatCol.classList.toggle('is-wide', chatExtend>0);
}
function dragStart(axis,pos){
  drag={axis, start:pos, size:axis==='y'?thread.getBoundingClientRect().height:chatExtend};
  chatCol.classList.add('is-dragging');
  document.body.style.userSelect='none';
  document.body.style.cursor=axis==='y'?'ns-resize':'ew-resize';
}
function dragMove(x,y){
  if(!drag)return;
  if(drag.axis==='y'){
    const h=Math.max(140, Math.min(window.innerHeight*0.75, drag.size+(y-drag.start)));
    chatEl.classList.add('is-sized');
    thread.style.maxHeight=h+'px';thread.style.height=h+'px';
    updateThreadFades();
  } else {
    setChatExtend(drag.size+(drag.start-x));   // left widens, right narrows
  }
}
function dragEnd(){
  if(!drag)return;
  drag=null;
  chatCol.classList.remove('is-dragging');
  document.body.style.userSelect='';document.body.style.cursor='';
}
dragHandle.addEventListener('mousedown',e=>{e.preventDefault();dragStart('y',e.clientY)});
sideHandle.addEventListener('mousedown',e=>{e.preventDefault();dragStart('x',e.clientX)});
window.addEventListener('mousemove',e=>dragMove(e.clientX,e.clientY));
window.addEventListener('mouseup',dragEnd);
dragHandle.addEventListener('touchstart',e=>{dragStart('y',e.touches[0].clientY)},{passive:true});
sideHandle.addEventListener('touchstart',e=>{dragStart('x',e.touches[0].clientX)},{passive:true});
window.addEventListener('touchmove',e=>{if(drag)dragMove(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
window.addEventListener('touchend',dragEnd);
sideHandle.addEventListener('dblclick',()=>setChatExtend(0));
// a narrower window changes both limits - re-clamp (0 in the one-column layout)
window.addEventListener('resize',()=>{if(chatExtend)setChatExtend(window.innerWidth>960?chatExtend:0)});

// fade the clipped edges of the conversation (top/bottom) based on scroll position
function updateThreadFades(){
  const canUp=thread.scrollTop>6;
  const canDown=thread.scrollTop+thread.clientHeight<thread.scrollHeight-6;
  thread.classList.toggle('fade-top',canUp);
  thread.classList.toggle('fade-bottom',canDown);
}
thread.addEventListener('scroll',updateThreadFades);
new MutationObserver(()=>requestAnimationFrame(updateThreadFades)).observe(thread,{childList:true,subtree:true});
window.addEventListener('resize',updateThreadFades);
