import { Link, useSearchParams } from 'react-router'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function News() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'association'
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      setNews(data || [])
      setLoading(false)
    }
    fetchNews()
  }, [category])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        {category === 'association' ? '协会新闻' : '俱乐部新闻'}
      </h1>
      
      {/* 分类切换 */}
      <div className="flex justify-center gap-4 mb-8">
        <Link 
          to="/news?category=association"
          className={`px-6 py-2 rounded-full font-medium transition ${category === 'association' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          协会新闻
        </Link>
        <Link 
          to="/news?category=club"
          className={`px-6 py-2 rounded-full font-medium transition ${category === 'club' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          俱乐部新闻
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : news.length === 0 ? (
        <div className="text-center py-12 text-gray-500">暂无新闻</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link 
              key={item.id} 
              to={`/news/${item.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group"
            >
              {item.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {new Date(item.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
