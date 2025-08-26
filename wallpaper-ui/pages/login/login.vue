<template>
	<view class="login">
		<view class="login-inner">
			<view class="inner-logo">
				<image src="/static/images/logo.png" mode="aspectFill"></image>
			</view>
			<view class="inner-btn">
				<button class="btn-login btn" @click="toLogin">
					<uni-icons type="weixin" size="32" color="#07b55a"></uni-icons>
					<text>一键登录</text>
				</button>
				<button class="btn-back btn" @click="goBack">
					<uni-icons type="undo-filled" size="32" color="#3b7cb5"></uni-icons>
					<text>暂不登录</text>
				</button>
				<view class="inner-agreement">
					<checkbox-group @change="handleAgreeChange">
						<label>
							<checkbox value="cb" :checked="isAgree" color="#FFCC33" style="transform: scale(0.7)" />
						</label>
					</checkbox-group>
					<view class="text">
						同意
						<navigator style="color: #547894; padding: 0 6rpx" url="/pages/live/live">用户协议</navigator>
						和
						<navigator style="color: #547894; padding: 0 6rpx" url="/pages/live/live">隐私政策</navigator>
						条款
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { login } from '../../api/api';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 是否同意协议
const isAgree = ref(false);
// 处理协议是否勾选
const handleAgreeChange = (e) => {
	// e.detail.value 是一个数组，包含所有被选中的 checkbox 的 value
	// 这里只有一个 checkbox，所以判断数组长度即可
	isAgree.value = e.detail.value.length > 0;
};

// 微信一键登录
const toLogin = async () => {
	if (!isAgree.value) {
		// 显示模态框，且后续逻辑必须在回调中执行
		uni.showModal({
			title: '提示',
			content: '请先阅读并同意用户协议和隐私政策条款',
			success: async function (res) {
				// 注意这里添加 async
				if (res.confirm) {
					isAgree.value = true;
					// 用户确认后，才执行登录逻辑
					await handleLogin(); // 提取登录逻辑到单独函数
				} else if (res.cancel) {
					isAgree.value = false;
					// 用户取消，不执行登录
					return;
				}
			}
		});
		// 这里直接 return，阻止代码继续往下执行
		return;
	}

	// 如果已经同意协议，直接执行登录
	await handleLogin();
};
// 处理登录的逻辑
const handleLogin = async () => {
	// 调用微信登录接口获取 code
	const { code } = await uni.login({ provider: 'weixin' });
	if (!code) {
		uni.showToast({ title: '登录失败', icon: 'none' });
		return;
	}
	// 将 code 发送到后端
	const result = await login({ code });
	// 存储后端返回的Token和用户信息
	uni.setStorageSync('token', result.token);
	uni.setStorageSync('userInfo', result.userInfo);
	uni.showToast({ title: '登录成功' });
	// 返回之前的页面
	uni.navigateBack();
};

// 挂载
onLoad(() => {});
</script>

<style lang="scss">
.login {
	width: 100%;
	height: 100vh;
	background-color: #141414;
	padding-top: 200rpx;
	overflow: auto;
	position: relative;
	background-image: url('https://img1.baidu.com/it/u=164719841,4001633826&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1084');
	background-size: cover;
	background-position: center; 
	.login-inner {
		width: 100%;
		height: 50%;
		padding: 30rpx;
		position: absolute;
		top: 16vh;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		.inner-logo {
			width: 100%;
			height: 30%;
			display: flex;
			align-items: center;
			justify-content: center;
			image {
				width: 80%;
				height: 80%;
			}
		}
		.inner-btn {
			width: 80%;
			height: 50%;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.btn {
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding-right: 100rpx;
				&.btn-login {
					background-color: #275607;
				}
				&.btn-back {
					background-color: #2d2d29;
				}
				text {
					margin-left: 10rpx;
					font-size: 20px;
				}
			}
		}
		.inner-agreement {
			display: flex;
			.text {
				color: #797979;
				display: flex;
			}
		}
	}
}
</style>
