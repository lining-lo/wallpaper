const jwt = require('jsonwebtoken');
const db = require('../lib/db')
const axios = require('axios');
const config = require('../config/default');
const { nanoid } = require('nanoid');

// 缓存变量（微信 access_token 有效期为 2 小时，频繁调用 getAccessToken 会导致不必要的请求，甚至触发接口频率限制。）
let accessTokenCache = {
    token: '',
    expireTime: 0 // 过期时间戳（毫秒）
};
// 获取微信安全验证的 access_token
async function getAccessToken(appid, appsecret) {
    // 检查缓存是否有效（提前 10 分钟过期，避免临界点失效）
    if (accessTokenCache.token && Date.now() < accessTokenCache.expireTime - 600000) {
        return accessTokenCache.token;
    }
    // 缓存失效，重新获取
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
    const response = await axios.get(url);

    if (response.data.errcode) {
        throw new Error(`获取 access_token 失败：${response.data.errmsg}`);
    }
    // 更新缓存（有效期 = 获取时间 + 7200 秒 - 10 分钟缓冲）
    accessTokenCache.token = response.data.access_token;
    accessTokenCache.expireTime = Date.now() + (response.data.expires_in - 600) * 1000;
    return response.data.access_token;
}

// 文本内容安全检测函数
async function checkTextSecurity(access_token, content, scene = 1, version = 2) {
    const url = `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${access_token}`;
    const data = {
        openid: 'oXemk6zTftsenDPjWEcYmsgSgpS0', // 用户的 openid
        scene, // 场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
        content, // 需检测的文本内容
        version
    };
    const response = await axios.post(url, data);
    return response.data;
}

// 图片|视频内容安全检测函数
// async function checkMediaSecurity(access_token, fileUrl) {
//     const url = `https://api.weixin.qq.com/wxa/media_check_async?access_token=${access_token}`;
//     const data = {
//         openid: 'oXemk6zTftsenDPjWEcYmsgSgpS0', // 用户的 openid
//         media_url: fileUrl,
//         media_type: 2, // 1=音频,2=图片
//         version: 2,
//         scene: 1 // 场景值（1=默认）
//     };
//     const response = await axios.post(url, data);
//     return response.data;
// }



/**
 * 分类相关
 */
// 分页查询分类数据
exports.selecCategoryPage = async (request, response) => {
    const data = request.body
    await db.selecCategoryPage([data.type, data.status, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}


/**
 * 壁纸相关
 */
// 根据分类id分页查询壁纸数据
exports.selecWallpaperPageByCategoryId = async (request, response) => {
    const data = request.body
    await db.selecWallpaperPageByCategoryId([data.current_userId, data.type, data.category_id, data.status, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}
// 根据用户名和壁纸类型分页获取数据
exports.selecWallpaperPageByUserId = async (request, response) => {
    const data = request.body
    await db.selecWallpaperPageByUserId([data.current_userId, data.type, data.user_id, data.status, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}

/**
 * 用户相关
 */
// 分页查询用户数据
exports.selecUserPage = async (request, response) => {
    const data = request.body
    await db.selecUserPage([(data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}
// 微信一键登录
exports.login = async (request, response) => {
    const { code } = request.body;
    if (!code || (typeof code === 'object' && code !== null && Object.keys(code).length === 0)) {
        return response.send({
            code: 400,
            message: '缺少 code'
        });
    }
    try {
        // 1. 调用微信 code2Session 接口换取 openid 和 session_key
        const wxRes = await axios.get(`https://api.weixin.qq.com/sns/jscode2session`, {
            params: {
                appid: config.wx.APPID,
                secret: config.wx.APPSECRET,
                js_code: code,
                grant_type: 'authorization_code'
            }
        });
        const { openid, session_key, errcode } = wxRes.data;
        // 2. 检查微信接口返回是否异常
        if (errcode) {
            return response.send({
                code: 400,
                message: `微信登录失败：${wxRes.data.errmsg}`
            });
        }
        // 3.查询数据库，判断用户是否为新用户
        const user = await db.selectUserByOpenId([openid])
        let userInfo = null
        if (user.length < 1) {
            // 新用户：插入数据库
            const newUser = {
                id: nanoid(10),
                openid,
                name: null,
                avatar_url: null,
                gender: null,
                motto: null
            }
            await db.addUser([newUser.id, newUser.openid]);
            userInfo = JSON.parse(JSON.stringify(newUser))
        } else {
            userInfo = user[0]
        }
        // 4. 生成自定义登录态 Token（有效期 7 天）
        const token = jwt.sign(
            { openid, session_key }, // 存储 openid（用户唯一标识）
            config.wx.APPSECRET, // 密钥，生产环境需保密
            { expiresIn: '7d' }
        );
        // 5. 返回 Token 给小程序
        response.send({
            code: 200,
            message: {
                token,
                userInfo: {
                    id: userInfo.id,
                    name: userInfo.name,
                    avatar_url: userInfo.avatar_url,
                    gender: userInfo.gender,
                    motto: userInfo.motto
                    // 不返回 session_key 等敏感信息
                }
            }
        })

    } catch (err) {
        console.error('登录失败：', err);
        response.send({ code: 500, msg: '服务器错误' });
    }

}
// 修改用户信息函数
exports.updateUser = async (request, response) => {
    const data = request.body;
    const appid = config.wx.APPID;
    const appsecret = config.wx.APPSECRET;
    const access_token = await getAccessToken(appid, appsecret);

    // 检验头像
    // if (data.avatar_url && data.avatar_url.trim() !== '') {
    //     const mediaCheckResult = await checkMediaSecurity(access_token, data.avatar_url);
    //     console.log(mediaCheckResult);
        
    // }
    // 验证用户名
    if (data.name && data.name.trim() !== '') {
        const nameCheckResult = await checkTextSecurity(access_token, data.name);
        if (nameCheckResult.errcode !== 0 || nameCheckResult.result.suggest !== 'pass') {
            return response.send({
                code: 400,
                message: '名称包含违规内容'
            });
        }
    }
    // 验证介绍（格言）
    if (data.motto && data.motto.trim() !== '') {
        const mottoCheckResult = await checkTextSecurity(access_token, data.motto);
        if (mottoCheckResult.errcode !== 0 || mottoCheckResult.result.suggest !== 'pass') {
            return response.send({
                code: 400,
                message: '介绍包含违规内容'
            });
        }
    }
    // 校验成功更新数据
    try {
        const result = await db.updateUser([data.name, data.avatar_url, data.gender, data.motto, data.id]);
        response.send({
            code: 200,
            message: result
        });
    } catch (error) {
        response.send({
            code: 500,
            message: '更新用户信息失败',
            error: error.message
        });
    }
};
