import Header from './../components/header'
import Footer from './../components/footer'
import Image from 'next/image'

export default function Index() {
  const list = [
    {
      title: '竞赛',
      descript: '实验室成立数十年，拥有七项国际级奖项，十二项国家级奖项，五项省级奖项',
    },
    {
      title: '成果',
      descript:
        '实验室技术积累良多，拥有十七项软件著作权，五项实用性发明专利',
    },
    {
      title: '升学',
      descript: '实验室学长学姐去向，包括香港科技大学、中国科学院大学、加州大学伯克利分校等',
    },
    {
      title: '就业',
      descript: '实验室学长学姐去向，包括字节跳动、百度、腾讯、阿里巴巴、美团等大厂',
    },
  ]
  return (
    <main className="dark:bg-slate-800" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
      <Header />
      <div>
        <div className="max-w-7xl mx-auto px-4 py-2 h-96 ">
          <div className="relative h-full">
            <Image src="/banner.jpeg" alt="Banner" layout="fill" objectFit="cover" quality={100} />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">广州大学 313 实验室</h1>
                {/* <p className="text-lg lg:text-xl text-white">
                依托于广州大学实验中心
                <a
                  href="https://github.com/AnsonZnl/iWebsite"
                  className="text-gray bg-blue-500 hover:bg-blue-600 mx-2 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Get Start
                </a>
              </p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 from-gray-300 to-gray-700">
          <div className="py-2 text-center mb-4">
            <h2 className="text-center text-xl mb-2 dark:text-gray-300">313 的沉淀</h2>
            <p className="text-xs text-gray-400">当然不止这些</p>
          </div>
          <div className="flex flex-wrap md:flex-nowrap justify-between mb-4 w-full">
            {list.map((item) => {
              return (
                <div
                  className="h-1/2 md:h-1/4 mx-2 p-2 mb-8 md:mb-1 rounded-md shadow cursor-pointer hover:shadow-md"
                  key={item.title}
                >
                  <h3 className="text-center text-lg dark:text-gray-300">{item.title}</h3>
                  <p className="block p-4 text-sm text-gray-500 tracking-wider leading-6">
                    {item.descript}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* <div>
        <Image src="/设计图.png" width={1600} height={700} alt="设计图" />{' '}
      </div> */}

      <Footer />
    </main>
  )
}
