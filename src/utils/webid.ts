import FingerprintJS from '@fingerprintjs/fingerprintjs'

export async function generateWebId(): Promise<string> {
    try {
        // 获取浏览器指纹
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        const fingerprint = result.visitorId

        // 获取 UserAgent
        const userAgent = window.navigator.userAgent

        // 获取 IP (这里需要调用后端接口获取真实 IP)
        // const ipResponse = await fetch('https://api.ipify.org?format=json')
        // const { ip } = await ipResponse.json()
        let ip = '123'
        // 组合三个因子
        const factors = [fingerprint, userAgent, ip]

        // 使用 SHA-256 生成最终的 webid
        const msgBuffer = new TextEncoder().encode(factors.join('|'))
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const webid = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        // 存储到 localStorage
        localStorage.setItem('webid', webid)
        console.log(localStorage.getItem('webid'), 111)
        return webid
    } catch (error) {
        console.error('Generate webid failed:', error)
        // 生成失败时返回一个随机 ID
        return `fallback_${Math.random().toString(36).substr(2, 9)}`
    }
}

// 获取 webid，如果不存在则生成新的
export async function getWebId(): Promise<string> {
    const storedWebId = localStorage.getItem('webid')
    if (storedWebId) {
        return storedWebId
    }
    return generateWebId()
} 