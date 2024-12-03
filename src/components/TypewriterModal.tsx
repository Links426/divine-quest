import { Modal, Button, message } from 'antd'
import ReactMarkdown from 'react-markdown'
import html2canvas from 'html2canvas'
import { useRef } from 'react'
import { DownloadOutlined } from '@ant-design/icons'

interface TypewriterModalProps {
    open: boolean
    onClose: () => void
    content: string
    isAnalyzing?: boolean
}

const TypewriterModal: React.FC<TypewriterModalProps> = ({ 
    open, 
    onClose, 
    content,
    isAnalyzing = false 
}) => {
    const contentRef = useRef<HTMLDivElement>(null)

    const handleSaveImage = async () => {
        if (!contentRef.current || !content) return

        try {
            message.loading('正在生成图片...', 0)
            
            const canvas = await html2canvas(contentRef.current, {
                backgroundColor: '#F9FAFB',
                scale: 2,
                useCORS: true,
                logging: false,
            })

            const link = document.createElement('a')
            link.download = `命理分析结果_${new Date().toLocaleDateString()}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
            
            message.destroy()
            message.success('图片已保存')
        } catch (error) {
            message.destroy()
            message.error('保存失败，请重试')
            console.error('Save image failed:', error)
        }
    }

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <span className="text-lg font-medium text-purple-800">分析结果</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={
                content && !isAnalyzing ? (
                    <div className="flex justify-center pb-4">
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleSaveImage}
                            className="flex items-center bg-purple-600 hover:bg-purple-700 border-none shadow-md hover:shadow-lg transition-all duration-300 px-6"
                            size="large"
                        >
                            保存为图片
                        </Button>
                    </div>
                ) : null
            }
            width={800}
            className="typewriter-modal"
            modalRender={(modal) => (
                <div className="rounded-lg overflow-hidden shadow-2xl">
                    {modal}
                </div>
            )}
        >
            <div 
                ref={contentRef}
                className="min-h-[400px] p-8 bg-gradient-to-b from-purple-50 to-white rounded-lg"
            >
                {content ? (
                    <div className="prose prose-purple max-w-none">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold text-purple-800 bg-purple-50 py-2 px-4 rounded-full inline-block shadow-sm">
                                命理分析报告
                            </h1>
                            <div className="text-sm text-gray-500 mt-2">
                                生成时间：{new Date().toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                        <div className="mt-6 text-center text-sm text-gray-400 flex items-center justify-center space-x-2">
                            <span className="w-12 h-[1px] bg-gray-200"></span>
                            <span>AI 命理大师生成</span>
                            <span className="w-12 h-[1px] bg-gray-200"></span>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <svg
                            className="w-16 h-16 text-purple-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                        </svg>
                        <p className="text-lg">暂无分析结果</p>
                        <p className="text-sm">请先进行命理分析以获取结果</p>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default TypewriterModal 