import { useState } from 'react'
import { Form, Input, Button, message, Checkbox } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PasswordStrength } from '../components/PasswordStrength'

export default function Register() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [password, setPassword] = useState('')

  const passwordRules = [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6个字符' },
    {
      validator: (_, value) => {
        if (!value) return Promise.resolve()
        
        const errors = []
        if (!/\d/.test(value)) errors.push('需包含数字')
        if (!/[a-z]/.test(value)) errors.push('需包含小写字母')
        if (!/[A-Z]/.test(value)) errors.push('需包含大写字母')
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push('需包含特殊字符')
        
        return errors.length ? Promise.reject(errors.join('、')) : Promise.resolve()
      }
    }
  ]

  const handleRegister = async (values: any) => {
    try {
      setLoading(true)
      // TODO: 调用注册 API
      const { email, username, password } = values
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟错误处理
      if (Math.random() > 0.5) {
        throw new Error('EMAIL_EXISTS')
      }
      
      message.success({
        content: '注册成功！正在跳转...',
        duration: 2,
      })
      
      // 延迟跳转
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
    } catch (error: any) {
      // 错误处理映射
      const errorMessages = {
        'EMAIL_EXISTS': '该邮箱已被注册',
        'USERNAME_EXISTS': '用户名已被使用',
        'INVALID_PASSWORD': '密码格式不正确',
        'DEFAULT': '注册失败，请重试'
      }
      
      message.error(errorMessages[error.message] || errorMessages.DEFAULT)
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
          <h2 className="text-center text-3xl font-extrabold text-gray-900">注册账号</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            注册成为AI命理大师用户
          </p>
        </div>

        <Form
          form={form}
          onFinish={handleRegister}
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
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={passwordRules}
          >
            <div>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
                className="rounded-lg"
                onChange={e => setPassword(e.target.value)}
              />
              <PasswordStrength password={password} />
            </div>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
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
              placeholder="确认密码"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议')),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <Link href="/terms" className="text-purple-600">用户协议</Link> 和 <Link href="/privacy" className="text-purple-600">隐私政策</Link>
            </Checkbox>
          </Form.Item>

          <div>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-lg rounded-lg"
              style={{ background: '#7c3aed' }}
            >
              注册
            </Button>
            <div className="mt-4 text-center">
              <span className="text-gray-600">已有账号？</span>
              <Link href="/login" className="text-purple-600 hover:text-purple-500 ml-2">
                立即登录
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
} 