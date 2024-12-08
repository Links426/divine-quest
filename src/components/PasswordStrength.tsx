import { Progress } from 'antd'

interface Props {
  password: string
}

export function PasswordStrength({ password }: Props) {
  const getStrengthPercent = (pwd: string): number => {
    if (!pwd) return 0
    let strength = 0
    
    // 长度检查
    if (pwd.length >= 6) strength += 20
    if (pwd.length >= 8) strength += 10
    
    // 包含数字
    if (/\d/.test(pwd)) strength += 20
    
    // 包含小写字母
    if (/[a-z]/.test(pwd)) strength += 20
    
    // 包含大写字母
    if (/[A-Z]/.test(pwd)) strength += 15
    
    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength += 15

    return Math.min(strength, 100)
  }

  const getStrengthText = (percent: number): string => {
    if (percent === 0) return '请输入密码'
    if (percent < 40) return '密码强度：弱'
    if (percent < 70) return '密码强度：中'
    return '密码强度：强'
  }

  const getStrokeColor = (percent: number): string => {
    if (percent < 40) return '#ff4d4f'
    if (percent < 70) return '#faad14'
    return '#52c41a'
  }

  const strength = getStrengthPercent(password)

  return (
    <div className="mt-2">
      <Progress
        percent={strength}
        size="small"
        showInfo={false}
        strokeColor={getStrokeColor(strength)}
      />
      <div className="text-xs mt-1" style={{ color: getStrokeColor(strength) }}>
        {getStrengthText(strength)}
      </div>
    </div>
  )
} 