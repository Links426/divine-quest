import { Modal } from 'antd'
import ReactMarkdown from 'react-markdown'

interface TypewriterModalProps {
    open: boolean
    onClose: () => void
    content: string
}

const TypewriterModal: React.FC<TypewriterModalProps> = ({ open, onClose, content }) => {
    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium">分析结果</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            className="typewriter-modal"
        >
            <div className="min-h-[400px] p-6 bg-gray-50 rounded-lg">
                {content ? (
                    <div className="prose prose-purple max-w-none">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <svg
                            className="w-16 h-16 text-gray-300"
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