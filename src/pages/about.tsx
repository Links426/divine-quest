import Header from './../components/header'
import Footer from './../components/footer'
import Markdown from 'react-markdown'



export default function About() {
  const qaList = [
    {
      q: '我们是谁？😎',
      a: '广州大学计算机313实验室，驻足于广州大学实验中心。成立十余年，积累颇丰。',
    },
    {
      q: '我们的目标是什么？🎯',
      a: '作为广州大学实验中心的一员，我们追求极致、务实敢为、开放谦虚，立足于培养人才，和优秀的人，做正确的事！',
    },
    {
      q: '我们的成果有哪些？🏅️',
      a: '团队成立至今，国家级奖项十余项，省级奖项二十余项；团队往届成员的去向包括 香港大学、中国科学院大学、字节跳动、美团、滴滴、腾讯、OPPO等。',
    },
    {
      q: '怎么联系我们？📮',
      a: '有任何的疑问（诸如加入、合作、参观等）都可以联系邮箱：links426@e.gzhu.edu.cn',
    },
  ]
  return (
    <main className="dark:bg-slate-800" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
      <Header />
      <div>
        <div className="max-w-7xl mx-auto p-4 h-[36rem]">
          {qaList.map((e) => {
            return (
              <div key={e.a} className="mb-4">
                <h2 className="text-xl mb-2 dark:text-gray-300">{e.q}</h2>
                <p className="text-sm text-gray-600">{e.a}</p>
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </main>
  )
}
