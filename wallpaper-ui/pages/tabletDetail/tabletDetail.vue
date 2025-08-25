<template>
	<view class="tabletdetail" @click="changeShow">
		<!-- 头部导航 -->
		<view class="avatar-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>平板</text>
			<view style="width: 56rpx"></view>
		</view>
		<!-- 图片轮播图 -->
		<view class="tabletdetail-main">
			<view class="currenindx">
				<text>{{ currentWallpaperIndex + 1 }}&nbsp;/&nbsp;{{ wallpapers.length }}</text>
			</view>
			<swiper circular @change="changeWallpaper" :current="currentWallpaperIndex">
				<swiper-item v-for="(item, index) in wallpapers" :key="index">
					<view class="info-time">
						<text class="time">{{ time.time }}</text>
						<text class="date">{{ time.date }}</text>
					</view>
					<view class="tabletdetail-img">
						<image v-if="readWallpaperIndexList.includes(index)" :src="item.url" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 壁纸信息 -->
		<view class="sharelist-info">
			<view class="info-labels">
				<text @click="toSort" class="label">{{ ['壁纸', '专辑', '动态', '平板', '头像'][currentWallpaper.type] }}</text>
				<text @click="toSearch(label)" class="label" v-for="(label, index2) in currentWallpaper.labels" :key="index2">{{ label }}</text>
			</view>
			<view class="info-base">
				<view class="base-avatar base" @click="toUserDetail">
					<image :src="currentWallpaper.user_avatar" mode="aspectFill"></image>
					<text>{{ currentWallpaper.user_name }}</text>
				</view>
				<view class="base-avatar base" @click="toHandleFeedback(2)">
					<uni-icons v-if="currentWallpaper.is_downloaded >= 1" type="cloud-download-filled" size="30" color="#109be8"></uni-icons>
					<uni-icons v-else type="cloud-download" size="30" color="#109be8"></uni-icons>
					<text>下载： {{ currentWallpaper.download_count }}</text>
				</view>
				<view class="base-avatar base" @click="toHandleFeedback(0)">
					<uni-icons v-if="currentWallpaper.is_liked >= 1" type="heart-filled" size="30" color="#d4381d"></uni-icons>
					<uni-icons v-else type="heart" size="30" color="#d4381d"></uni-icons>
					<text>点赞： {{ currentWallpaper.like_count }}</text>
				</view>
				<view class="base-avatar base" @click="toHandleFeedback(1)">
					<uni-icons v-if="currentWallpaper.is_collected >= 1" type="star-filled" size="30" color="#e1ea25"></uni-icons>
					<uni-icons v-else type="star" size="30" color="#e1ea25"></uni-icons>
					<text>收藏： {{ currentWallpaper.collect_count }}</text>
				</view>
			</view>
		</view>
		<!-- 广告位 -->
		<view class="sharelist-advertisement">
			<image src="https://lining-lo.top/avatar/1755237311090-6m5zg3lo77.jpg" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script setup>
	import { getDateTime } from '../../utils/customize';
import { handleFeedback } from '../../api/api';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 详情弹窗dom
const popupInfo = ref();
// 打开|关闭弹窗(0关闭，1打开)
const changePopup = (option) => {
	if (option === 1) {
		popupInfo.value.open();
	} else {
		popupInfo.value.close();
	}
};

// 壁纸列表
const wallpapers = ref([]);
// 当前壁纸id
const currentWallpaperId = ref();
// 当前壁纸的索引
const currentWallpaperIndex = ref();
// 当前的壁纸信息
const currentWallpaper = ref({});
// 看过的壁纸索引
const readWallpaperIndexList = ref([]);
const from = ref();
// 挂载
onLoad((options) => {
	// 获取当前壁纸来源
	from.value = decodeURIComponent(options.from);
	wallpapers.value = JSON.parse(uni.getStorageSync(`${from.value}`));
	// 获取当前壁纸id
	currentWallpaperId.value = options.id;
	// 获取当前的索引
	currentWallpaperIndex.value = Number(options.index);
	// 获取当前壁纸信息
	currentWallpaper.value = wallpapers.value[currentWallpaperIndex.value];

	// 提取缓存三张图
	readWallpaperIndexList.value.push(
		currentWallpaperIndex.value <= 0 ? wallpapers.value.length - 1 : currentWallpaperIndex.value - 1,
		currentWallpaperIndex.value,
		currentWallpaperIndex.value >= wallpapers.value.length - 1 ? 0 : currentWallpaperIndex.value + 1
	);
	// 数组去重
	readWallpaperIndexList.value = [...new Set(readWallpaperIndexList.value)];
});
// 更换壁纸的方法
const changeWallpaper = (event) => {
	const currentIndex = event.detail.current;
	currentWallpaperIndex.value = currentIndex;
	currentWallpaper.value = wallpapers.value[currentIndex];
	readWallpaperIndexList.value.push(currentIndex);
	console.log(currentWallpaper.value);

	// 提取缓存三张图
	readWallpaperIndexList.value.push(
		currentWallpaperIndex.value <= 0 ? wallpapers.value.length - 1 : currentWallpaperIndex.value - 1,
		currentWallpaperIndex.value,
		currentWallpaperIndex.value >= wallpapers.value.length - 1 ? 0 : currentWallpaperIndex.value + 1
	);
	// 数组去重
	readWallpaperIndexList.value = [...new Set(readWallpaperIndexList.value)];
};

// 用户信息
const userInfo = ref();
// token信息
const token = ref();
// 当前时间
const time = ref({});
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');

	// 获取当前时间
	time.value = getDateTime();
});

// 点赞|收藏|下载的参数
const feedbackParams = reactive({
	user_id: '',
	wallpaper_id: '',
	category_id: '',
	type: 0,
	status: 1
});

// 点赞|收藏|下载的方法
const toHandleFeedback = async (type) => {
	if (!token.value) {
		return uni.navigateTo({
			url: `/pages/login/login`
		});
	}

	// 获取参数
	feedbackParams.user_id = userInfo.value.id;
	feedbackParams.wallpaper_id = currentWallpaper.value.id;
	feedbackParams.category_id = currentWallpaper.value.category_id;
	feedbackParams.type = type;
	feedbackParams.status = 1;

	// 根据反馈类型做出不同处理
	// 点赞
	if (type === 0) {
		if (currentWallpaper.value.is_liked >= 1) {
			return uni.showToast({
				title: '您已点过赞了',
				icon: 'none',
				duration: 2000
			});
		} else {
			const result = await handleFeedback(feedbackParams);
			console.log(result);
			currentWallpaper.value.is_liked += 1;
			currentWallpaper.value.like_count += 1;
			setTimeout(() => {
				uni.showToast({
					title: '点赞成功',
					icon: 'success',
					duration: 2000
				});
			}, 500);
		}
	}
	// 收藏
	if (type === 1) {
		if (currentWallpaper.value.is_collected >= 1) {
			await handleFeedback(feedbackParams);
			currentWallpaper.value.is_collected -= 1;
			currentWallpaper.value.collect_count -= 1;
			setTimeout(() => {
				uni.showToast({
					title: '已取消收藏',
					icon: 'none',
					duration: 2000
				});
			}, 1000);
		} else {
			await handleFeedback(feedbackParams);
			currentWallpaper.value.is_collected += 1;
			currentWallpaper.value.collect_count += 1;
			setTimeout(() => {
				uni.showToast({
					title: '收藏成功',
					icon: 'success',
					duration: 2000
				});
			}, 1000);
		}
	}
	// 下载
	if (type === 2) {
		handleDownload();
	}
	// 同步更新缓存
	updateWallpaperCache();
	console.log('current', currentWallpaper.value);
};
// 同步更新壁纸列表缓存
const updateWallpaperCache = () => {
	if (wallpapers.value && wallpapers.value.length > currentWallpaperIndex.value) {
		// 直接用当前最新的 currentWallpaper 覆盖数组中的旧数据
		wallpapers.value[currentWallpaperIndex.value] = {
			...wallpapers.value[currentWallpaperIndex.value], // 保留原始数据结构（避免丢失未修改的字段）
			...currentWallpaper.value // 用最新的 currentWallpaper 覆盖所有字段
		};
	}
	// 重新保存到缓存
	uni.setStorageSync(from.value, JSON.stringify(wallpapers.value));
};
// 下载图片的方法
const handleDownload = async () => {
	uni.getImageInfo({
		src: currentWallpaper.value.url,
		success: (res) => {
			uni.saveImageToPhotosAlbum({
				filePath: res.path,
				success: async (res) => {
					await handleFeedback(feedbackParams);
					currentWallpaper.value.is_downloaded += 1;
					currentWallpaper.value.download_count += 1;
					// 同步更新缓存
					updateWallpaperCache();
					uni.showToast({
						title: '保存成功',
						icon: 'success',
						duration: 2000
					});
				},
				fail: (err) => {
					// 处理特殊错误：用户拒绝授权后引导到设置页
					if (err.errMsg.includes('auth deny') || err.errMsg.includes('deny')) {
						uni.showModal({
							title: '权限不足',
							content: '需要开启相册权限才能保存图片，是否去设置？',
							confirmText: '去设置',
							success: (modalRes) => {
								if (modalRes.confirm) {
									// 打开应用设置页
									uni.openSetting();
								}
							}
						});
					} else {
						uni.showToast({
							title: '保存失败，请重试',
							icon: 'none'
						});
					}
				}
			});
		},
		fail: (err) => {
			console.error('获取图片信息失败:', err);
			uni.showToast({
				title: '图片加载失败，请重试',
				icon: 'none'
			});
		}
	});
};

// 跳转到用户详情
const toUserDetail = async () => {
	const author_item = JSON.stringify({ id: currentWallpaper.value.user_id });
	uni.navigateTo({
		url: `/pages/authorDetail/authorDetail?item=${encodeURIComponent(author_item)}&need=1`
	});
};

// 跳转到分类
const toSort = (type) => {
	uni.showToast({
		title: '当前已在该分类',
		icon: 'none'
	});
};

// 前往搜索
const toSearch = (keyword = '') => {
	// 1. 获取搜索记录
	let keywords = uni.getStorageSync('keywords') || [];
	// 2. 过滤空值（避免存入空字符串）
	if (!keyword.trim()) return;
	// 3. 去重并保持数组类型（使用Set去重后转回数组）
	const newKeywords = [...new Set([keyword, ...keywords])];
	// 4. 限制历史记录数量（可选，避免无限增长）
	if (newKeywords.length > 10) {
		newKeywords.pop(); // 超过10条时删除最后一条
	}
	// 5. 更新响应式数据并同步到本地存储
	keywords = newKeywords;
	uni.setStorageSync('keywords', newKeywords);
	// 6. 跳转到搜索详情页
	uni.navigateTo({
		url: `/pages/searchDetail/searchDetail?keyword=${encodeURIComponent(keyword)}`
	});
};
</script>

<style lang="scss">
.tabletdetail {
	width: 100%;
	min-height: 100vh;
	position: relative;
	padding-top: 192rpx;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.avatar-navbar {
		width: 100%;
		height: 180rpx;
		background-color: #141414;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	/* 轮播图 */
	.tabletdetail-main {
		width: 100%;
		height: 836rpx;
		background-color: #141414;
		overflow: hidden;
		.currenindx {
			width: 100%;
			text-align: center;
			padding: 30rpx;
			text {
				padding: 8rpx 40rpx;
				background-color: rgba(255, 255, 255, 0.1);
				border-radius: 30rpx;
				font-size: 13px;
			}
		}
		swiper {
			position: relative;
			width: 100%;
			height: 100%;
			swiper-item {
				width: 100%;
				height: 100%;
				.info-time {
					width: 100%;
					text-align: center;
					display: flex;
					flex-direction: column;
					margin: 10rpx 0 60rpx 0;
					.time {
						font-size: 46px;
						font-weight: 600;
						letter-spacing: 0.2em;
						margin-bottom: 8px;
					}
					.date {
						font-size: 24px;
						font-weight: 400;
						letter-spacing: 0.2em;
					}
				}
				.tabletdetail-img {
					width: 100%;
					height: 100%;
					image {
						width: 100%;
						height: 468rpx;
					}
				}
			}
		}
	}
	/* 壁纸信息 */
	.sharelist-info {
		width: 100%;
		padding: 60rpx 30rpx 0 30rpx;
		.info-labels {
			width: 100%;
			display: flex;
			margin-bottom: 30rpx;
			flex-wrap: wrap;

			.label {
				padding: 4rpx 30rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
				white-space: nowrap;
				margin-bottom: 20rpx;
				border: 1px solid;
			}

			.label:nth-child(6n + 1) {
				color: #109be8;
				border-color: #109be8;
			}
			/* nth-child(6n+2) 表示第2、8、14...个标签 */
			.label:nth-child(6n + 2) {
				color: #9d4d64;
				border-color: #9d4d64;
			}
			/* nth-child(6n+3) 表示第3、9、15...个标签 */
			.label:nth-child(6n + 3) {
				color: #af8933;
				border-color: #af8933;
			}
			/* nth-child(6n+4) 表示第4、10、16...个标签 */
			.label:nth-child(6n + 4) {
				color: #8b8bef;
				border-color: #8b8bef;
			}
			/* nth-child(6n+5) 表示第5、11、17...个标签 */
			.label:nth-child(6n + 5) {
				color: #33a4af;
				border-color: #33a4af;
			}
			/* nth-child(6n+6) 表示第6、12、18...个标签 */
			.label:nth-child(6n + 6) {
				color: #0a7521;
				border-color: #0a7521;
			}
		}
		.info-base {
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.base {
				width: calc(50% - 15rpx);
				height: 108rpx;
				border-radius: 12rpx;
				background-color: #222222;
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;
				padding: 0 20rpx;
				&.base-avatar {
					display: flex;
					align-items: center;
					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
					text {
						margin-left: 12rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 205rpx;
					}
				}
			}
		}
	}
	/* 广告位 */
	.sharelist-advertisement {
		margin-bottom: 40rpx;
		padding: 0 30rpx;
		width: 100%;
		height: 400rpx;
		background-color: #222222;
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
