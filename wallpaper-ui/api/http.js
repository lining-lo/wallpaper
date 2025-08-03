const baseUrl = 'http://localhost:3001';

// 默认请求超时时间（毫秒）
const DEFAULT_TIMEOUT = 5000;

function http(url, data = {}, method = 'POST') {
  return new Promise((resolve, reject) => {
    // 统一转换方法为大写，避免大小写问题
    const upperMethod = method.toUpperCase();
    
    uni.request({
      url: baseUrl + url,
      data,
      method: upperMethod,
      header: { 
        'token': uni.getStorageSync('token'),
        // 对 GET 请求默认添加时间戳，避免缓存
        ...(upperMethod === 'GET' ? { 'Cache-Control': 'no-cache' } : {})
      },
      timeout: DEFAULT_TIMEOUT, // 添加超时设置
      success: (result) => {
        const { statusCode, data } = result;
        
        // 处理 HTTP 状态码异常
        if (statusCode < 200 || statusCode >= 300) {
          const errorMsg = `HTTP错误: ${statusCode}`;
          uni.showToast({ title: errorMsg, icon: 'none' });
          return reject({ type: 'http', statusCode, message: errorMsg });
        }
        
        // 处理业务逻辑错误
        if (data.code !== 200) {
          // 特殊处理令牌过期（示例：code=401 代表令牌无效）
          if (data.code === 401) {
            uni.removeStorageSync('token'); // 清除无效令牌
            uni.navigateTo({ url: '/pages/login/login' }); // 跳转到登录页
          }
          const errorMsg = data.message || `业务错误: ${data.code}`;
          uni.showToast({ title: errorMsg, icon: 'none' });
          return reject({ type: 'business', code: data.code, message: errorMsg });
        }
        
        // 成功：返回完整的业务数据（根据后端规范调整）
		console.log()
        resolve(data.message);
      },
      fail: (err) => {
        // 网络错误（如超时、断网）
        const errorMsg = err.errMsg || '服务器请求异常';
        uni.showToast({ title: errorMsg, icon: 'none' });
        reject({ type: 'network', message: errorMsg, detail: err });
      }
    });
  });
}

export default http;
