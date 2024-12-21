import Image from 'next/image'
import IwsLink from './IwsLink'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { router as routerList } from './../router'
import { Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { request } from './../utils/request'
import { useUser } from '../contexts/UserContext'
import { message } from 'antd'

export default function Header() {
  const { userInfo, isLoggedIn, logout } = useUser()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const currentRouter = routerList.find((e) => e.path === router.asPath)?.name

  const handleLogout = () => {
    logout()
    router.push('/login')
    message.success('已退出登录')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo区域 */}
          <div className="flex-shrink-0 flex items-center">
            <IwsLink href="/" className="flex items-center space-x-2">
              <Image
                className="w-auto h-8"
                height={32}
                width={32}
                src="/logo.png"
                alt="Logo"
              />
              <span className="text-xl font-bold text-purple-600">AI命理大师</span>
            </IwsLink>
          </div>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center space-x-4">
            <IwsLink
              href="/"
              className={`nav-link ${currentRouter === 'home' ? 'active' : ''}`}
            >
              命理分析
            </IwsLink>
            <IwsLink
              href="/about"
              className={`nav-link ${currentRouter === 'about' ? 'active' : ''}`}
            >
              关于我们
            </IwsLink>

            {/* 添加登���/用户按钮 */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button
                  type="text"
                  icon={<UserOutlined />}
                  className="flex items-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full px-4"
                  onClick={() => router.push('/dashboard')}
                >
                  {userInfo?.username || '用户'}
                </Button>
                <Button
                  type="text"
                  className="hover:text-red-500"
                  onClick={handleLogout}
                >
                  退出
                </Button>
              </div>
            ) : (
              <Button
                type="primary"
                className="flex items-center rounded-full px-6 bg-purple-600 hover:bg-purple-700 border-none"
                onClick={() => router.push('/login')}
              >
                登录/注册
              </Button>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center space-x-4">
            {/* 添加移动端登录按钮 */}
            {isLoggedIn ? (
              <Button
                type="text"
                icon={<UserOutlined />}
                className="flex items-center text-purple-600"
                onClick={() => router.push('/dashboard')}
              />
            ) : (
              <Button
                type="primary"
                className="rounded-full px-4 bg-purple-600 hover:bg-purple-700 border-none"
                onClick={() => router.push('/login')}
              >
                登录
              </Button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-600"
            >
              <span className="sr-only">打开菜单</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <IwsLink
            href="/"
            className={`mobile-nav-link ${currentRouter === 'home' ? 'active' : ''}`}
          >
            命理分析
          </IwsLink>
          <IwsLink
            href="/fortune"
            className={`mobile-nav-link ${currentRouter === 'fortune' ? 'active' : ''}`}
          >
            今日运势
          </IwsLink>
          <IwsLink
            href="/naming"
            className={`mobile-nav-link ${currentRouter === 'naming' ? 'active' : ''}`}
          >
            智能起名
          </IwsLink>
          <IwsLink
            href="/about"
            className={`mobile-nav-link ${currentRouter === 'about' ? 'active' : ''}`}
          >
            关于我们
          </IwsLink>
        </div>
      </div>
    </nav>
  )
}
