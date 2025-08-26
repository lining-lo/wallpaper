<template>
	<view class="navbar">
		<view class="navbar-logo">
			<image src="/static/images/logo.png" mode="aspectFill"></image>
		</view>
		<navigator url="/pages/search/search" class="navbar-search">
			<uni-icons type="search" color="#a9a6a6" size="16"></uni-icons>
			<text>搜索</text>
		</navigator>
	</view>
</template>

<script setup></script>

<style lang="scss">
.navbar {
	width: 100%;
	height: 192rpx;
	position: fixed;
	z-index: 10;
	top: 0;
	padding: 30rpx 20rpx;
	display: flex;
	align-items: flex-end;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	.navbar-logo {
		height: 60rpx;
		width: 240rpx;
		image {
			height: 100%;
			width: 100%;
		}
	}

	.navbar-search {
		width: 204rpx;
		margin-left: 19rpx;
		padding: 10rpx 18rpx;
		border-radius: 40rpx;
		display: flex;
		background-color: rgba(255, 255, 255, 0.1);
		text {
			color: #a9a6a6;
			margin-left: 10rpx;
		}
	}
}
</style>
