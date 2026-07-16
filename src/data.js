// ============================================================================
//  EDIT THIS FILE TO UPDATE YOUR PORTFOLIO
//  Everything the site shows comes from here. No build step — just edit,
//  save, and re-upload to S3. Keep the shape of each object the same.
// ============================================================================

export const profile = {
  name: "Jeffrin Goldwin",
  // Short role shown under your name (kept punchy).
  role: "Senior DevOps Engineer",
  // The animated tagline in the hero. Keep it one strong line.
  tagline: "I architect secure, scalable cloud infrastructure and ship full-stack systems end to end.",
  // A 2–3 sentence bio for the About section.
  about:
    "Senior DevOps Engineer with hands-on experience designing and delivering enterprise cloud " +
    "infrastructure, full-stack applications, and data platforms across AWS and Azure. " +
    "Skilled in DevOps, Infrastructure as Code, CI/CD automation, and cloud-native architecture " +
    "with a track record of building secure, scalable systems end to end.",
  location: "Chennai, India",
  email: "jeffcrjj@gmail.com",
  // Path to your photo. Drop a square image at assets/profile.jpg (or .png)
  // and it appears in the hero. If the file is missing, a monogram shows instead.
  photo: "assets/profile.jpg",
  // Resume: put a PDF at assets/resume.pdf, or set to null to hide the button.
  // Hidden for now — set back to "assets/resume.pdf" to show the button again.
  resume: null,
  // Small stat chips shown in the hero. Add/remove freely.
  stats: [
    { value: "AWS + Azure", label: "Multi-cloud" },
    { value: "Terraform", label: "Infra as Code" },
    { value: "CI/CD", label: "Automated delivery" },
  ],
};

// Order + labels of the tech badges under your bio.
export const skills = [
  "AWS", "Azure", "Terraform", "Docker", "Kubernetes",
  "GitHub Actions", "TypeScript", "Next.js", "NestJS", "PostgreSQL",
];

export const socials = [
  { label: "GitHub", href: "https://github.com/Jeffrin-Goldwin", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jeffrin-goldwin", icon: "linkedin" },
  { label: "Email", href: "mailto:jeffcrjj@gmail.com", icon: "mail" },
];

// ---------------------------------------------------------------------------
//  EXPERIENCE  (your roles — shown as cards under the "Experience" section)
//  `featured: true` highlights the card; `badge` overrides the corner flag
//  text (defaults to "featured").
//  `description` is the summary always shown on the card. `highlights` is the
//  bullet list revealed when the card is expanded — omit it and the card
//  simply isn't expandable.
//  When you have public repos to show, add `repo` / `demo` URLs to a card.
// ---------------------------------------------------------------------------
export const projects = [
  {
    title: "Senior Software Engineer",
    org: "JMAN Group",
    period: "Jan 2024 — Present",
    description:
      "Design and deliver cloud-native full-stack applications and enterprise cloud infrastructure across AWS and Azure — reusable Terraform modules for networking, compute, storage and security, multi-tenant SSO with Azure Entra ID / OAuth2 / OpenID Connect, and hardened CI/CD pipelines (GitHub Actions, Azure DevOps, Jenkins) with SonarQube, Trivy, secret scanning and coverage gates. Also build scalable data platforms with Microsoft Fabric, Databricks, Snowflake and dbt.",
    highlights: [
      "Designed and delivered cloud-native full-stack applications using Next.js, NestJS, TypeScript, PostgreSQL and Prisma across multiple client engagements.",
      "Built and maintained CI/CD pipelines using GitHub Actions, Azure DevOps and Jenkins, incorporating SonarQube scanning, Trivy, secret scanning, migration dry-runs and test coverage gates.",
      "Implemented enterprise authentication using Azure Entra ID, OAuth2 and OpenID Connect, including multi-tenant SSO across multiple Azure Active Directory tenants.",
      "Designed and deployed cloud infrastructure on AWS and Azure using reusable Terraform modules, covering networking, compute, storage and security across multiple environments.",
      "Implemented AWS governance controls across multi-account AWS Organizations using Service Control Policies (SCPs), Tag Policies and AWS Config for tag enforcement and compliance.",
      "Built scalable data engineering pipelines using Microsoft Fabric, Databricks, Snowflake and dbt, including on-premises data gateway integration and medallion architecture design.",
      "Automated cloud operational workflows using Azure Logic Apps, reducing manual effort for Fabric capacity management and infrastructure lifecycle tasks.",
      "Containerized applications using Docker and designed deployment strategies for Kubernetes-based environments.",
    ],
    tags: ["AWS", "Azure", "Terraform", "CI/CD", "Kubernetes", "Data Engineering"],
    repo: null,
    demo: null,
    featured: true,
    badge: "current",
  },
  {
    title: "Penetration Testing Intern",
    org: "HackUp Technology",
    period: "Dec 2023 — Jan 2024",
    description:
      "Performed web application security assessments, vulnerability analysis and penetration testing following industry-standard methodologies. Documented findings and remediation recommendations for identified vulnerabilities.",
    highlights: [
      "Performed web application security assessments, vulnerability analysis and penetration testing following industry-standard methodologies.",
      "Documented findings and remediation recommendations for identified security vulnerabilities.",
    ],
    tags: ["Security", "Pen Testing", "Web AppSec"],
    repo: null,
    demo: null,
    featured: false,
  },
];

// ---------------------------------------------------------------------------
//  CERTIFICATIONS
//  Set `credential` to a verification URL to show a "Verify credential" link,
//  or leave it null. `date` is optional.
// ---------------------------------------------------------------------------
export const certifications = [
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "",
    credential: null,
  },
];

// ---------------------------------------------------------------------------
//  BLOG  (link out to Medium/Dev.to/your own posts)
// ---------------------------------------------------------------------------
export const posts = [
  {
    title: "Terraform modules that scale across teams",
    excerpt:
      "A practical look at structuring reusable Terraform modules for multi-account, multi-cloud environments — without the copy-paste sprawl.",
    date: "2026-06-01",
    readingTime: "7 min read",
    href: "#", // placeholder — swap for your real post URL
    tag: "Infrastructure",
  },
];
