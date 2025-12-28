/* eslint-disable */
// Generated from projects.json
export type ProjectsData = {
  PROJECTS_TITLE: Record<string, string>;
  PROJECTS_SUBTITLE: Record<string, string>;
  ALL_PROJECTS: Record<string, string>;
  WEB_DEVELOPMENT: Record<string, string>;
  MOBILE_APPS: Record<string, string>;
  GAMES: Record<string, string>;
  BLOCKCHAIN: Record<string, string>;
  CYBERSECURITY: Record<string, string>;
  VIEW_DETAILS: Record<string, string>;
  BACK_TO_PROJECTS: Record<string, string>;
  PROJECT_GALLERY: Record<string, string>;
  PROJECT_NOT_FOUND: Record<string, string>;
  HOME_LABEL: Record<string, string>;
  TECHNOLOGIES_USED: Record<string, string>;
  FRONTEND: Record<string, string>;
  BACKEND: Record<string, string>;
  OTHER_TOOLS: Record<string, string>;
  KEY_FEATURES: Record<string, string>;
  KEY_ACHIEVEMENTS: Record<string, string>;
  VIEW_CODE: Record<string, string>;
  LIVE_DEMO: Record<string, string>;
  VIEW_FULL_PROJECT: Record<string, string>;
  MY_ROLE: Record<string, string>;
  PROJECT_DURATION: Record<string, string>;
  projects: ({
      id: string;
      title: Record<string, string>;
      category: string;
      thumbnail: string;
      description: Record<string, string>;
      role: Record<string, string>;
      duration: string;
      images: (string)[];
      techStack: {
        frontend: (string)[];
        backend: (string)[];
        other: (string)[];
      };
      keyFeatures: (Record<string, string>)[];
      achievements: (Record<string, string>)[];
      links: {
        demo: string;
      };
      hasFullPage: boolean;
    } | {
      id: string;
      title: Record<string, string>;
      category: string;
      thumbnail: string;
      description: Record<string, string>;
      role: Record<string, string>;
      duration: string;
      images: (string)[];
      techStack: {
        frontend: unknown[];
        backend: (string)[];
        other: (string)[];
      };
      keyFeatures: (Record<string, string>)[];
      achievements: (Record<string, string>)[];
      links: {

      };
      hasFullPage: boolean;
    } | {
      id: string;
      title: Record<string, string>;
      category: string;
      thumbnail: string;
      description: Record<string, string>;
      role: Record<string, string>;
      duration: string;
      images: (string)[];
      techStack: {
        frontend: unknown[];
        backend: unknown[];
        other: (string)[];
      };
      keyFeatures: (Record<string, string>)[];
      achievements: (Record<string, string>)[];
      links: {

      };
      hasFullPage: boolean;
    })[];
};
