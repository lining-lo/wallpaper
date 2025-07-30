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

/**
 * 用户相关
 */
// 分页查询用户数据
export const selecUserPage = (data) => {
	return http('/selecUserPage', data)
}