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
}