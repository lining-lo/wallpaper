<template>
	<view class="sortlist">
		<!-- 头部导航 -->
		<view class="sortlist-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>AI美图</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 分类内容列表 -->
		<view class="sortlist-container">
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img0.baidu.com/it/u=1385187587,3636080608&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img1.baidu.com/it/u=4015338242,787950689&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1085" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img0.baidu.com/it/u=2737969190,1661739575&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1004" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img2.baidu.com/it/u=4263426615,941366807&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1000" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img0.baidu.com/it/u=808317043,911558675&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img1.baidu.com/it/u=967723385,2563996465&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1086" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img1.baidu.com/it/u=2777636240,3699060457&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1109" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img0.baidu.com/it/u=2731060646,3609875482&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img2.baidu.com/it/u=3197135656,4184515407&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1084" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img0.baidu.com/it/u=1577364197,2525632164&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1085" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img1.baidu.com/it/u=2865979413,4138188230&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1430" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img2.baidu.com/it/u=3040379321,586538598&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1085" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img0.baidu.com/it/u=366492549,1054282565&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1084" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img2.baidu.com/it/u=3116809257,1863643066&fm=253&fmt=auto&app=138&f=JPEG?w=231&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="container-item">
				<image src="https://img0.baidu.com/it/u=789324612,3843744592&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1100" mode="aspectFill"></image>
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
.sortlist {
	width: 100%;
	height: 1200px;
	padding: 30rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.sortlist-navbar {
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
	/* 分类内容列表 */
	.sortlist-container {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.container-item {
			width: calc(34% - 20rpx);
			height: 450rpx;
			margin-right: 20rpx;
			margin-bottom: 30rpx;
			border-radius: 20rpx;
			position: relative;
			&:nth-child(3n) {
				margin-right: 0;
			}
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}
}
</style>
