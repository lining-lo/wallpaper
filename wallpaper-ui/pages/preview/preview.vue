<template>
	<view class="preview" @click="changeShow">
		<!-- 毛玻璃背景 -->
		<view class="preview-background"></view>
		<!-- 图片轮播图 -->
		<swiper circular>
			<swiper-item>
				<image src="https://img1.baidu.com/it/u=3257114389,2112170662&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=875" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
				<image src="https://img1.baidu.com/it/u=178885858,2138464450&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=934" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
				<image src="https://img2.baidu.com/it/u=2007894116,2307834774&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=956" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
				<image src="https://img1.baidu.com/it/u=532063795,1538461415&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
				<image src="https://img1.baidu.com/it/u=2290924651,729530190&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=938" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!-- 当前图片信息 -->
		<view class="preview-info" v-if="isShow">
			<view class="info-current">
				<text>预览图 1/5</text>
			</view>
			<view class="info-user">
				<view class="inner">
					<text>李光洁</text>
					<image src="https://img2.baidu.com/it/u=93036002,4253821634&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
				</view>
			</view>
			<view class="info-time">
				<text class="time">18:23</text>
				<text class="date">7月20日</text>
			</view>
		</view>
		<!-- 底部功能按钮 -->
		<view class="preview-bottom"  v-if="isShow">
			<view class="bottom-detail btn">
				<uni-icons type="info-filled" color="#fff" size="22"></uni-icons>
				<text>详情</text>
			</view>
			<view class="bottom-favorites btn">
				<uni-icons type="heart-filled" color="#fff" size="22"></uni-icons>
				<text>343</text>
			</view>
			<view class="bottom-like btn">
				<uni-icons type="hand-up-filled" color="#fff" size="22"></uni-icons>
				<text>454</text>
			</view>
			<view class="bottom-download btn">
				<uni-icons type="download-filled" color="#fff" size="22"></uni-icons>
				<text>4567</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

// 显示|隐藏图片以外的信息
const isShow = ref(true);
// 切换信息状态
const changeShow = () => {
	isShow.value = !isShow.value;
};
</script>

<style lang="scss">
.preview {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.preview-background {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		filter: blur(40px);
		-webkit-backdrop-filter: blur(40rpx);
		background-image: url(https://img2.baidu.com/it/u=2681334238,2875512996&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=625);
		background-size: cover;
		background-position: center;
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
		top: 0;
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
}
</style>
