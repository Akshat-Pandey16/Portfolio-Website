import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './pages/Home';
import About from './pages/About';
import Internships from './pages/Internships';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Hire from './pages/Hire';
import Contact from './pages/Contact';
import { DarkModeProvider } from './components/DarkMode';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <DarkModeProvider>
      <Home />
      <About />
      <Internships />
      <Projects />
      <Skills />
      <Hire />
      <Contact />
      </DarkModeProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
