const baseUrl = 'http://localhost:3001';

function http(url, data = {}, method = 'POST') {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			data,
			method,
			success: (result) => {
				if (result.statusCode === 200) {
						resolve(result.data.message);
				} else {
					uni.showToast({
						title: `请求失败`,
						icon: 'none'
					});
					reject(`请求失败`);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '服务器请求异常',
					icon: 'none'
				});
				reject(err);
			}
		});
	});
}

export default http;