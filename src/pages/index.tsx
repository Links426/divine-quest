import Header from '../components/header'
import Footer from '../components/footer'
import { useState } from 'react'
import {
  Form,
  DatePicker,
  TimePicker,
  Input,
  Radio,
  Select,
  Button,
  message,
  Tabs,
  Modal,
  Timeline,
  Checkbox,
} from 'antd'
import { ClockCircleOutlined, HistoryOutlined } from '@ant-design/icons'
import CorrelationAnalysis from '../components/CorrelationAnalysis'
import DailyFortune from '../components/DailyFortune'
import SmartNaming from '../components/SmartNaming'
import { destinyAPI } from '../services/api'
import TypewriterModal from '../components/TypewriterModal'

const { TextArea } = Input
const { Option } = Select

// 模拟历史记录数据
const mockHistoryData = [
  {
    id: 1,
    date: '2024-03-15 14:30',
    result: {
      destiny: '命带贵人星，有贵人相助...',
      fortune: '近期事业运势上升，适合把握机会...',
      advice: '建议多与贵人互动，保持积极心态...',
    },
  },
  {
    id: 2,
    date: '2024-03-10 09:15',
    result: {
      destiny: '财运昌隆，有意外之财...',
      fortune: '投资机会较多��但需谨慎决策...',
      advice: '建议稳中求进，不要贪心冒进...',
    },
  },
  {
    id: 3,
    date: '2024-03-05 16:45',
    result: {
      destiny: '桃花运旺盛，人缘较好...',
      fortune: '感情方面有新的机遇...',
      advice: '把握当下，保持真诚待人...',
    },
  },
]

export default function Index() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analysis')
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [isLunar, setIsLunar] = useState(false)
  const [showTypewriter, setShowTypewriter] = useState(false)
  const [streamContent, setStreamContent] = useState('')
  const [isStreamComplete, setIsStreamComplete] = useState(true)

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      setStreamContent('')
      setIsStreamComplete(false)
      const formattedValues = {
        birth_date: values.birth_date?.format('YYYY-MM-DD'),
        birth_time: values.birth_time?.format('HH:mm'),
        birth_place: values.birth_place,
        gender: values.gender === 'male' ? '男' : '女',
        blood_type: values.blood_type,
        extra_info: values.extra_info,
        is_lunar: isLunar,
        is_leap_month: isLunar ? values.isLeapMonth : undefined,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destiny_analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      if (response.body) {
        setShowTypewriter(true)
        handleStreamData(response.body)
      }

    } catch (error) {
      setLoading(false)
      setIsStreamComplete(true)
      console.error('Analysis failed:', error)
      message.error('分析失败，请稍后重试')
    }
  }

  const showHistoryModal = () => {
    setIsHistoryModalOpen(true)
  }

  const handleHistoryModalClose = () => {
    setIsHistoryModalOpen(false)
    setSelectedRecord(null)
  }

  const showRecordDetail = (record: any) => {
    setSelectedRecord(record)
  }

  const handleTypewriterClose = () => {
    setShowTypewriter(false)

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
          break
        }
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.includes('stream completed')) {
            setLoading(false)
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
    }
  }

  const items = [
    {
      key: 'analysis',
      label: (
        <span className="flex items-center text-base">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          命理分析
        </span>
      ),
      children: (
        <div className="animate-tab-enter">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="glass-morphism p-6 md:p-8 rounded-lg transform transition-all"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">个人信息</h2>
              <div className="flex items-center space-x-4">
                {(
                  <Button
                    type="default"
                    onClick={() => {
                      if (!streamContent.trim()) {
                        message.info('暂无上次分析结果');
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
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
                )}
                <Button
                  type="text"
                  onClick={showHistoryModal}
                  className="flex items-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full px-4 py-2"
                >
                  <HistoryOutlined className="text-lg mr-1" />
                  <span>历史记录</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-700 font-medium">出生日期</span>
                    <Radio.Group
                      value={isLunar}
                      onChange={(e) => setIsLunar(e.target.value)}
                      className="ml-4"
                      size="small"
                    >
                      <Radio.Button value={false}>公历</Radio.Button>
                      <Radio.Button value={true}>农历</Radio.Button>
                    </Radio.Group>
                  </div>
                }
                required
                className="mb-6"
              >
                <div className="space-y-4">
                  <Form.Item
                    name="birth_date"
                    rules={[{ required: true, message: '请选择出生日期' }]}
                    noStyle
                  >
                    <DatePicker
                      className="w-full !bg-gray-50 hover:!bg-white focus:!bg-white transition-colors"
                      placeholder={`选择${isLunar ? '农历' : '公历'}出生日期`}
                      format={isLunar ? 'YYYY年MM月DD日' : 'YYYY年MM月DD日'}
                    />
                  </Form.Item>

                  {isLunar && (
                    <Form.Item name="isLeapMonth" valuePropName="checked" noStyle>
                      <Checkbox>闰月</Checkbox>
                    </Form.Item>
                  )}
                </div>
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">出生时间</span>}
                name="birth_time"
                rules={[{ required: true, message: '请选择出生时间' }]}
              >
                <TimePicker
                  className="w-full !bg-gray-50 hover:!bg-white focus:!bg-white transition-colors"
                  format="HH:mm"
                  placeholder="选择出生时间"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">出生地点</span>}
                name="birth_place"
                rules={[{ required: true, message: '请输入出生地点' }]}
              >
                <Input
                  placeholder="例如：北京市"
                  className="!bg-gray-50 hover:!bg-white focus:!bg-white transition-colors"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">性别</span>}
                name="gender"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Radio.Group className="flex space-x-8">
                  <Radio value="male" className="!text-gray-600">
                    男
                  </Radio>
                  <Radio value="female" className="!text-gray-600">
                    女
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">血型（可选）</span>}
                name="blood_type"
              >
                <Select
                  placeholder="请选择血型"
                  className="!bg-gray-50 hover:!bg-white focus:!bg-white transition-colors"
                  allowClear
                >
                  <Option value="A">A型</Option>
                  <Option value="B">B型</Option>
                  <Option value="O">O型</Option>
                  <Option value="AB">AB型</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-medium">附加提示（可选）</span>}
                name="extra_info"
                className="md:col-span-2"
              >
                <TextArea
                  rows={4}
                  placeholder="请输入任何您想补充的信息..."
                  className="!bg-gray-50 hover:!bg-white focus:!bg-white transition-colors"
                />
              </Form.Item>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="text-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="h-12 px-12 text-lg rounded-full animate-pulse-purple glass-morphism"
                style={{
                  background: 'linear-gradient(45deg, #9333ea, #7c3aed)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
                }}
              >
                {loading ? '分析中...' : '开始分析'}
              </Button>
              <div className="mt-2 text-sm text-gray-500">
                {loading
                  ? '正在生成分析报告，请稍候...'
                  : '点击分析后，系统将为您生成命理报告'}
              </div>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: 'fortune',
      label: (
        <span className="flex items-center text-base">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          今日运势
        </span>
      ),
      children: (
        <div className="animate-tab-enter">
          <DailyFortune />
        </div>
      ),
    },
    {
      key: 'naming',
      label: (
        <span className="flex items-center text-base">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          智能起名
        </span>
      ),
      children: (
        <div className="animate-tab-enter">
          <SmartNaming />
        </div>
      ),
    },
    {
      key: 'correlation',
      label: (
        <span className="flex items-center text-base">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          关联分析
        </span>
      ),
      children: (
        <div className="animate-tab-enter">
          <CorrelationAnalysis />
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 在 Hero 区域添加动态背景和玻璃态效果 */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 overflow-hidden">
        {/* 添加动态背景圆圈 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 左上角紫色光晕 */}
          <div className="animate-blob1 absolute bg-purple-300/40 rounded-full -top-32 -left-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>

          {/* 右上角粉色光晕 */}
          <div className="animate-blob2 absolute bg-pink-300/40 rounded-full -top-32 -right-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>

          {/* 左下角蓝色光晕 */}
          <div className="animate-blob3 absolute bg-indigo-300/40 rounded-full -bottom-32 -left-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>

          {/* 右下角紫色光晕 */}
          <div className="animate-blob4 absolute bg-purple-400/40 rounded-full -bottom-32 -right-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>

          {/* 中央渐变光晕 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/20 via-white/10 to-transparent blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-2xl text-white">
              AI 命理大师
            </h1>
            <p className="text-xl md:text-2xl text-purple-50 mb-8 animate-fade-in-delay leading-relaxed">
              运人工智能，解析您的命理，预见未来可能
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 relative bg-gradient-to-b from-white to-purple-50/50 overflow-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 添加淡化的背景光晕 */}
          <div className="animate-blob1 absolute bg-purple-200/20 rounded-full top-1/4 -left-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>
          <div className="animate-blob2 absolute bg-pink-200/20 rounded-full top-3/4 -right-32 w-[500px] h-[500px] blur-[80px] mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl mx-auto">
            {/* 改进 Tabs 容器样式 */}
            <div className="backdrop-blur-md bg-white/90 rounded-2xl shadow-xl mb-12 transition-all hover:shadow-2xl animate-fade-up overflow-hidden">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                className="glass-tabs transform-gpu"
                tabBarStyle={{
                  padding: '1rem 1.5rem',
                  marginBottom: 0,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                }}
                tabBarGutter={32}
                animated={{ inkBar: true, tabPane: true }}
                destroyInactiveTabPane={false}
              />
            </div>

            {/* 改进特性卡片区域 */}
            <div className="mt-16 animate-fade-up delay-200">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">我们的特色服务</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="feature-card group animate-hover">
                  <div className="backdrop-blur-md bg-purple-200/95 p-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                    <div className="w-16 h-16 bg-purple-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-400 transition-colors group-hover:scale-110 duration-300">
                      <svg
                        className="w-8 h-8 text-purple-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-purple-900 mb-3 group-hover:text-purple-800 transition-colors">
                      今日运势
                    </h3>
                    <p className="text-purple-800 group-hover:text-purple-900 transition-colors">
                      每日更新的运势预测，助您把握机遇，趋吉避凶
                    </p>
                  </div>
                </div>

                <div className="feature-card group animate-hover">
                  <div className="backdrop-blur-md bg-pink-200/95 p-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                    <div className="w-16 h-16 bg-pink-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-400 transition-colors group-hover:scale-110 duration-300">
                      <svg
                        className="w-8 h-8 text-pink-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-pink-900 mb-3 group-hover:text-pink-800 transition-colors">
                      智能起名
                    </h3>
                    <p className="text-pink-800 group-hover:text-pink-900 transition-colors">
                      基于八字命理的智能取名服务，为您的宝宝选择最佳名字
                    </p>
                  </div>
                </div>

                <div className="feature-card group animate-hover">
                  <div className="backdrop-blur-md bg-indigo-200/95 p-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                    <div className="w-16 h-16 bg-indigo-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-400 transition-colors group-hover:scale-110 duration-300">
                      <svg
                        className="w-8 h-8 text-indigo-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-3 group-hover:text-indigo-800 transition-colors">
                      深度分析
                    </h3>
                    <p className="text-indigo-800 group-hover:text-indigo-900 transition-colors">
                      专业的八字命理分析与人生指导，助您明晰人生方向
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 历史记录弹窗 */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <HistoryOutlined className="text-purple-600" />
              <span>算命历史记录</span>
            </div>
          }
          open={isHistoryModalOpen}
          onCancel={handleHistoryModalClose}
          footer={null}
          width={800}
          className="history-modal"
        >
          <div className="flex h-[500px]">
            {/* 左侧时间线 */}
            <div className="w-1/2 border-r pr-4 overflow-auto">
              <Timeline
                items={mockHistoryData.map((record) => ({
                  color: 'purple',
                  dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                  children: (
                    <div
                      key={record.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${selectedRecord?.id === record.id
                        ? 'bg-purple-50 border-purple-200'
                        : 'hover:bg-gray-50'
                        }`}
                      onClick={() => showRecordDetail(record)}
                    >
                      <div className="font-medium text-gray-900">{record.date}</div>
                      <div className="text-gray-500 mt-1 line-clamp-2">{record.result.destiny}</div>
                    </div>
                  ),
                }))}
              />
            </div>

            {/* 右侧详情 */}
            <div className="w-1/2 pl-4 overflow-auto">
              {selectedRecord ? (
                <div className="space-y-4">
                  <div className="text-lg font-medium text-purple-600">详细分析结果</div>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="font-medium mb-2">命理分析</div>
                      <div className="text-gray-600">{selectedRecord.result.destiny}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="font-medium mb-2">势预测</div>
                      <div className="text-gray-600">{selectedRecord.result.fortune}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="font-medium mb-2">建议</div>
                      <div className="text-gray-600">{selectedRecord.result.advice}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  请择左侧记录查看详情
                </div>
              )}
            </div>
          </div>
        </Modal>
      </main>
      <Footer />
      <TypewriterModal
        open={showTypewriter}
        onClose={handleTypewriterClose}
        content={streamContent}
        isAnalyzing={!isStreamComplete}
      />
    </div>
  )
}
