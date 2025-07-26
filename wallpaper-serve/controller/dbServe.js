const db = require('../lib/db')

/**
 * 分类相关
 */
// 分页查询分类数据
exports.selecCategoryPage = async (request, response) => {
    const data = request.body
    await db.selecCategoryPage([data.type, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
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
    await db.selecWallpaperPageByCategoryId([data.type,data.category_id,data.status, (data.page - 1) * data.pagesize, data.pagesize]).then(async result => {
        // 返回结果
        response.send({
            code: 200,
            message: result
        })
    })
}