/* eslint-disable */
// Generated from biography.json
export type BiographyData = {
  name: Record<string, string>;
  title: Record<string, string>;
  location: Record<string, string>;
  email: string;
  phone: string;
  availability: {
    status: string;
    message: Record<string, string>;
  };
  longBio: Record<string, string>;
  sections: ({
      title: Record<string, string>;
      content: Record<string, string>;
      extra: Record<string, string>;
    } | {
      title: Record<string, string>;
      content: Record<string, string>;
    })[];
  languages: ({
      language: string;
      level: string;
    })[];
};
