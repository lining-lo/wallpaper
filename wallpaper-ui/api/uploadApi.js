// 七牛云文件访问域名（用于拼接最终URL）
const qiniuDomain = 'https://lining-lo.top';
// 七牛云上传域名（根据存储区域选择）
const uploadDomain = 'https://upload.qiniup.com';

// 封装文件上传函数
export const upload = (dir,tempFilePath, uploadToken) => {
	return new Promise((resolve, reject) => {
		// 显示上传加载提示
		uni.showLoading({
			title: '上传中...'
		});

		// 前端生成文件名（无变量，确保安全）
		const timestamp = Date.now();
		const randomStr = Math.random().toString(36).slice(2, 12);
		const fileExt = tempFilePath.split('.').pop().toLowerCase(); // 提取扩展名
		const key = `${dir}/${timestamp}-${randomStr}.${fileExt}`;
		
		// 允许的图片扩展名列表
		const allowedExts = ['jpg', 'jpeg', 'png', 'webp','mp4'];
		// 检查扩展名是否在允许列表中
		if (!allowedExts.includes(fileExt)) {
		  uni.hideLoading(); // 隐藏之前的加载提示
		  return uni.showToast({
		    title: '只能支持上传图片（jpg、jpeg、png、webp）',
		    icon: 'none'
		  });
		}

		uni.uploadFile({
			url: uploadDomain, // 修正为七牛云上传域名
			filePath: tempFilePath,
			name: 'file', // 固定为'file'，七牛云要求
			formData: {
				token: uploadToken, // 七牛上传凭证
				// 自定义文件名（若后端未指定saveKey则需配置）
				key: key,
			},
			success: (res) => {
				uni.hideLoading();
				if (res.statusCode === 200) {
					// 解析七牛云返回的JSON字符串
					const result = JSON.parse(res.data);

					// 七牛云成功响应格式：{ key, hash, url? }（无code字段）
					if (result.key) {
						// 拼接完整访问URL（若后端returnBody未返回url）
						const fileUrl = `${qiniuDomain}/${result.key}`;
						resolve({
							...result,
							url: fileUrl
						});
					} else {
						// 七牛云返回错误（如token无效、文件格式不符）
						const errorMsg = result.error || '上传失败';
						uni.showToast({
							title: errorMsg,
							icon: 'none'
						});
						reject(new Error(errorMsg));
					}
				} else {
					// HTTP状态码错误（如400、500）
					uni.showToast({
						title: `上传失败：${res.statusCode}`,
						icon: 'none'
					});
					reject(new Error(`HTTP错误：${res.statusCode}`));
				}
			},
			fail: (err) => {
				uni.hideLoading();
				uni.showToast({
					title: '上传失败，请检查网络',
					icon: 'none'
				});
				reject(err);
			}
		});
	});
};