import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '../styles/global.css'
import 'antd/dist/reset.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { userAPI, systemAPI } from '../services/api'
import { UserProvider } from '../contexts/UserContext'
import { useUser } from '../contexts/UserContext'

dayjs.locale('zh-cn')

// 创建一个新的组件来处理初始化逻辑
function AppInitializer({ children }: { children: React.ReactNode }) {
  const { updateUserInfo } = useUser()

  useEffect(() => {
    const initApp = async () => {
      try {
        // 先检查当前 webid 是否有效
        const checkResponse = await userAPI.checkWebId({})

        if (!checkResponse.web_id) {
          // 获取新的 webid
          await userAPI.getWebId({})
        } else {
          // 如果有有效的 webid，获取用户信息
          const res = await updateUserInfo()
        }
      } catch (error) {
        console.error('Init app failed:', error)
      }
    }

    initApp()
  }, [])

  return <>{children}</>
}

// 主应用组件
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AppInitializer>
        <ConfigProvider locale={zhCN}>
          <div id="root">
            <Component {...pageProps} />
          </div>
        </ConfigProvider>
      </AppInitializer>
    </UserProvider>
  )
}

export default MyApp
