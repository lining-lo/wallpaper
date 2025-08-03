const jwt = require('jsonwebtoken');
const db = require('../lib/db')
const axios = require('axios');
const config = require('../config/default');
const { nanoid } = require('nanoid');

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
                gender: 0,
                motto: null
            }
            await db.addUser([newUser.id, newUser.openid, newUser.name, newUser.avatar_url, newUser.gender, newUser.motto]);
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
