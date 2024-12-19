import { useState } from 'react'
import { Form, Input, Radio, Button, message } from 'antd'
import { destinyAPI } from '../services/api'
import TypewriterModal from './TypewriterModal'

export default function SmartNaming() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [streamContent, setStreamContent] = useState('')
  const [isStreamComplete, setIsStreamComplete] = useState(true)
  const [showTypewriter, setShowTypewriter] = useState(false)

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      setStreamContent('')
      setIsStreamComplete(false)

      const formattedValues = {
        last_name: values.lastName,
        gender: values.gender === 'male' ? '男' : '女',
        extra_info: values.extra_info
      }

      const response = await destinyAPI.analyzeName(formattedValues)

      if (response.body) {
        setShowTypewriter(true)
        handleStreamData(response.body)
      }

    } catch (error) {
      setLoading(false)
      setIsStreamComplete(true)
      console.error('Name analysis failed:', error)
      message.error('起名失败，请重试')
    }
  }

  const handleStreamData = async (stream: ReadableStream<Uint8Array>) => {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let accumulated = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          setIsStreamComplete(true)
          setStreamContent(accumulated)
          setLoading(false)
          break
        }
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.includes('stream completed')) {
            setLoading(false)
            setStreamContent(accumulated)
            return
          }
          if (line.startsWith('data:')) {
            try {
              const jsonStr = line.slice(5)
              const data = JSON.parse(jsonStr)
              if (data.message) {
                accumulated += data.message
                setStreamContent(accumulated)
              }
            } catch (e) {
              console.error('Error parsing JSON:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading stream:', error)
      setLoading(false)
      setIsStreamComplete(true)
      message.error('读取数据流失败，请重试')
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">智能起名</h2>
          <p className="text-gray-500">基于AI的智能起名系统，为您的宝宝选择最佳名字</p>
        </div>
        <Button
          type="default"
          onClick={() => {
            if (!streamContent.trim()) {
              message.info('暂无上次起名结果');
              return;
            }
            setShowTypewriter(true);
          }}
          className="flex items-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full px-4 py-2 transition-all duration-300"
          icon={
            <svg
              className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        >
          <span className="relative">
            查看上次结果
            {streamContent && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            )}
          </span>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-sm border border-purple-100">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">姓氏</span>}
              name="lastName"
              rules={[{ required: true, message: '请输入姓氏' }]}
            >
              <Input
                placeholder="请输入姓氏"
                className="!bg-white hover:!bg-gray-50 focus:!bg-white transition-colors text-lg h-12"
                maxLength={2}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">宝宝性别</span>}
              name="gender"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Radio.Group className="flex gap-6">
                <Radio value="male" className="!text-gray-600 bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">👶</span>
                    <span>男宝宝</span>
                  </div>
                </Radio>
                <Radio value="female" className="!text-gray-600 bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all">
                  <div className="flex items-center space-x-2">
                    <span className="text-pink-500">👶</span>
                    <span>女宝宝</span>
                  </div>
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">起名要求（可选）</span>
                  <span className="text-gray-400 text-sm">可以描述您对名字的期望</span>
                </div>
              }
              name="extra_info"
            >
              <Input.TextArea
                rows={4}
                placeholder="例如：希望宝宝的名字有寓意、好听、独特..."
                className="!bg-white hover:!bg-gray-50 focus:!bg-white transition-colors"
              />
            </Form.Item>

            <Form.Item className="text-center pt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="h-14 px-12 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(45deg, #9333ea, #7c3aed)',
                  border: 'none',
                }}
              >
                {loading ? '正在智能起名...' : '开始智能起名'}
              </Button>
              <div className="mt-3 text-sm text-gray-500">
                {loading ? '正在为您的宝宝精心起名，请稍候...' : '点击开始后，AI将为您的宝宝生成最佳名字'}
              </div>
            </Form.Item>
          </Form>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">智能分析</h3>
            <p className="text-gray-600 text-sm">基于深度学习的智能起名系统</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">文化传承</h3>
            <p className="text-gray-600 text-sm">融合传统文化与现代审美</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">寓意深远</h3>
            <p className="text-gray-600 text-sm">为宝宝选择最佳寓意的名字</p>
          </div>
        </div>
      </div>

      <TypewriterModal
        open={showTypewriter}
        onClose={() => setShowTypewriter(false)}
        content={streamContent}
        isAnalyzing={!isStreamComplete}
      />
    </div>
  )
} 