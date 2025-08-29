<template>
	<view class="my">
		<!-- 账号信息 -->
		<view class="my-info" @click="toEditUser">
			<view class="info-avatar">
				<view class="avatar-left">
					<image :src="userInfo ? userInfo.avatar_url : '/static/images/avatar.png'" mode="aspectFill"></image>
				</view>
				<view class="avatar-right">
					<view class="name">{{ userInfo ? userInfo.name || '未登录用户' : '未登录用户' }}</view>
					<view class="userid">ID：{{ userInfo ? userInfo.id : '未知' }}</view>
				</view>
			</view>
		</view>
		<!-- logo信息 -->
		<view class="my-logo">
			<view class="logo-img">
				<image src="/static/images/logo.png" mode="aspectFill"></image>
			</view>
			<view class="logo-integration">
				<view class="works integration" @click="toUserDetail">
					<text class="title">我的作品</text>
					<text class="count">{{ myInfo ? myInfo.total_works : 0 }}</text>
				</view>
				<text class="separate">|</text>
				<view @click="toMyCollection" class="collection integration">
					<text class="title">我的收藏</text>
					<text class="count">{{ myInfo ? myInfo.total_collections : 0 }}</text>
				</view>
				<text class="separate">|</text>
				<view class="energy integration">
					<text class="title">我的能量</text>
					<text class="count">0</text>
				</view>
			</view>
		</view>
		<!-- 底部功能 -->
		<view class="my-footer">
			<view @click="toMyDownload" class="row">
				<view class="label">
					<uni-icons type="cloud-download-filled" size="32" color="#109be7"></uni-icons>
					<text class="title">下载记录</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<navigator url="/pages/subscribe/subscribe" class="row">
				<view class="label">
					<uni-icons type="weixin" size="32" color="#07b55a"></uni-icons>
					<text class="title">订阅更新</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</navigator>
			<button open-type="contact" hover-class="button-active" class="row">
				<view class="label">
					<uni-icons type="auth-filled" size="32" color="#68a5e1"></uni-icons>
					<text class="title">在线客服</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</button>
			<view @click="toProblem" class="row">
				<view class="label">
					<uni-icons type="chat-filled" size="32" color="#b53898"></uni-icons>
					<text class="title">意见反馈</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<navigator url="/pages/help/help" class="row">
				<view class="label">
					<uni-icons type="help-filled" size="32" color="#b26105"></uni-icons>
					<text class="title">常见问题</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</navigator>
			<view @click="logout" class="row">
				<view class="label">
					<uni-icons type="circle-filled" size="32" color="#ed1c24"></uni-icons>
					<text class="title">退出登录</text>
				</view>
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
		</view>
	</view>
	<tabbar />
</template>

<script setup>
import { selectUserByUserId } from '../../api/api';
import tabbar from '../../components/tabbar.vue';
import { getGender } from '../../utils/customize';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 用户信息
const userInfo = ref();
// token信息
const token = ref();
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');
	if (!myInfo.value) {
		getMyInfo();
	}
});

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

// 当前信息
const myInfo = ref();
// 获取用户信息
const getMyInfo = async () => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	if (!userInfo.value || userInfo.value.id === '') return;
	const result = await selectUserByUserId({ user_id: userInfo.value.id });
	myInfo.value = result[0];
	console.log(myInfo.value);
};
// 跳转到用户详情
const toUserDetail = () => {
	if (token.value) {
		const author_item = JSON.stringify(myInfo.value);
		uni.navigateTo({
			url: `/pages/authorDetail/authorDetail?item=${encodeURIComponent(author_item)}&need=0`
		});
	} else {
		uni.navigateTo({
			url: `/pages/login/login`
		});
	}
};

// 跳转到我的收藏
const toMyCollection = () => {
	if (token.value) {
		uni.navigateTo({
			url: `/pages/myCollection/myCollection`
		});
	} else {
		uni.navigateTo({
			url: `/pages/login/login`
		});
	}
};

// 跳转到我的下载
const toMyDownload = () => {
	if (token.value) {
		uni.navigateTo({
			url: `/pages/myDownload/myDownload`
		});
	} else {
		uni.navigateTo({
			url: `/pages/login/login`
		});
	}
};

// 跳转到问题反馈
const toProblem = () => {
	if (token.value) {
		uni.navigateTo({
			url: `/pages/problem/problem`
		});
	} else {
		uni.navigateTo({
			url: `/pages/login/login`
		});
	}
};

// 退出登录
const logout = () => {
	if (!token.value) return;

	uni.showLoading({
		title: '退出中...',
		mask: true
	});
	
	setTimeout(() => {
		uni.removeStorageSync('token');
		uni.removeStorageSync('userInfo');
		myInfo.value = null;
		userInfo.value = null;
		token.value = null;
		uni.showToast({
			title: '退出成功',
			icon: 'success',
			duration: 2000
		});
		uni.hideLoading();
	}, 500);
};
</script>

<style lang="scss">
.my {
	width: 100%;
	min-height: 100vh;
	background-color: #111111;
	overflow: auto;
	/* 账号信息 */
	.my-info {
		width: 100%;
		height: 400rpx;
		padding: 0 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 60rpx;
		background-image: url('https://img0.baidu.com/it/u=1844358284,619757854&fm=253&fmt=auto&app=138&f=JPEG?w=888&h=500');
		background-size: cover;
		background-position: center;
		.info-avatar {
			width: 100%;
			display: flex;
			align-items: center;
			.avatar-left {
				width: 130rpx;
				height: 130rpx;
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
				height: 130rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.name {
					font-weight: 600;
					font-size: 20px;
				}
				.userid {
					color: #797979;
					font-size: 17px;
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
		padding: 0 30rpx;
		margin-bottom: 40rpx;
		.logo-img {
			width: 90%;
			height: 160rpx;
			border-radius: 30rpx 30rpx 0 0;
			box-shadow: 0 -6px 2px 0px #45434c;
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
			box-shadow: 0 1.8px 0px 1px #45434c;
			border-top: 1rpx solid #45434c;
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
		padding-bottom: 150rpx;
		.row {
			width: 100%;
			height: 101rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			padding: 10px 30rpx;
			border-radius: 20rpx;
			box-shadow: 0 0px 0px 0.5px #45434c;
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

button {
	/* 清除默认背景和边框 */
	background-color: transparent;
	border: none;
	/* 清除默认圆角 */
	border-radius: 0;
	/* 清除默认内边距（根据需要调整） */
	padding: 0;
	/* 清除点击效果 */
	-webkit-tap-highlight-color: transparent !important;
	tap-highlight-color: transparent !important;
}

/* 清除按钮默认文字样式 */
button::after {
	border: none !important; /* 清除按钮点击时的边框效果 */
}
.button-active {
	opacity: 0.7;
}
</style>
