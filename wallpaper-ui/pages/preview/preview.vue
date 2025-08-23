<template>
	<view class="preview" @click="changeShow">
		<!-- 返回按钮 -->
		<view class="preview-back" @click="goBack">
			<uni-icons type="left" size="20" color="#fff"></uni-icons>
		</view>
		<!-- 图片轮播图 -->
		<swiper circular @change="changeWallpaper" :current="currentWallpaperIndex">
			<swiper-item v-for="(item, index) in wallpapers" :key="index">
				<image v-if="readWallpaperIndexList.includes(index)" :src="item.url" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!-- 当前图片信息 -->
		<view class="preview-info" v-if="isShow">
			<view class="info-current">
				<text v-if="wallpapers">{{ currentWallpaperIndex + 1 }}&nbsp;/&nbsp;{{ wallpapers.length }}</text>
			</view>
			<view class="info-user">
				<view class="inner">
					<text>{{ currentWallpaper.user_name }}</text>
					<image :src="currentWallpaper.user_avatar" mode="aspectFill"></image>
				</view>
			</view>
			<view class="info-time">
				<text class="time">18:23</text>
				<text class="date">7月20日</text>
			</view>
		</view>
		<!-- 底部功能按钮 -->
		<view class="preview-bottom" v-if="isShow" @click.stop="">
			<view class="bottom-detail btn" @click="changePopup(1)">
				<uni-icons type="info-filled" color="#03A9F4" size="22"></uni-icons>
				<text>详情</text>
			</view>
			<view class="bottom-favorites btn" @click="toHandleFeedback(1)">
				<uni-icons type="star-filled" :color="currentWallpaper.is_collected >= 1 ? '#f4ff14' : '#fff'" size="24"></uni-icons>
				<text>{{ currentWallpaper.collect_count }}</text>
			</view>
			<view class="bottom-like btn" @click="toHandleFeedback(0)">
				<uni-icons type="heart-filled" :color="currentWallpaper.is_liked >= 1 ? '#ff3613' : '#fff'" size="22"></uni-icons>
				<text>{{ currentWallpaper.like_count }}</text>
			</view>
			<view class="bottom-download btn" @click="toHandleFeedback(2)">
				<uni-icons type="download-filled" :color="currentWallpaper.is_downloaded >= 1 ? '#8d5fe0' : '#fff'" size="22"></uni-icons>
				<text>{{ currentWallpaper.download_count }}</text>
			</view>
		</view>
		<!-- 详情弹窗 -->
		<uni-popup type="bottom" ref="popupInfo" :is-mask-click="false" :safe-area="false" borderRadius="20rpx 20rpx 0 0" background-color="#141414">
			<view class="inner" @click.stop="">
				<view class="popup-title">
					<view class="fill"></view>
					<view class="title">壁纸信息</view>
					<uni-icons @click="changePopup(0)" type="closeempty" color="#fff" size="18"></uni-icons>
				</view>
				<scroll-view scroll-y>
					<view class="content">
						<view class="row">
							<view class="label">壁纸ID：</view>
							<text selectable class="value">{{ currentWallpaper.id }}</text>
						</view>
						<view class="row">
							<view class="label">分类：</view>
							<text selectable class="value">{{ currentWallpaper.category_name }}</text>
						</view>
						<view class="row">
							<view class="label">发布者：</view>
							<text selectable class="value">{{ currentWallpaper.user_name }}</text>
						</view>
						<view class="row">
							<view class="label">标签：</view>
							<view selectable class="value tags">
								<text class="tag" v-for="(label, index2) in currentWallpaper.labels" :key="index2">{{ label }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<view class="content">
						声明：本图片来自用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸 ID 到邮箱 2092576148@qq.com，管理将删除侵权壁纸，维护您的权益。
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { handleFeedback } from '../../api/api';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 详情弹窗dom
const popupInfo = ref();
// 弹窗的状态（0关闭，1打开）
const popupStatus = ref(0);
// 打开|关闭弹窗(0关闭，1打开)
const changePopup = (option) => {
	popupStatus.value = option;
	if (option === 1) {
		popupInfo.value.open();
	} else {
		popupInfo.value.close();
	}
};
// 显示|隐藏图片以外的信息
const isShow = ref(true);
// 切换信息状态
const changeShow = () => {
	if (popupStatus.value === 1) return;
	isShow.value = !isShow.value;
};
// 返回上一页
const goBack = () => {
	uni.navigateBack();
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
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');
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
</script>

<style lang="scss">
.preview {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 返回按钮 */
	.preview-back {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(40, 40, 40, 0.8);
		position: fixed;
		z-index: 1;
		top: 92rpx;
		left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* 轮播图 */
	swiper {
		position: relative;
		width: 100%;
		height: 100vh;
		swiper-item {
			width: 100%;
			height: 100%;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	/* 当前图片信息 */
	.preview-info {
		position: absolute;
		top: 120rpx;
		width: 100%;
		height: 54vw;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.info-current {
			width: 100%;
			text-align: center;
			text {
				padding: 8rpx 40rpx;
				background-color: rgba(40, 40, 40, 0.6);
				border-radius: 30rpx;
				font-size: 13px;
			}
		}
		.info-user {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			padding-right: 20rpx;
			.inner {
				display: flex;
				align-items: center;
				gap: 20rpx;
				padding: 2px 4px 2px 20px;
				background-color: rgba(40, 40, 40, 0.5);
				border-radius: 50rpx;
				text {
					font-size: 16px;
					color: #fff;
				}
				image {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					border: 2px solid #fff;
				}
			}
		}
		.info-time {
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
	}
	/* 底部功能按钮 */
	.preview-bottom {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		bottom: 50px;
		width: 80%;
		height: 16vw;
		border-radius: 100rpx;
		background-color: rgba(40, 40, 40, 0.8);
		display: flex;
		justify-content: space-around;
		align-items: center;
		.btn {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			padding: 0 14rpx;
		}
	}
	/* 详情弹窗 */
	uni-popup {
		width: 100%;
		.inner {
			.popup-title {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 40rpx 30rpx;
			}
			scroll-view {
				width: 100%;
				max-height: 60vh;
				padding: 0 60rpx 20rpx 60rpx;
				.content {
					.row {
						display: flex;
						padding: 16rpx 0;
						font-size: 32rpx;
						line-height: 1.7rem;
						.label {
							color: #9c9c9c;
							width: 140rpx;
							text-align: right;
							font-size: 30rpx;
						}
						.value {
							width: calc(100% - 240rpx);
							padding: 0 20rpx;
						}
						.tags {
							display: flex;
							flex-wrap: wrap;
							.tag {
								border: 1px solid #fff;
								font-size: 22rpx;
								padding: 10rpx 30rpx;
								border-radius: 40rpx;
								line-height: 1em;
								margin: 0 10rpx 10rpx 0;
							}
						}
					}
				}
			}
			.popup-footer {
				width: 100%;
				padding: 0 20rpx 80rpx 20rpx;
				.content {
					padding: 30rpx;
					background-color: rgba(40, 40, 40, 0.3);
					border-radius: 10rpx;
					line-height: 1.64;
				}
			}
		}
	}
}
</style>
