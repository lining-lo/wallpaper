<template>
	<view class="subscribe">
		<!-- 头部导航 -->
		<view class="subscribe-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>订阅更新</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 二维码 -->
		<view class="subscribe-qrcode">
			<image :src="imageSrc" @click="previewImage" mode="widthFix"></image>
		</view>
		<!-- 提示 -->
		<view class="subscribe-tip">点击识别二维码，关注公众号畅享新视界</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 定义图片的路径，这里用示例路径，实际使用中替换为真实路径
const imageSrc = ref('https://lining-lo.top/qrcode.png'); 

// 点击图片后的处理函数，用于打开图片预览弹窗
const previewImage = () => {
  uni.previewImage({
    current: imageSrc.value, // 当前显示图片的链接，不填则默认为urls的第一张
    urls: [imageSrc.value], // 需要预览的图片链接列表，可以传入多张图片链接，这里是单张图片
  });
};
</script>

<style lang="scss">
.subscribe {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 320rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.subscribe-navbar {
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
	/* 二维码 */
	.subscribe-qrcode {
		width: 80%;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width: 80%;
			border-radius: 20rpx;
		}
	}
	/* 提示 */
	.subscribe-tip {
		width: 100%;
		margin-top: 72rpx;
		text-align: center;
		color: #797979;
		font-weight: 600;
		letter-spacing: 2px;
		font-size: 17px;
	}
}
</style>
