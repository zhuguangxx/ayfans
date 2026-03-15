import { useParams, Link } from 'react-router'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function NewsDetail() {
  const { id } = useParams()
  const [news, setNews] = useState<any>(null)

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase.from('news').select('*').eq('id', id).single()
      setNews(data)
    }
    if (id) fetchNews()
  }, [id])

  if (!news) return <div className="text-center py-12">加载中...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/news" className="text-red-600 hover:text-red-700 mb-4 inline-block">← 返回新闻列表</Link>
      <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {news.image_url && (
          <img src={news.image_url} alt={news.title} className="w-full h-80 object-cover" />
        )}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{news.title}</h1>
          <p className="text-gray-500 mb-6">{new Date(news.created_at).toLocaleDateString('zh-CN')}</p>
          <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">{news.content}</div>
        </div>
      </article>
    </div>
  )
}
