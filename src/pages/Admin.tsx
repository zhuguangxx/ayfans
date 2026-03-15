import { useState, useEffect } from 'react'
import { supabase, News, User, Match } from '../lib/supabase'

export default function Admin() {
  const [tab, setTab] = useState<'news' | 'users' | 'matches' | 'about'>('news')
  const [news, setNews] = useState<News[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [about, setAbout] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Form states
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image_url: '', category: 'association' })
  const [userForm, setUserForm] = useState({ name: '', phone: '', id_card: '', gender: '男', is_annual_card: false, expire_date: '' })
  const [matchForm, setMatchForm] = useState({ opponent: '', match_date: '', match_type: 'league', venue: '', is_home: true })

  useEffect(() => {
    loadData()
  }, [tab])

  async function loadData() {
    setLoading(true)
    if (tab === 'news') {
      const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
      setNews(data || [])
    } else if (tab === 'users') {
      const { data } = await supabase.from('users').select('*').order('points_total', { ascending: false })
      setUsers(data || [])
    } else if (tab === 'matches') {
      const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: false })
      setMatches(data || [])
    } else if (tab === 'about') {
      const { data } = await supabase.from('about').select('*').limit(1).single()
      setAbout(data)
    }
    setLoading(false)
  }

  async function handleAddNews() {
    await supabase.from('news').insert([newsForm])
    setNewsForm({ title: '', content: '', image_url: '', category: 'association' })
    loadData()
  }

  async function handleDeleteNews(id: number) {
    await supabase.from('news').delete().eq('id', id)
    loadData()
  }

  async function handleAddUser() {
    const { data: lastUser } = await supabase.from('users').select('rank').order('rank', { ascending: false }).limit(1).single()
    const newRank = lastUser ? lastUser.rank + 1 : 1
    await supabase.from('users').insert([{ ...userForm, rank: newRank, password: userForm.id_card.slice(-6) }])
    setUserForm({ name: '', phone: '', id_card: '', gender: '男', is_annual_card: false, expire_date: '' })
    loadData()
  }

  async function handleAddMatch() {
    await supabase.from('matches').insert([matchForm])
    setMatchForm({ opponent: '', match_date: '', match_type: 'league', venue: '', is_home: true })
    loadData()
  }

  async function handleUpdateAbout() {
    if (about) {
      await supabase.from('about').update({ content: about.content, image_url: about.image_url }).eq('id', about.id)
    }
  }

  const inputClass = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 outline-none"

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">管理后台</h1>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['news', 'users', 'matches', 'about'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${tab === t ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {t === 'news' ? '新闻管理' : t === 'users' ? '会员管理' : t === 'matches' ? '比赛管理' : '关于协会'}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-8">加载中...</div> : (
        <div className="space-y-6">
          {/* News Tab */}
          {tab === 'news' && (
            <>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold mb-4">添加新闻</h3>
                <div className="grid gap-4">
                  <input value={newsForm.title} onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} placeholder="标题" className={inputClass} />
                  <textarea value={newsForm.content} onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} placeholder="内容" className={inputClass} rows={4} />
                  <input value={newsForm.image_url} onChange={(e) => setNewsForm({...newsForm, image_url: e.target.value})} placeholder="图片URL" className={inputClass} />
                  <select value={newsForm.category} onChange={(e) => setNewsForm({...newsForm, category: e.target.value})} className={inputClass}>
                    <option value="association">协会新闻</option>
                    <option value="club">俱乐部新闻</option>
                  </select>
                  <button onClick={handleAddNews} className="bg-red-600 text-white px-4 py-2 rounded-lg">添加</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold mb-4">新闻列表</h3>
                <div className="space-y-2">
                  {news.map((n) => (
                    <div key={n.id} className="flex justify-between items-center py-2 border">
                      <span>{n.title}</span>
                      <button onClick={() => handleDeleteNews(n.id)} className="text-red-600">删除</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Users Tab */}
          {tab === 'users' && (
            <>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold mb-4">添加会员</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} placeholder="姓名" className={inputClass} />
                  <input value={userForm.phone} onChange={(e) => setUserForm({...userForm, phone: e.target.value})} placeholder="手机号" className={inputClass} />
                  <input value={userForm.id_card} onChange={(e) => setUserForm({...userForm, id_card: e.target.value})} placeholder="身份证号" className={inputClass} />
                  <input value={userForm.expire_date} onChange={(e) => setUserForm({...userForm, expire_date: e.target.value})} type="date" className={inputClass} />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={userForm.is_annual_card} onChange={(e) => setUserForm({...userForm, is_annual_card: e.target.checked})} />
                    年卡会员
                  </label>
                  <button onClick={handleAddUser} className="bg-red-600 text-white px-4 py-2 rounded-lg">添加</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold mb-4">会员列表 ({users.length}人)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">姓名</th>
                        <th className="text-left py-2">手机</th>
                        <th className="text-left py-2">积分</th>
                        <th className="text-left py-2">等级</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b">
                          <td className="py-2">{u.name}</td>
                          <td className="py-2">{u.phone}</td>
                          <td className="py-2">{u.points_total}</td>
                          <td className="py-2">{u.level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Matches Tab */}
          {tab === 'matches' && (
            <>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold mb-4">添加比赛</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={matchForm.opponent} onChange={(e) => setMatchForm({...matchForm, opponent: e.target.value})} placeholder="对手" className={inputClass} />
                  <input value={matchForm.match_date} onChange={(e) => setMatchForm({...matchForm, match_date: e.target.value})} type="datetime-local" className={inputClass} />
                  <input value={matchForm.venue} onChange={(e) => setMatchForm({...matchForm, venue: e.target.value})} placeholder="场地" className={inputClass} />
                  <select value={matchForm.match_type} onChange={(e) => setMatchForm({...matchForm, match_type: e.target.value})} className={inputClass}>
                    <option value="league">联赛</option>
                    <option value="cup">杯赛</option>
                    <option value="national">国家队</option>
                    <option value="second_home">第二主场</option>
                  </select>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={matchForm.is_home} onChange={(e) => setMatchForm({...matchForm, is_home: e.target.checked})} />
                    主场
                  </label>
                  <button onClick={handleAddMatch} className="bg-red-600 text-white px-4 py-2 rounded-lg">添加</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold mb-4">比赛列表</h3>
                <div className="space-y-2">
                  {matches.map((m) => (
                    <div key={m.id} className="flex justify-between items-center py-2 border">
                      <span>{m.match_date?.slice(0, 16)} {m.opponent} ({m.is_home ? '主场' : '客场'})</span>
                      <span className="text-gray-500">{m.match_type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* About Tab */}
          {tab === 'about' && about && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4">关于协会</h3>
              <textarea
                value={about.content || ''}
                onChange={(e) => setAbout({...about, content: e.target.value})}
                className={inputClass}
                rows={10}
              />
              <input
                value={about.image_url || ''}
                onChange={(e) => setAbout({...about, image_url: e.target.value})}
                placeholder="封面图片URL"
                className={`${inputClass} mt-4`}
              />
              <button onClick={handleUpdateAbout} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4">保存</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
