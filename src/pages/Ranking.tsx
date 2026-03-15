import { Link } from 'react-router'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Ranking() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase
        .from('users')
        .select('name, points_total, points_count, level')
        .order('points_total', { ascending: false })
        .limit(50)
      setUsers(data || [])
    }
    fetchLeaderboard()
  }, [])

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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">会员积分榜</h1>
      
      {/* 积分规则 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 积分规则</h2>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="bg-yellow-50 p-4 rounded-xl">
            <div className="text-2xl mb-1">🏟️</div>
            <div className="font-medium">主场观赛</div>
            <div className="text-yellow-600 font-bold">+10分</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl">
            <div className="text-2xl mb-1">✈️</div>
            <div className="font-medium">客场观赛</div>
            <div className="text-orange-600 font-bold">+30分</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-2xl mb-1">📺</div>
            <div className="font-medium">第二主场</div>
            <div className="text-blue-600 font-bold">+5分</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-2xl mb-1">🌏</div>
            <div className="font-medium">国家队</div>
            <div className="text-purple-600 font-bold">+50分</div>
          </div>
        </div>
      </div>

      {/* 会员等级 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">👑 会员等级</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 px-4 py-2 rounded-full text-white font-medium">钻石会员 (300+分)</div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 rounded-full text-white font-medium">黄金会员 (150-299分)</div>
          <div className="bg-gradient-to-r from-gray-300 to-gray-500 px-4 py-2 rounded-full text-white font-medium">白银会员 (50-149分)</div>
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-2 rounded-full text-white font-medium">青铜会员 (10-49分)</div>
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-4 py-2 rounded-full text-white font-medium">铁杆会员 (0-9分)</div>
        </div>
      </div>

      {/* 积分榜 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 排名榜单</h2>
        <div className="space-y-2">
          {users.map((user, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 flex items-center justify-center font-bold text-xl">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <span className="text-gray-400">#{idx + 1}</span>}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">{user.points_count}场比赛</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${getLevelBadge(user.level)}`}>
                {user.level}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-red-600">{user.points_total}</div>
                <div className="text-xs text-gray-400">积分</div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">暂无排名数据</p>
          )}
        </div>
      </div>
    </div>
  )
}
