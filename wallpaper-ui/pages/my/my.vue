<template>
	<view class="my">
		<!-- 账号信息 -->
		<view class="my-info" @click="toEditUser">
			<view class="info-avatar">
				<view class="avatar-left">
					<image :src="userInfo ? userInfo.avatar_url : '/static/images/avatar.png'" mode="aspectFill"></image>
				</view>
				<view class="avatar-right">
					<view class="name">{{ userInfo ? userInfo.name || '分享室用户' : '分享室用户' }}</view>
					<view class="userid">id：{{ userInfo ? userInfo.id : '615615154' }}</view>
					<view class="sex">性别：{{ userInfo ? getGender(userInfo.gender) : '未知' }}</view>
				</view>
			</view>
			<view class="info-slogan">{{ userInfo ? userInfo.motto || '尚未填写简介，点击完善' : '点这里完善简介资料' }}</view>
		</view>
		<!-- logo信息 -->
		<view class="my-logo">
			<view class="logo-img">
				<image src="/static/images/logo.png" mode="aspectFill"></image>
			</view>
			<view class="logo-integration">
				<view class="works integration">
					<text class="title">我的作品</text>
					<text class="count">12</text>
				</view>
				<text class="separate">|</text>
				<view class="collection integration">
					<text class="title">我的收藏</text>
					<text class="count">4</text>
				</view>
				<text class="separate">|</text>
				<view class="energy integration">
					<text class="title">我的积分</text>
					<text class="count">1</text>
				</view>
			</view>
		</view>
		<!-- 底部功能 -->
		<view class="my-footer">
			<view class="row">
				<view class="label">
					<uni-icons type="cloud-download-filled" size="32" color="#109be7"></uni-icons>
					<text class="title">下载记录</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="row">
				<view class="label">
					<uni-icons type="weixin" size="32" color="#07b55a"></uni-icons>
					<text class="title">订阅更新</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="row">
				<view class="label">
					<uni-icons type="auth-filled" size="32" color="#68a5e1"></uni-icons>
					<text class="title">在线客服</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="row">
				<view class="label">
					<uni-icons type="chat-filled" size="32" color="#b53898"></uni-icons>
					<text class="title">意见反馈</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="row">
				<view class="label">
					<uni-icons type="help-filled" size="32" color="#b26105"></uni-icons>
					<text class="title">常见问题</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="row">
				<view class="label">
					<uni-icons type="info-filled" size="32" color="#b43aff"></uni-icons>
					<text class="title">用户协议</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
import { getGender } from '../../utils/customize';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 用户信息
const userInfo = ref();
// token信息
const token = ref();
// 跳转到用户编辑页
const toEditUser = () => {
	if (token.value) {
		uni.navigateTo({
			url: `/pages/myInfo/myInfo`
		});
	} else {
		uni.navigateTo({
			url: `/pages/login/login`
		});
	}
};
// 挂载
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');
});
</script>

<style lang="scss">
.my {
	width: 100%;
	min-height: 100vh;
	background-color: #232749;
	padding: 30rpx;
	padding-top: 200rpx;
	overflow: auto;
	/* 账号信息 */
	.my-info {
		width: 100%;
		padding: 0 30rpx;
		margin-bottom: 60rpx;
		.info-avatar {
			width: 100%;
			display: flex;
			align-items: center;
			margin-bottom: 40rpx;
			.avatar-left {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				border: 2px solid #fff;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.avatar-right {
				margin-left: 30rpx;
				width: calc(100% - 180rpx);
				height: 160rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.name {
					font-weight: 600;
					font-size: 18px;
				}
				.userid {
					color: #797979;
					font-size: 14px;
					font-weight: 600;
				}
				.sex {
					color: #797979;
					font-size: 14px;
					font-weight: 600;
				}
			}
		}
		.info-slogan {
			position: relative;
			font-size: 16px;
			color: #797979;
			font-weight: 600;
		}
	}
	/* logo信息 */
	.my-logo {
		width: 100%;
		margin-bottom: 40rpx;
		.logo-img {
			width: 90%;
			height: 160rpx;
			background-color: #272b4d;
			border-radius: 30rpx 30rpx 0 0;
			box-shadow: 0 1px 20px -6px #00000080;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: center;
			image {
				width: 54%;
				height: 64%;
			}
		}
		.logo-integration {
			width: 100%;
			height: 150rpx;
			border-radius: 30rpx;
			box-shadow: 0 1px 20px -6px #00000080;
			background-color: #272b4d;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.separate {
				color: #e26b8e;
			}
			.integration {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 14px;
				font-weight: 600;
				.title {
					color: #797979;
					margin-bottom: 16rpx;
				}
			}
		}
	}
	/* 底部功能 */
	.my-footer {
		width: 100%;
		padding: 0 30rpx;
		.row {
			width: 100%;
			padding: 24rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px dotted #797979;
			.label {
				display: flex;
				align-items: center;
				.title {
					margin-left: 30rpx;
					font-size: 18px;
				}
			}
		}
	}
}
</style>
