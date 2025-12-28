export interface BiographySection {
  title: string;
  content: string;
  extra: string;
}

export interface Language {
  language: string;
  level: string;
}

export interface Availability {
  status: 'available' | 'busy';
  message: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
  label: string;
}

export interface Photo {
  url: string;
  alt: string;
}

export interface BiographyTranslation {
  name: string;
  title: string;
  location: string;
  availability: Availability;
  longBio: string;
  sections: BiographySection[];
  languages: Language[];
}

export interface TimelineEntry {
  date: string;
  title: string;
  company: string;
  description: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  availability: Availability;
  longBio: string;
  photos: Photo[];
  socialLinks: SocialLink[];
  sections: BiographySection[];
  languages: Language[];
}

export interface Biography {
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  longBio: string;
  sections: BiographySection[];
  languages: Language[];
  availability: Availability;
  translations?: {
    [lang: string]: BiographyTranslation;
  };
}
