<template>
	<view class="myinfo">
		<!-- 头部导航 -->
		<view class="myinfo-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>个人信息</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 头像 -->
		<view class="myinfo-avatar">
			<image src="/static/images/avatar.png" mode="aspectFill"></image>
		</view>
		<!-- 基本信息 -->
		<view class="myinfo-base">
			<view class="base-row">
				<view class="label">ID</view>
				<input type="text" :value="64151615" />
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="base-row">
				<view class="label">昵称</view>
				<input type="text" placeholder="请填写" />
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="base-row">
				<view class="label">性别</view>
				<input type="text" placeholder="选选择" />
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="base-textarea">
				<textarea placeholder="对自己进行自我介绍，越详细越受欢迎哦。" />
			</view>
		</view>
		<!-- 提交按钮 -->
		<button style="background-color: #7d68fe;color: #fff;border-radius: 20rpx;margin-top: 30rpx;">提交信息</button>
	</view>
</template>

<script setup>
// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss">
.myinfo {
	width: 100%;
	min-height: 100vh;
	background-color: #232749;
	padding: 30rpx 40rpx;
	padding-top: 200rpx;
	overflow: auto;
	/* 头部导航栏 */
	.myinfo-navbar {
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
	/* 头像 */
	.myinfo-avatar {
		width: 100%;
		height: 300rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width: 200rpx;
			height: 200rpx;
			border-radius: 50%;
		}
	}
	/* 基本信息 */
	.myinfo-base {
		width: 100%;
		.base-row {
			width: 100%;
			height: 80rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			.label {
				width: 80rpx;
			}
			input {
				width: 300rpx;
			}
		}
		.base-textarea {
			padding: 40rpx 0;
			width: 100%;
			height: 420rpx;
			textarea {
				width: 100%;
				height: 100%;
				background-color: #33375e;
				padding: 30rpx 40rpx;
				border-radius: 10rpx;
			}
		}
	}
}
</style>
