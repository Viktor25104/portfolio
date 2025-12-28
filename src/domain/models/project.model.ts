export interface ProjectImage {
    url: string;
    alt: string;
    featured?: boolean;
}

export interface ProjectLink {
    url: string;
    label: string;
    icon?: string;
}

export interface ProjectTechStack {
    frontend?: string[];
    backend?: string[];
    other?: string[];
}

export interface ProjectContent {
    title?: string;
    description: string;
    fullDescription?: string;
    contributions: string[];
    features: string[];
    challenges: string[];
    sections?: {
        title: string;
        content: string;
    }[];
    testimonials?: {
        author: string;
        role: string;
        content: string;
    }[];
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    category: 'Web Development' | 'Games' | 'Blockchain' | 'Mobile';
    thumbnail: string;
    images: ProjectImage[];
    videoUrl?: string;
    description: string;
    fullDescription?: string;
    contributions: string[];
    duration: string;
    role: string;
    techStack: ProjectTechStack;
    links: {
        github?: string;
        demo?: string;
        additional?: ProjectLink[];
    };
    features: string[];
    challenges: string[];
    testimonials?: {
        author: string;
        role: string;
        content: string;
    }[];
    relatedProjects?: string[]; // IDs of related projects
    sections?: {
        title: string;
        content: string;
        images?: ProjectImage[];
    }[];
    // Multilingual content
    translations?: {
        [lang: string]: ProjectContent;
    };
}