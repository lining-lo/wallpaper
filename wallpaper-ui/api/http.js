const baseUrl = 'http://localhost:3001';

// 默认请求超时时间（毫秒）
const DEFAULT_TIMEOUT = 200000;

// 存储正在进行的请求，用于防抖
const pendingRequests = new Map();

function http(url, data = {}, method = 'POST', showLoading = true, customHeader = {}) {
  return new Promise((resolve, reject) => {
    // 统一转换方法为大写
    const upperMethod = method.toUpperCase();
    
    // 生成唯一请求标识（URL + 方法 + 参数的字符串表示）
    const requestKey = `${upperMethod}-${baseUrl + url}-${JSON.stringify(data)}`;
    
    // 检查是否有相同请求正在进行
    if (pendingRequests.has(requestKey)) {
      // 如果有，直接复用之前的Promise
      return pendingRequests.get(requestKey).then(resolve).catch(reject);
    }
    
    // 显示加载提示
    if (showLoading) {
      uni.showLoading({ title: '加载中...', mask: true });
    }
    
    // 创建当前请求的Promise并缓存
    const requestPromise = new Promise((innerResolve, innerReject) => {
      uni.request({
        url: baseUrl + url,
        data,
        method: upperMethod,
        header: { 
          'token': uni.getStorageSync('token'),
          ...(upperMethod === 'GET' ? { 'Cache-Control': 'no-cache' } : {}),
          ...customHeader
        },
        timeout: DEFAULT_TIMEOUT,
        success: (result) => {
          const { statusCode, data } = result;
          
          if (statusCode < 200 || statusCode >= 300) {
            const errorMsg = `HTTP错误: ${statusCode}`;
            uni.showToast({ title: errorMsg, icon: 'none' });
            return innerReject({ type: 'http', statusCode, message: errorMsg });
          }
          
          if (data.code !== 200) {
            if (data.code === 401) {
              uni.removeStorageSync('token');
              uni.removeStorageSync('userInfo');
              uni.navigateTo({ url: '/pages/login/login' });
            }
            const errorMsg = data.message || `业务错误: ${data.code}`;
            uni.showToast({ title: errorMsg, icon: 'none' });
            return innerReject({ type: 'business', code: data.code, message: errorMsg });
          }
          
          innerResolve(data.message);
        },
        fail: (err) => {
          const errorMsg = err.errMsg || '服务器请求异常';
          uni.showToast({ title: errorMsg, icon: 'none' });
          innerReject({ type: 'network', message: errorMsg, detail: err });
        },
        complete: () => {
          // 隐藏提示
          if (showLoading) {
            setTimeout(function () {
              uni.hideLoading();
            }, 500);
          }
		  // 请求完成后隐藏加载提示并移除缓存
          pendingRequests.delete(requestKey);
        }
      });
    });
    
    // 缓存当前请求的Promise
    pendingRequests.set(requestKey, requestPromise);
    
    // 将结果传递给外部Promise
    requestPromise.then(resolve).catch(reject);
  });
}

export default http;
    