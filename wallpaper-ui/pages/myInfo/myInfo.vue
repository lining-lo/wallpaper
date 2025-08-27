<template>
	<view class="myinfo">
		<!-- 头部导航 -->
		<view class="myinfo-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>个人资料</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 头像 -->
		<view class="myinfo-avatar">
			<button open-type="chooseAvatar" @chooseavatar="onchooseavatar" @error="onAvatarError">
				<image v-if="userInfo" :src="userInfo.avatar_url || '/static/images/avatar.png'" mode="aspectFill"></image>
			</button>
		</view>
		<!-- 基本信息 -->
		<view class="myinfo-base">
			<view class="base-row">
				<view class="label">ID</view>
				<input type="text" v-if="userInfo" disabled :value="userInfo.id" />
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="base-row">
				<view class="label">昵称</view>
				<input type="nickname" maxlength="20" v-if="userInfo" @input="changeName" :value="userInfo.name" placeholder="请填写" />
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
		</view>
		<!-- 提交按钮 -->
		<button
			@click="submit"
			:style="{ backgroundColor: localImg || localName !== userInfo.name ? '#b59d22' : '#46454e' }"
			style="color: #fff; border-radius: 20rpx; margin-top: 40px"
		>
			提交信息
		</button>
	</view>
</template>

<script setup>
import { updateUser, getQiniuToken } from '../../api/api';
import { upload } from '../../api/uploadApi';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 用户信息
const userInfo = ref({});
// 本地头像
const localImg = ref(null);
// 选择头像
const onchooseavatar = (e) => {
	// 本地显示
	localImg.value = e.detail.avatarUrl;
	userInfo.value.avatar_url = e.detail.avatarUrl;
};
// 处理头像选择错误（包括取消操作）
const onAvatarError = (err) => {
	// 只处理用户取消的情况，其他错误仍然抛出
	if (err.detail.errMsg.includes('cancel')) {
		uni.showToast({ title: '已取消选择', icon: 'none' });
	} else {
		uni.showToast({ title: '选择头像失败，请重试', icon: 'none' });
	}
};
// 初始名称
const localName = ref(null);
// 选择姓名
const changeName = (e) => {
	userInfo.value.name = e.detail.value;
};

// 提交信息
const submit = async () => {
	// 图片处理
	if (localImg.value) {
		const {token} = await getQiniuToken();
		const uploadResult = await upload('user_avatar',userInfo.value.avatar_url, token);
		userInfo.value.avatar_url = uploadResult.url;
	}
	if (localImg.value || localName.value !== userInfo.value.name) {
		if(userInfo.value.name.trim() === '') return uni.showToast({ title: '名称不能为空', icon: 'none' });
		// 发送请求
		const updateResult = await updateUser(userInfo.value);
		// 更新用户信息
		uni.setStorageSync('userInfo', userInfo.value);
		setTimeout(function () {
			uni.showToast({ title: '修改成功', icon: 'success' });
		}, 500);
		// 清除数据
		localName.value = userInfo.value.name
		localImg.value = null
	}
};

// 挂载
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo
	userInfo.value = uni.getStorageSync('userInfo');
	localName.value = userInfo.value.name;
});
</script>

<style lang="scss">
.myinfo {
	width: 100%;
	min-height: 100vh;
	background-color: #141414;
	padding: 30rpx 40rpx;
	padding-top: 200rpx;
	overflow: auto;
	/* 头部导航栏 */
	.myinfo-navbar {
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
	/* 头像 */
	.myinfo-avatar {
		width: 100%;
		height: 300rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 50rpx;
		button {
			width: 240rpx;
			height: 240rpx;
			border-radius: 20rpx;
			padding: 0;
			background: transparent;
			image {
				width: 100%;
				height: 100%;
			}
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
				width: 100rpx;
			}
			input {
				width: 300rpx;
			}
		}
	}
}
</style>
