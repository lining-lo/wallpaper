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
    if (data.type === 0 || data.type === 1) {
        await db.selecWallpaperPageByUserId([data.current_userId, 0, 1, data.user_id, data.status, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
            // 返回结果
            response.send({
                code: 200,
                message: result
            })
        })
    } else {
        await db.selecWallpaperPageByUserId([data.current_userId, data.type, data.type, data.user_id, data.status, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
            // 返回结果
            response.send({
                code: 200,
                message: result
            })
        })
    }
}
// 查找用户下载|收藏的壁纸
exports.selectUserWallpapers = async (request, response) => {
    const data = request.body
    await db.selectUserWallpapers([data.user_id, data.type, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}
// 更新壁纸的查看次数
exports.updateWallpaperViewCount = async (request, response) => {
    const data = request.body
    await db.updateWallpaperViewCount([data.wallpaper_id]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}
// 根据排序类型（下载|点赞|收藏）分页查找壁纸
exports.selectWallpaperBySort = async (request, response) => {
    const data = request.body
    await db.selectWallpaperBySort([data.user_id, data.type, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}
// 随机分页查找所有类型壁纸
exports.selectAllWallpaperByRand = async (request, response) => {
    const data = request.body
    await db.selectAllWallpaperByRand([data.user_id, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}
// 根据关键词分页查找壁纸
exports.selectWallpaperBySearch = async (request, response) => {
    const data = request.body
    const result1 = await db.selectSearchCount([data.keyword])
    const result2 = await db.selectWallpaperBySearch([data.user_id, data.keyword, data.type, data.type, data.type, data.type, (data.page - 1) * data.pagesize, data.pagesize])
    // 返回结果
    response.send({
        code: 200,
        message: {
            countInfo: result1,
            data: result2
        }
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


/**
 * 反馈相关（点赞|收藏|下载）
 */
// 统一处理反馈的新增/状态更新，避免回调嵌套
exports.handleFeedback = async (request, response) => {
    try {
        const { user_id, wallpaper_id, category_id, type, status = 1 } = request.body;

        // 1. 参数校验
        if (!user_id || !wallpaper_id || type === undefined) {
            return response.send({
                code: 400,
                message: "参数不完整，请提供 user_id、wallpaper_id、type"
            });
        }

        // 2. 查询是否存在记录
        const existingRecords = await db.selectFeedBackByUserId([user_id, wallpaper_id, type]);
        const hasRecord = existingRecords[0].action_count >= 1;
        console.log(['点赞', '收藏', '下载'][type], hasRecord);

        // 3. 分类型处理
        switch (type) {
            // 点赞（type=0）：仅允许一次，不支持取消
            case 0:
                if (hasRecord) {
                    // 已点赞 → 直接返回提示，不执行操作
                    console.log('已点赞 → 直接返回提示，不执行操作');
                    response.send({ code: 200, message: "您已点过赞，无法重复点赞" });
                } else {
                    // 未点赞 → 新增点赞记录
                    console.log('未点赞 → 新增点赞记录');
                    await db.addFeedBack([user_id, wallpaper_id, category_id, type, status]);
                    response.send({ code: 200, message: "点赞成功" });
                }
                break;

            // 收藏（type=1）：支持收藏/取消收藏切换
            case 1:
                if (hasRecord) {
                    // 已收藏 → 取消收藏 | 取消收藏 → 重新收藏
                    console.log('已收藏 → 取消收藏 | 取消收藏 → 重新收藏');
                    await db.updateFeedBackStatus([user_id, wallpaper_id, type]); // SQL需实现 status=1-status
                    response.send({ code: 200, message: "'已收藏 → 取消收藏 | 取消收藏 → 重新收藏" });
                } else {
                    // 未收藏 → 新增收藏记录
                    console.log('未收藏 → 新增收藏记录');
                    await db.addFeedBack([user_id, wallpaper_id, category_id, type, status]);
                    response.send({ code: 200, message: "收藏成功" });
                }
                break;

            // 下载（type=2）：允许重复记录，直接新增
            case 2:
                await db.addFeedBack([user_id, wallpaper_id, category_id, type, status]);
                console.log('允许重复下载，直接新增');
                response.send({ code: 200, message: "下载记录已添加" });
                break;

            // 无效类型
            default:
                response.send({ code: 400, message: "无效的类型（type 应为 0/1/2）" });
        }

    } catch (error) {
        // 4. 统一错误处理
        console.error("反馈操作失败：", error);
        response.send({
            code: 500,
            message: "操作失败，请重试",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};


/**
 * 问题反馈相关（需求壁纸、问题反馈）
 */
// 新增问题反馈
exports.addProblem = async (request, response) => {
    const data = request.body
    await db.addProblem([data.user_id, data.type, data.content]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}
