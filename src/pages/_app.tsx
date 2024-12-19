import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '../styles/global.css'
import 'antd/dist/reset.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { userAPI, systemAPI } from '../services/api'

dayjs.locale('zh-cn')

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 添加调试信息
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
    console.log('Current cookie:', document.cookie)

    const webid = document.cookie
    if (!webid) {
      userAPI.getWebId({}).then((res) => {
        console.log('GetWebId response:', res)
        console.log('Updated cookie:', document.cookie)
      }).catch(error => {
        console.error('GetWebId failed:', error)
      })
    }
  }, [])

  return (
    <ConfigProvider locale={zhCN}>
      <div id="root">
        <Component {...pageProps} />
      </div>
    </ConfigProvider>
  )
}

export default MyApp
