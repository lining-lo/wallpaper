const db = require('../lib/db')

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
