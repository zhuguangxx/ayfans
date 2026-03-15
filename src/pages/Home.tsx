import { Link } from 'react-router'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [latestNews, setLatestNews] = useState<any[]>([])
  const [upcomingMatch, setUpcomingMatch] = useState<any>(null)
  const [lastMatch, setLastMatch] = useState<any>(null)
  const [countdown, setCountdown] = useState('')
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      // 最新新闻
      const { data: news } = await supabase
        .from('news')
        .select('*')
        .eq('category', 'association')
        .order('created_at', { ascending: false })
        .limit(4)
      
      // 即将到来的比赛
      const { data: upcoming } = await supabase
        .from('matches')
        .select('*')
        .gte('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
        .limit(1)

      // 上一场比赛
      const { data: last } = await supabase
        .from('matches')
        .select('*')
        .lt('match_date', new Date().toISOString())
        .not('result', 'is', null)
        .order('match_date', { ascending: false })
        .limit(1)

      // 积分榜前10
      const { data: leaders } = await supabase
        .from('users')
        .select('name, points_total, level')
        .order('points_total', { ascending: false })
        .limit(10)

      setLatestNews(news || [])
      setUpcomingMatch(upcoming?.[0] || null)
      setLastMatch(last?.[0] || null)
      setLeaderboard(leaders || [])
    }
    fetchData()

    // 倒计时
    const timer = setInterval(() => {
      if (upcomingMatch) {
        const diff = new Date(upcomingMatch.match_date).getTime() - Date.now()
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setCountdown(`${days}天 ${hours}小时 ${mins}分钟`)
        }
      }
    }, 60000)
    return () => clearInterval(timer)
  }, [upcomingMatch])

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      '钻石会员': 'bg-gradient-to-r from-cyan-400 to-cyan-600',
      '黄金会员': 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      '白银会员': 'bg-gradient-to-r from-gray-300 to-gray-500',
      '青铜会员': 'bg-gradient-to-r from-amber-600 to-amber-800',
      '铁杆会员': 'bg-gradient-to-r from-red-600 to-red-800',
    }
    return colors[level] || 'bg-gray-400'
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-4xl">⚽</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'serif' }}>安阳市球迷协会</h1>
          <p className="text-lg md:text-xl text-red-100 mb-6">热爱足球 · 团结进取 · 为河南加油</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/about" className="bg-white text-red-600 hover:bg-red-100 px-6 py-2 rounded-full font-medium transition shadow">了解更多</Link>
            <Link to="/login" className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-full font-medium transition border-2 border-red-400">会员登录</Link>
          </div>
        </div>
      </section>

      {/* 赛事中心 */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 下一场 */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">⚔️ 下一场</h3>
              {upcomingMatch ? (
                <div>
                  <div className="text-3xl font-bold mb-2">河南 VS {upcomingMatch.opponent}</div>
                  <p className="text-red-200 mb-2">{new Date(upcomingMatch.match_date).toLocaleString('zh-CN')}</p>
                  <p className="text-red-200">{upcomingMatch.venue}</p>
                  {countdown && (
                    <div className="mt-4 bg-white/20 rounded-lg px-4 py-2 inline-block">
                      <span className="text-2xl font-bold">{countdown}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-200">暂无比赛安排</p>
              )}
            </div>

            {/* 上一场结果 */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">📊 上一场</h3>
              {lastMatch ? (
                <div>
                  <div className="text-2xl font-bold mb-2">河南 {lastMatch.result}</div>
                  <p className="text-gray-500">{new Date(lastMatch.match_date).toLocaleDateString('zh-CN')}</p>
                  <p className="text-gray-500">{lastMatch.venue}</p>
                </div>
              ) : (
                <p className="text-gray-500">暂无比赛结果</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 新闻列表 */}
      {latestNews.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📰 协会新闻</h2>
              <Link to="/news" className="text-red-600 hover:text-red-700 font-medium">查看全部 →</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestNews.map((news) => (
                <Link key={news.id} to={`/news/${news.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
                  {news.image_url && (
                    <div className="h-32 overflow-hidden">
                      <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition" />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">{new Date(news.created_at).toLocaleDateString('zh-CN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 积分榜预览 */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🏆 积分榜 TOP 10</h2>
            <Link to="/ranking" className="text-red-600 hover:text-red-700 font-medium">查看完整榜单 →</Link>
          </div>
          <div className="space-y-3">
            {leaderboard.map((user, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </div>
                <div className="flex-1 font-bold text-gray-800">{user.name}</div>
                <div className={`px-3 py-1 rounded-full text-white text-sm ${getLevelBadge(user.level)}`}>{user.level}</div>
                <div className="text-red-600 font-bold">{user.points_total}分</div>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-center text-gray-500 py-8">暂无积分数据</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
