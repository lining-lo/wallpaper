<template>
	<view class="my">
		<!-- 毛玻璃背景 -->
		<view class="my-background"></view>
	</view>
</template>

<script setup></script>

<style lang="scss">
.my {
	width: 100%;
	height: 1200px;
	padding: 30rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.my-background {
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
}
</style>
