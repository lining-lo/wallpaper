const controller = require('../controller/dbServe')
const verifyToken = require('../middleware/verifyToken');
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
    // 查找用户下载|收藏的壁纸
    app.post('/selectUserWallpapers', (request, response) => {
        controller.selectUserWallpapers(request, response)
    })
    // 更新壁纸的查看次数
    app.post('/updateWallpaperViewCount', (request, response) => {
        controller.updateWallpaperViewCount(request, response)
    })
    // 根据排序类型（下载|点赞|收藏）分页查找壁纸
    app.post('/selectWallpaperBySort', (request, response) => {
        controller.selectWallpaperBySort(request, response)
    })
    // 随机分页查找所有类型壁纸
    app.post('/selectAllWallpaperByRand', (request, response) => {
        controller.selectAllWallpaperByRand(request, response)
    })
    // 根据关键词分页查找壁纸
    app.post('/selectWallpaperBySearch', (request, response) => {
        controller.selectWallpaperBySearch(request, response)
    })

    /**
     * 用户相关
     */
    // 分页查询用户数据
    app.post('/selecUserPage', (request, response) => {
        controller.selecUserPage(request, response)
    })
    // 微信一键登录
    app.post('/login', (request, response) => {
        controller.login(request, response)
    })
    // 修改用户信息
    app.post('/updateUser', (request, response) => {
        controller.updateUser(request, response)
    })


    /**
     * 反馈相关（点赞|收藏|下载）
     */
    // 统一处理反馈的新增/状态更新
    app.post('/handleFeedback', (request, response) => {
        controller.handleFeedback(request, response)
    })

}