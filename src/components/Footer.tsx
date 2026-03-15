export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">安阳市球迷协会</h3>
            <p className="text-sm text-gray-400">
              致力于为安阳球迷提供最专业的服务
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white">关于协会</a></li>
              <li><a href="/news" className="hover:text-white">协会新闻</a></li>
              <li><a href="/contact" className="hover:text-white">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">联系我们</h3>
            <p className="text-sm text-gray-400">
              Email: anyangfans@email.com<br />
              电话: 0372-1234567
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2026 安阳市球迷协会. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
