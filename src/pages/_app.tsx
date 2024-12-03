import type { AppProps } from 'next/app'
import '../styles/global.css'
import 'antd/dist/reset.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={zhCN}>
      <div id="root">
        <Component {...pageProps} />
      </div>
    </ConfigProvider>
  )
}

export default MyApp
