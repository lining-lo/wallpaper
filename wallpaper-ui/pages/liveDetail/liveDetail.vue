<template>
	<view class="livedetail">
		<!-- 返回按钮 -->
		<view class="preview-back" @click="goBack">
			<uni-icons type="left" size="20" color="#fff"></uni-icons>
		</view>
		<!-- 动态壁纸 -->
		<video
			id="myVideo"
			src="https://mobile-img-baofun.zhhainiao.com/pcwallpaper_ugc_mobile/live/9769482a5c19fa6efa72d7963e35f9eb_preview.mp4"
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
			<view class="btn-download">
				<uni-icons type="cloud-download" size="30"></uni-icons>
				<text>壁纸下载</text>
			</view>
			<uni-icons type="redo-filled" color="#fff" size="36"></uni-icons>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

// 是否静音
const isMuted = ref(true);

// 返回上一页
const goBack = () => {
	uni.navigateBack();
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
