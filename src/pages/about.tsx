import Header from './../components/header'
import Footer from './../components/footer'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* 添加背景动效 */}
      <div className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-blob1 absolute bg-purple-300/30 rounded-full -top-32 -left-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>
          <div className="animate-blob2 absolute bg-pink-300/30 rounded-full -top-32 -right-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>
          <div className="animate-blob3 absolute bg-blue-300/30 rounded-full -bottom-32 -left-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>
          <div className="animate-blob4 absolute bg-purple-400/30 rounded-full -bottom-32 -right-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-200/20 via-pink-200/20 to-transparent blur-[100px] opacity-60"></div>
        </div>

        <main className="relative flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* 愿景部分 */}
              <section className="text-center backdrop-blur-sm bg-white/50 p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  传承智慧，融合科技 ✨
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  AI命理大师致力于将传统命理文化与现代人工智能技术完美结合 🤖，打造智能化的命理分析平台，让东方智慧在数字时代焕发新生 🌟
                </p>
              </section>

              {/* 使命部分 */}
              <section className="backdrop-blur-sm bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🎯</span> 我们的使命
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start">
                    <span className="mr-2 text-xl">🚀</span>
                    我们立志成为命理文化传承与创新的引领者，通过科技的力量，让传统命理文化更好地服务于现代人的生活。
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2 text-xl">💡</span>
                    利用人工智能技术，我们将数千年的命理智慧系统化、科学化，让每个人都能便捷地获得专业的命理指导。
                  </p>
                </div>
              </section>

              {/* 核心价值观 */}
              <section className="backdrop-blur-sm bg-white/70 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-2">💫</span> 核心价值观
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 p-6 bg-white/50 rounded-xl hover:shadow-md transition-all">
                    <h3 className="text-xl font-semibold text-purple-600 flex items-center">
                      <span className="mr-2">📚</span> 专业严谨
                    </h3>
                    <p className="text-gray-600">
                      基于深厚的命理理论基础，结合先进的AI算法，提供准确可靠的分析结果。
                    </p>
                  </div>
                  <div className="space-y-2 p-6 bg-white/50 rounded-xl hover:shadow-md transition-all">
                    <h3 className="text-xl font-semibold text-purple-600 flex items-center">
                      <span className="mr-2">🔮</span> 开放创新
                    </h3>
                    <p className="text-gray-600">
                      持续探索命理与科技的融合可能，不断优化算法模型，提升服务体验。
                    </p>
                  </div>
                  <div className="space-y-2 p-6 bg-white/50 rounded-xl hover:shadow-md transition-all">
                    <h3 className="text-xl font-semibold text-purple-600 flex items-center">
                      <span className="mr-2">🌏</span> 普惠共享
                    </h3>
                    <p className="text-gray-600">
                      让命理文化的智慧触手可及，帮助更多人认识自我，规划人生。
                    </p>
                  </div>
                  <div className="space-y-2 p-6 bg-white/50 rounded-xl hover:shadow-md transition-all">
                    <h3 className="text-xl font-semibold text-purple-600 flex items-center">
                      <span className="mr-2">🤝</span> 责任担当
                    </h3>
                    <p className="text-gray-600">
                      秉持道德准则，保护用户隐私，为社会提供正向价值。
                    </p>
                  </div>
                </div>
              </section>

              {/* 发展愿景 */}
              <section className="backdrop-blur-sm bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🔭</span> 发展愿景
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start">
                    <span className="mr-2 text-xl">🌈</span>
                    未来，我们将持续深化AI技术在命理领域的应用，开发更多创新功能，打造全球领先的智能命理服务平台。
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2 text-xl">📈</span>
                    通过不断积累数据和优化算法，我们将为用户提供更精准的命理分析、更个性化的生活建议和更全面的发展规划。
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2 text-xl">🤲</span>
                    我们期待与更多志同道合的伙伴一起，共同推动命理文化的现代化发展，让东方智慧更好地服务全人类。
                  </p>
                </div>
              </section>

              {/* 技术实力 */}
              <section className="backdrop-blur-sm bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">💪</span> 技术实力
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start">
                    <span className="mr-2 text-xl">🧠</span>
                    我们拥有业内领先的AI算法团队，通过深度学习技术，构建了强大的命理分析模型。
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2 text-xl">☁️</span>
                    平台采用最新的云计算架构，确保服务的高可用性和可扩展性，为数百万用户提供稳定可靠的服务。
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2 text-xl">🔬</span>
                    持续投入研发创新，在命理数据分析、模式识别、智能推荐等领域拥有多项技术专利。
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
