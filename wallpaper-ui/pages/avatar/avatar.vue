<template>
	<view class="avatar">
		<!-- 头部导航 -->
		<view class="avatar-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>头像</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 分享列表 -->
		<view class="avatar-list">
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=953640602,4047902931&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=615285359,1419138736&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=2129850704,309143223&fm=253&fmt=auto&app=138&f=JPEG?w=802&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=3167322707,1679056125&fm=253&fmt=auto&app=138&f=JPEG?w=533&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=2786903409,1732820867&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=1638790034,3534418596&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=801644006,604878762&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=3087975985,2887273610&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=4263343468,1566665778&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/avatarDetail/avatarDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=2343135913,1697720286&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
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
.avatar {
	width: 100%;
	height: 100%;
	background-color: #141414;
	padding: 30rpx;
	padding-top: 192rpx;
	overflow: auto;
	/* 头部导航栏 */
	.avatar-navbar {
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
	.avatar-list {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 48%;
			height: 172px;
			border-radius: 40rpx;
			box-shadow: 0 1px 20px -6px #00000080;
			margin-bottom: 40rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 40rpx;
			}
		}
	}
}
</style>
