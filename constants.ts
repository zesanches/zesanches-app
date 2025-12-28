import { AppContent } from './types';

const COMMON_DATA = {
  name: "José Malassise",
  email: "josemanoelmalassise@gmail.com",
  linkedin: "https://www.linkedin.com/in/josemalassise353380227",
  github: "https://github.com/zesanches",
  skills: [
    {
      category: "Tech Stack",
      items: ["React", "TypeScript", "JavaScript", "Next.js", "Node.js", "Git"]
    },
    {
      category: "Metodologias & Outros",
      items: ["Scrum", "Component Library (Shadcn UI, Material UI, Radix UI, etc.)", "Integração Backend", "Push Notifications", "Gerenciamento de Estado Global (Zustand, Redux, Context API)", "Websocket"]
    }
  ]
};

export const CONTENT_PT: AppContent = {
  nav: {
    about: 'Sobre',
    experience: 'Experiência',
    blog: 'Blog',
    books: 'Livros',
  },
  headers: {
    skills: 'Competências',
    education: 'Formação Acadêmica',
    experience: 'Experiência Profissional',
    experienceSub: 'Minha trajetória construindo interfaces e resolvendo problemas.',
    writing: 'Escrita',
    writingSub: 'Pensamentos sobre desenvolvimento, arquitetura e carreira.',
    books: 'Livros Lidos e Recomendados',
    booksSub: 'Uma curadoria de leituras que moldaram minha visão técnica e profissional.',
    readArticle: 'Ler artigo'
  },
  personalInfo: {
    ...COMMON_DATA,
    role: "Desenvolvedor Front-end (futuro especialista em JavaScript) | React | Typescript",
    location: "Londrina, Paraná, Brasil",
    summary: `Sou um Desenvolvedor Front-end apaixonado por transformar requisitos de negócio em interfaces escaláveis, resilientes e de alta performance. Com sólida experiência no ecossistema React, foco na criação de componentes reutilizáveis e acessíveis que garantem a melhor experiência para o usuário.

Atualmente, na X-Brain Software Development, atuo no desenvolvimento de sistemas de missão crítica para a Claro. Meu trabalho impacta diretamente tanto a operação interna (sistemas de vendas e gestão de funcionários) quanto o cliente final, através de formulários e fluxos de vendas externos de alto volume. Busco, um dia, me tornar um desenvolvedor full-stack especialista em JavaScript, atualmente estou focando meus estudos em me especializar na linguagem.`
  },
  experiences: [
    {
      company: "X-Brain Desenvolvimento de Sistemas",
      role: "Desenvolvedor de front-end",
      period: "julho de 2022 - Presente",
      location: "Londrina, Paraná, Brasil",
      description: [
        "Atuação direta no projeto da Claro, desenvolvendo sistemas utilizados para operações críticas de vendas, realização de ligações e controle interno de funcionários.",
        "Desenvolvimento de interfaces escaláveis com React e Redux para portais de autoatendimento e formulários externos utilizados diretamente por clientes finais da Claro.",
        "Construção de componentes reutilizáveis e acessíveis, focados na experiência do usuário e eficiência operacional.",
        "Colaboração em equipes ágeis multidisciplinares para levantamento de requisitos técnicos e alinhamento com os objetivos de negócio do cliente."
      ]
    },
    {
      company: "X-Brain Desenvolvimento de Sistemas",
      role: "Estagiário",
      period: "abril de 2022 - julho de 2022",
      location: "Londrina, Paraná, Brasil",
      description: [
        "Buscando mais experiência e aprendizado desenvolvi componentes e features que aumentavam minhas capacidades como desenvolvedor e implementavam soluções que melhoram a experiência do usuário e a usabilidade dos nossos sistemas."
      ]
    },
    {
      company: "TradeTool",
      role: "Desenvolvedor de software",
      period: "dezembro de 2021 - maio de 2022",
      location: "Londrina, Paraná, Brasil",
      description: [
        "Co-criação da plataforma que foi finalista no INOVA SENAI, competição de tecnologia realizada em parceria com o SENAI.",
        "Um Marketplace para gamers que desejam vender ou comprar contas, trocar itens em seus jogos, visando segurança, melhor experiência de usuário e um novo design para o mercado."
      ]
    }
  ],
  education: [
    {
      institution: "Rocketseat",
      degree: "Certificados - Next.js, React.js, Node.js, TypeScript",
      period: "2025 - 2026"
    },
    {
      institution: "Universidade Positivo",
      degree: "Curso Superior de Tecnologia (CST), Tecnologia da Informação",
      period: "2022 - 2024"
    },
    {
      institution: "Digital Innovation One Inc.",
      degree: "Certificado, Tecnologia da Informação",
      period: "2021"
    }
  ],
  skills: COMMON_DATA.skills,
  books: [
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      status: "Lido",
      thoughts: "Essencial para entender a importância de escrever código legível e sustentável. Mudou minha visão sobre funções pequenas.",
      coverUrl: "https://picsum.photos/100/150?random=1"
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      status: "Lido",
      thoughts: "Uma filosofia completa de desenvolvimento de software. A mentalidade 'basta funcionar' não é suficiente.",
      coverUrl: "https://picsum.photos/100/150?random=2"
    },
    {
      title: "Refactoring UI",
      author: "Adam Wathan & Steve Schoger",
      status: "Lido",
      thoughts: "Fundamental para desenvolvedores que querem melhorar o design sem serem designers gráficos. Dicas práticas incríveis.",
      coverUrl: "https://picsum.photos/100/150?random=3"
    },
    {
      title: "Domain-Driven Design",
      author: "Eric Evans",
      status: "Lendo",
      thoughts: "Denso, mas necessário para arquitetar aplicações complexas como as que trabalho na X-Brain.",
      coverUrl: "https://picsum.photos/100/150?random=4"
    }
  ],
  posts: [
    {
      id: "react-performance",
      title: "Otimizando Performance em Aplicações React de Alta Escala",
      date: "12 Mar 2024",
      excerpt: "Estratégias de memoização, code-splitting e virtualização que utilizamos em sistemas de missão crítica.",
      content: "Content placeholder...",
      tags: ["React", "Performance", "Engineering"]
    },
    {
      title: "Acessibilidade não é feature, é requisito",
      id: "a11y-react",
      date: "05 Fev 2024",
      excerpt: "Como construir componentes inclusivos utilizando Radix UI e boas práticas de ARIA.",
      content: "Content placeholder...",
      tags: ["A11y", "UI/UX"]
    },
    {
      title: "Migrando de Javascript para Typescript: Lições Aprendidas",
      id: "ts-migration",
      date: "10 Nov 2023",
      excerpt: "Os desafios e benefícios de tipar uma base de código legada em produção.",
      content: "Content placeholder...",
      tags: ["TypeScript", "Refactoring"]
    }
  ]
};

export const CONTENT_EN: AppContent = {
  nav: {
    about: 'About',
    experience: 'Experience',
    blog: 'Blog',
    books: 'Books',
  },
  headers: {
    skills: 'Skills',
    education: 'Education',
    experience: 'Professional Experience',
    experienceSub: 'My journey building interfaces and solving problems.',
    writing: 'Writing',
    writingSub: 'Thoughts on development, architecture, and career.',
    books: 'Read and Recommended Books',
    booksSub: 'A curation of readings that shaped my technical and professional vision.',
    readArticle: 'Read article'
  },
  personalInfo: {
    ...COMMON_DATA,
    role: "Front-end Developer | React | Typescript",
    location: "Londrina, Paraná, Brazil",
    summary: `I am a Front-end Developer passionate about transforming business requirements into scalable, resilient, and high-performance interfaces. With solid experience in the React ecosystem, I focus on creating reusable and accessible components that ensure the best user experience.

    Currently, at X-Brain Software Development, I work on mission-critical systems for Claro. My work directly impacts both internal operations (sales systems and employee management) and the end customer, through high-volume external sales flows and forms. Looking for, one day, being a full-stack developer specialized in JavaScript, currently focusing my studies on specializing in the language.`
  },
  experiences: [
    {
      company: "X-Brain Software Development",
      role: "Front-end Developer",
      period: "July 2022 - Present",
      location: "Londrina, Paraná, Brazil",
      description: [
        "Direct involvement in the Claro project, developing systems used for critical sales operations, call handling, and internal employee control.",
        "Development of scalable interfaces with React and Redux for self-service portals and external forms used directly by Claro's end customers.",
        "Construction of reusable and accessible components, focused on user experience and operational efficiency.",
        "Collaboration in multidisciplinary agile teams to gather technical requirements and align with the client's business objectives."
      ]
    },
    {
      company: "X-Brain Software Development",
      role: "Intern",
      period: "April 2022 - July 2022",
      location: "Londrina, Paraná, Brazil",
      description: [
        "Seeking more experience and learning, I developed components and features that increased my capabilities as a developer and implemented solutions improving user experience and system usability."
      ]
    },
    {
      company: "TradeTool",
      role: "Software Developer",
      period: "December 2021 - May 2022",
      location: "Londrina, Paraná, Brazil",
      description: [
        "Co-creation of the platform that was a finalist in INOVA SENAI, a technology competition held in partnership with SENAI.",
        "A Marketplace for gamers wishing to sell or buy accounts, trade items in their games, aiming for security, better user experience, and a new design for the market."
      ]
    }
  ],
  education: [
    {
      institution: "Rocketseat",
      degree: "Certificates - Next.js, React.js, Node.js, TypeScript",
      period: "2024 - 2026"
    },
    {
      institution: "Universidade Positivo",
      degree: "Technologist Degree, Information Technology",
      period: "2022 - 2024"
    },
    {
      institution: "Digital Innovation One Inc.",
      degree: "Certificate, Information Technology",
      period: "2021"
    }
  ],
  skills: [
    { category: "Tech Stack", items: COMMON_DATA.skills[0].items },
    { category: "Methodologies & Others", items: COMMON_DATA.skills[1].items }
  ],
  books: [
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      status: "Read",
      thoughts: "Essential for understanding the importance of writing readable and sustainable code. Changed my view on small functions.",
      coverUrl: "https://picsum.photos/100/150?random=1"
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      status: "Read",
      thoughts: "A complete philosophy of software development. The 'it just works' mindset is not enough.",
      coverUrl: "https://picsum.photos/100/150?random=2"
    },
    {
      title: "Refactoring UI",
      author: "Adam Wathan & Steve Schoger",
      status: "Read",
      thoughts: "Fundamental for developers who want to improve design without being graphic designers. Amazing practical tips.",
      coverUrl: "https://picsum.photos/100/150?random=3"
    },
    {
      title: "Domain-Driven Design",
      author: "Eric Evans",
      status: "Reading",
      thoughts: "Dense, but necessary for architecting complex applications like the ones I work on at X-Brain.",
      coverUrl: "https://picsum.photos/100/150?random=4"
    }
  ],
  posts: [
    {
      id: "react-performance",
      title: "Optimizing Performance in High-Scale React Applications",
      date: "Mar 12, 2024",
      excerpt: "Memoization strategies, code-splitting, and virtualization we use in mission-critical systems.",
      content: "Content placeholder...",
      tags: ["React", "Performance", "Engineering"]
    },
    {
      title: "Accessibility is not a feature, it's a requirement",
      id: "a11y-react",
      date: "Feb 05, 2024",
      excerpt: "How to build inclusive components using Radix UI and ARIA best practices.",
      content: "Content placeholder...",
      tags: ["A11y", "UI/UX"]
    },
    {
      title: "Migrating from Javascript to Typescript: Lessons Learned",
      id: "ts-migration",
      date: "Nov 10, 2023",
      excerpt: "Challenges and benefits of typing a legacy codebase in production.",
      content: "Content placeholder...",
      tags: ["TypeScript", "Refactoring"]
    }
  ]
};
