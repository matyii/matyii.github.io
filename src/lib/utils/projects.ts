import type { Project, RawProject } from "$lib/types/project";

function defaultArchitecture(raw: RawProject): string[] {
  const stacks = raw.badges?.map((badge) => badge.label).join(", ") || "modern web tooling";
  return [
    `Core implementation built with ${stacks}.`,
    "Focused on a clean information architecture and readable UI composition.",
    "Shipped with progressive enhancement and responsive behavior."
  ];
}

function defaultFeatures(raw: RawProject): string[] {
  return [
    raw.description,
    "Responsive layout optimized for desktop and mobile usage.",
    "Clear navigation and straightforward interaction design."
  ];
}

export function normalizeProject(raw: RawProject): Project {
  const gallery = raw.images && raw.images.length > 0
    ? raw.images
    : [raw.image];

  return {
    id: raw.id ?? raw.url,
    title: raw.title,
    url: raw.url,
    description: raw.description,
    extendedDescription: raw.extended_description ?? raw.description,
    heroImage: raw.image,
    gallery,
    badges: raw.badges ?? [],
    links: raw.links ?? [],
    featured: raw.featured ?? false,
    role: raw.role ?? "Full-stack developer",
    status: raw.status ?? "Completed",
    year: raw.year ?? "2024",
    architecture: raw.architecture && raw.architecture.length > 0 ? raw.architecture : defaultArchitecture(raw),
    features: raw.features && raw.features.length > 0 ? raw.features : defaultFeatures(raw),
    timeline: raw.timeline && raw.timeline.length > 0
      ? raw.timeline
      : [
          {
            phase: "Build and iteration",
            period: "Initial release",
            details: "Implemented core scope and refined UX through iterative improvements."
          }
        ],
    challenges: raw.challenges && raw.challenges.length > 0
      ? raw.challenges
      : ["Balancing implementation speed with maintainable architecture decisions."],
    lessonsLearned: raw.lessonsLearned && raw.lessonsLearned.length > 0
      ? raw.lessonsLearned
      : ["Investing in clear component boundaries improves long-term project velocity."],
    metrics: raw.metrics ?? []
  };
}

export function projectImagePath(project: Project, imageName: string): string {
  return `/img/projects/${project.url}/${imageName}`;
}

export function projectHeroImagePath(project: Project): string {
  return projectImagePath(project, project.heroImage);
}
