<template>
	<view class="live">
		<!-- 头部导航 -->
		<view class="live-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>动态壁纸</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 分享列表 -->
		<view class="live-list">
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=3109327944,3353382792&fm=253&fmt=auto&app=120&f=JPEG?w=703&h=1216" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=802058814,788146649&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=711" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=1054759078,279081371&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=707" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img1.baidu.com/it/u=827314903,978560304&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=850" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=424471230,304579767&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=760" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=1291127,1468535221&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=855" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=899210046,474850241&fm=253&fmt=auto?w=800&h=1130" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=4148244255,1125607134&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=1322" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=3908877121,407742069&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=874" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/liveDetail/liveDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=2967915771,3109062559&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=730" mode="aspectFill"></image>
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
.live {
	width: 100%;
	height: 100%;
	background-color: #141414;
	padding: 30rpx;
	padding-top: 192rpx;
	overflow: auto;
	/* 头部导航栏 */
	.live-navbar {
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
	/* 分享列表 */
	.live-list {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 48%;
			height: 300px;
			border-radius: 30rpx;
			box-shadow: 0 1px 20px -6px #00000080;
			margin-bottom: 40rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 30rpx;
			}
		}
	}
}
</style>
