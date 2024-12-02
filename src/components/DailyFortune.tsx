export default function DailyFortune() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">今日运势</h2>
      <div className="space-y-6">
        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">总体运势</h3>
          <p className="text-gray-700">
            今日整体运势不错，适合处理重要事务...
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">事业运</h3>
            <p className="text-gray-700">
              工作上会有新的机遇...
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">感情运</h3>
            <p className="text-gray-700">
              桃花运旺盛，单身者容易遇到心仪对象...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 