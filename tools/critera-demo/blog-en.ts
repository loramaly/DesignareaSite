// The English demo's blog: four articles only, in their own English edition (not a line-by-line
// translation of the Hebrew, so they live here instead of in en.json). vite.config.ts swaps the site's
// content/blog/index.ts for this file in the English build; the Hebrew demo keeps the site's full blog.
// Same exports as the site's index.ts, so the blog pages read it unchanged.
import type { BlogArticle, CategoryId } from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/content/blog/types'
import visionCover from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/assets/blog/israel-business-finance-market.webp'
import launchCover from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/assets/blog/critera-ai-launch.webp'
import brokersCover from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/assets/blog/brokers-infrastructure.webp'
import companiesCover from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/assets/blog/companies-competing-offers.webp'

export * from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/content/blog/types'

const launch: BlogArticle = {
  slug: 'critera-ai-launch',
  title: 'Critera Is Opening for Early Access. Help Shape What Comes Next.',
  metaTitle: 'Critera Is Opening for Early Access | Critera',
  metaDescription: 'Critera, an AI-powered marketplace for corporate credit and project financing, is opening for early access: introductory terms, personal guidance and a voice in the product.',
  category: 'platform',
  publishedISO: '2026-10-14',
  publishedDisplay: 'October 14, 2026',
  readingMinutes: 4,
  teaser: 'Critera is opening for early access. What the marketplace is, who it is for, and why joining early matters - including introductory terms and personal guidance.',
  cover: launchCover,
  coverAlt: 'A white rocket on a launch pad at sunrise, seconds before lift-off, white vapor at its base',
  featured: true,
  blocks: [
    { t: 'lead', text: 'Anyone who has arranged business financing knows the routine. A meeting with one lender. Another set of documents for the next. A wait for an answer. And a question that never quite goes away: have we actually explored the right options for this deal?' },
    { t: 'p', text: "The problem isn't simply a lack of capital. It's the difficulty of reaching suitable lenders and comparing what they're willing to offer. Even substantial transactions can still move through email threads, spreadsheets and phone calls." },
    { t: 'p', text: "That's why we're building Critera: an AI-powered marketplace for corporate credit and project financing, designed to connect borrowers, lenders and brokers through a more structured process. As we prepare for early access, we're inviting participants to help shape how it works." },
    { t: 'h2', id: 'in-two-minutes', text: 'Critera in Two Minutes' },
    { t: 'p', text: 'Instead of preparing separate submissions for every institution, a borrower creates one structured financing request covering the business, the transaction, collateral and cash flow.' },
    { t: 'p', text: "AI helps gather and analyze the information, support due diligence and organize a credit file that lenders can review. It doesn't replace human underwriting. It helps prepare the work that comes before it." },
    { t: 'p', text: 'The marketplace is designed to connect each opportunity with a relevant panel of banks, non-bank lenders and institutional financing providers. Lenders evaluate the request independently and may submit offers without seeing competing terms. The borrower compares the options and decides whether to proceed. Every lender retains control of its own credit decision.' },
    { t: 'h2', id: 'why-now', text: 'Why Join at the Early-Access Stage?' },
    { t: 'item', title: 'Introductory terms', text: 'During the early-access period, the proposed service offer includes a limited-time 40% discount and personal guidance through the financing process. Not just a chatbot. Real people, working with you on your transaction. Full eligibility and service terms should be confirmed with the team.' },
    { t: 'item', title: 'A voice in the product', text: "Early feedback can help shape what information is requested, where the process creates friction and how financing offers are presented for comparison. We're building for the way professionals actually work, not for an idealized workflow on a slide." },
    { t: 'item', title: 'The freedom to evaluate', text: 'Submitting a financing request does not, by itself, mean accepting an offer. Borrowers remain free to review the available terms and decide whether to move forward, subject to the applicable service agreement.' },
    { t: 'h2', id: 'who-for', text: 'Who Is It For?' },
    { t: 'p', text: 'Critera is designed for substantial corporate and project financing needs, including real estate and development projects, business credit, working capital and growth financing.' },
    { t: 'p', text: "It's also intended for brokers and financing advisers who manage transactions on behalf of clients, and for professional lenders interested in joining the financing panel as it develops.", links: { 'brokers and financing advisers': '/blog/brokers-infrastructure' } },
    { t: 'h2', id: 'now-what', text: "What's Next?" },
    { t: 'p', text: "Join the early-access conversation. Tell us what you're trying to finance, where the current process slows you down and what a better experience would need to deliver." },
    { t: 'p', text: "For decades, financing has relied on the phone. We're building the infrastructure to support what comes next." },
  ],
  faq: [
    { q: 'Does it cost anything to submit a request?', a: 'Under the service model described for Critera, submitting a request is intended to carry no application or retainer fee. A service fee would apply when a transaction closes. A limited-time 40% introductory discount is also planned. Confirm the full commercial terms, including eligibility and when charges apply, before participating.' },
    { q: 'What does early access mean?', a: 'It means the marketplace is being developed and refined while lender connections and operating processes are established. Participants may be able to provide direct feedback and receive personal support. Early access does not guarantee a particular number of offers, a closing date or specific financing terms.' },
    { q: 'Am I required to accept an offer?', a: 'No. Submitting a request does not oblige you to accept financing. You can review proposed terms, ask questions, negotiate or decide not to proceed. Likewise, receiving a financing request does not oblige a lender to approve it. Both sides retain their own decision-making authority.' },
    { q: 'Who makes the credit decision?', a: "The lender does. Critera is designed to use AI to help collect, analyze and organize information for review, but the lender's credit team or committee determines whether to provide financing and on what terms. Responsibility for the decision stays with the financing institution." },
  ],
}

const companies: BlogArticle = {
  slug: 'companies-competing-offers',
  title: "Raising Business Finance? One Offer Doesn't Tell You What the Market Would Offer.",
  metaTitle: "Raising Business Finance? One Offer Isn't the Market | Critera",
  metaDescription: "Without a meaningful comparison, it's hard to know whether a financing offer reflects what the market would offer. How one structured request changes the starting point.",
  category: 'platform',
  publishedISO: '2026-10-11',
  publishedDisplay: 'October 11, 2026',
  readingMinutes: 5,
  teaser: "The offer you received isn't the market. Why comparing financing offers matters, how the process works from the borrower's side, and what to do now.",
  cover: companiesCover,
  coverAlt: 'Top-down photo of a wooden desk with five financing offers side by side, a hand with a pen above the middle one, an espresso cup and a phone',
  blocks: [
    { t: 'lead', text: "The offer you received isn't the market. It's just the offer you received." },
    { t: 'p', text: "How many proposals were on the table when you arranged your last financing deal? One? Two? Without a meaningful comparison, it's hard to know whether the interest rate, funding amount and security requirements reflect what other suitable lenders might have offered." },
    { t: 'p', text: "And the cost isn't just the interest. Executives spend time in meetings, preparing documents and waiting for decisions instead of running the business. Those weeks or months have a real commercial cost, even when they never appear in a loan agreement." },
    { t: 'p', text: "There's also an information problem. Your existing bank may know your business well. A new lender often starts with a much narrower picture. A sound business can struggle to reach the right financing partners simply because the information is scattered and the process is fragmented." },
    { t: 'p', text: 'Critera is being built to change that starting point: prepare one organized request and make it easier for relevant lenders to evaluate the opportunity.' },
    { t: 'h2', id: 'how-it-works', text: 'How It Works From Your Side' },
    { t: 'p', text: 'The intended process has four stages.' },
    { t: 'item', title: 'Submit one request', text: 'Information about your company, the transaction, collateral and cash flow is gathered in a structured format instead of being recreated for every lender.' },
    { t: 'item', title: 'Prepare the credit file', text: "AI helps collect and analyze the information, support due diligence and organize it for lender review. It doesn't promise approval or replace the lender's own underwriting." },
    { t: 'item', title: 'Reach relevant lenders', text: "The marketplace is designed to bring opportunities to suitable banks, non-bank lenders and institutional financing providers. The process is intended to protect the borrower's identity during initial screening, with identifying details disclosed later according to the agreed process." },
    { t: 'item', title: 'Compare and decide', text: 'If offers are received, you can examine pricing, financing amounts, collateral, repayment structures and other terms side by side. Whether to proceed remains your decision.' },
    { t: 'h2', id: 'what-is-it-worth', text: 'What Is That Worth?' },
    { t: 'p', text: 'Even a small difference in interest rates can have a significant effect on the cost of a large financing transaction. But headline rates tell only part of the story. Fees, repayment schedules, security requirements and flexibility can matter just as much.' },
    { t: 'p', text: "A comparison gives you a better view of those trade-offs. It doesn't guarantee that one lender will beat another, but it helps you understand what you're agreeing to." },
    { t: 'p', text: "There's a second benefit: management time. Preparing information once and making it available to multiple relevant institutions is intended to reduce repeated work and sequential waiting. The goal is a more efficient path to potential offers, not an unverified promise about how quickly a deal will close." },
    { t: 'h2', id: 'who-for', text: "Who Is It For, and Who Isn't It For?" },
    { t: 'p', text: "Critera is being designed for substantial financing transactions: project and real estate finance, corporate borrowing, larger working-capital needs and growth funding. It isn't intended to replace everyday small-business loan products." },
    { t: 'callout', text: 'And a necessary qualification: a marketplace cannot turn a weak business into a strong one. Nor can competition guarantee an approval or attractive terms. What a better process can do is help a transaction reach more suitable lenders with a consistent set of information, giving the borrower a clearer basis for making a decision.' },
    { t: 'h2', id: 'worth-doing-now', text: 'One Thing Worth Doing Now, Even Without Critera' },
    { t: 'p', text: 'Get your financial information in order.' },
    { t: 'p', text: 'Review outstanding obligations, reconcile payment records and make sure your financial statements and supporting documents tell a consistent story. Resolve inaccuracies before they become questions during due diligence.' },
    { t: 'p', text: "A lender that doesn't already know your company needs a reliable picture of its performance and commitments. The clearer that picture is, the easier it becomes to assess the opportunity on its merits." },
    { t: 'p', text: 'The financing process may change. Good financial records will always matter.' },
  ],
  faq: [
    { q: 'Does it cost anything to submit a request?', a: 'Under the proposed service model, there is no application or retainer fee for submitting a financing request. A service fee would be payable only if a transaction closes. A limited-time 40% introductory discount is also planned, together with personal guidance. Full terms should be reviewed before participation.' },
    { q: 'How long does it take to receive offers?', a: "The process is designed to reduce delays by preparing one credit file for review by multiple relevant lenders, rather than approaching each institution separately. Timing will still depend on the transaction, the completeness of the information and each lender's review. No specific turnaround time is guaranteed at this stage." },
    { q: "Who can see my company's information?", a: "The proposed process is designed to keep the borrower's identity anonymous during initial lender screening. Identifying details may be shared later, under the applicable consent and disclosure arrangements, when a relevant lender needs them to continue its assessment. Participants should review the information-sharing terms before submitting a request." },
    { q: 'Does submitting a request mean I have to accept an offer?', a: 'No. Submitting a request does not require a business to accept financing. You can review proposals, ask questions, negotiate or decide not to proceed. Likewise, a lender is not required to approve credit simply because it receives a request. Each party makes its own decision.' },
  ],
}

const brokers: BlogArticle = {
  slug: 'brokers-infrastructure',
  title: 'For Finance Brokers and Advisers: Your Relationships Are the Asset. Now Give Them Better Infrastructure.',
  metaTitle: 'For Finance Brokers and Advisers: Better Infrastructure | Critera',
  metaDescription: "Your judgment and relationships are the value you bring. Critera is being built as infrastructure for brokers and financing advisers - not as a replacement.",
  category: 'platform',
  publishedISO: '2026-10-09',
  publishedDisplay: 'October 9, 2026',
  readingMinutes: 5,
  teaser: "The problem isn't the broker. It's the infrastructure. How a marketplace can give advisers broader reach, less repeated work and a clearer client conversation.",
  cover: brokersCover,
  coverAlt: 'A conductor leading an orchestra of old telephones, under a sign that reads The Market Conductor',
  blocks: [
    { t: 'lead', text: 'A client calls with a major project that needs financing. You already have a sense of which lenders might be interested, whom to approach and how to position the transaction.' },
    { t: 'p', text: 'Then the less visible work begins: sending summaries to contacts, sharing documents across email threads, following up, chasing responses and updating a spreadsheet that never seems to stay current.' },
    { t: 'p', text: 'Weeks can pass. A couple of lenders express interest. And the client asks the question every adviser knows: Are these really our best options?' },
    { t: 'p', text: "Your judgment, relationships and ability to understand a deal are the value you bring. The problem isn't the broker. It's the infrastructure that leaves experienced professionals spending too much of their time on administration." },
    { t: 'callout', text: 'Critera is being built for you, too. Not as a replacement. As infrastructure.' },
    { t: 'h2', id: 'what-changes', text: 'What Actually Changes?' },
    { t: 'p', text: "A good adviser brings experience, guidance and access to lenders. But even a strong network doesn't update itself. A fund's appetite can shift. A lender that once favored one type of project may now prefer another. What was true six months ago may no longer be true today." },
    { t: 'p', text: 'Critera is designed to help present a structured financing request to a panel of relevant banks, non-bank lenders and institutional financing providers. Offers can be organized in a format that makes them easier to compare.' },
    { t: 'p', text: 'The adviser still does the work that matters most: preparing the transaction, helping the client understand the implications of each offer, negotiating terms and guiding the deal toward closing.' },
    { t: 'p', text: 'The ambition is straightforward: fewer hours spent on document chasing, more time spent advising clients.' },
    { t: 'h2', id: 'with-brokers', text: "Why We're Building With Brokers, Not Around Them" },
    { t: 'p', text: "Brokers and financing advisers are essential to complex transactions. They understand the people, the process and the details that don't fit neatly into a form. A marketplace that ignores that expertise misses a central part of how financing actually works." },
    { t: 'p', text: "Critera's model is designed to let advisers work with their own clients while gaining three practical advantages." },
    { t: 'item', title: 'Broader reach', text: "A relevant lender panel can extend beyond any individual's contact list and help reflect changing financing preferences." },
    { t: 'item', title: 'Less repeated work', text: 'One structured transaction file reduces the need to recreate the same package for every institution.' },
    { t: 'item', title: 'A clearer client conversation', text: 'Organized offers make it easier to explain differences in pricing, collateral, repayment structures and other terms.' },
    { t: 'p', text: 'Technology should take friction out of the process, not take the adviser out of the relationship.' },
    { t: 'h2', id: 'the-real-question', text: "The Question You're Really Asking" },
    { t: 'p', text: 'What if my client goes directly to the marketplace?' },
    { t: 'p', text: "It's a fair question. Clients can approach lenders directly today. Yet arranging a substantial financing transaction isn't the same as filling out a form. Someone still needs to frame the opportunity, assess the financing structure, understand what lenders will examine and recognize the clauses that deserve negotiation." },
    { t: 'p', text: 'A marketplace can improve access and information flow. It cannot replace the experience of the person guiding the transaction. In complex financing, good advice remains valuable precisely because the decisions are complex.' },
    { t: 'h2', id: 'now-what', text: "What's Next?" },
    { t: 'p', text: "We're developing a partner pathway for brokers and financing advisers. During the early-access stage, advisers can help shape the tools they would use with clients, while clients may qualify for introductory terms.", links: { 'early-access stage': '/blog/critera-ai-launch' } },
    { t: 'p', text: "Your phone book still matters. We're building a way to connect that expertise to a wider financing network." },
  ],
  faq: [
    { q: 'Does Critera compete with brokers?', a: "No. Critera is designed to support brokers and financing advisers as they manage client relationships and transactions. The marketplace aims to provide structured credit files, access to relevant lenders and a clearer way to compare offers. The adviser's expertise, relationships and ongoing guidance remain central to the client's experience." },
    { q: 'What does a broker gain from the marketplace?', a: 'The proposed model combines access to a wider lender panel, matching based on transaction requirements, a consistent credit file and organized financing offers. The goal is to reduce repetitive administration so advisers can spend more time structuring deals, negotiating terms and supporting clients through important decisions.' },
    { q: 'How is the broker-client relationship protected?', a: 'The intended model allows the broker to continue managing the client relationship and the transaction introduced through the marketplace. Specific commercial protections, ownership of the relationship and partner terms still need to be defined and confirmed in the applicable agreement.' },
  ],
}

const vision: BlogArticle = {
  slug: 'israel-business-finance-market',
  title: "Business Financing Still Runs on Phone Calls. We're Building What Comes Next.",
  metaTitle: 'Business Financing Still Runs on Phone Calls | Critera',
  metaDescription: 'Stocks have exchanges. Business financing has phone calls. Why large financing deals still move by hand, what AI changes, and what Critera is building.',
  category: 'market',
  publishedISO: '2026-09-27',
  publishedDisplay: 'September 27, 2026',
  readingMinutes: 6,
  teaser: "A company needs substantial funding for a new project. Where does it go to compare offers? Why financing still runs on phone calls, and what makes change possible now.",
  cover: visionCover,
  coverAlt: 'A giant rotary phone on a pedestal in the middle of a modern glass office - the analog age at the heart of the financing market',
  blocks: [
    { t: 'lead', text: 'A company needs substantial funding for a new project. Where does it go to compare offers?' },
    { t: 'p', text: 'Stocks have exchanges. Currencies have established markets. Yet when a business needs a major loan, there is often no straightforward place to present the opportunity and see which lenders are interested. Instead, there are phone calls. A conversation with a bank, an introduction through a broker, a meeting with a private credit fund. Each institution reviews the deal separately, and each response arrives on its own schedule, in its own format.' },
    { t: 'p', text: "If you've raised financing before, you know the routine: meetings, repeated document requests, long waits and the nagging question of whether the offer on the table is really the best one available." },
    { t: 'callout', text: "The money hasn't disappeared. The problem is how businesses reach it. Information moves slowly, comparisons are difficult, and promising deals can depend too heavily on who knows whom. We're building infrastructure to address that gap." },
    { t: 'h2', id: 'the-gap', text: "Technology Moved Forward. The Financing Process Didn't." },
    { t: 'p', text: 'Almost every major business process has changed over the past three decades. Large financing transactions, however, can still involve separate meetings, spreadsheets, repeated reviews and weeks of waiting. Professional relationships remain essential, but without shared infrastructure, those relationships can also determine which lenders ever see a deal.' },
    { t: 'p', text: "This isn't the fault of any one bank or fund. An individual lender has little incentive to build a system that also benefits its competitors. So every institution manages its own process, while the transaction travels between them by email and phone." },
    { t: 'p', text: "The borrower pays for that fragmentation. An existing banking relationship may give one lender a detailed view of the business, while others see little more than financial statements and a presentation. It's difficult to compare offers when lenders aren't starting with the same information." },
    { t: 'p', text: 'Large amounts of capital are available. Yet too many financing conversations still begin, and end, with a phone call.' },
    { t: 'h2', id: 'what-changed', text: 'What Changed? AI Made Shared Preparation Possible.' },
    { t: 'p', text: 'A serious financing request requires far more than a revenue check. Lenders need to examine financial performance, cash flow, collateral, risk, the proposed structure and the conditions surrounding the transaction. Much of that work is repeated by every institution approached.' },
    { t: 'p', text: 'AI can help organize and analyze large volumes of information, identify gaps and prepare a consistent credit file for review. Instead of rebuilding the same materials for each conversation, borrowers can present a common starting point to relevant lenders.' },
    { t: 'p', text: "That doesn't remove professional judgment. It gives credit teams more time to exercise it." },
    { t: 'p', text: 'There are already signs of this shift. Platforms such as Termgrid and Loanboox have brought more structure to debt financing workflows, while major financial institutions have invested in shared infrastructure for syndicated lending. The direction is clear: financing needs better ways to move information and coordinate participants.' },
    { t: 'p', text: "What we're building brings those ideas together around the financing request itself. And that's the opportunity." },
    { t: 'h2', id: 'what-we-build', text: "What We're Building" },
    { t: 'p', text: 'Critera is an AI-powered marketplace for corporate credit and project financing. Its purpose is to connect businesses seeking capital with relevant banks, non-bank lenders and institutional financing providers through one structured process.' },
    { t: 'p', text: 'A borrower submits the information once. AI helps collect and analyze the data, support due diligence, assess risk and organize a credit file that lenders can examine. Relevant institutions can then review the same opportunity and decide whether to make an offer.' },
    { t: 'p', text: "The AI doesn't approve loans. Each lender remains responsible for its own underwriting, credit decisions and terms." },
    { t: 'p', text: 'Think of the logic behind a competitive offering: several institutions evaluate the same opportunity, each forming its own view and submitting terms independently. The borrower can then compare the offers rather than treating the first response as the whole market.' },
    { t: 'p', text: "We're working toward a process that makes it easier to get a well-prepared financing request in front of the right people, without repeating the same administrative work at every step." },
    { t: 'h2', id: 'what-could-change', text: 'What Could This Change?' },
    { t: 'p', text: "Let's start with what we can't promise. No marketplace can guarantee a particular interest rate, an approval or a fixed amount of savings. Those depend on the borrower, the transaction and the lender's assessment." },
    { t: 'p', text: 'What can change is access to a better-organized process. Borrowers get a clearer basis for comparing offers. Lenders receive information prepared for review. Brokers and financing advisers gain infrastructure that supports their expertise rather than competing with it.', links: { 'Brokers and financing advisers': '/blog/brokers-infrastructure' } },
    { t: 'p', text: "The goal isn't to replace professional relationships. It's to stop making those relationships carry the entire operational burden of a financing transaction." },
    { t: 'p', text: "Business financing shouldn't depend solely on who picks up the phone first. Good opportunities deserve a clear path to the institutions equipped to finance them." },
    { t: 'callout', text: 'Not another company selling money. A marketplace where there used to be only phone calls.' },
    { t: 'p', text: "We're building that infrastructure now, with room for borrowers, lenders and advisers who want to help shape it." },
  ],
  faq: [
    { q: 'What is Critera?', a: 'Critera is an AI-powered marketplace being developed for corporate credit and project financing. The idea is to let businesses prepare one structured financing request for review by relevant lenders, rather than rebuilding the same application for each institution. Its purpose is to make the process more organized and offers easier to compare.' },
    { q: 'How is Critera different from a broker?', a: 'A broker brings experience, lender relationships and judgment that software cannot replace. Critera is designed to provide shared infrastructure: a structured credit file, access to a relevant lender panel and a clearer way to compare offers. Brokers and advisers are intended to be part of the model, not its competitors.' },
    { q: 'Does AI make the lending decision?', a: "No. AI helps collect, organize and analyze information and prepare the transaction for review. It does not approve financing or replace a lender's credit committee. Each financial institution evaluates the opportunity under its own standards and remains responsible for the decision and the terms it offers." },
    { q: 'When will the marketplace launch?', a: "Critera is being developed and prepared for a phased launch. Specific availability and onboarding arrangements will be communicated through the company's official channels. Businesses, lenders and advisers interested in participating early can contact the team to learn about the current stage of the rollout." },
  ],
}

/** Newest first. The featured article leads the blog page. */
export const BLOG_ARTICLES: BlogArticle[] = [launch, companies, brokers, vision]

export const RENAMED_SLUGS: Record<string, string> = {
  'critera-market-launch': 'critera-ai-launch',
}

export function getArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug)
}

export function getFeatured(): BlogArticle {
  return BLOG_ARTICLES.find((a) => a.featured) ?? BLOG_ARTICLES[0]
}

export function getRelated(article: BlogArticle, count = 3): BlogArticle[] {
  const sameCategory = BLOG_ARTICLES.filter((a) => a.slug !== article.slug && a.category === article.category)
  const others = BLOG_ARTICLES.filter((a) => a.slug !== article.slug && a.category !== article.category)
  return [...sameCategory, ...others].slice(0, count)
}

export function articlesByCategory(category: CategoryId | 'all'): BlogArticle[] {
  if (category === 'all') return BLOG_ARTICLES
  return BLOG_ARTICLES.filter((a) => a.category === category)
}
