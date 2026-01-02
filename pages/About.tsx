import React from 'react';
import { MapPin, GraduationCap } from '@phosphor-icons/react';
import FadeWrapper from '../components/FadeWrapper';
import { useAppContext } from '../contexts/AppContext';

const About: React.FC = () => {
  const { content } = useAppContext();
  const { personalInfo, skills, education, headers } = content;

  return (
    <FadeWrapper>
      <section className="space-y-12">
        <div className="prose prose-stone max-w-none">
          <div className="mt-6 space-y-4 text-secondary text-lg leading-8 font-light">
            {personalInfo.summary.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-4 flex items-center text-sm text-secondary gap-2 opacity-70">
            <MapPin size={16} />
            <span>{personalInfo.location}</span>
          </div>
        </div>

        <div className="border-t border-accent pt-10">
          <h2 className="font-serif text-xl text-primary mb-6">{headers.skills}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary opacity-60 mb-3">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-surface-hover text-secondary rounded-full text-sm hover:text-primary transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-accent pt-10">
          <h2 className="font-serif text-xl text-primary mb-6">{headers.education}</h2>
          <div className="space-y-8">
            {education.map((edu, idx) => (
              <div key={idx} className="group">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                  <h3 className="font-medium text-lg text-primary group-hover:text-secondary transition-colors">
                    {edu.institution}
                  </h3>
                  <span className="text-sm text-secondary opacity-50 font-mono">{edu.period}</span>
                </div>
                <div className="flex items-start gap-2 text-secondary">
                  <GraduationCap size={18} className="mt-0.5 shrink-0 opacity-50" />
                  <p className="text-base font-light">{edu.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeWrapper>
  );
};

export default About;
