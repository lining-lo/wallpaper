/**
 * HTTP请求工具函数封装
 * 功能：统一处理网络请求、加载提示、重复请求拦截、错误处理等
 */

// 接口基础路径（服务器地址）
const baseUrl = 'http://localhost:3001';
// 默认请求超时时间（毫秒）
const DEFAULT_TIMEOUT = 8000;
// 存储正在进行的请求（用于拦截重复请求）
// key: 请求唯一标识, value: 对应的Promise
const pendingRequests = new Map();
// loading计数器（处理多请求同时发起时的显示逻辑）
let loadingCount = 0;
// loading最小显示时间（毫秒），防止请求太快导致闪烁
const MIN_LOADING_DURATION = 300;
// 记录loading开始显示的时间戳
let loadingStartTime = 0;

/**
 * 核心HTTP请求函数
 * @param {string} url - 接口路径（相对于baseUrl）
 * @param {object} data - 请求参数（默认空对象）
 * @param {string} method - 请求方法（默认POST）
 * @param {boolean} showLoading - 是否显示加载提示（默认true）
 * @param {object} customHeader - 自定义请求头（默认空对象）
 * @returns {Promise} - 返回请求结果的Promise
 */
function http(url, data = {}, method = 'POST', showLoading = true, customHeader = {}) {
  // --------------------------
  // 1. 初始化loading隐藏信号（解决弹窗冲突）
  // --------------------------
  // 用于通知外部"loading已完全隐藏"的Promise
  let loadingHiddenPromise;
  // 用于触发loading隐藏信号的resolve函数
  let resolveLoadingHidden;

  if (showLoading) {
    // 需要显示loading时，创建一个未完成的Promise
    loadingHiddenPromise = new Promise(resolve => {
      resolveLoadingHidden = resolve;
    });
  } else {
    // 不需要显示loading时，直接返回已完成的Promise
    loadingHiddenPromise = Promise.resolve();
  }

  // --------------------------
  // 2. 创建外层Promise，统一处理请求流程
  // --------------------------
  return new Promise((resolve, reject) => {
    // 统一将请求方法转为大写（避免大小写不一致问题）
    const upperMethod = method.toUpperCase();
    
    // 生成请求唯一标识（用于拦截重复请求）
    // 规则：请求方法 + 完整URL + 参数字符串（确保唯一性）
    const requestKey = `${upperMethod}-${baseUrl + url}-${JSON.stringify(data)}`;
    
    // 拦截重复请求：如果相同请求正在进行，直接复用其Promise
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey).then(resolve).catch(reject);
    }
    
    // --------------------------
    // 3. 显示loading（根据配置）
    // --------------------------
    if (showLoading) {
      // 每发起一个需要loading的请求，计数器+1
      loadingCount++;
      // 只有当计数器从0变为1时，才真正调用showLoading（避免重复显示）
      if (loadingCount === 1) {
        // 记录loading开始显示的时间
        loadingStartTime = Date.now();
        // 显示加载提示（带遮罩防止用户操作）
        uni.showLoading({ title: '加载中...', mask: true });
      }
    }
    
    // --------------------------
    // 4. 创建请求Promise并发起实际请求
    // --------------------------
    const requestPromise = new Promise((innerResolve, innerReject) => {
      // 调用uni的原生请求API
      uni.request({
        url: baseUrl + url, // 拼接完整请求地址
        data, // 请求参数
        method: upperMethod, // 请求方法
        header: { 
          // 默认携带token（从本地存储获取）
          'token': uni.getStorageSync('token'),
          // GET请求添加禁用缓存的头（避免浏览器缓存旧数据）
          ...(upperMethod === 'GET' ? { 'Cache-Control': 'no-cache' } : {}),
          // 合并自定义请求头（优先级高于默认）
          ...customHeader
        },
        timeout: DEFAULT_TIMEOUT, // 超时时间
        // --------------------------
        // 5. 请求成功回调
        // --------------------------
        success: (result) => {
          const { statusCode, data } = result;
          
          // 处理HTTP状态码错误（非2xx状态）
          if (statusCode < 200 || statusCode >= 300) {
            const errorMsg = `HTTP错误: ${statusCode}`;
            // 显示错误提示
            uni.showToast({ title: errorMsg, icon: 'none' });
            // 向外层抛出错误（类型：http错误）
            return innerReject({ type: 'http', statusCode, message: errorMsg });
          }
          
          // 处理业务逻辑错误（后端返回的code不是200）
          if (data.code !== 200) {
            // 特殊处理：401通常代表登录失效
            if (data.code === 401) {
              // 清除本地登录信息
              uni.removeStorageSync('token');
              uni.removeStorageSync('userInfo');
              // 跳转到登录页
              uni.navigateTo({ url: '/pages/login/login' });
            }
            // 生成错误信息（优先用后端返回的message）
            const errorMsg = data.message || `业务错误: ${data.code}`;
            // 显示错误提示
            uni.showToast({ title: errorMsg, icon: 'none' });
            // 向外层抛出错误（类型：业务错误）
            return innerReject({ type: 'business', code: data.code, message: errorMsg });
          }
          
          // 请求完全成功：将后端返回的message传递出去
          innerResolve(data.message);
        },
        // --------------------------
        // 6. 请求失败回调（网络错误等）
        // --------------------------
        fail: (err) => {
          // 生成错误信息（默认"服务器请求异常"）
          const errorMsg = err.errMsg || '服务器请求异常';
          // 显示错误提示
          uni.showToast({ title: errorMsg, icon: 'none' });
          // 向外层抛出错误（类型：网络错误）
          innerReject({ type: 'network', message: errorMsg, detail: err });
        },
        // --------------------------
        // 7. 请求完成回调（无论成功失败都会执行）
        // --------------------------
        complete: () => {
          // 处理loading隐藏逻辑
          if (showLoading) {
            // 每完成一个请求，计数器-1
            loadingCount--;
            // 计算当前loading已显示的时间
            const loadingDuration = Date.now() - loadingStartTime;
            // 计算需要延迟的时间（确保loading至少显示MIN_LOADING_DURATION）
            const delay = loadingDuration < MIN_LOADING_DURATION 
              ? MIN_LOADING_DURATION - loadingDuration 
              : 0;
            
            // 延迟隐藏loading（确保满足最小显示时间）
            setTimeout(() => {
              // 只有当所有请求都完成（计数器<=0），才真正隐藏loading
              if (loadingCount <= 0) {
                loadingCount = 0; // 重置计数器（防止出现负数）
                uni.hideLoading(); // 隐藏loading
                resolveLoadingHidden(); // 触发loading隐藏信号
              }
            }, delay);
          } else {
            // 不显示loading时，直接触发隐藏信号
            resolveLoadingHidden();
          }
          
          // 请求完成后，从pending中移除该请求
          pendingRequests.delete(requestKey);
        }
      });
    });
    
    // 将当前请求的Promise存入pending，用于拦截重复请求
    pendingRequests.set(requestKey, requestPromise);
    
    // 将请求结果传递给外层Promise
    requestPromise.then(resolve).catch(reject);
  })
  // --------------------------
  // 8. 确保loading隐藏后再返回结果（解决弹窗冲突）
  // --------------------------
  .then(result => {
    // 接口成功：等待loading完全隐藏后，再返回结果
    return loadingHiddenPromise.then(() => result);
  })
  .catch(err => {
    // 接口失败：等待loading完全隐藏后，再抛出错误
    return loadingHiddenPromise.then(() => Promise.reject(err));
  });
}

// 导出http函数供外部使用
export default http;
    