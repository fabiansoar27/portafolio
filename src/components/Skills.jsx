const Skills = () => {
  const designSkills = [
    { 
      name: 'Photoshop', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
      level: 'Avanzado'
    },
    { 
      name: 'Illustrator', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
      level: 'Experto'
    },
    { 
      name: 'Figma', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      level: 'Avanzado'
    },
    { 
      name: 'InDesign', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg',
      level: 'Básico'
    },
    { 
      name: 'Lightroom', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg',
      level: 'Básico'
    },
    { 
      name: 'Canva', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg',
      level: 'Avanzado'
    }
  ];

  const developmentSkills = [
    { 
      name: 'HTML', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      level: 'Experto'
    },
    { 
      name: 'CSS', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      level: 'Experto'
    },
    { 
      name: 'Javascript', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      level: 'Avanzado'
    },
    { 
      name: 'Elementor', 
      logo: '/assets/img/Elementor-Logo-Symbol-Red.svg',
      level: 'Avanzado'
    },
    { 
      name: 'React', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      level: 'Intermedio'
    },
    { 
      name: 'Next JS', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      level: 'Intermedio'
    }
  ];

  return (
    <section className="skills section" id="habilidades">
      <span className="section__subtitle">Nivel técnico</span>
      <h2 className="section__title">Mis habilidades</h2>

      <div className="skills__container container">
        <div className="skills__content">
          <h3 className="skills__title">Diseño y Comunicación Visual</h3>
          <div className="skills__grid">
            {designSkills.map((skill, index) => (
              <div key={index} className="skills__item">
                <img 
                  src={skill.logo} 
                  alt={skill.name}
                  className="skills__icon-img"
                />
                <span className="skills__name">{skill.name}</span>
                <span className="skills__level">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="skills__content">
          <h3 className="skills__title">Desarrollo de Software</h3>
          <div className="skills__grid">
            {developmentSkills.map((skill, index) => (
              <div key={index} className="skills__item">
                <img 
                  src={skill.logo} 
                  alt={skill.name}
                  className="skills__icon-img"
                />
                <span className="skills__name">{skill.name}</span>
                <span className="skills__level">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
