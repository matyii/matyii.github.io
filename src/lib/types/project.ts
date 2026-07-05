export type ProjectLink = {
  label: string;
  url: string;
};

export type ProjectBadge = {
  label: string;
};

export type ProjectTimelineItem = {
  phase: string;
  period: string;
  details?: string;
};

export type ProjectMetric = {
  label: string;
  value: string;
};

export type RawProject = {
  id?: string;
  title: string;
  url: string;
  description: string;
  extended_description?: string;
  image: string;
  images?: string[];
  badges?: ProjectBadge[];
  links?: ProjectLink[];
  featured?: boolean;
  role?: string;
  status?: string;
  year?: string;
  architecture?: string[];
  features?: string[];
  timeline?: ProjectTimelineItem[];
  challenges?: string[];
  lessonsLearned?: string[];
  metrics?: ProjectMetric[];
};

export type Project = {
  id: string;
  title: string;
  url: string;
  description: string;
  extendedDescription: string;
  heroImage: string;
  gallery: string[];
  badges: ProjectBadge[];
  links: ProjectLink[];
  featured: boolean;
  role: string;
  status: string;
  year: string;
  architecture: string[];
  features: string[];
  timeline: ProjectTimelineItem[];
  challenges: string[];
  lessonsLearned: string[];
  metrics: ProjectMetric[];
};
