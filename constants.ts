import { AppContent } from './types';

const COMMON_DATA = {
  name: "José Sanches",
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
      title: "You Don't Know JS Yet: Get Started",
      author: "Kyle Simpson",
      status: "Lido",
      thoughts: "O primeiro livro da série me deu uma base sólida dos fundamentos do JavaScript. Essencial para entender a linguagem em profundidade.",
      coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1580357376i/50718908.jpg",
      amazonUrlBR: "https://www.amazon.com.br/You-Dont-Know-JS-Yet/dp/B084DFZ6GW",
      amazonUrlUS: "https://www.amazon.com/You-Dont-Know-JS-Yet/dp/B084DFZ6GW"
    },
    {
      title: "You Don't Know JS Yet: Scope & Closures",
      author: "Kyle Simpson",
      status: "Lido",
      thoughts: "Explorando o funcionamento de escopo léxico e closures em JavaScript. Mudando minha forma de pensar sobre organização de código.",
      coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1585414018i/52764087.jpg",
      amazonUrlBR: "https://www.amazon.com.br/You-Dont-Know-JS-Yet/dp/B086GD45ZG",
      amazonUrlUS: "https://www.amazon.com/You-Dont-Know-JS-Yet/dp/B086GD45ZG"
    },
    {
      title: "You Don't Know JS: this & Object Prototypes",
      author: "Kyle Simpson",
      status: "Lido",
      thoughts: "Uma exploração profunda do comportamento de 'this' e do sistema de protótipos do JavaScript. Este livro desmistifica conceitos frequentemente mal compreendidos e mostra como a delegação de comportamento através de protótipos é mais poderosa que a simulação de classes tradicionais.",
      coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1405288115i/22221108.jpg",
      amazonUrlBR: "https://www.amazon.com.br/You-Dont-Know-Js-Prototypes/dp/1491904151",
      amazonUrlUS: "https://www.amazon.com/You-Dont-Know-JS-Prototypes/dp/1491904151"
    },
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
    role: "Front-end Developer (Future JS Specialist) | React | Typescript",
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
      title: "You Don't Know JS Yet: Get Started",
      author: "Kyle Simpson",
      status: "Read",
      thoughts: "The first book in the series gave me a solid foundation of JavaScript fundamentals. Essential for understanding the language in depth.",
      coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1580357376i/50718908.jpg",
      amazonUrlBR: "https://www.amazon.com.br/You-Dont-Know-JS-Yet/dp/B084DFZ6GW",
      amazonUrlUS: "https://www.amazon.com/You-Dont-Know-JS-Yet/dp/B084DFZ6GW"
    },
    {
      title: "You Don't Know JS Yet: Scope & Closures",
      author: "Kyle Simpson",
      status: "Read",
      thoughts: "Exploring how lexical scope and closures work in JavaScript. Changing the way I think about code organization.",
      coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1585414018i/52764087.jpg",
      amazonUrlBR: "https://www.amazon.com.br/You-Dont-Know-JS-Yet/dp/B086GD45ZG",
      amazonUrlUS: "https://www.amazon.com/You-Dont-Know-JS-Yet/dp/B086GD45ZG"
    },
    {
      title: "You Don't Know JS: this & Object Prototypes",
      author: "Kyle Simpson",
      status: "Read",
      thoughts: "A deep dive into JavaScript's 'this' behavior and prototype system. This book demystifies frequently misunderstood concepts and shows how behavior delegation through prototypes is more powerful than simulating traditional classes.",
      coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1405288115i/22221108.jpg",
      amazonUrlBR: "https://www.amazon.com.br/You-Dont-Know-Js-Prototypes/dp/1491904151",
      amazonUrlUS: "https://www.amazon.com/You-Dont-Know-JS-Prototypes/dp/1491904151"
    },
  ]
};
