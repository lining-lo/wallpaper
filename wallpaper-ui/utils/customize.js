// 根据后端数据显示性别
export const getGender = (type) => {
	let result = ''
	if (type === 0) {
		result = '未知'
	} else if (type === 1) {
		result = '男'
	} else {
		result = '女'
	}
	return result
}