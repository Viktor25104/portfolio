export interface LearningStep {
  date: string;
  milestone: string;
  description: string;
}

export interface RelatedResource {
  title: string;
  url: string;
  type: 'Book' | 'Course' | 'Documentation' | 'Video' | 'Article' | 'Tool' | 'Technique';
  description?: string;
}

export interface SkillCategory {
  name: string;
  color: string;
  description: string;
}

export interface SkillTranslation {
  description: string;
  fullDescription?: string;
  keyFeatures?: string[];
  useCases?: string[];
  futureGoals?: string[];
  learningJourney?: LearningStep[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  fullDescription?: string;
  experience: number;
  projects?: string[];
  color?: string;
  learningJourney?: LearningStep[];
  keyFeatures?: string[];
  useCases?: string[];
  relatedSkills?: string[];
  resources?: RelatedResource[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  futureGoals?: string[];
  translations?: {
    [lang: string]: SkillTranslation;
  };
}