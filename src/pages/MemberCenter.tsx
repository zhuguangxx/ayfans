import { useState } from 'react'
import { supabase, User } from '../lib/supabase'

interface MemberCenterProps {
  user: User
}

export default function MemberCenter({ user }: MemberCenterProps) {
  const [editing, setEditing] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [points, setPoints] = useState<any[]>([])

  useState(() => {
    async function fetchPoints() {
      const { data } = await supabase
        .from('point_records')
        .select('*, matches(opponent, match_date)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      setPoints(data || [])
    }
    fetchPoints()
  })

  const handlePasswordChange = async () => {
    if (!newPassword) return
    await supabase.from('users').update({ password: newPassword }).eq('id', user.id)
    setEditing(false)
    setNewPassword('')
    alert('密码修改成功！')
  }

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      '钻石会员': 'from-cyan-400 to-cyan-600',
      '黄金会员': 'from-yellow-400 to-yellow-600',
      '白银会员': 'from-gray-300 to-gray-500',
      '青铜会员': 'from-amber-600 to-amber-800',
      '铁杆会员': 'from-red-600 to-red-800',
    }
    return colors[level] || 'from-gray-400 to-gray-600'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">会员中心</h1>
      
      {/* 会员信息卡片 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <span className={`bg-gradient-to-r ${getLevelBadge(user.level)} text-white px-3 py-1 rounded-full text-sm`}>
                {user.level}
              </span>
              {user.is_annual_card && (
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">年卡</span>
              )}
            </div>
            <p className="text-gray-500">手机: {user.phone}</p>
            <p className="text-gray-500">有效期至: {user.expire_date || '未设置'}</p>
          </div>
        </div>
      </div>

      {/* 积分信息 */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white text-center">
          <div className="text-4xl font-bold mb-1">{user.points_total}</div>
          <div className="text-red-100">总积分</div>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-6 text-white text-center">
          <div className="text-4xl font-bold mb-1">{user.points_count}</div>
          <div className="text-orange-100">观赛场次</div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white text-center">
          <div className="text-4xl font-bold mb-1">#{user.rank || '-'}</div>
          <div className="text-blue-100">排名</div>
        </div>
      </div>

      {/* 修改密码 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">修改密码</h3>
        {editing ? (
          <div className="flex gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="新密码"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button onClick={handlePasswordChange} className="bg-red-600 text-white px-4 py-2 rounded-lg">保存</button>
            <button onClick={() => setEditing(false)} className="bg-gray-200 px-4 py-2 rounded-lg">取消</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-red-600 hover:text-red-700">修改密码</button>
        )}
      </div>

      {/* 积分记录 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-800 mb-4">积分记录</h3>
        {points.length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无积分记录</p>
        ) : (
          <div className="space-y-3">
            {points.map((p) => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{p.reason}</p>
                  <p className="text-sm text-gray-500">{p.matches?.opponent}</p>
                </div>
                <span className="text-green-600 font-bold">+{p.points}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
