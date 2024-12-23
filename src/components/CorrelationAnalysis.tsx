import { useState } from 'react'
import { Form, Input, Button, Select, Collapse, Tag, Modal, Timeline, message } from 'antd'
import { PlusOutlined, ClockCircleOutlined, StarOutlined, CompassOutlined, RightOutlined, HistoryOutlined } from '@ant-design/icons'
import { destinyAPI, systemAPI, userAPI, type CorrelationAnalysisParams } from '../services/api'
import TypewriterModal from './TypewriterModal'

const { Option } = Select
const { Panel } = Collapse

// 预设的事件选项
const eventAOptions = [
  { category: '职业发展', items: ['更换工作', '参加培训', '创业', '调整职业方向', '申请升职'] },
  { category: '学习进修', items: ['报考资格证', '参加考试', '学习新技能', '报名课程', '考研'] },
  { category: '生活健康', items: ['开始健身', '改善作息', '调整饮食', '学习冥想', '戒烟戒酒'] },
  { category: '人际关系', items: ['扩展社交圈', '改善家庭关系', '寻找伴侣', '加入社团', '和解旧怨'] },
]

const eventBOptions = [
  { category: '事业成就', items: ['获得晋升', '收入提升', '业务突破', '团队壮大', '项目成功'] },
  { category: '个人成长', items: ['能力提升', '心态改善', '自信增强', '压力缓解', '效率提高'] },
  { category: '身心健康', items: ['体重达标', '精力充沛', '睡眠质量', '抵抗力增强', '心情愉悦'] },
  { category: '人际效果', items: ['人缘改善', '贵人相助', '恋爱脱单', '化解矛盾', '建立信任'] },
]

// 首先定义一个类型来描述 promptTemplates 的结构
type PromptTemplate = {
  [key: string]: {
    [key: string]: string[]
  }
}



// 然后在组件中声明 promptTemplates 时使用这个类型
const promptTemplates: PromptTemplate = {
  // ... 你的现有数据
}

// 添加关联分析历史记录数据
const mockCorrelationHistory = [
  {
    id: 1,
    date: '2024-03-20 15:30',
    eventA: '更换工作',
    eventB: '得晋升',
    result: {
      correlation: '正相关 (85%)',
      analysis: '更换工作到新环境后，由于您的专业能力得到充分发挥，晋升机会显著提升...',
      suggestion: '建议在新工作中主动承担更多责任，展现领导力，为晋升创造有利条件...',
      risk: '需注意新环境适应期可能带来的短期绩效波动...'
    }
  },
  {
    id: 2,
    date: '2024-03-15 10:20',
    eventA: '开始健身',
    eventB: '工作效率',
    result: {
      correlation: '正相关 (72%)',
      analysis: '规律运动帮助提升精力和注意力，对工作效率有明显促进作用...',
      suggestion: '建议保持每周3-4次的运动频率，但避免过度训练影响工作...',
      risk: '初期适应阶段可能会感觉疲惫，建议循序渐进...'
    }
  },
  {
    id: 3,
    date: '2024-03-10 09:15',
    eventA: '参加培训',
    eventB: '收入提升',
    result: {
      correlation: '正相关 (78%)',
      analysis: '专业技能提升直接影响职业发展空间，对收入增长有积极影响...',
      suggestion: '建议将培训所学及时应用到实际工作中，创造价值...',
      risk: '需要平衡培训投入与短期收益的关系...'
    }
  }
]

export default function CorrelationAnalysis() {
  const [form] = Form.useForm()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [expandedA, setExpandedA] = useState(false)
  const [expandedB, setExpandedB] = useState(false)
  const [currentPrompts, setCurrentPrompts] = useState<string[]>([])
  const [showPrompts, setShowPrompts] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [streamContent, setStreamContent] = useState('')
  const [isStreamComplete, setIsStreamComplete] = useState(true)
  const [showTypewriter, setShowTypewriter] = useState(false)

  // 处理事件选项点击
  const handleEventClick = (event: string, field: 'eventA' | 'eventB') => {
    form.setFieldsValue({ [field]: event })

    // 显示相关的提示模板
    const templates = promptTemplates[field]?.[event]
    if (templates) {
      setCurrentPrompts(templates)
      setShowPrompts(true)
    }
  }

  // 处理提示模板点击
  const handlePromptClick = (prompt: string, field: 'eventA' | 'eventB') => {
    form.setFieldsValue({ [field]: prompt })
    setShowPrompts(false)
  }

  const renderPromptSuggestions = (field: 'eventA' | 'eventB') => {
    if (!showPrompts || currentPrompts.length === 0) return null

    return (
      <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-2 text-sm text-gray-500">示例描述：</div>
        {currentPrompts.map((prompt, index) => (
          <div
            key={index}
            className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-gray-700 text-sm"
            onClick={() => handlePromptClick(prompt, field)}
          >
            {prompt}
          </div>
        ))}
      </div>
    )
  }

  const renderEventOptions = (options: typeof eventAOptions, field: 'eventA' | 'eventB', expanded: boolean) => {
    if (!expanded) {
      // 只显示第一个类别的前3个选项
      const previewCategory = options[0]
      return (
        <div className="relative">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {previewCategory.items.slice(0, 3).map((item) => (
              <Tag
                key={item}
                className="cursor-pointer px-3 py-1 rounded-full whitespace-nowrap"
                color="purple"
                onClick={() => handleEventClick(item, field)}
              >
                {item}
              </Tag>
            ))}
            <Button
              type="link"
              className="text-purple-600 hover:text-purple-700 flex items-center whitespace-nowrap"
              onClick={() => field === 'eventA' ? setExpandedA(true) : setExpandedB(true)}
            >
              更多选项 <RightOutlined className="ml-1" />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {options.map((category) => (
          <div key={category.category}>
            <div className="text-sm text-gray-500 mb-2">{category.category}：</div>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <Tag
                  key={item}
                  className="cursor-pointer px-3 py-1 rounded-full"
                  color="purple"
                  onClick={() => handleEventClick(item, field)}
                >
                  {item}
                </Tag>
              ))}
            </div>
          </div>
        ))}
        <Button
          type="link"
          className="text-purple-600 hover:text-purple-700"
          onClick={() => field === 'eventA' ? setExpandedA(false) : setExpandedB(false)}
        >
          收起
        </Button>
      </div>
    )
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

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      setStreamContent('')
      setIsStreamComplete(false)
      setShowTypewriter(true)  // 立即显示 modal

      const formattedValues: CorrelationAnalysisParams = {
        event_list: [
          { description: values.eventA },
          { description: values.eventB }
        ],
        analyze_options: {
          time_range: values.timeRange?.toUpperCase() || 'MONTH3',
          use_constellation: values.useConstellation === 'yes',
          use_zodia: values.useZodiac === 'yes',
          analyze_depth: values.analysisDepth?.toUpperCase() || 'NORMAL'
        }
      }
      const response = await destinyAPI.analyzeCorrelation(formattedValues)
      if (response.body) {
        handleStreamData(response.body)
      } else {
        throw new Error('Response body is null')
      }

    } catch (error) {
      setLoading(false)
      setIsStreamComplete(true)
      console.error('Correlation analysis failed:', error)
      message.error('分析失败，请重试')
    }
  }

  // 添加流式数据处理函数
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
              // 添加数据验证和清理
              const jsonStr = line.slice(5).trim()
              // 跳过空字符串和非JSON格式的数据（如keep-alive）
              if (!jsonStr || jsonStr === 'keep-alive' || !jsonStr.startsWith('{')) {
                continue
              }
              const data = JSON.parse(jsonStr)
              if (data?.message) {
                accumulated += data.message
                setStreamContent(accumulated)
              }
            } catch (e) {
              console.warn('跳过无效JSON数据:', line)
              continue // 继续处理下一行，而不是中断整个流程
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">事件关联分析</h2>
        <div className="flex items-center space-x-4">
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
          <Button
            type="text"
            onClick={showHistoryModal}
            className="flex items-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full px-4 py-2"
          >
            <HistoryOutlined className="text-lg mr-1" />
            <span>历史记录</span>
          </Button>
          <Button
            type="default"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 hover:bg-purple-50 border-purple-200"
            icon={<PlusOutlined />}
          >
            高级选项
          </Button>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 事件A */}
          <div className="relative">
            <Form.Item
              label={<span className="text-gray-700 font-medium">事件 A</span>}
              name="eventA"
              required
            >
              <Input.TextArea
                placeholder="请简要描述您想要分析关联性的第一件事"
                className="!bg-gray-50 hover:!bg-white focus:!bg-white transition-colors"
                rows={3}
                onFocus={() => setShowPrompts(false)}
              />
            </Form.Item>
            {renderPromptSuggestions('eventA')}
            {renderEventOptions(eventAOptions, 'eventA', expandedA)}
          </div>

          {/* 事件B */}
          <div className="relative">
            <Form.Item
              label={<span className="text-gray-700 font-medium">事件 B</span>}
              name="eventB"
              required
            >
              <Input.TextArea
                placeholder="请简要描述您想要分析关联性的第二件事"
                className="!bg-gray-50 hover:!bg-white focus:!bg-white transition-colors"
                rows={3}
                onFocus={() => setShowPrompts(false)}
              />
            </Form.Item>
            {renderPromptSuggestions('eventB')}
            {renderEventOptions(eventBOptions, 'eventB', expandedB)}
          </div>
        </div>

        {/* 高级选项区域 */}
        <Collapse
          className="mt-8 bg-gray-50 border-gray-200"
          activeKey={showAdvanced ? ['1'] : []}
          onChange={() => setShowAdvanced(!showAdvanced)}
        >
          <Panel
            header={
              <span className="text-lg font-medium text-gray-700">
                高级分析选项
              </span>
            }
            key="1"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Form.Item
                label={
                  <span className="flex items-center">
                    <ClockCircleOutlined className="mr-2" />
                    分析时间范围
                  </span>
                }
                name="timeRange"
              >
                <Select defaultValue="month3">
                  <Option value="month1">近一个月</Option>
                  <Option value="month3">三个月</Option>
                  <Option value="month6">近半年</Option>
                  <Option value="year1">近一年</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span className="flex items-center">
                    <StarOutlined className="mr-2" />
                    参考星座运势
                  </span>
                }
                name="useConstellation"
              >
                <Select defaultValue="yes">
                  <Option value="yes">是</Option>
                  <Option value="no">否</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span className="flex items-center">
                    <CompassOutlined className="mr-2" />
                    参考生肖运势
                  </span>
                }
                name="useZodiac"
              >
                <Select defaultValue="yes">
                  <Option value="yes">是</Option>
                  <Option value="no">否</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="分析深度"
                name="analysisDepth"
                className="md:col-span-3"
              >
                <Select defaultValue="normal">
                  <Option value="simple">简单分析（速度快，结果概括）</Option>
                  <Option value="normal">标准分析（平衡速度与深度）</Option>
                  <Option value="deep">深度分析（更详细的结果，需要更多时间）</Option>
                </Select>
              </Form.Item>
            </div>
          </Panel>
        </Collapse>

        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            className="h-12 px-12 text-lg rounded-full"
            style={{
              background: 'linear-gradient(to right, #9333ea, #7c3aed)',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(147, 51, 234, 0.2)',
            }}
          >
            开始分析关联性
          </Button>
          <div className="mt-2 text-sm text-gray-500">
            系统将分析两个事件之间可能存在的关联关系，并提供详细的解释和建议
          </div>
        </div>
      </Form>

      {/* 历史记录弹窗 */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <HistoryOutlined className="text-purple-600" />
            <span>关联分���历史记录</span>
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
              items={mockCorrelationHistory.map((record) => ({
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
                    <div className="text-sm text-purple-600 mt-1">
                      {record.eventA} → {record.eventB}
                    </div>
                    <div className="text-gray-500 mt-1 text-sm">
                      关联度：{record.result.correlation}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>

          {/* 右侧详情 */}
          <div className="w-1/2 pl-4 overflow-auto">
            {selectedRecord ? (
              <div className="space-y-4">
                <div className="text-lg font-medium text-purple-600">分析详情</div>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-medium mb-2">事件关联</div>
                    <div className="text-gray-600">
                      {selectedRecord.eventA} 与 {selectedRecord.eventB}
                    </div>
                    <div className="text-purple-600 font-medium mt-2">
                      关联度：{selectedRecord.result.correlation}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-medium mb-2">分析结果</div>
                    <div className="text-gray-600">{selectedRecord.result.analysis}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-medium mb-2">建议</div>
                    <div className="text-gray-600">{selectedRecord.result.suggestion}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-medium mb-2">风险提示</div>
                    <div className="text-gray-600">{selectedRecord.result.risk}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                请选择左侧记录查看详情
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* 添加 TypewriterModal */}
      <TypewriterModal
        open={showTypewriter}
        onClose={() => setShowTypewriter(false)}
        content={streamContent}
        isAnalyzing={!isStreamComplete}
      />
    </div>
  )
} 