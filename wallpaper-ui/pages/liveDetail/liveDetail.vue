<template>
	<view class="livedetail">
		<!-- 返回按钮 -->
		<view class="preview-back" @click="goBack">
			<uni-icons type="left" size="20" color="#fff"></uni-icons>
		</view>
		<!-- 动态壁纸 -->
		<video
			id="myVideo"
			:src="live.video_url"
			autoplay="true"
			loop="ture"
			:muted="isMuted"
			:controls="false"
			:show-fullscreen-btn="false"
			:show-center-play-btn="false"
			:show-play-btn="false"
			:enable-progress-gesture="false"
			object-fit="fill"
		></video>
		<!-- 时间信息 -->
		<view class="livedetail-time">
			<text class="time">18:23</text>
			<text class="date">7月20日</text>
		</view>
		<!-- 功能按钮 -->
		<view class="livedetail-btn">
			<view class="btn-sound" @click="isMuted = !isMuted">
				<uni-icons v-if="isMuted" type="sound" color="#fff" size="36"></uni-icons>
				<uni-icons v-else type="sound-filled" color="#fff" size="36"></uni-icons>
			</view>
			<view class="btn-download" @click="handleDownload">
				<uni-icons type="cloud-download" size="30"></uni-icons>
				<text>壁纸下载</text>
			</view>
			<uni-icons type="redo-filled" color="#fff" size="36"></uni-icons>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { updateWallpaperViewCount,handleFeedback } from '../../api/api';

// 是否静音
const isMuted = ref(true);

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
// 视频数据
const live = ref({});
// 挂载
onLoad((options) => {
	// 获取封面信息
	const preview_item = JSON.parse(decodeURIComponent(options.item));
	live.value = preview_item;
	// 更新壁纸查看次数
	updateWallpaperViewCount({ wallpaper_id: preview_item.id });
});

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
	type: 1,
	status: 1
});

// 下载视频的方法
const handleDownload = async () => {
	if (!token.value) {
		return uni.navigateTo({
			url: `/pages/login/login`
		});
	}

	// 获取参数
	feedbackParams.user_id = userInfo.value.id;
	feedbackParams.wallpaper_id = live.value.id;
	feedbackParams.category_id = live.value.category_id;

	// 1. 下载视频到本地临时路径
	uni.downloadFile({
		url: live.value.video_url, // 视频 URL
		success: (downloadRes) => {
			// 下载成功（临时文件路径在 downloadRes.tempFilePath）
			if (downloadRes.statusCode === 200) {
				// 2. 保存视频到相册（使用视频专用 API）
				uni.saveVideoToPhotosAlbum({
					filePath: downloadRes.tempFilePath,
					success: async (res) => {
						// 记录下载行为（你的业务逻辑）
						await handleFeedback(feedbackParams);
						live.value.is_downloaded += 1;
						live.value.download_count += 1;
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
</script>

<style lang="scss">
.livedetail {
	width: 100%;
	height: 100vh;
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
	/* 动态壁纸 */
	video {
		width: 100%;
		height: 100%;
	}
	/* 时间信息 */
	.livedetail-time {
		position: absolute;
		top: 20vh;
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
	/* 功能按钮 */
	.livedetail-btn {
		position: absolute;
		bottom: 4vh;
		width: 100%;
		height: 200rpx;
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.btn-sound {
			display: flex;
			align-items: center;
		}
		.btn-download {
			padding: 8rpx 80rpx;
			border-radius: 30rpx;
			display: flex;
			background-color: rgba(255, 255, 255, 0.6);
			align-items: center;
			text {
				color: black;
				font-size: 18px;
				padding: 0 10rpx 0 4rpx;
			}
		}
	}
}
</style>
