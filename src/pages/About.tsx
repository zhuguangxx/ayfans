import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function About() {
  const [about, setAbout] = useState<any>(null)

  useEffect(() => {
    async function fetchAbout() {
      const { data } = await supabase.from('about').select('*').limit(1).single()
      setAbout(data)
    }
    fetchAbout()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">关于协会</h1>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {about?.image_url && (
          <img src={about.image_url} alt="关于协会" className="w-full h-64 object-cover rounded-xl mb-6" />
        )}
        <div className="prose max-w-none">
          {about?.content ? (
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">{about.content}</div>
          ) : (
            <p className="text-gray-500 text-center py-8">暂无内容，请在后台添加</p>
          )}
        </div>
      </div>
    </div>
  )
}
