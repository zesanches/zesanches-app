import React from 'react';
import { Route, HashRouter as Router, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './contexts/AppContext';
import About from './pages/About';
import Blog from './pages/Blog';
import Books from './pages/Books';
import Experience from './pages/Experience';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
