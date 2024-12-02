import { Form, Input, Radio, Button, message } from 'antd'

export default function SmartNaming() {
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    try {
      message.success('起名完成！')
    } catch (error) {
      message.error('起名失败，请重试')
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-8">智能起名</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-2xl mx-auto"
      >
        <Form.Item
          label="姓氏"
          name="lastName"
          rules={[{ required: true, message: '请输入姓氏' }]}
        >
          <Input placeholder="请输入姓氏" className="!bg-gray-50" />
        </Form.Item>

        <Form.Item
          label="性别"
          name="gender"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group>
            <Radio value="male">男</Radio>
            <Radio value="female">女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item className="text-center">
          <Button
            type="primary"
            htmlType="submit"
            className="h-12 px-8 rounded-full"
            style={{
              background: 'linear-gradient(to right, #9333ea, #7c3aed)',
              border: 'none',
            }}
          >
            开始起名
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
} 