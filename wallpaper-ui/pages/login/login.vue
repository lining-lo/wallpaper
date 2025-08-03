<template>
	<view class="login">
		<view class="login-inner">
			<view class="inner-logo">
				<image src="/static/images/logo.png" mode="aspectFill"></image>
			</view>
			<view class="inner-btn">
				<button class="btn-login btn">
					<uni-icons type="weixin" size="32" color="#07b55a"></uni-icons>
					<text>一键登录</text>
				</button>
				<button class="btn-back btn" @click="goBack">
					<uni-icons type="undo-filled" size="32" color="#3b7cb5"></uni-icons>
					<text>暂不登录</text>
				</button>
				<view class="inner-agreement">
					<checkbox-group>
						<label>
							<checkbox value="cb" :checked="true" color="#FFCC33" style="transform: scale(0.7)" />
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
// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss">
.login {
	width: 100%;
	height: 100vh;
	background-color: #232749;
	padding-top: 200rpx;
	overflow: auto;
	position: relative;
	.login-inner {
		width: 100%;
		height: 50%;
		padding: 30rpx;
		position: absolute;
		top: 12vh;
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
					background-color: #444067;
				}
				&.btn-back {
					background-color: #395869;
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
