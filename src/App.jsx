import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationSetter from './components/NavigationSetter';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import NewsSearch from './components/NewsSearch';
import Favorites from './components/Favorites';
import ArticleDetail from './components/ArticleDetail';
import NotFound from './components/NotFound';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
      <NavigationSetter />
        <Navbar />
          <Routes>
            <Route path="/" element={<NewsSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
