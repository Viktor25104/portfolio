export interface Skill {
  id: string;
  name: string;
  description: string;
  level: string;
  experience: number;
  projects?: string[];
  category: string;
  color: string;
  keyPoints?: string[];
  tools?: string[];
}
