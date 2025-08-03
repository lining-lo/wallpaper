const config = require('../config/default');
const jwt = require('jsonwebtoken'); 

// 验证 Token 的中间件
const verifyToken = (req, res, next) => {
  // 1. 从请求头中获取 Token（前端需在请求头中携带 token，键名为 token）
  const token = req.headers.token;

  // 2. 判断 Token 是否存在
  if (!token) {
    return res.json({
      code: 401, // 401 是 HTTP 未授权状态码
      msg: '未登录，请先登录'
    });
  }

  // 3. 验证 Token 有效性
  try {
    // 注意：这里的密钥必须和生成 Token 时的密钥一致！
    const secret = config.wx.APPSECRET; 
    
    // 验证 Token 并解析出 payload（生成 Token 时存储的用户信息）
    const decoded = jwt.verify(token, secret);

    // 4. 将解析出的用户信息挂载到 req 对象上，方便后续接口使用
    req.user = decoded; // decoded 中包含生成 Token 时存储的 openid 等信息

    // 5. 验证通过，调用 next() 继续执行后续接口逻辑
    next();
  } catch (err) {
    // Token 无效或过期时的处理
    return res.json({
      code: 401,
      msg: '登录已过期，请重新登录'
    });
  }
};

// 导出中间件
module.exports = verifyToken;