const controller = require('../controller/dbServe')
module.exports = function (app) {
    /**
     * 分类相关
     */
    // 分页查询分类数据
    app.post('/selecCategoryPage', (request, response) => {
        controller.selecCategoryPage(request, response)
    })


    /**
     * 壁纸相关
     */
    // 根据分类id分页查询壁纸数据
    app.post('/selecWallpaperPageByCategoryId', (request, response) => {
        controller.selecWallpaperPageByCategoryId(request, response)
    })
    // 根据用户名和壁纸类型分页获取数据
    app.post('/selecWallpaperPageByUserId', (request, response) => {
        controller.selecWallpaperPageByUserId(request, response)
    })

    /**
     * 用户相关
     */
    // 分页查询用户数据
    app.post('/selecUserPage', (request, response) => {
        controller.selecUserPage(request, response)
    })
}