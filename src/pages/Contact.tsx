export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">联系我们</h1>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">地址</h3>
              <p className="text-gray-600">河南省安阳市北关区红旗路158号</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📞</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">电话</h3>
              <p className="text-gray-600">0372-1234567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
