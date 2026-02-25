import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Publications from './pages/Publications';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Life from './pages/Life';
import LifePost from './pages/LifePost';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-secondary text-secondary-foreground font-serif">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/life" element={<Life />} />
            <Route path="/life/:id" element={<LifePost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;