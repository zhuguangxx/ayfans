import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { useState } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Contact from './pages/Contact'
import Login from './pages/Login'
import MemberCenter from './pages/MemberCenter'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  const [user, setUser] = useState<any>(null)

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route 
              path="/member" 
              element={user ? <MemberCenter user={user} /> : <Navigate to="/login" />} 
            />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
