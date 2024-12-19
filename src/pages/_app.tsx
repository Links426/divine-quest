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
    // 检查是否已有 webid
    console.log(document.cookie)
    const webid = document.cookie.split('; ').find(row => row.startsWith('webid='))?.split('=')[1]
    if (!webid) {
      userAPI.getWebId({}).then((res) => {
        console.log(document.cookie)
      })
    }
    // 如果没有，则调用创建接口

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
