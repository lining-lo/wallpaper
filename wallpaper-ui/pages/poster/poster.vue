<template>
	<view class="poster">
		<!-- 返回按钮 -->
		<view class="preview-back" @click="goBack">
			<uni-icons type="left" size="20" color="#fff"></uni-icons>
		</view>
		<image src="https://lining-lo.top/welcome_poster.webp" mode="widthFix"></image>
	</view>
</template>

<script setup>
// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss">
.poster {
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
	image {
		width: 100%;
	}
}
</style>
