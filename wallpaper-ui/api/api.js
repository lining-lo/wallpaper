import http from "./http";

/**
 * 分类相关
 */
// 分页查询分类数据
export const selecCategoryPage = (data) => {
	return http('/selecCategoryPage', data)
}

/**
 * 壁纸相关
 */
// 根据分类id分页查询壁纸数据
export const selecWallpaperPageByCategoryId = (data) => {
	return http('/selecWallpaperPageByCategoryId', data)
}
// 根据用户名和壁纸类型分页获取数据
export const selecWallpaperPageByUserId = (data) => {
	return http('/selecWallpaperPageByUserId', data)
}
// 查找用户下载|收藏的壁纸
export const selectUserWallpapers = (data) => {
	return http('/selectUserWallpapers', data)
}

/**
 * 用户相关
 */
// 分页查询用户数据
export const selecUserPage = (data) => {
	return http('/selecUserPage', data)
}
// 微信一键登录
export const login = (data) => {
	return http('/login', data)
}
// 修改用户信息
export const updateUser = (data) => {
	return http('/updateUser', data)
}

/**
 * 文件上传相关
 */
// 获取七牛上传凭证
export const getQiniuToken = () => {
	return http('/getQiniuToken')
}

/**
 * 反馈相关（点赞|收藏|下载）
 */
// 统一处理反馈的新增/状态更新
export const handleFeedback = (data) => {
	return http('/handleFeedback', data)
}