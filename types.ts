export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
}

export interface Book {
  title: string;
  author: string;
  status: 'Lido' | 'Lendo' | 'Recomendado' | 'Read' | 'Reading' | 'Recommended';
  coverUrl?: string;
  thoughts?: string;
  amazonUrl?: string;
  amazonUrlBR?: string;
  amazonUrlUS?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface PersonalInfo {
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface AppContent {
  nav: {
    about: string;
    experience: string;
    blog: string;
    books: string;
  };
  headers: {
    skills: string;
    education: string;
    experience: string;
    experienceSub: string;
    writing: string;
    writingSub: string;
    books: string;
    booksSub: string;
    readArticle: string;
  };
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  books: Book[];
}
