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
// 更新壁纸的查看次数
export const updateWallpaperViewCount = (data) => {
	return http('/updateWallpaperViewCount', data)
}
// 根据排序类型（下载|点赞|收藏）分页查找壁纸
export const selectWallpaperBySort = (data) => {
	return http('/selectWallpaperBySort', data)
}
// 随机分页查找所有类型壁纸
export const selectAllWallpaperByRand = (data) => {
	return http('/selectAllWallpaperByRand', data)
}
// 根据关键词分页查找壁纸
export const selectWallpaperBySearch = (data) => {
	return http('/selectWallpaperBySearch', data)
}
// 根据壁纸类型分页获取所有壁纸
export const selectAllWallpaperByType = (data) => {
	return http('/selectAllWallpaperByType', data)
}
// 获取首页数据
export const getHomeData = (data) => {
	return http('/getHomeData', data)
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
// 根据用户id查找用户信息
export const selectUserByUserId = (data) => {
	return http('/selectUserByUserId', data)
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


/**
 * 问题反馈相关（需求壁纸、问题反馈）
 */
// 新增问题反馈
export const addProblem = (data) => {
	return http('/addProblem', data)
}