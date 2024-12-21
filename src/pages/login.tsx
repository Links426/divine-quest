import { useState } from 'react'
import { Form, Input, Button, Tabs, message, Divider, Radio } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, WechatOutlined, ArrowLeftOutlined, PhoneOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { userAPI } from '../services/api'
import { useUser } from '../contexts/UserContext'

const { TabPane } = Tabs

export default function Login() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sendCodeLoading, setSendCodeLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('account')
  const router = useRouter()
  const [countdown, setCountdown] = useState(0)
  const { updateUserInfo } = useUser()

  // 验证输入类型的函数
  const getInputType = (value: string): 'phone' | 'email' | null => {
    if (!value) return null
    const phoneRegex = /^1[3-9]\d{9}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (phoneRegex.test(value)) return 'phone'
    if (emailRegex.test(value)) return 'email'
    return null
  }

  // 账号密码登录
  const handleAccountLogin = async (values: any) => {
    try {
      setLoading(true)

      // 调用账号密码登录 API
      const response = await userAPI.login({
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password
      })


      message.success('登录成功！')
      router.push('/')
    } catch (error) {
      message.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 验证码登录
  const handleCodeLogin = async (values: any) => {
    try {
      setLoading(true)
      const inputType = getInputType(values.contact)

      if (!inputType) {
        message.error('请输入正确的手机号或邮箱')
        return
      }

      const response = await userAPI.quickLogin({
        input: values.contact,
        code: values.code,
        tag: inputType === 'email' ? 2 : 3
      })

      // 登录成功后更新用户信息
      await updateUserInfo()
      
      message.success('登录成功！')
      router.push('/')
    } catch (error) {
      message.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 修改发送验证码处理函数
  const handleSendCode = async () => {
    try {
      setSendCodeLoading(true)
      const contact = form.getFieldValue('contact')
      if (!contact) {
        message.error('请输入手机号或邮箱')
        return
      }

      const inputType = getInputType(contact)
      if (!inputType) {
        message.error('请输入正确的手机号或邮箱格式')
        return
      }

      // 调用发送验证码 API
      const response = await userAPI.sendVerifyCode({
        input: contact,
        tag: inputType === 'email' ? 2 : 3
      })




      message.success(`验证码已发送${inputType === 'email' ? '，请查收邮件' : ''}`)

      // 开始倒计时
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (error) {
      message.error('发送验证码失败，请重试')
    } finally {
      setSendCodeLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Link href="/">
        <a className="fixed top-8 left-8 flex items-center text-gray-600 hover:text-purple-600 transition-colors">
          <ArrowLeftOutlined className="mr-2" />
          <span>返回首页</span>
        </a>
      </Link>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">AI命理大师</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            登录后开启您的命理之旅
          </p>
        </div>

        <Tabs
          activeKey={'code'}
          onChange={setActiveTab}
          centered
          animated={false}
        >


          <TabPane tab="验证码登录" key="code">
            <Form form={form} onFinish={handleCodeLogin} className="mt-8 space-y-6">
              <Form.Item
                name="contact"
                rules={[
                  { required: true, message: '请输入手机号或邮箱' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve()
                      return getInputType(value)
                        ? Promise.resolve()
                        : Promise.reject('请输入正确的手机号或邮箱格式')
                    }
                  }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入手机号或邮箱"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <div className="flex space-x-4">
                  <Input
                    placeholder="验证码"
                    size="large"
                    className="rounded-lg"
                  />
                  <Button
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="w-32 rounded-lg"
                    loading={sendCodeLoading}
                  >
                    {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                  </Button>
                </div>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-lg rounded-lg"
                style={{ background: '#7c3aed' }}
              >
                登录
              </Button>
            </Form>
          </TabPane>
        </Tabs>

        <div className="mt-6">
          <Divider>第三方登录</Divider>
          <div className="flex justify-center space-x-8 mt-4">
            <Button
              icon={<GoogleOutlined />}
              className="flex items-center"
              onClick={() => message.info('Google登录开发中')}
            >
              Google登录
            </Button>
            <Button
              icon={<WechatOutlined />}
              className="flex items-center"
              onClick={() => message.info('微信登录开发中')}
            >
              微信登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 