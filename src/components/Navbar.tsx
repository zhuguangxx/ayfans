import { Link, useNavigate } from 'react-router'
import { useState } from 'react'

interface NavbarProps {
  user: any
  setUser: (user: any) => void
}

export default function Navbar({ user, setUser }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  return (
    <header className="bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm md:text-lg">⚽</span>
            </div>
            <span className="font-bold text-sm md:text-lg hidden sm:block">安阳市球迷协会</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-5">
            <Link to="/about" className="hover:text-red-200 transition text-sm">关于协会</Link>
            <Link to="/news" className="hover:text-red-200 transition text-sm">协会新闻</Link>
            <Link to="/ranking" className="hover:text-red-200 transition text-sm">会员积分榜</Link>
            <Link to="/contact" className="hover:text-red-200 transition text-sm">联系我们</Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/member" className="hover:text-red-200 transition text-sm">会员中心</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-800 hover:bg-red-900 px-3 py-1.5 rounded-lg transition text-sm"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                会员登录
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link to="/about" className="block py-2 hover:text-red-200" onClick={() => setMenuOpen(false)}>关于协会</Link>
            <Link to="/news" className="block py-2 hover:text-red-200" onClick={() => setMenuOpen(false)}>协会新闻</Link>
            <Link to="/ranking" className="block py-2 hover:text-red-200" onClick={() => setMenuOpen(false)}>会员积分榜</Link>
            <Link to="/contact" className="block py-2 hover:text-red-200" onClick={() => setMenuOpen(false)}>联系我们</Link>
            {user ? (
              <>
                <Link to="/member" className="block py-2 hover:text-red-200" onClick={() => setMenuOpen(false)}>会员中心</Link>
                <button onClick={handleLogout} className="block py-2 w-full text-left hover:text-red-200">退出登录</button>
              </>
            ) : (
              <Link to="/login" className="block py-2 hover:text-red-200" onClick={() => setMenuOpen(false)}>会员登录</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
