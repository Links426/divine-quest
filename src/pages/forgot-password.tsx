import { useState } from 'react'
import { Form, Input, Button, message, Steps } from 'antd'
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

const { Step } = Steps

export default function ForgotPassword() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const [countdown, setCountdown] = useState(0)

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email')
      if (!email) {
        message.error('请输入邮箱')
        return
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        message.error('请输入正确的邮箱格式')
        return
      }

      // TODO: 调用发送验证码 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success('验证码已发送，请查收邮件')
      
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
    }
  }

  // 验证邮箱
  const handleVerifyEmail = async (values: any) => {
    try {
      setLoading(true)
      // TODO: 调用验证邮箱 API
      console.log('验证信息:', values)
      setCurrentStep(1)
    } catch (error) {
      message.error('验证失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 重置密码
  const handleResetPassword = async (values: any) => {
    try {
      setLoading(true)
      // TODO: 调用重置密码 API
      console.log('重置密码:', values)
      message.success('密码重置成功！')
      router.push('/login')
    } catch (error) {
      message.error('重置失败，请重试')
    } finally {
      setLoading(false)
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
          <h2 className="text-center text-3xl font-extrabold text-gray-900">找回密码</h2>
          <div className="mt-8">
            <Steps current={currentStep} className="px-8">
              <Step title="验证邮箱" />
              <Step title="重置密码" />
            </Steps>
          </div>
        </div>

        {currentStep === 0 ? (
          <Form
            form={form}
            onFinish={handleVerifyEmail}
            className="mt-8 space-y-6"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱"
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
              下一步
            </Button>
          </Form>
        ) : (
          <Form
            form={form}
            onFinish={handleResetPassword}
            className="mt-8 space-y-6"
          >
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="新密码"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认新密码"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-lg rounded-lg"
              style={{ background: '#7c3aed' }}
            >
              重置密码
            </Button>
          </Form>
        )}

        <div className="text-center">
          <Link href="/login" className="text-purple-600 hover:text-purple-500">
            返回登录
          </Link>
        </div>
      </div>
    </div>
  )
} 