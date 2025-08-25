// 根据后端数据显示性别
export const getGender = (type) => {
	let result = ''
	if (type === 0) {
		result = '女'
	} else if (type === 1) {
		result = '男'
	} else {
		result = '未知'
	}
	return result
}

// 获取日期和时间
export const getDateTime = () => {
	const now = new Date();
	// 获取月份，注意月份从 0 开始，所以要加 1
	const month = now.getMonth() + 1;
	const day = now.getDate();
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');

	const dateStr = `${month}月${day}日`;
	const timeStr = `${hours}:${minutes}`;

	return {
		date: dateStr,
		time: timeStr
	};
}

// 生成10位由数字和字母（大小写）组成的随机字符串
export const getRandomID = () => {
    // 定义包含数字和大小写字母的字符集
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const length = 10;
    
    for (let i = 0; i < length; i++) {
        // 随机从字符集中选取一个字符
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    
    return result;
}