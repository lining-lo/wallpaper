<template>
	<view class="sharelist">
		<!-- 返回按钮 -->
		<view class="sharelist-back" @click="goBack">
			<uni-icons type="left" size="20" color="#fff"></uni-icons>
		</view>
		<!-- 图片预览 -->
		<uni-popup type="center" ref="popupInfo" :safe-area="false" background-color="#141414">
			<view v-if="isOpen" @click="changePopup(0)" @touchmove.stop.prevent class="inner">
				<view class="inner-time" v-if="!(plat === 1 && currentWallpaper.type === 4)">
					<text class="time">{{ time.time }}</text>
					<text class="date">{{ time.date }}</text>
				</view>
				<image
					v-if="currentWallpaper && currentWallpaper.type !== 2"
					:class="{
						portrait: currentWallpaper.type === 0 || currentWallpaper.type === 1 || currentWallpaper.type === 2,
						tablet: currentWallpaper.type === 3,
						avatar: currentWallpaper.type === 4
					}"
					:src="currentWallpaper.url"
					mode="aspectFill"
				></image>
				<video
					v-else
					:class="{ portrait: currentWallpaper.type === 2 }"
					id="myVideo"
					:src="currentWallpaper.video_url"
					:autoplay="false"
					:loop="false"
					:muted="true"
					:controls="false"
					:show-fullscreen-btn="false"
					:show-center-play-btn="false"
					:show-play-btn="false"
					:enable-progress-gesture="false"
					object-fit="fill"
					@loadedmetadata="onVideoLoaded"
				></video>
			</view>
		</uni-popup>
		<!-- 轮播图 -->
		<view class="sharelist-swaper">
			<view class="currenindx">
				<text>{{ currentWallpaperIndex + 1 }}&nbsp;/&nbsp;{{ wallpapers.length }}</text>
			</view>
			<swiper circular previous-margin="72px" next-margin="72px" @change="changeWallpaper" :current="currentWallpaperIndex">
				<swiper-item v-for="(item, index) in wallpapers" :key="index">
					<view class="img">
						<image
							@click="changePopup(1, item.id)"
							:class="{
								portrait: item.type === 0 || item.type === 1 || item.type === 2,
								tablet: item.type === 3,
								avatar: item.type === 4
							}"
							v-if="readWallpaperIndexList.includes(index)"
							:src="item.url"
							mode="aspectFill"
							lazy-load
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 壁纸信息 -->
		<view class="sharelist-info">
			<view class="info-labels">
				<text class="label" @click="toSort(currentWallpaper.type)">{{ ['壁纸', '专辑', '动态', '平板', '头像'][currentWallpaper.type] }}</text>
				<text class="label" @click="toSearch(label)" v-for="(label, index2) in currentWallpaper.labels" :key="index2">{{ label }}</text>
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
		<!-- 相关推荐 -->
		<!-- 		<view class="sharelist-recommend">
			<view class="recommend-title">相关推荐</view>
			<view class="recommend-list"></view>
		</view> -->
	</view>
</template>

<script setup>
import { getDateTime } from '../../utils/customize';
import { handleFeedback } from '../../api/api';
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app';
import { reactive, ref, nextTick } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 动态壁纸相关
const videoContext = ref(null);
const isAutoPlay = ref(false);
// 初始化视频播放
const initVideoPlay = () => {
	if (currentWallpaper.value.type === 2) {
		nextTick(() => {
			videoContext.value = uni.createVideoContext('myVideo');
		});
	}
};
// 停止视频播放
const stopVideo = () => {
	if (videoContext.value) {
		videoContext.value.pause();
	}
};
// 视频加载完成事件
const onVideoLoaded = () => {
	if (isAutoPlay.value && videoContext.value) {
		videoContext.value.play();
	}
};

const isOpen = ref(false);
const popupInfo = ref();
// 打开|关闭弹窗(0关闭，1打开)
const changePopup = (option, id = '') => {
	if (option === 1 && id === currentWallpaper.value.id) {
		isOpen.value = true;
		popupInfo.value.open();
		if (currentWallpaper.value.type === 2) {
			isAutoPlay.value = true;
			initVideoPlay(); // 手动触发视频播放
		}
	} else {
		isOpen.value = false;
		popupInfo.value.close();
		if (currentWallpaper.value.type === 2) {
			isAutoPlay.value = false;
			stopVideo(); // 手动暂停视频
		}
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
// 当前设备（0手机,1电脑）
const plat = ref(0);
// 挂载
onLoad((options) => {
	// 获取当前设备
	const systemInfo = uni.getSystemInfoSync();
	const platform = systemInfo.platform;
	if (platform === 'android' || platform === 'ios') {
		plat.value = 0;
	} else if (platform === 'devtools' || platform === 'windows' || platform === 'mac') {
		plat.value = 1;
	}

	// 获取当前壁纸来源
	from.value = decodeURIComponent(options.from);
	wallpapers.value = JSON.parse(uni.getStorageSync(`${from.value}`));
	// 获取当前壁纸id
	currentWallpaperId.value = options.id;
	// 获取当前的索引
	currentWallpaperIndex.value = wallpapers.value.findIndex((item) => item.id === options.id);
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
	// console.log(currentWallpaper.value);

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
		currentWallpaper.value.type === 2 ? handleDownloadVideo() : handleDownloadWallpaper();
	}
	// 同步更新缓存
	updateWallpaperCache();
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
const handleDownloadWallpaper = async () => {
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
// 下载视频的方法
const handleDownloadVideo = async () => {
	// 1. 下载视频到本地临时路径
	uni.downloadFile({
		url: currentWallpaper.value.video_url, // 视频 URL
		success: (downloadRes) => {
			// 下载成功（临时文件路径在 downloadRes.tempFilePath）
			if (downloadRes.statusCode === 200) {
				// 2. 保存视频到相册（使用视频专用 API）
				uni.saveVideoToPhotosAlbum({
					filePath: downloadRes.tempFilePath,
					success: async (res) => {
						// 记录下载行为（你的业务逻辑）
						await handleFeedback(feedbackParams);
						currentWallpaper.value.is_downloaded += 1;
						currentWallpaper.value.download_count += 1;
						uni.showToast({
							title: '视频保存成功',
							icon: 'success',
							duration: 2000
						});
					},
					fail: (err) => {
						// 处理权限问题
						if (err.errMsg.includes('auth deny') || err.errMsg.includes('deny')) {
							uni.showModal({
								title: '权限不足',
								content: '需要开启相册权限才能保存视频，是否去设置？',
								confirmText: '去设置',
								success: (modalRes) => {
									if (modalRes.confirm) {
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
			} else {
				// 下载失败（非 200 状态码）
				uni.showToast({
					title: '视频下载失败',
					icon: 'none'
				});
			}
		},
		fail: (err) => {
			console.error('视频下载请求失败:', err);
			uni.showToast({
				title: '网络错误，下载失败',
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
	switch (type) {
		case 0:
			const sort_item = JSON.stringify({ id: '' });
			uni.navigateTo({
				url: `/pages/sortList/sortList?item=${encodeURIComponent(sort_item)}&index=0`
			});
			break;
		case 1:
			uni.navigateTo({
				url: `/pages/album/album`
			});
			break;
		case 2:
			uni.navigateTo({
				url: `/pages/live/live`
			});
			break;
		case 3:
			uni.navigateTo({
				url: `/pages/tablet/tablet`
			});
			break;
		case 4:
			uni.navigateTo({
				url: `/pages/avatar/avatar`
			});
			break;
	}
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
.sharelist {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 返回按钮 */
	.sharelist-back {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(40, 40, 40, 0.8);
		position: fixed;
		z-index: 2;
		top: 100rpx;
		left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* 图片预览 */
	uni-popup {
		width: 100%;
		.inner {
			width: 100vw;
			height: 100vh;
			background-color: #141414;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			.inner-time {
				position: absolute;
				top: 220rpx;
				z-index: 1;
				width: 100%;
				text-align: center;
				display: flex;
				flex-direction: column;
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
			.portrait {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
			.avatar {
				width: 100%;
				height: 751rpx;
			}
			.tablet {
				width: 100%;
				height: 480rpx;
			}
		}
	}
	/* 轮播图 */
	.sharelist-swaper {
		width: 100%;
		height: 900rpx;
		margin-top: 100rpx;
		position: relative;
		.currenindx {
			position: absolute;
			top: 20rpx;
			z-index: 1;
			width: 100%;
			text-align: center;
			text {
				padding: 8rpx 40rpx;
				background-color: rgba(40, 40, 40, 0.6);
				border-radius: 30rpx;
				font-size: 13px;
			}
		}
		swiper {
			width: 100%;
			height: 100%;
			swiper-item {
				width: 100%;
				height: 100%;
				padding: 0 10rpx;
				.img {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					background-color: #222222;
					border-radius: 20rpx;
					.portrait {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
					.avatar {
						width: 100%;
						height: 455rpx;
					}
					.tablet {
						width: 100%;
						height: 300rpx;
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
	/* 相关推荐 */
	.sharelist-recommend {
		padding: 0 30rpx;
		width: 100%;
		.recommend-title {
			font-size: 20px;
			font-weight: 700;
			padding-bottom: 36rpx;
		}
		.recommend-list {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			.list-item {
				width: calc(34% - 20rpx);
				height: 450rpx;
				margin-right: 20rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				position: relative;
				&:nth-child(3n) {
					margin-right: 0;
				}
				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
			}
		}
	}
}
</style>
