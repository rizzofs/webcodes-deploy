import React, { useState, useEffect } from 'react';
import './Resources.css';

const Resources = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showToolInfo, setShowToolInfo] = useState(false);

  // Función para navegar al siguiente recurso
  const nextResource = () => {
    setCurrentIndex((prev) => (prev + 1) % resources.length);
  };

  // Función para navegar al recurso anterior
  const prevResource = () => {
    setCurrentIndex((prev) => (prev - 1 + resources.length) % resources.length);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowSubcategories(true);
  };

  const handleBackToCategories = () => {
    setShowSubcategories(false);
    setSelectedCategory(null);
  };

  const handleToolClick = (toolName, toolUrl) => {
    setSelectedTool({
      name: toolName,
      url: toolUrl,
      description: getToolDescription(toolName),
      useCase: getToolUseCase(toolName),
      installCommand: getToolInstallCommand(toolName)
    });
    setShowToolInfo(true);
  };

  const handleBackToSubcategories = () => {
    setShowToolInfo(false);
    setSelectedTool(null);
  };

  // No necesitamos localStorage para esta versión simplificada

  // Función para generar enlaces automáticamente
  const generateLink = (itemName) => {
    const lowerName = itemName.toLowerCase();
    
    // Enlaces específicos para herramientas conocidas
    const specificLinks = {
      'sublime text': 'https://www.sublimetext.com/',
      'atom': 'https://atom.io/',
      'vim': 'https://www.vim.org/',
      'emacs': 'https://www.gnu.org/software/emacs/',
      'notepad++': 'https://notepad-plus-plus.org/',
      'brackets': 'http://brackets.io/',
      'textmate': 'https://macromates.com/',
      'ultraedit': 'https://www.ultraedit.com/',
      'editplus': 'https://www.editplus.com/',
      'pspad': 'https://www.pspad.com/',
      'crimson editor': 'http://www.crimsoneditor.com/',
      'bluefish': 'http://bluefish.openoffice.nl/',
      'geany': 'https://www.geany.org/',
      'kate': 'https://kate-editor.org/',
      'gedit': 'https://wiki.gnome.org/Apps/Gedit',
      'leafpad': 'http://tarot.freeshell.org/leafpad/',
      'mousepad': 'https://github.com/codebrainz/mousepad',
      'iterm2': 'https://iterm2.com/',
      'hyper': 'https://hyper.is/',
      'alacritty': 'https://alacritty.org/',
      'terminator': 'https://gnometerminator.blogspot.com/',
      'konsole': 'https://konsole.kde.org/',
      'gnome terminal': 'https://help.gnome.org/users/gnome-terminal/',
      'xterm': 'https://invisible-island.net/xterm/',
      'rxvt': 'http://software.schmorp.de/pkg/rxvt-unicode.html',
      'st': 'https://st.suckless.org/',
      'kitty': 'https://sw.kovidgoyal.net/kitty/',
      'termux': 'https://termux.com/',
      'putty': 'https://www.putty.org/',
      'mobaxterm': 'https://mobaxterm.mobatek.net/',
      'securecrt': 'https://www.vandyke.com/products/securecrt/',
      'royal tsx': 'https://royalapps.com/ts/',
      'terminal.app': 'https://support.apple.com/guide/terminal/',
      'mysql workbench': 'https://www.mysql.com/products/workbench/',
      'pgadmin': 'https://www.pgadmin.org/',
      'mongodb compass': 'https://www.mongodb.com/products/compass',
      'dbeaver': 'https://dbeaver.io/',
      'phpmyadmin': 'https://www.phpmyadmin.net/',
      'sequel pro': 'https://sequelpro.com/',
      'tableplus': 'https://tableplus.com/',
      'navicat': 'https://www.navicat.com/',
      'heidisql': 'https://www.heidisql.com/',
      'sqlite browser': 'https://sqlitebrowser.org/',
      'redis desktop manager': 'https://rdm.dev/',
      'robo 3t': 'https://robomongo.org/',
      'studio 3t': 'https://studio3t.com/',
      'mongodb atlas': 'https://www.mongodb.com/atlas',
      'firebase console': 'https://console.firebase.google.com/',
      'github desktop': 'https://desktop.github.com/',
      'sourcetree': 'https://www.sourcetreeapp.com/',
      'tortoisegit': 'https://tortoisegit.org/',
      'gitkraken': 'https://www.gitkraken.com/',
      'smartgit': 'https://www.syntevo.com/smartgit/',
      'fork': 'https://git-fork.com/',
      'github cli': 'https://cli.github.com/',
      'gitlab': 'https://gitlab.com/',
      'bitbucket': 'https://bitbucket.org/',
      'azure devops': 'https://azure.microsoft.com/en-us/services/devops/',
      'postman': 'https://www.postman.com/',
      'insomnia': 'https://insomnia.rest/',
      'thunder client': 'https://www.thunderclient.com/',
      'rest client': 'https://marketplace.visualstudio.com/items?itemName=humao.rest-client',
      'httpie': 'https://httpie.io/',
      'newman': 'https://www.npmjs.com/package/newman',
      'soapui': 'https://www.soapui.org/',
      'jmeter': 'https://jmeter.apache.org/',
      'selenium': 'https://selenium.dev/',
      'cypress': 'https://www.cypress.io/',
      'jest': 'https://jestjs.io/',
      'mocha': 'https://mochajs.org/'
    };
    
    // Si tenemos un enlace específico, lo usamos
    if (specificLinks[lowerName]) {
      return specificLinks[lowerName];
    }
    
    // Si no, generamos una búsqueda de Google
    const searchQuery = encodeURIComponent(itemName);
    return `https://www.google.com/search?q=${searchQuery}+official+site`;
  };

  // Función para obtener descripción de herramientas
  const getToolDescription = (toolName) => {
    const descriptions = {
      'Visual Studio Code': 'Editor de código fuente desarrollado por Microsoft. Es completamente gratuito, de código abierto y altamente personalizable con una extensa biblioteca de extensiones. Ofrece características avanzadas como IntelliSense, debugging integrado, control de versiones Git incorporado, terminal integrado, y soporte para múltiples lenguajes de programación. Su arquitectura basada en Electron permite que sea multiplataforma, funcionando en Windows, macOS y Linux. Es especialmente popular entre desarrolladores web, pero también es excelente para desarrollo de aplicaciones de escritorio, móviles y servicios backend.',
      'Cursor': 'Editor de código revolucionario que integra inteligencia artificial directamente en el flujo de trabajo de programación. Utiliza modelos de IA avanzados para ayudar en la escritura, comprensión y optimización de código. Ofrece características como autocompletado inteligente, generación de código basada en comentarios, explicación automática de código complejo, y sugerencias de refactoring. Es especialmente útil para desarrolladores que quieren acelerar su productividad y aprender nuevas tecnologías con la ayuda de IA. Combina la familiaridad de VS Code con capacidades de IA de última generación.',
      'IntelliJ IDEA': 'IDE completo y profesional para desarrollo Java desarrollado por JetBrains. Ofrece un conjunto completo de herramientas para desarrollo empresarial, incluyendo análisis de código avanzado, refactoring inteligente, debugging potente, y soporte nativo para frameworks como Spring, Hibernate, y Maven. Su motor de análisis estático es excepcional, detectando errores antes de la ejecución. También soporta múltiples lenguajes como Kotlin, Scala, Groovy, y JavaScript. Es la elección preferida para desarrollo Java empresarial y aplicaciones complejas de gran escala.',
      'Eclipse': 'IDE de código abierto y multiplataforma con soporte para múltiples lenguajes de programación. Es especialmente popular para desarrollo Java, pero también soporta C/C++, Python, PHP, JavaScript, y otros lenguajes. Ofrece un ecosistema extenso de plugins y extensiones que permiten personalización extrema. Su arquitectura modular permite adaptar el IDE a necesidades específicas. Aunque ha perdido popularidad frente a alternativas más modernas como IntelliJ IDEA, sigue siendo una opción sólida para muchos desarrolladores, especialmente en entornos corporativos y educativos.',
      'PyCharm': 'IDE profesional especializado para desarrollo Python desarrollado por JetBrains. Ofrece herramientas completas para desarrollo Python, incluyendo debugging avanzado, testing integrado, profiling de rendimiento, y soporte para frameworks como Django, Flask, FastAPI, y Pyramid. Su análisis de código es excepcional, detectando errores y sugiriendo mejoras. También incluye herramientas para desarrollo científico con Jupyter Notebooks integrado, soporte para data science con pandas y numpy, y herramientas para machine learning. Es la elección preferida para desarrollo Python profesional y proyectos de gran escala.',
      'WebStorm': 'IDE especializado para desarrollo web moderno desarrollado por JetBrains. Ofrece herramientas avanzadas para JavaScript, TypeScript, HTML, CSS, y frameworks modernos como React, Angular, Vue.js, Node.js, y Express. Incluye características como debugging de JavaScript, testing integrado, herramientas de refactoring, y soporte para tecnologías web modernas como Webpack, Babel, y ESLint. Su análisis de código es excepcional para proyectos web complejos, detectando errores y sugiriendo mejoras. Es especialmente popular entre desarrolladores frontend y full-stack.',
      'Android Studio': 'IDE oficial para desarrollo de aplicaciones Android desarrollado por Google. Basado en IntelliJ IDEA, ofrece herramientas completas para desarrollo Android, incluyendo diseño de interfaces con Layout Editor, debugging avanzado, testing con Espresso, y emulación de dispositivos. Incluye características como diseño visual de layouts, análisis de rendimiento, herramientas de optimización, y soporte para Kotlin y Java. Es la elección estándar para desarrollo Android profesional y es requerido para publicar aplicaciones en Google Play Store.',
      'Xcode': 'IDE oficial de Apple para desarrollo de aplicaciones iOS, macOS, watchOS y tvOS. Ofrece herramientas completas para desarrollo en Swift y Objective-C, incluyendo Interface Builder para diseño visual, debugging avanzado, testing con XCTest, y simulación de dispositivos. Incluye características como análisis de memoria, profiling de rendimiento, herramientas de optimización, y soporte para frameworks como SwiftUI y UIKit. Es exclusivo para macOS y es la única forma oficial de desarrollar aplicaciones para el ecosistema Apple.',
      'Sublime Text': 'Editor de texto sofisticado conocido por su velocidad excepcional, interfaz minimalista y potentes características de edición. Ofrece múltiples selecciones, búsqueda y reemplazo con expresiones regulares, navegación rápida de archivos con Goto Anything, y un sistema de plugins extenso. Su rendimiento es excepcional, manejando archivos grandes sin problemas. Es especialmente popular entre desarrolladores que valoran la eficiencia y la personalización. Aunque es de pago, ofrece una versión de evaluación ilimitada.',
      'Atom': 'Editor de código moderno y altamente personalizable desarrollado por GitHub. Está construido con tecnologías web (HTML, CSS, JavaScript) lo que lo hace extremadamente flexible y hackeable. Ofrece características como edición colaborativa en tiempo real con Teletype, integración nativa con Git, y un ecosistema de packages extenso. Su interfaz es limpia y moderna, con temas y configuraciones altamente personalizables. Aunque el desarrollo activo se ha descontinuado, sigue siendo una opción sólida para muchos desarrolladores.',
      'Vim': 'Editor de texto modal legendario conocido por su eficiencia y poder. Utiliza un sistema de comandos único que permite edición rápida sin usar el mouse. Su curva de aprendizaje es empinada, pero una vez dominado, permite una productividad excepcional. Es altamente configurable con scripts y plugins. Es especialmente popular entre administradores de sistemas, desarrolladores experimentados, y entusiastas de la eficiencia. Está disponible en prácticamente todos los sistemas Unix y Linux.',
      'Emacs': 'Editor de texto extensible y altamente personalizable con un ecosistema rico de extensiones. Es más que un editor - es una plataforma de desarrollo completa. Ofrece características como correo electrónico, navegador web, cliente IRC, y herramientas de desarrollo integradas. Su sistema de extensión con Lisp permite personalización casi ilimitada. Es especialmente popular entre desarrolladores que valoran la personalización extrema y la eficiencia a largo plazo.',
      'Postman': 'Plataforma integral de desarrollo de APIs que simplifica el testing, documentación, y colaboración en APIs. Ofrece características como testing automatizado, generación de código, mock servers, monitoreo de APIs, y documentación interactiva. Permite crear colecciones de requests, automatizar pruebas, y colaborar en equipos. Es especialmente útil para desarrolladores backend, QA engineers, y equipos que trabajan con microservicios. Su interfaz intuitiva hace que sea fácil para principiantes pero potente para usuarios avanzados.',
      'React': 'Biblioteca de JavaScript desarrollada por Facebook para construir interfaces de usuario, especialmente aplicaciones de una sola página (SPA). Utiliza un paradigma de componentes reutilizables y un DOM virtual para optimizar el rendimiento. Ofrece características como JSX para escribir HTML en JavaScript, hooks para manejar estado y efectos secundarios, y un ecosistema extenso de librerías. Es especialmente popular para desarrollo frontend moderno, aplicaciones móviles con React Native, y desarrollo de interfaces complejas e interactivas.',
      'Vue.js': 'Framework progresivo de JavaScript para construir interfaces de usuario. Su diseño permite adoptarlo gradualmente, desde mejorar HTML existente hasta construir aplicaciones complejas. Ofrece características como template syntax intuitiva, sistema de componentes, reactividad automática, y herramientas de desarrollo excelentes. Es especialmente popular entre desarrolladores que buscan una curva de aprendizaje suave, equipos que necesitan flexibilidad, y proyectos que requieren integración con sistemas existentes.',
      'Angular': 'Framework de desarrollo web basado en TypeScript desarrollado por Google para aplicaciones de una sola página (SPA). Ofrece características como inyección de dependencias, routing avanzado, formularios reactivos, y herramientas de testing integradas. Su arquitectura basada en componentes y servicios es ideal para aplicaciones empresariales de gran escala. Es especialmente popular para aplicaciones complejas, equipos grandes, y proyectos que requieren estructura y escalabilidad.',
      'Node.js': 'Entorno de ejecución de JavaScript del lado del servidor basado en el motor V8 de Chrome. Permite ejecutar JavaScript fuera del navegador, lo que habilita el desarrollo de aplicaciones backend, APIs, y herramientas de línea de comandos. Ofrece características como programación asíncrona, ecosistema npm extenso, y rendimiento excelente para aplicaciones I/O intensivas. Es especialmente popular para desarrollo full-stack con JavaScript, APIs REST, microservicios, y aplicaciones en tiempo real.',
      'Django': 'Framework web de alto nivel para Python que fomenta el desarrollo rápido y el diseño limpio. Ofrece características como ORM integrado, sistema de autenticación, panel de administración automático, y arquitectura MVT (Model-View-Template). Su filosofía "batteries included" proporciona todo lo necesario para desarrollo web. Es especialmente popular para aplicaciones web complejas, APIs REST, sistemas de gestión de contenido, y proyectos que requieren seguridad y escalabilidad.',
      'Laravel': 'Framework de PHP elegante y expresivo para el desarrollo web. Ofrece características como Eloquent ORM, sistema de routing, middleware, y Artisan CLI. Su sintaxis limpia y herramientas integradas hacen que el desarrollo sea agradable y productivo. Es especialmente popular para aplicaciones web modernas, APIs REST, sistemas de gestión de contenido, y proyectos que requieren desarrollo rápido y mantenible.',
      'Firebase': 'Plataforma de desarrollo de aplicaciones móviles y web de Google que proporciona servicios backend como base de datos, autenticación, hosting, y analytics. Ofrece características como Realtime Database, Cloud Firestore, Authentication, Cloud Functions, y Hosting. Su modelo de desarrollo sin servidor permite enfocarse en la lógica de negocio. Es especialmente popular para prototipos rápidos, aplicaciones móviles, y proyectos que requieren escalabilidad automática.',
      'MongoDB': 'Base de datos NoSQL orientada a documentos que almacena datos en formato BSON (similar a JSON). Ofrece características como esquemas flexibles, escalabilidad horizontal, consultas potentes, y agregación avanzada. Su modelo de datos es ideal para aplicaciones que manejan datos no estructurados o semi-estructurados. Es especialmente popular para aplicaciones web modernas, big data, IoT, y proyectos que requieren flexibilidad en el esquema de datos.',
      'MySQL': 'Sistema de gestión de bases de datos relacionales de código abierto y multiplataforma. Ofrece características como transacciones ACID, índices optimizados, replicación, y particionamiento. Su estabilidad y rendimiento lo hacen ideal para aplicaciones web, sistemas empresariales, y proyectos que requieren consistencia de datos. Es especialmente popular para aplicaciones web, sistemas de gestión de contenido, y proyectos que requieren relaciones complejas entre datos.',
      'Git': 'Sistema de control de versiones distribuido para el seguimiento de cambios en el código fuente. Ofrece características como branching y merging, historial completo, colaboración distribuida, y integridad de datos. Su modelo distribuido permite trabajar offline y colaborar eficientemente. Es especialmente popular para desarrollo de software, colaboración en equipos, y proyectos que requieren control de versiones robusto.',
      'Docker': 'Plataforma de contenedores que permite empaquetar aplicaciones y sus dependencias en contenedores ligeros y portables. Ofrece características como aislamiento de procesos, portabilidad entre entornos, escalabilidad automática, y orquestación con Docker Compose. Su modelo de contenedores simplifica el deployment y la gestión de aplicaciones. Es especialmente popular para microservicios, CI/CD, desarrollo de aplicaciones, y proyectos que requieren consistencia entre entornos.',
      'Figma': 'Herramienta de diseño de interfaces de usuario basada en la web con colaboración en tiempo real. Ofrece características como diseño vectorial, prototipado interactivo, sistemas de diseño, y colaboración en tiempo real. Su modelo basado en la web permite acceso desde cualquier dispositivo y colaboración instantánea. Es especialmente popular para diseño de interfaces, prototipado, sistemas de diseño, y equipos que requieren colaboración estrecha entre diseñadores y desarrolladores.',
      'Photoshop': 'Editor de gráficos rasterizados líder en la industria para diseño gráfico y fotografía. Ofrece características como edición de imágenes avanzada, retoque fotográfico, composición digital, y herramientas de pintura. Su conjunto completo de herramientas lo hace ideal para profesionales creativos. Es especialmente popular para fotografía, diseño gráfico, retoque de imágenes, y creación de contenido visual profesional.',
      'Illustrator': 'Editor de gráficos vectoriales para crear ilustraciones, logos, iconos, y diseños escalables. Ofrece características como herramientas de dibujo vectorial, tipografía avanzada, efectos y filtros, y exportación a múltiples formatos. Su modelo vectorial permite escalar diseños sin pérdida de calidad. Es especialmente popular para diseño de logos, ilustraciones, iconografía, y diseño de marca.',
      'Canva': 'Plataforma de diseño gráfico en línea con plantillas y herramientas fáciles de usar. Ofrece características como plantillas pre-diseñadas, biblioteca de elementos, colaboración en equipo, y exportación a múltiples formatos. Su interfaz intuitiva hace que el diseño sea accesible para no diseñadores. Es especialmente popular para marketing digital, redes sociales, presentaciones, y diseño rápido de contenido visual.',
      'Notion': 'Herramienta de productividad que combina notas, tareas, wikis, y bases de datos en una plataforma unificada. Ofrece características como bloques de contenido flexibles, bases de datos relacionales, colaboración en tiempo real, y integración con herramientas externas. Su flexibilidad permite adaptarlo a diferentes flujos de trabajo. Es especialmente popular para gestión de proyectos, documentación de equipos, y organización personal.',
      'Trello': 'Aplicación de gestión de proyectos basada en el método Kanban. Ofrece características como tableros visuales, tarjetas de tareas, listas de progreso, y colaboración en equipo. Su interfaz visual hace que sea fácil entender el estado de los proyectos. Es especialmente popular para gestión de proyectos ágiles, seguimiento de tareas, y colaboración en equipos pequeños y medianos.',
      'Slack': 'Plataforma de comunicación empresarial para equipos de trabajo. Ofrece características como mensajería instantánea, canales organizados, integración con herramientas de trabajo, y colaboración en tiempo real. Su modelo de canales permite organizar conversaciones por tema o proyecto. Es especialmente popular para comunicación de equipos, colaboración remota, y integración con herramientas de desarrollo.',
      'GitHub': 'Plataforma de desarrollo colaborativo para alojar proyectos de código abierto y privado. Ofrece características como control de versiones Git, colaboración en código, gestión de issues, y CI/CD integrado. Su ecosistema incluye GitHub Actions, GitHub Pages, y GitHub Copilot. Es especialmente popular para desarrollo de software, colaboración en código, y gestión de proyectos de código abierto.',
      'AWS': 'Plataforma de servicios de computación en la nube de Amazon que proporciona más de 200 servicios. Ofrece características como computación elástica, almacenamiento, bases de datos, machine learning, y herramientas de desarrollo. Su modelo de pago por uso permite escalar según las necesidades. Es especialmente popular para aplicaciones empresariales, startups, y proyectos que requieren escalabilidad y confiabilidad.',
      'Google Cloud': 'Suite de servicios de computación en la nube de Google que incluye infraestructura, plataforma, y servicios de datos. Ofrece características como computación, almacenamiento, bases de datos, machine learning, y herramientas de desarrollo. Su integración con servicios de Google lo hace atractivo para ciertos casos de uso. Es especialmente popular para aplicaciones que usan servicios de Google, machine learning, y análisis de datos.',
      'Azure': 'Plataforma de servicios de computación en la nube de Microsoft que incluye infraestructura, plataforma, y servicios de datos. Ofrece características como computación, almacenamiento, bases de datos, machine learning, y herramientas de desarrollo. Su integración con productos de Microsoft lo hace ideal para entornos empresariales. Es especialmente popular para aplicaciones empresariales, desarrollo .NET, y organizaciones que usan Microsoft 365.'
    };
    
    return descriptions[toolName] || 'Herramienta de desarrollo y productividad para programadores y diseñadores.';
  };

  // Función para obtener casos de uso
  const getToolUseCase = (toolName) => {
    const useCases = {
      'Visual Studio Code': 'Ideal para desarrollo web frontend y backend, aplicaciones móviles con React Native o Flutter, desarrollo de extensiones, scripting, y cualquier proyecto de programación. Es especialmente útil para equipos que necesitan un editor consistente multiplataforma, desarrolladores que trabajan con múltiples lenguajes, y proyectos que requieren integración con Git y herramientas de CI/CD. Su ecosistema de extensiones lo hace perfecto para casi cualquier stack tecnológico.',
      'Cursor': 'Perfecto para programadores que quieren acelerar su productividad con IA, aprender nuevas tecnologías, refactorizar código existente, y generar código boilerplate rápidamente. Es ideal para desarrolladores que trabajan con múltiples lenguajes, equipos que buscan estandarizar prácticas de código, y proyectos que requieren documentación automática. También es excelente para debugging y optimización de código con asistencia inteligente.',
      'IntelliJ IDEA': 'Excelente para desarrollo Java empresarial, aplicaciones Spring Boot, microservicios, desarrollo de APIs REST, aplicaciones de escritorio Java, y proyectos de gran escala. Es ideal para equipos de desarrollo que necesitan herramientas avanzadas de análisis de código, refactoring seguro, y debugging complejo. También es perfecto para desarrollo de aplicaciones Android con Kotlin, desarrollo de plugins, y proyectos que requieren integración con bases de datos y servidores de aplicaciones.',
      'Eclipse': 'Ideal para desarrollo Java empresarial, especialmente en entornos corporativos y educativos. Perfecto para proyectos que requieren múltiples lenguajes, desarrollo de plugins, y equipos que necesitan un IDE gratuito y estable. También es excelente para desarrollo C/C++, Python, PHP, y JavaScript en un entorno unificado.',
      'PyCharm': 'Esencial para desarrollo Python profesional, data science, machine learning, y desarrollo web con Django/Flask. Perfecto para proyectos que requieren debugging avanzado, testing integrado, y herramientas de análisis de código. También es ideal para desarrollo científico con Jupyter Notebooks y análisis de datos con pandas/numpy.',
      'WebStorm': 'Perfecto para desarrollo frontend moderno con React, Vue, Angular, y Node.js. Ideal para proyectos que requieren herramientas avanzadas de JavaScript, TypeScript, y frameworks modernos. También es excelente para desarrollo full-stack, debugging de aplicaciones web, y proyectos que requieren integración con herramientas de build.',
      'Android Studio': 'Necesario para desarrollo de aplicaciones Android nativas con Java o Kotlin. Perfecto para proyectos que requieren diseño de interfaces, testing con Espresso, y emulación de dispositivos. También es ideal para desarrollo de juegos Android, aplicaciones empresariales, y proyectos que requieren integración con servicios de Google.',
      'Xcode': 'Requerido para desarrollo de aplicaciones iOS, macOS, watchOS y tvOS con Swift o Objective-C. Perfecto para proyectos que requieren diseño de interfaces con Interface Builder, testing con XCTest, y simulación de dispositivos. También es ideal para desarrollo de juegos iOS, aplicaciones empresariales, y proyectos que requieren integración con servicios de Apple.',
      'Sublime Text': 'Ideal para edición rápida de código, scripting, y desarrollo ligero. Perfecto para desarrolladores que valoran la velocidad, edición de archivos grandes, y herramientas de búsqueda avanzada. También es excelente para edición de configuraciones, scripting, y desarrollo que requiere rendimiento excepcional sin la complejidad de un IDE completo.',
      'Atom': 'Perfecto para desarrollo web con integración nativa de Git y GitHub. Ideal para desarrolladores que buscan flexibilidad, colaboración en tiempo real, y un ecosistema de packages extenso. También es excelente para desarrollo de extensiones, edición colaborativa, y proyectos que requieren personalización extrema con tecnologías web.',
      'Vim': 'Ideal para programadores que prefieren edición eficiente sin mouse. Perfecto para administradores de sistemas, desarrollo en servidores remotos, y entornos donde la velocidad es crítica. También es excelente para scripting, edición de configuraciones, y desarrollo que requiere trabajar en terminal o entornos con recursos limitados.',
      'Emacs': 'Perfecto para programadores que quieren un entorno completamente personalizable. Ideal para desarrolladores que valoran la flexibilidad extrema, herramientas integradas, y un ecosistema de extensiones rico. También es excelente para desarrollo Lisp, edición de texto avanzada, y proyectos que requieren automatización y personalización profunda.',
      'Postman': 'Esencial para testing de APIs, documentación, y desarrollo backend. Perfecto para desarrolladores backend, QA engineers, y equipos que trabajan con microservicios. También es ideal para automatización de pruebas, colaboración en APIs, y proyectos que requieren documentación interactiva y monitoreo de APIs.',
      'React': 'Ideal para aplicaciones web modernas, SPAs, y interfaces de usuario interactivas.',
      'Vue.js': 'Perfecto para aplicaciones web progresivas y desarrollo frontend ágil.',
      'Angular': 'Ideal para aplicaciones empresariales complejas y aplicaciones a gran escala.',
      'Node.js': 'Perfecto para desarrollo backend, APIs, y aplicaciones de tiempo real.',
      'Django': 'Ideal para desarrollo web rápido, aplicaciones de contenido, y APIs REST.',
      'Laravel': 'Perfecto para desarrollo web en PHP con características modernas.',
      'Firebase': 'Ideal para aplicaciones móviles, autenticación, y bases de datos en tiempo real.',
      'MongoDB': 'Perfecto para aplicaciones que manejan datos no estructurados y escalabilidad.',
      'MySQL': 'Ideal para aplicaciones web tradicionales y sistemas que requieren ACID.',
      'Git': 'Esencial para control de versiones, colaboración, y gestión de código.',
      'Docker': 'Ideal para containerización, deployment, y desarrollo consistente.',
      'Figma': 'Perfecto para diseño de interfaces, prototipado, y colaboración en diseño.',
      'Photoshop': 'Ideal para edición de imágenes, diseño gráfico, y manipulación fotográfica.',
      'Illustrator': 'Perfecto para diseño vectorial, logos, ilustraciones, y gráficos escalables.',
      'Canva': 'Ideal para diseño gráfico rápido, presentaciones, y contenido para redes sociales.',
      'Notion': 'Perfecto para gestión de proyectos, documentación, y organización personal.',
      'Trello': 'Ideal para gestión de tareas, proyectos ágiles, y colaboración en equipo.',
      'Slack': 'Perfecto para comunicación de equipos, integración de herramientas, y colaboración.',
      'GitHub': 'Ideal para alojamiento de código, colaboración open source, y CI/CD.',
      'AWS': 'Perfecto para aplicaciones en la nube, escalabilidad, y servicios empresariales.',
      'Google Cloud': 'Ideal para machine learning, big data, y aplicaciones modernas en la nube.',
      'Azure': 'Perfecto para integración con Microsoft, aplicaciones empresariales, y servicios híbridos.'
    };
    
    return useCases[toolName] || 'Herramienta versátil para desarrollo y productividad.';
  };

  // Función para obtener comandos de instalación
  const getToolInstallCommand = (toolName) => {
    const installCommands = {
      'Visual Studio Code': 'Descargar desde code.visualstudio.com',
      'Cursor': 'Descargar desde cursor.sh',
      'IntelliJ IDEA': 'Descargar desde jetbrains.com/idea',
      'Eclipse': 'Descargar desde eclipse.org',
      'PyCharm': 'Descargar desde jetbrains.com/pycharm',
      'WebStorm': 'Descargar desde jetbrains.com/webstorm',
      'Android Studio': 'Descargar desde developer.android.com/studio',
      'Xcode': 'Instalar desde App Store (macOS)',
      'Sublime Text': 'Descargar desde sublimetext.com',
      'Atom': 'Descargar desde atom.io',
      'Vim': 'sudo apt install vim (Linux) o brew install vim (macOS)',
      'Emacs': 'sudo apt install emacs (Linux) o brew install emacs (macOS)',
      'Postman': 'Descargar desde postman.com',
      'React': 'npx create-react-app my-app',
      'Vue.js': 'npm install vue',
      'Angular': 'npm install -g @angular/cli',
      'Node.js': 'Descargar desde nodejs.org',
      'Django': 'pip install django',
      'Laravel': 'composer create-project laravel/laravel my-app',
      'Firebase': 'npm install firebase',
      'MongoDB': 'Descargar desde mongodb.com',
      'MySQL': 'Descargar desde mysql.com',
      'Git': 'Descargar desde git-scm.com',
      'Docker': 'Descargar desde docker.com',
      'Figma': 'Acceder desde figma.com',
      'Photoshop': 'Suscripción Adobe Creative Cloud',
      'Illustrator': 'Suscripción Adobe Creative Cloud',
      'Canva': 'Acceder desde canva.com',
      'Notion': 'Descargar desde notion.so',
      'Trello': 'Acceder desde trello.com',
      'Slack': 'Descargar desde slack.com',
      'GitHub': 'Crear cuenta en github.com',
      'AWS': 'Crear cuenta en aws.amazon.com',
      'Google Cloud': 'Crear cuenta en cloud.google.com',
      'Azure': 'Crear cuenta en azure.microsoft.com'
    };
    
    return installCommands[toolName] || 'Visitar sitio web oficial para descarga';
  };

  // Auto-rotación del hexágono
  // Solo rotación visual, sin cambio automático de elementos

  const resources = [
    {
      id: 1,
      title: "Herramientas",
      description: "IDEs, editores y software de desarrollo",
      icon: "fas fa-tools",
      category: "Categoría",
      subcategories: [
        { 
          name: "IDEs", 
          items: [
            { name: "Visual Studio Code", url: "https://code.visualstudio.com/", install: "Descarga desde el sitio oficial" },
            { name: "Cursor", url: "https://cursor.sh/", install: "Descarga desde cursor.sh" },
            { name: "IntelliJ IDEA", url: "https://www.jetbrains.com/idea/", install: "Descarga desde JetBrains" },
            { name: "Eclipse", url: "https://www.eclipse.org/", install: "Descarga desde eclipse.org" },
            { name: "PyCharm", url: "https://www.jetbrains.com/pycharm/", install: "Descarga desde JetBrains" },
            { name: "WebStorm", url: "https://www.jetbrains.com/webstorm/", install: "Descarga desde JetBrains" },
            { name: "Android Studio", url: "https://developer.android.com/studio", install: "Descarga desde Android Developer" },
            { name: "Xcode", url: "https://developer.apple.com/xcode/", install: "Descarga desde App Store (macOS)" },
            { name: "NetBeans", url: "https://netbeans.apache.org/", install: "Descarga desde Apache NetBeans" },
            { name: "Code::Blocks", url: "http://www.codeblocks.org/", install: "Descarga desde codeblocks.org" },
            { name: "Dev-C++", url: "https://www.bloodshed.net/devcpp.html", install: "Descarga desde bloodshed.net" },
            { name: "CLion", url: "https://www.jetbrains.com/clion/", install: "Descarga desde JetBrains" },
            { name: "Rider", url: "https://www.jetbrains.com/rider/", install: "Descarga desde JetBrains" },
            { name: "PhpStorm", url: "https://www.jetbrains.com/phpstorm/", install: "Descarga desde JetBrains" },
            { name: "RubyMine", url: "https://www.jetbrains.com/ruby/", install: "Descarga desde JetBrains" },
            { name: "DataGrip", url: "https://www.jetbrains.com/datagrip/", install: "Descarga desde JetBrains" },
            { name: "AppCode", url: "https://www.jetbrains.com/objc/", install: "Descarga desde JetBrains" }
          ] 
        },
        { 
          name: "Editores", 
          items: [
            "Sublime Text", "Atom", "Vim", "Emacs", "Notepad++", "Brackets",
            "TextMate", "UltraEdit", "EditPlus", "PSPad", "Crimson Editor",
            "Bluefish", "Geany", "Kate", "Gedit", "Leafpad", "Mousepad"
          ] 
        },
        { 
          name: "Terminales", 
          items: [
            "iTerm2", "Windows Terminal", "Hyper", "Alacritty", "Terminator",
            "Konsole", "GNOME Terminal", "xterm", "rxvt", "st", "kitty",
            "Termux", "PuTTY", "MobaXterm", "SecureCRT", "Royal TSX", "Terminal.app"
          ] 
        },
        { 
          name: "Bases de Datos", 
          items: [
            "MySQL Workbench", "pgAdmin", "MongoDB Compass", "DBeaver", "phpMyAdmin",
            "Sequel Pro", "TablePlus", "Navicat", "HeidiSQL", "SQLite Browser",
            "Redis Desktop Manager", "Robo 3T", "Studio 3T", "MongoDB Atlas", "Firebase Console"
          ] 
        },
        { 
          name: "Version Control", 
          items: [
            "Git", "GitHub Desktop", "SourceTree", "TortoiseGit", "GitKraken",
            "SmartGit", "Fork", "GitHub CLI", "GitLab", "Bitbucket", "Azure DevOps"
          ] 
        },
        { 
          name: "Testing", 
          items: [
            "Postman", "Insomnia", "Thunder Client", "REST Client", "HTTPie",
            "Newman", "SoapUI", "JMeter", "Selenium", "Cypress", "Jest", "Mocha"
          ] 
        },
        { 
          name: "DevOps", 
          items: [
            "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
            "Azure DevOps", "AWS CodePipeline", "Terraform", "Ansible", "Vagrant"
          ] 
        }
      ]
    },
    {
      id: 2,
      title: "Diseño",
      description: "Herramientas de diseño UI/UX y gráfico",
      icon: "fas fa-palette",
      category: "Categoría",
      subcategories: [
        { 
          name: "UI/UX", 
          items: [
            "Figma", "Sketch", "Adobe XD", "InVision", "Marvel", "Principle",
            "Framer", "Proto.io", "Balsamiq", "Mockplus", "Justinmind", "Axure",
            "Fluid UI", "MockFlow", "Pidoco", "HotGloo", "Wireframe.cc", "Draw.io"
          ] 
        },
        { 
          name: "Gráfico", 
          items: [
            "Photoshop", "Illustrator", "Canva", "GIMP", "Inkscape", "Affinity Designer",
            "CorelDRAW", "Paint.NET", "Krita", "Blender", "Cinema 4D", "Maya",
            "3ds Max", "SketchUp", "Fusion 360", "Tinkercad", "OpenSCAD", "FreeCAD"
          ] 
        },
        { 
          name: "Prototipado", 
          items: [
            "Framer", "Principle", "Proto.io", "Marvel", "InVision", "Adobe XD",
            "Sketch", "Figma", "Balsamiq", "Mockplus", "Justinmind", "Axure"
          ] 
        },
        { 
          name: "Iconos", 
          items: [
            "Feather Icons", "Heroicons", "Font Awesome", "Material Icons", "Ionicons",
            "Feather", "Lucide", "Tabler Icons", "Bootstrap Icons", "Ant Design Icons",
            "React Icons", "Vue Icons", "Angular Icons", "Flutter Icons", "IcoMoon", "Iconify"
          ] 
        },
        { 
          name: "Color", 
          items: [
            "Adobe Color", "Coolors", "Paletton", "Color Hunt", "Material Design Colors",
            "Flat UI Colors", "ColorZilla", "Eye Dropper", "Color Picker", "Chroma.js"
          ] 
        },
        { 
          name: "Tipografía", 
          items: [
            "Google Fonts", "Font Squirrel", "Adobe Fonts", "FontSpace", "DaFont",
            "1001 Fonts", "Fonts.com", "MyFonts", "Fontspring", "Typekit"
          ] 
        },
        { 
          name: "3D", 
          items: [
            "Blender", "Cinema 4D", "Maya", "3ds Max", "SketchUp", "Fusion 360",
            "Tinkercad", "OpenSCAD", "FreeCAD", "Rhino", "ZBrush", "Houdini"
          ] 
        },
      ]
    },
    {
      id: 3,
      title: "Desarrollo",
      description: "Frameworks, librerías y plataformas",
      icon: "fas fa-code",
      category: "Categoría",
      subcategories: [
        { 
          name: "Frontend", 
          items: [
            { name: "React", url: "https://reactjs.org/", install: "npm install react react-dom" },
            { name: "Vue.js", url: "https://vuejs.org/", install: "npm install vue" },
            { name: "Angular", url: "https://angular.io/", install: "npm install -g @angular/cli" },
            { name: "Svelte", url: "https://svelte.dev/", install: "npm install -g svelte" },
            { name: "Next.js", url: "https://nextjs.org/", install: "npx create-next-app@latest" },
            { name: "Nuxt.js", url: "https://nuxtjs.org/", install: "npx create-nuxt-app" },
            { name: "Gatsby", url: "https://www.gatsbyjs.com/", install: "npm install -g gatsby-cli" },
            { name: "SvelteKit", url: "https://kit.svelte.dev/", install: "npm create svelte@latest" },
            { name: "Astro", url: "https://astro.build/", install: "npm create astro@latest" },
            { name: "Solid.js", url: "https://www.solidjs.com/", install: "npm install solid-js" },
            { name: "Preact", url: "https://preactjs.com/", install: "npm install preact" },
            { name: "Inferno", url: "https://infernojs.org/", install: "npm install inferno" },
            { name: "Ember.js", url: "https://emberjs.com/", install: "npm install -g ember-cli" },
            { name: "Backbone.js", url: "https://backbonejs.org/", install: "npm install backbone" },
            { name: "Knockout.js", url: "https://knockoutjs.com/", install: "npm install knockout" },
            { name: "Mithril", url: "https://mithril.js.org/", install: "npm install mithril" },
            { name: "Hyperapp", url: "https://hyperapp.dev/", install: "npm install hyperapp" },
            { name: "Stimulus", url: "https://stimulus.hotwired.dev/", install: "npm install @hotwired/stimulus" }
          ] 
        },
        { 
          name: "Backend", 
          items: [
            "Node.js", "Django", "Laravel", "Express", "FastAPI", "Flask",
            "Spring Boot", "ASP.NET Core", "Ruby on Rails", "Phoenix", "Gin",
            "Fiber", "Echo", "Koa", "Hapi", "Sails.js", "Meteor"
          ] 
        },
        { 
          name: "Mobile", 
          items: [
            "React Native", "Flutter", "Ionic", "Xamarin", "Cordova", "PhoneGap",
            "NativeScript", "Quasar", "Framework7", "Onsen UI", "Kendo UI",
            "Sencha Touch", "jQuery Mobile", "Intel XDK", "Appcelerator", "Corona SDK"
          ] 
        },
        { 
          name: "Cloud", 
          items: [
            "AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Heroku",
            "DigitalOcean", "Linode", "Vultr", "Cloudflare", "Firebase",
            "Supabase", "PlanetScale", "Railway", "Render", "Fly.io", "Koyeb"
          ] 
        },
        { 
          name: "Bases de Datos", 
          items: [
            "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "MariaDB",
            "Oracle", "SQL Server", "Cassandra", "CouchDB", "Neo4j", "InfluxDB",
            "DynamoDB", "Firestore", "Supabase", "PlanetScale", "FaunaDB", "CockroachDB"
          ] 
        },
        { 
          name: "DevOps", 
          items: [
            "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
            "Travis CI", "CircleCI", "Azure DevOps", "AWS CodePipeline", "Terraform",
            "Ansible", "Chef", "Puppet", "Vagrant", "Vagrant", "Packer"
          ] 
        },
        { 
          name: "Testing", 
          items: [
            "Jest", "Mocha", "Chai", "Sinon", "Enzyme", "Testing Library",
            "Cypress", "Playwright", "Puppeteer", "Selenium", "WebDriver", "Appium",
            "Karma", "Jasmine", "Vitest", "Ava", "Tape", "Supertest"
          ] 
        },
        { 
          name: "APIs", 
          items: [
            "Postman", "Insomnia", "Thunder Client", "REST Client", "HTTPie", "Newman",
            "SoapUI", "JMeter", "Bruno", "Paw", "API Blueprint", "Swagger",
            "OpenAPI", "GraphQL", "Apollo", "Prisma", "Hasura", "Strapi"
          ] 
        },
        { 
          name: "Microservicios", 
          items: [
            "Docker", "Kubernetes", "Istio", "Linkerd", "Consul", "Eureka",
            "Zookeeper", "Etcd", "Redis", "RabbitMQ", "Apache Kafka", "NATS",
            "gRPC", "Apache Thrift", "GraphQL Federation", "Kong", "Traefik", "Envoy"
          ] 
        }
      ]
    },
    {
      id: 4,
      title: "Productividad",
      description: "Herramientas para organizar y gestionar proyectos",
      icon: "fas fa-tasks",
      category: "Categoría",
      subcategories: [
        { 
          name: "Gestión", 
          items: [
            "Notion", "Trello", "Asana", "Monday.com", "Jira", "Linear",
            "ClickUp", "Airtable", "Basecamp", "Wrike", "Smartsheet", "Todoist",
            "Any.do", "TickTick", "Things", "OmniFocus", "Remember The Milk", "Habitica"
          ] 
        },
        { 
          name: "Notas", 
          items: [
            "Obsidian", "Roam Research", "Logseq", "RemNote", "Notion", "Evernote",
            "OneNote", "Bear", "Simplenote", "Standard Notes", "Joplin", "Zettlr",
            "TiddlyWiki", "DokuWiki", "MediaWiki", "Confluence", "GitBook", "BookStack"
          ] 
        },
        { 
          name: "Tiempo", 
          items: [
            "Toggl", "RescueTime", "Clockify", "Harvest", "Time Doctor", "Hubstaff",
            "DeskTime", "Timely", "Everhour", "TimeCamp", "Pomodoro Timer", "Focus Keeper",
            "Be Focused", "PomoDone", "Tomato Timer", "Pomodoro Technique", "Time Blocking"
          ] 
        },
        { 
          name: "Comunicación", 
          items: [
            "Slack", "Microsoft Teams", "Zoom", "Discord", "Telegram", "WhatsApp",
            "Signal", "Element", "Mattermost", "Rocket.Chat", "Zulip", "Wire",
            "Jitsi", "Google Meet", "Skype", "Webex", "GoToMeeting", "BlueJeans"
          ] 
        },
        { 
          name: "Documentación", 
          items: [
            "GitBook", "Notion", "Confluence", "DokuWiki", "MediaWiki", "Sphinx",
            "MkDocs", "Docusaurus", "VuePress", "Gitiles", "BookStack", "Outline",
            "Slab", "Helpjuice", "ProProfs", "Zendesk", "Freshdesk", "Intercom"
          ] 
        },
        { 
          name: "Colaboración", 
          items: [
            "Figma", "Miro", "Mural", "Lucidchart", "Draw.io", "Whimsical",
            "Conceptboard", "InVision", "Marvel", "Principle", "Framer", "Proto.io"
          ] 
        },
        { 
          name: "Automatización", 
          items: [
            "Zapier", "IFTTT", "Microsoft Power Automate", "Automate.io", "Integromat",
            "Pabbly Connect", "n8n", "Node-RED", "Huginn", "AutoHotkey", "Keyboard Maestro",
            "Alfred", "Raycast", "LaunchBar", "Quicksilver", "Spotlight", "Everything"
          ] 
        },
        { 
          name: "Backup", 
          items: [
            "Google Drive", "Dropbox", "OneDrive", "iCloud", "Box", "Mega",
            "Sync.com", "pCloud", "Tresorit", "SpiderOak", "Carbonite", "Backblaze",
            "CrashPlan", "Acronis", "EaseUS", "AOMEI", "Macrium", "Clonezilla"
          ] 
        }
      ]
    },
    {
      id: 5,
      title: "Educación",
      description: "Plataformas de aprendizaje y recursos educativos",
      icon: "fas fa-graduation-cap",
      category: "Categoría",
      subcategories: [
        { 
          name: "Cursos", 
          items: [
            "Coursera", "Udemy", "Platzi", "edX", "Khan Academy", "Codecademy",
            "FreeCodeCamp", "The Odin Project", "Scrimba", "Frontend Masters", "Egghead",
            "Lynda", "Skillshare", "MasterClass", "Udacity", "Treehouse", "Team Treehouse"
          ] 
        },
        { 
          name: "Tutoriales", 
          items: [
            "YouTube", "FreeCodeCamp", "Codecademy", "Khan Academy", "MDN", "W3Schools",
            "TutorialsPoint", "GeeksforGeeks", "Stack Overflow", "Dev.to", "Hashnode",
            "Medium", "CSS-Tricks", "Smashing Magazine", "A List Apart", "SitePoint"
          ] 
        },
        { 
          name: "Documentación", 
          items: [
            "MDN", "Stack Overflow", "DevDocs", "GitHub Docs", "React Docs", "Vue Docs",
            "Angular Docs", "Node.js Docs", "Python Docs", "Java Docs", "C# Docs",
            "Go Docs", "Rust Docs", "TypeScript Docs", "Webpack Docs", "Vite Docs"
          ] 
        },
        { 
          name: "Libros", 
          items: [
            "O'Reilly", "Packt", "Manning", "Apress", "No Starch Press", "Pragmatic Bookshelf",
            "Addison-Wesley", "Wiley", "McGraw-Hill", "Pearson", "Safari Books Online",
            "Google Books", "Project Gutenberg", "Open Library", "Internet Archive"
          ] 
        },
        { 
          name: "Podcasts", 
          items: [
            "Syntax", "JavaScript Jabber", "React Podcast", "Vue.js Podcast", "Angular Podcast",
            "The Changelog", "Software Engineering Daily", "CodeNewbie", "Developer Tea",
            "Full Stack Radio", "ShopTalk Show", "The Web Platform Podcast", "Frontend Happy Hour"
          ] 
        },
        { 
          name: "Newsletters", 
          items: [
            "JavaScript Weekly", "Frontend Focus", "CSS Weekly", "React Status", "Vue.js News",
            "Angular Weekly", "Node Weekly", "Python Weekly", "Go Weekly", "Rust Weekly",
            "Dev.to Newsletter", "Hashnode Newsletter", "Medium Daily Digest", "Substack"
          ] 
        }
      ]
    },
    {
      id: 6,
      title: "Comunidad",
      description: "Plataformas para conectar con otros desarrolladores",
      icon: "fas fa-users",
      category: "Categoría",
      subcategories: [
        { 
          name: "Redes", 
          items: [
            "GitHub", "GitLab", "Bitbucket", "SourceForge", "Launchpad", "CodePlex",
            "Google Code", "Assembla", "Beanstalk", "Kiln", "FogBugz", "Trac",
            "Redmine", "Bugzilla", "Mantis", "Jira", "YouTrack", "Linear"
          ] 
        },
        { 
          name: "Foros", 
          items: [
            "Reddit", "Stack Overflow", "Dev.to", "Hashnode", "Medium", "Quora",
            "Discord", "Slack", "Telegram", "IRC", "Usenet", "Mailing Lists",
            "Google Groups", "Yahoo Groups", "Facebook Groups", "LinkedIn Groups"
          ] 
        },
        { 
          name: "Eventos", 
          items: [
            "Meetup", "Eventbrite", "Devpost", "Hackathons", "Conferences", "Workshops",
            "Webinars", "Seminars", "Bootcamps", "Code Retreats", "Tech Talks",
            "Lightning Talks", "Panel Discussions", "Networking Events", "Career Fairs"
          ] 
        },
        { 
          name: "Mentoría", 
          items: [
            "Codementor", "MentorCruise", "Platzi", "FreeCodeCamp", "Codecademy",
            "The Odin Project", "Scrimba", "Frontend Masters", "Egghead", "Lynda",
            "Skillshare", "MasterClass", "Udacity", "Treehouse", "Team Treehouse"
          ] 
        },
        { 
          name: "Open Source", 
          items: [
            "GitHub", "GitLab", "Bitbucket", "SourceForge", "Launchpad", "CodePlex",
            "Google Code", "Assembla", "Beanstalk", "Kiln", "FogBugz", "Trac",
            "Redmine", "Bugzilla", "Mantis", "Jira", "YouTrack", "Linear"
          ] 
        },
        { 
          name: "Freelancing", 
          items: [
            "Upwork", "Freelancer", "Fiverr", "Toptal", "Guru", "PeoplePerHour",
            "99designs", "Dribbble", "Behance", "AngelList", "Crunchbase", "Product Hunt"
          ] 
        }
      ]
    },
    {
      id: 7,
      title: "Recursos",
      description: "Bibliotecas, APIs y servicios útiles",
      icon: "fas fa-book",
      category: "Categoría",
      subcategories: [
        { 
          name: "APIs", 
          items: [
            { name: "REST Countries", url: "https://restcountries.com/", install: "fetch('https://restcountries.com/v3.1/all')" },
            { name: "JSONPlaceholder", url: "https://jsonplaceholder.typicode.com/", install: "fetch('https://jsonplaceholder.typicode.com/posts')" },
            { name: "OpenWeather", url: "https://openweathermap.org/api", install: "API Key required" },
            { name: "News API", url: "https://newsapi.org/", install: "API Key required" },
            { name: "GitHub API", url: "https://docs.github.com/en/rest", install: "fetch('https://api.github.com/users/username')" },
            { name: "Twitter API", url: "https://developer.twitter.com/en/docs", install: "API Key required" },
            { name: "Facebook API", url: "https://developers.facebook.com/", install: "API Key required" },
            { name: "Google APIs", url: "https://developers.google.com/apis", install: "API Key required" },
            { name: "Stripe API", url: "https://stripe.com/docs/api", install: "npm install stripe" },
            { name: "PayPal API", url: "https://developer.paypal.com/docs/api/", install: "API Key required" },
            { name: "Twilio API", url: "https://www.twilio.com/docs/usage/api", install: "npm install twilio" },
            { name: "SendGrid API", url: "https://docs.sendgrid.com/api-reference", install: "npm install @sendgrid/mail" },
            { name: "Mailgun API", url: "https://documentation.mailgun.com/en/latest/api_reference.html", install: "npm install mailgun-js" },
            { name: "AWS API", url: "https://docs.aws.amazon.com/api/", install: "npm install aws-sdk" },
            { name: "Azure API", url: "https://docs.microsoft.com/en-us/azure/", install: "npm install @azure/identity" },
            { name: "Firebase API", url: "https://firebase.google.com/docs/reference", install: "npm install firebase" },
            { name: "Supabase API", url: "https://supabase.com/docs/reference", install: "npm install @supabase/supabase-js" },
            { name: "PlanetScale API", url: "https://planetscale.com/docs", install: "npm install @planetscale/database" },
            { name: "Railway API", url: "https://docs.railway.app/", install: "npm install @railway/cli" },
            { name: "Render API", url: "https://render.com/docs", install: "API Key required" }
          ] 
        },
        { 
          name: "Imágenes", 
          items: [
            { name: "Unsplash", url: "https://unsplash.com/", install: "API: https://unsplash.com/developers" },
            { name: "Pexels", url: "https://www.pexels.com/", install: "API: https://www.pexels.com/api/" },
            { name: "Pixabay", url: "https://pixabay.com/", install: "API: https://pixabay.com/api/docs/" },
            { name: "Freepik", url: "https://www.freepik.com/", install: "Premium subscription required" },
            { name: "Shutterstock", url: "https://www.shutterstock.com/", install: "Premium subscription required" },
            { name: "Getty Images", url: "https://www.gettyimages.com/", install: "Premium subscription required" },
            { name: "Adobe Stock", url: "https://stock.adobe.com/", install: "Adobe Creative Cloud subscription" },
            { name: "iStock", url: "https://www.istockphoto.com/", install: "Premium subscription required" },
            { name: "Depositphotos", url: "https://depositphotos.com/", install: "Premium subscription required" },
            { name: "123RF", url: "https://www.123rf.com/", install: "Premium subscription required" },
            { name: "Dreamstime", url: "https://www.dreamstime.com/", install: "Premium subscription required" },
            { name: "Bigstock", url: "https://www.bigstockphoto.com/", install: "Premium subscription required" },
            { name: "Canva", url: "https://www.canva.com/", install: "Free account or Pro subscription" },
            { name: "Figma", url: "https://www.figma.com/", install: "Free account or Professional plan" },
            { name: "Sketch", url: "https://www.sketch.com/", install: "macOS app - $99/year" },
            { name: "Adobe XD", url: "https://www.adobe.com/products/xd.html", install: "Adobe Creative Cloud subscription" },
            { name: "InVision", url: "https://www.invisionapp.com/", install: "Free account or paid plans" },
            { name: "Marvel", url: "https://marvelapp.com/", install: "Free account or paid plans" }
          ] 
        },
        { 
          name: "Iconos", 
          items: [
            "Feather", "Heroicons", "Lucide", "Tabler Icons", "Bootstrap Icons", "Ant Design Icons",
            "React Icons", "Vue Icons", "Angular Icons", "Flutter Icons", "IcoMoon", "Iconify",
            "Font Awesome", "Material Icons", "Ionicons", "Feather Icons", "Heroicons", "Lucide"
          ] 
        },
        { 
          name: "Fuentes", 
          items: [
            "Google Fonts", "Font Squirrel", "Adobe Fonts", "FontSpace", "DaFont",
            "1001 Fonts", "Fonts.com", "MyFonts", "Fontspring", "Typekit", "Font Awesome",
            "Material Icons", "Ionicons", "Feather Icons", "Heroicons", "Lucide", "Tabler Icons"
          ] 
        },
        { 
          name: "Librerías", 
          items: [
            "React", "Vue.js", "Angular", "Svelte", "jQuery", "Lodash", "Underscore",
            "Moment.js", "Day.js", "date-fns", "Axios", "Fetch", "Superagent",
            "Chart.js", "D3.js", "Three.js", "GSAP", "Framer Motion", "Lottie"
          ] 
        },
        { 
          name: "Servicios", 
          items: [
            { name: "Firebase", url: "https://firebase.google.com/", install: "npm install firebase" },
            { name: "Supabase", url: "https://supabase.com/", install: "npm install @supabase/supabase-js" },
            { name: "PlanetScale", url: "https://planetscale.com/", install: "npm install @planetscale/database" },
            { name: "Railway", url: "https://railway.app/", install: "npm install @railway/cli" },
            { name: "Render", url: "https://render.com/", install: "Deploy via Git integration" },
            { name: "Vercel", url: "https://vercel.com/", install: "npm install -g vercel" },
            { name: "Netlify", url: "https://www.netlify.com/", install: "npm install -g netlify-cli" },
            { name: "Heroku", url: "https://www.heroku.com/", install: "npm install -g heroku" },
            { name: "DigitalOcean", url: "https://www.digitalocean.com/", install: "API integration required" },
            { name: "Linode", url: "https://www.linode.com/", install: "API integration required" },
            { name: "Vultr", url: "https://www.vultr.com/", install: "API integration required" },
            { name: "Cloudflare", url: "https://www.cloudflare.com/", install: "API integration required" },
            { name: "AWS", url: "https://aws.amazon.com/", install: "npm install aws-sdk" },
            { name: "Google Cloud", url: "https://cloud.google.com/", install: "npm install @google-cloud/storage" },
            { name: "Azure", url: "https://azure.microsoft.com/", install: "npm install @azure/identity" },
            { name: "Stripe", url: "https://stripe.com/", install: "npm install stripe" },
            { name: "PayPal", url: "https://www.paypal.com/", install: "API integration required" },
            { name: "Twilio", url: "https://www.twilio.com/", install: "npm install twilio" }
          ] 
        }
      ]
    },
    {
      id: 8,
      title: "Utilidades",
      description: "Herramientas auxiliares y servicios online",
      icon: "fas fa-wrench",
      category: "Categoría",
      subcategories: [
        { 
          name: "Conversores", 
          items: [
            "CloudConvert", "Convertio", "Online-Convert", "Zamzar", "FreeConvert", "ConvertFiles",
            "Online-Convert", "Zamzar", "CloudConvert", "Convertio", "FreeConvert", "ConvertFiles",
            "Online-Convert", "Zamzar", "CloudConvert", "Convertio", "FreeConvert", "ConvertFiles"
          ] 
        },
        { 
          name: "Generadores", 
          items: [
            "Lorem Ipsum", "Fake Data", "UUID Generator", "QR Code", "Password Generator", "Hash Generator",
            "Color Generator", "Gradient Generator", "Pattern Generator", "Logo Generator", "Favicon Generator",
            "Meta Tag Generator", "Sitemap Generator", "Robots.txt Generator", "HTACCESS Generator", "CSS Generator"
          ] 
        },
        { 
          name: "Validadores", 
          items: [
            "JSON Validator", "HTML Validator", "CSS Validator", "Regex Tester", "XML Validator", "YAML Validator",
            "Markdown Validator", "JavaScript Validator", "TypeScript Validator", "Python Validator", "Java Validator",
            "C# Validator", "Go Validator", "Rust Validator", "PHP Validator", "Ruby Validator", "Swift Validator"
          ] 
        },
        { 
          name: "Optimizadores", 
          items: [
            "TinyPNG", "ImageOptim", "CSS Minifier", "JS Minifier", "HTML Minifier", "JSON Minifier",
            "XML Minifier", "YAML Minifier", "Markdown Minifier", "SVG Optimizer", "PDF Optimizer",
            "Video Optimizer", "Audio Optimizer", "Font Optimizer", "Code Minifier", "Bundle Optimizer"
          ] 
        },
        { 
          name: "Testing", 
          items: [
            "Postman", "Insomnia", "Thunder Client", "REST Client", "HTTPie", "Newman",
            "SoapUI", "JMeter", "Selenium", "Cypress", "Jest", "Mocha", "Chai", "Sinon",
            "Enzyme", "Testing Library", "Playwright", "Puppeteer", "WebDriver", "Appium"
          ] 
        },
        { 
          name: "Monitoreo", 
          items: [
            "Google Analytics", "Mixpanel", "Amplitude", "Hotjar", "FullStory", "LogRocket",
            "Sentry", "Bugsnag", "Rollbar", "Airbrake", "Honeybadger", "Raygun",
            "New Relic", "DataDog", "AppDynamics", "Dynatrace", "Pingdom", "UptimeRobot"
          ] 
        }
      ]
    }
  ];

  return (
    <section id="extra" className="resources-section">
      <div className="container">
        <div className="section-header">
          <h2>Recursos Útiles</h2>
          <p>Herramientas y recursos que te ayudarán en tu carrera</p>
          
        </div>

        {!showSubcategories && !showToolInfo ? (
          <div className="categories-grid">
            {resources.map((resource) => (
              <div 
                key={resource.id} 
                className="category-card"
                onClick={() => handleCategoryClick(resource)}
              >
                <div className="category-icon">
                  <i className={resource.icon}></i>
                </div>
                <div className="category-content">
                  <h3 className="category-title">{resource.title}</h3>
                  <p className="category-description">{resource.description}</p>
                  <div className="category-count">
                    {resource.subcategories.length} subcategorías
                  </div>
                </div>
                <div className="category-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            ))}
          </div>
        ) : showSubcategories && !showToolInfo ? (
          <div className="subcategories-container">
            <div className="subcategories-header">
              <button className="back-button" onClick={handleBackToCategories}>
                <i className="fas fa-arrow-left"></i>
                Volver a categorías
              </button>
              <div className="category-info">
                <div className="category-icon-large">
                  <i className={selectedCategory.icon}></i>
                </div>
                <div>
                  <h3 className="subcategories-title">{selectedCategory.title}</h3>
                  <p className="subcategories-description">{selectedCategory.description}</p>
                </div>
              </div>
            </div>
            
            <div className="subcategories-grid">
              {selectedCategory.subcategories.map((subcategory, index) => (
                <div key={index} className="subcategory-card">
                  <h4 className="subcategory-name">{subcategory.name}</h4>
                  <div className="subcategory-items">
                    {subcategory.items.map((item, itemIndex) => {
                      const isObject = typeof item === 'object';
                      const itemName = isObject ? item.name : item;
                      const itemUrl = isObject ? item.url : generateLink(itemName);
                      
                      return (
                        <div key={itemIndex} className="subcategory-item">
                          <button 
                            className="item-link"
                            onClick={() => handleToolClick(itemName, itemUrl)}
                          >
                            {itemName}
                          </button>
                  </div>
                      );
                    })}
              </div>
            </div>
          ))}
        </div>
          </div>
        ) : null}

        {/* Vista de información de herramienta */}
        {showToolInfo && selectedTool && (
          <div className="tool-info-container">
            <div className="tool-info-header">
              <button className="back-button" onClick={handleBackToSubcategories}>
                <i className="fas fa-arrow-left"></i>
                Volver a {selectedCategory?.title}
              </button>
            </div>
            
            <div className="tool-info-card">
              <div className="tool-info-content">
                <h2 className="tool-name">{selectedTool.name}</h2>
                
                <div className="tool-section">
                  <h3>¿Qué es?</h3>
                  <p className="tool-description">{selectedTool.description}</p>
                </div>
                
                <div className="tool-section">
                  <h3>¿Para qué sirve?</h3>
                  <p className="tool-use-case">{selectedTool.useCase}</p>
                </div>
                
                <div className="tool-section">
                  <h3>Instalación</h3>
                  <p className="tool-install">{selectedTool.installCommand}</p>
                </div>
                
                <div className="tool-actions">
                  <a 
                    href={selectedTool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    <i className="fas fa-download"></i>
                    Ir al sitio oficial
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Resources;