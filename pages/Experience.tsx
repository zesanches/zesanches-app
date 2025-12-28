import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import FadeWrapper from '../components/FadeWrapper';

const Experience: React.FC = () => {
  const { content } = useAppContext();
  const { headers, experiences } = content;

  return (
    <FadeWrapper>
      <div className="space-y-16">
        <header className="mb-10">
          <h1 className="font-serif text-3xl text-primary mb-2">{headers.experience}</h1>
          <p className="text-secondary font-light text-lg">
            {headers.experienceSub}
          </p>
        </header>

        <div className="space-y-12 relative border-l border-dashed border-accent ml-3 md:ml-0 pl-8 md:pl-0 md:border-none">
          {experiences.map((exp, idx) => (
            <article key={idx} className="relative group md:grid md:grid-cols-[1fr_3fr] md:gap-8">
              <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-accent border-2 border-background md:hidden group-hover:bg-secondary transition-colors" />

              <div className="mb-2 md:mb-0 md:text-right">
                <span className="text-sm font-mono text-secondary opacity-60 block mb-1">{exp.period}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-secondary opacity-40">{exp.location}</span>
              </div>

              <div>
                <h3 className="text-xl font-serif text-primary font-medium flex items-center gap-2">
                  {exp.company}
                </h3>
                <h4 className="text-base text-secondary opacity-75 mb-4 font-medium italic">
                  {exp.role}
                </h4>

                <ul className="space-y-3">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-secondary leading-7 font-light text-[15px] md:text-base pl-4 relative">
                      <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-accent rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </FadeWrapper>
  );
};

export default Experience;
