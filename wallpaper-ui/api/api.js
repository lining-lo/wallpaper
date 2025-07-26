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