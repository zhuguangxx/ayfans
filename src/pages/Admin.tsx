import { useState, useEffect } from 'react'
import { supabase, News, User, Match, PointRecord } from '../lib/supabase'

export default function Admin() {
  const [tab, setTab] = useState<'news' | 'users' | 'matches' | 'points' | 'about'>('news')
  const [news, setNews] = useState<News[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [about, setAbout] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Points tab state
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [pointType, setPointType] = useState<number>(10)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [pointReason, setPointReason] = useState<string>('主场观赛')

  // Form states
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image_url: '', category: 'association' })
  const [userForm, setUserForm] = useState({ name: '', phone: '', id_card: '', gender: '男', is_annual_card: false, expire_date: '' })
  const [matchForm, setMatchForm] = useState({ opponent: '', match_date: '', match_type: 'league', venue: '', is_home: true, result: '' })

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

  // News handlers
  async function handleAddNews() {
    await supabase.from('news').insert([newsForm])
    setNewsForm({ title: '', content: '', image_url: '', category: 'association' })
    loadData()
  }
  async function handleDeleteNews(id: number) {
    await supabase.from('news').delete().eq('id', id)
    loadData()
  }

  // User handlers
  async function handleAddUser() {
    const { data: lastUser } = await supabase.from('users').select('rank').order('rank', { ascending: false }).limit(1).single()
    const newRank = lastUser ? lastUser.rank + 1 : 1
    await supabase.from('users').insert([{ ...userForm, rank: newRank, password: userForm.id_card.slice(-6) }])
    setUserForm({ name: '', phone: '', id_card: '', gender: '男', is_annual_card: false, expire_date: '' })
    loadData()
  }
  async function handleDeleteUser(id: number) {
    await supabase.from('users').delete().eq('id', id)
    loadData()
  }

  // Match handlers
  async function handleAddMatch() {
    await supabase.from('matches').insert([matchForm])
    setMatchForm({ opponent: '', match_date: '', match_type: 'league', venue: '', is_home: true, result: '' })
    loadData()
  }
  async function handleUpdateMatchResult(id: number, result: string) {
    await supabase.from('matches').update({ result }).eq('id', id)
    loadData()
  }

  // Points handlers - add points to selected users for selected match
  async function handleAddPoints() {
    if (!selectedMatch || selectedUsers.length === 0) return

    const pointRecords = selectedUsers.map(userId => ({
      user_id: userId,
      match_id: selectedMatch,
      points: pointType,
      reason: pointReason
    }))

    // Insert point records
    await supabase.from('point_records').insert(pointRecords)

    // Update user points
    for (const userId of selectedUsers) {
      const user = users.find(u => u.id === userId)
      if (user) {
        await supabase.from('users')
          .update({ 
            points_total: user.points_total + pointType,
            points_count: user.points_count + 1
          })
          .eq('id', userId)
      }
    }

    // Recalculate ranks
    const { data: allUsers } = await supabase.from('users').select('id').order('points_total', { ascending: false })
    if (allUsers) {
      for (let i = 0; i < allUsers.length; i++) {
        await supabase.from('users').update({ rank: i + 1 }).eq('id', allUsers[i].id)
      }
    }

    // Reset selection
    setSelectedUsers([])
    setSelectedMatch(null)
    alert('加分成功！')
    loadData()
  }

  // About handlers
  async function handleUpdateAbout() {
    if (about) {
      await supabase.from('about').update({ content: about.content, image_url: about.image_url }).eq('id', about.id)
    }
  }

  const inputClass = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 outline-none text-sm"

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">管理后台</h1>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { key: 'news', label: '新闻管理' },
          { key: 'users', label: '会员管理' },
          { key: 'matches', label: '比赛管理' },
          { key: 'points', label: '加分管理' },
          { key: 'about', label: '关于协会' }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap text-sm ${tab === t.key ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-8">加载中...</div> : (
        <div className="space-y-4">
          {/* News Tab */}
          {tab === 'news' && (
            <>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold mb-3 text-sm">添加新闻</h3>
                <div className="grid gap-3">
                  <input value={newsForm.title} onChange={(e) => setNewsForm({...newsForm, title: e.target.value})} placeholder="标题" className={inputClass} />
                  <textarea value={newsForm.content} onChange={(e) => setNewsForm({...newsForm, content: e.target.value})} placeholder="内容" className={inputClass} rows={3} />
                  <input value={newsForm.image_url} onChange={(e) => setNewsForm({...newsForm, image_url: e.target.value})} placeholder="图片URL" className={inputClass} />
                  <select value={newsForm.category} onChange={(e) => setNewsForm({...newsForm, category: e.target.value})} className={inputClass}>
                    <option value="association">协会新闻</option>
                    <option value="club">俱乐部新闻</option>
                  </select>
                  <button onClick={handleAddNews} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">添加</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold mb-3 text-sm">新闻列表</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {news.map((n) => (
                    <div key={n.id} className="flex justify-between items-center py-2 border text-sm">
                      <span className="truncate flex-1">{n.title}</span>
                      <button onClick={() => handleDeleteNews(n.id)} className="text-red-600 ml-2">删除</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Users Tab */}
          {tab === 'users' && (
            <>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold mb-3 text-sm">添加会员</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <input value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} placeholder="姓名" className={inputClass} />
                  <input value={userForm.phone} onChange={(e) => setUserForm({...userForm, phone: e.target.value})} placeholder="手机号" className={inputClass} />
                  <input value={userForm.id_card} onChange={(e) => setUserForm({...userForm, id_card: e.target.value})} placeholder="身份证号" className={inputClass} />
                  <input value={userForm.expire_date} onChange={(e) => setUserForm({...userForm, expire_date: e.target.value})} type="date" className={inputClass} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={userForm.is_annual_card} onChange={(e) => setUserForm({...userForm, is_annual_card: e.target.checked})} />
                    年卡会员
                  </label>
                  <button onClick={handleAddUser} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">添加</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold mb-3 text-sm">会员列表 ({users.length}人)</h3>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">姓名</th>
                        <th className="text-left py-2">手机</th>
                        <th className="text-left py-2">积分</th>
                        <th className="text-left py-2">等级</th>
                        <th className="text-left py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b">
                          <td className="py-2">{u.name}</td>
                          <td className="py-2">{u.phone}</td>
                          <td className="py-2">{u.points_total}</td>
                          <td className="py-2">{u.level}</td>
                          <td className="py-2"><button onClick={() => handleDeleteUser(u.id)} className="text-red-600 text-xs">删除</button></td>
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
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold mb-3 text-sm">添加比赛</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <input value={matchForm.opponent} onChange={(e) => setMatchForm({...matchForm, opponent: e.target.value})} placeholder="对手" className={inputClass} />
                  <input value={matchForm.match_date} onChange={(e) => setMatchForm({...matchForm, match_date: e.target.value})} type="datetime-local" className={inputClass} />
                  <input value={matchForm.venue} onChange={(e) => setMatchForm({...matchForm, venue: e.target.value})} placeholder="场地" className={inputClass} />
                  <input value={matchForm.result} onChange={(e) => setMatchForm({...matchForm, result: e.target.value})} placeholder="比赛结果（如 2-1）" className={inputClass} />
                  <select value={matchForm.match_type} onChange={(e) => setMatchForm({...matchForm, match_type: e.target.value})} className={inputClass}>
                    <option value="league">联赛</option>
                    <option value="cup">杯赛</option>
                    <option value="national">国家队</option>
                    <option value="second_home">第二主场</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={matchForm.is_home} onChange={(e) => setMatchForm({...matchForm, is_home: e.target.checked})} />
                    主场
                  </label>
                  <button onClick={handleAddMatch} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">添加</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold mb-3 text-sm">比赛列表</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {matches.map((m) => (
                    <div key={m.id} className="flex justify-between items-center py-2 border text-sm">
                      <span className="flex-1">{m.match_date?.slice(0, 16)} {m.opponent} ({m.is_home ? '主' : '客'}) {m.result && <span className="text-green-600 ml-2">{m.result}</span>}</span>
                      {!m.result && (
                        <input 
                          placeholder="输入结果" 
                          className="border rounded px-2 py-1 text-xs w-20"
                          onBlur={(e) => handleUpdateMatchResult(m.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Points Tab - 加分管理 */}
          {tab === 'points' && (
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold mb-4 text-sm">选择比赛场次</h3>
              <select 
                className={inputClass} 
                value={selectedMatch || ''} 
                onChange={(e) => setSelectedMatch(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">请选择比赛场次</option>
                {matches.filter(m => m.result).map(m => (
                  <option key={m.id} value={m.id}>
                    {m.match_date?.slice(0, 16)} {m.opponent} {m.result}
                  </option>
                ))}
              </select>

              {selectedMatch && (
                <>
                  <h3 className="font-bold mb-3 mt-4 text-sm">加分类型</h3>
                  <select 
                    className={inputClass} 
                    value={pointType} 
                    onChange={(e) => {
                      setPointType(Number(e.target.value))
                      const reasons: Record<number, string> = { 10: '主场观赛', 30: '客场观赛', 5: '第二主场', 50: '国家队比赛' }
                      setPointReason(reasons[Number(e.target.value)] || '加分')
                    }}
                  >
                    <option value={10}>主场观赛 +10分</option>
                    <option value={30}>客场观赛 +30分</option>
                    <option value={5}>第二主场 +5分</option>
                    <option value={50}>国家队比赛 +50分</option>
                  </select>

                  <h3 className="font-bold mb-3 mt-4 text-sm">选择会员（已选 {selectedUsers.length} 人）</h3>
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-1">
                    {users.map(u => (
                      <label key={u.id} className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer text-sm">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, u.id])
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== u.id))
                            }
                          }}
                        />
                        {u.name} ({u.phone}) - 当前 {u.points_total}分
                      </label>
                    ))}
                  </div>

                  <button 
                    onClick={handleAddPoints} 
                    disabled={selectedUsers.length === 0}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg mt-4 font-medium disabled:opacity-50"
                  >
                    确认加分 ({selectedUsers.length}人 × {pointType}分 = {selectedUsers.length * pointType}分)
                  </button>
                </>
              )}
            </div>
          )}

          {/* About Tab */}
          {tab === 'about' && about && (
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold mb-3 text-sm">关于协会</h3>
              <textarea
                value={about.content || ''}
                onChange={(e) => setAbout({...about, content: e.target.value})}
                className={inputClass}
                rows={8}
              />
              <input
                value={about.image_url || ''}
                onChange={(e) => setAbout({...about, image_url: e.target.value})}
                placeholder="封面图片URL"
                className={`${inputClass} mt-3`}
              />
              <button onClick={handleUpdateAbout} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-3 text-sm">保存</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
