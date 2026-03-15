import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'

interface LoginProps {
  setUser: (user: any) => void
}

export default function Login({ setUser }: LoginProps) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 身份证后6位作为密码
    const { data, error: err } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (err || !data) {
      setError('用户不存在，请检查手机号')
      setLoading(false)
      return
    }

    // 验证密码（身份证后6位）
    if (data.password !== password && data.id_card.slice(-6) !== password) {
      setError('密码错误')
      setLoading(false)
      return
    }

    setUser(data)
    setLoading(false)
    navigate('/member')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚽</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">会员登录</h1>
          <p className="text-gray-500 text-sm mt-2">手机号 + 密码登录</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              placeholder="请输入手机号"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              placeholder="请输入身份证后6位"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          初始密码为身份证后6位，登录后可修改
        </p>
      </div>
    </div>
  )
}
