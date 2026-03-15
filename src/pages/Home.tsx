import { Link } from 'react-router'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [latestNews, setLatestNews] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const { data: news } = await supabase
        .from('news')
        .select('*')
        .eq('category', 'association')
        .order('created_at', { ascending: false })
        .limit(3)
      
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .gte('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
        .limit(5)

      setLatestNews(news || [])
      setMatches(matches || [])
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-5xl">⚽</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'serif' }}>
            安阳市球迷协会
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8">
            热爱足球 · 团结进取 · 为河南加油
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/about" 
              className="bg-white text-red-600 hover:bg-red-100 px-8 py-3 rounded-full font-medium transition shadow-lg"
            >
              了解更多
            </Link>
            <Link 
              to="/login" 
              className="bg-red-800 hover:bg-red-900 text-white px-8 py-3 rounded-full font-medium transition border-2 border-red-400"
            >
              会员登录
            </Link>
          </div>
        </div>
      </section>

      {/* 积分规则 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">积分规则</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-xl text-center shadow-lg">
              <div className="text-4xl mb-2">🏟️</div>
              <div className="font-bold text-yellow-900">主场观赛</div>
              <div className="text-3xl font-bold text-yellow-900">+10分</div>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-xl text-center shadow-lg">
              <div className="text-4xl mb-2">✈️</div>
              <div className="font-bold text-orange-900">客场观赛</div>
              <div className="text-3xl font-bold text-orange-900">+30分</div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-6 rounded-xl text-center shadow-lg">
              <div className="text-4xl mb-2">📺</div>
              <div className="font-bold text-blue-900">第二主场</div>
              <div className="text-3xl font-bold text-blue-900">+5分</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-6 rounded-xl text-center shadow-lg">
              <div className="text-4xl mb-2">🌏</div>
              <div className="font-bold text-purple-900">国家队</div>
              <div className="text-3xl font-bold text-purple-900">+50分</div>
            </div>
          </div>

          {/* 会员等级 */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">会员等级</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 px-6 py-3 rounded-full text-white font-medium shadow">钻石会员 (300+分)</div>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 rounded-full text-white font-medium shadow">黄金会员 (150-299分)</div>
              <div className="bg-gradient-to-r from-gray-300 to-gray-500 px-6 py-3 rounded-full text-white font-medium shadow">白银会员 (50-149分)</div>
              <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-6 py-3 rounded-full text-white font-medium shadow">青铜会员 (10-49分)</div>
              <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-3 rounded-full text-white font-medium shadow">铁杆会员 (0-9分)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 最新新闻 */}
      {latestNews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">最新资讯</h2>
              <Link to="/news" className="text-red-600 hover:text-red-700 font-medium">查看全部 →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {latestNews.map((news) => (
                <Link key={news.id} to={`/news/${news.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                  {news.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                    <p className="text-gray-500 text-sm">{new Date(news.created_at).toLocaleDateString('zh-CN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 赛程 */}
      {matches.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">近期赛程</h2>
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">{new Date(match.match_date).toLocaleDateString('zh-CN')}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">{match.is_home ? '主场' : '客场'}</span>
                  </div>
                  <div className="font-bold text-gray-800">河南队 VS {match.opponent}</div>
                  <div className="text-gray-500">{match.venue}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
