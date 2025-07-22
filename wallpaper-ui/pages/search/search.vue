<template>
	<view class="search">
		<!-- 毛玻璃背景 -->
		<view class="search-background"></view>
		<!-- 头部导航 -->
		<view class="search-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>搜索</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 搜索部分 -->
		<view class="search-input">
			<view class="type">壁纸</view>
			<input type="text" placeholder="请输入关键词" />
			<view class="submit">搜索</view>
		</view>
		<!-- 搜索历史 -->
		<view class="search-history">
			<view class="history-title">
				<view class="title">搜索历史</view>
				<uni-icons type="trash" size="22" color="#fff"></uni-icons>
			</view>
			<view class="history-keywords">
				<view class="keywork">火影</view>
				<view class="keywork">蜡笔小新</view>
				<view class="keywork">简约</view>
				<view class="keywork">动漫</view>
				<view class="keywork">美女</view>
				<view class="keywork">风景</view>
				<view class="keywork">斗罗大陆</view>
				<view class="keywork">聊天背景</view>
			</view>
		</view>
		<!-- 热门搜索 -->
		<view class="search-hot">
			<view class="hot-title">
				<view class="title">热门搜索</view>
				<view class="fill"></view>
			</view>
			<view class="hot-keywords">
				<view class="keywork">火影</view>
				<view class="keywork">蜡笔小新</view>
				<view class="keywork">简约</view>
				<view class="keywork">动漫</view>
				<view class="keywork">美女</view>
				<view class="keywork">风景</view>
				<view class="keywork">斗罗大陆</view>
				<view class="keywork">聊天背景</view>
			</view>
		</view>
	</view>
</template>

<script setup>
// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss">
.search {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.search-background {
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
	/* 头部导航栏 */
	.search-navbar {
		width: 100%;
		height: 180rpx;
		background-color: #353962;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	/* 搜索部分 */
	.search-input {
		width: 100%;
		height: 80rpx;
		position: relative;
		display: flex;
		align-items: center;
		.type {
			width: 100rpx;
			padding: 10rpx 20rpx;
			background-color: rgb(167 161 161 / 13%);
			border-radius: 20rpx 0 0 20rpx;
		}
		input {
			width: calc(100% - 300rpx);
			padding: 10rpx 20rpx;
			background-color: rgba(12, 10, 10, 0.4);
		}
		.submit {
			padding: 10rpx 20rpx;
			background-color: rgb(54 53 56 / 80%);
			border-radius: 0 30rpx 30rpx 0;
			width: 140rpx;
			text-align: center;
		}
	}
	/* 搜索历史 */
	.search-history {
		position: relative;
		width: 100%;
		margin: 60rpx 0;
		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
		}
		.history-keywords {
			display: flex;
			flex-wrap: wrap;
			.keywork {
				margin-right: 16rpx;
				margin-bottom: 16rpx;
				border-radius: 20rpx;
				padding: 8rpx 25rpx;
				background-color: rgb(12 10 10 / 40%);
				font-size: 14px;
			}
		}
	}
	/* 热门搜索 */
	.search-hot {
		position: relative;
		width: 100%;
		margin: 60rpx 0;
		.hot-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
		}
		.hot-keywords {
			display: flex;
			flex-wrap: wrap;
			.keywork {
				margin-right: 16rpx;
				margin-bottom: 16rpx;
				border-radius: 20rpx;
				padding: 8rpx 25rpx;
				background-color: rgb(12 10 10 / 40%);
				font-size: 14px;
			}
		}
	}
}
</style>
