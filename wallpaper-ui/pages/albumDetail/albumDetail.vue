<template>
	<view class="albumdetail">
		<!-- 毛玻璃背景 -->
		<view class="albumdetail-background"></view>
		<!-- 头部导航 -->
		<view class="albumdetail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>壁纸专辑</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 专辑封面 -->
		<view class="albumdetail-cover">
			<image src="/static/images/banner1.jpg" mode="aspectFill"></image>
			<view class="item-info">
				<view class="info-like">
					<text class="fill"></text>
					<text>12</text>
				</view>
				<view class="info-title">
					<text class="name">性感迷人大幂幂</text>
					<text class="count">208人喜欢</text>
				</view>
			</view>
		</view>
		<!-- 分类内容列表 -->
		<view class="albumdetail-content">
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
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
.albumdetail {
	width: 100%;
	height: 1200px;
	padding-top: 180rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.albumdetail-background {
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
	.albumdetail-navbar {
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
	/* 专辑封面 */
	.albumdetail-cover {
		width: 100%;
		height: 360rpx;
		margin-bottom: 30rpx;
		position: relative;
		image {
			width: 100%;
			height: 100%;
		}
		.item-info {
			width: 100%;
			height: 100%;
			padding: 50rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: absolute;
			top: 0;
			.info-title {
				display: flex;
				justify-content: space-between;
				.name {
					font-weight: 700;
					background-color: rgb(40, 40, 40, 0.8);
					font-size: 20px;
					font-family: cursive;
				}
				.count {
					display: flex;
					align-items: center;
					font-size: 12px;
					padding: 0 8px;
					background-color: rgba(40, 40, 40, 0.8);
					border-radius: 10px;
				}
			}
			.info-like {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				text {
					font-size: 12px;
					padding: 4px 16px;
					background-color: rgba(40, 40, 40, 0.8);
					border-radius: 20px;
				}
			}
		}
	}
	/* 分类内容列表 */
	.albumdetail-content {
		padding: 30rpx;
		position: relative;
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.content-item {
			width: 28.5vw;
			height: 60vw;
			border-radius: 20rpx;
			border: 1px solid #fff;
			margin-bottom: 30rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
