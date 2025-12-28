export interface ProjectLink {
  github?: string;
  demo?: string;
  additional?: Array<{ url: string; label: string }>;
}

export interface ProjectTechStack {
  frontend?: string[];
  backend?: string[];
  other?: string[];
}

export interface Project {
  id: string;
  title: any;
  category: string;
  thumbnail: string;
  description?: any;
  role?: any;
  duration?: string;
  images: string[];
  techStack?: ProjectTechStack;
  keyFeatures?: any[];
  achievements?: any[];
  links?: ProjectLink;
  hasFullPage?: boolean;
}
