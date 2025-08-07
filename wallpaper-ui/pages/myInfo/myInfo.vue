<template>
	<view class="myinfo">
		<!-- 头部导航 -->
		<view class="myinfo-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>个人信息</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 上传按钮 -->
		<!-- <button class="upload-btn" @click="selectFile">
			<uni-icons type="plus" size="24"></uni-icons>
			<text>选择文件</text>
		</button> -->
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
			<view class="base-row">
				<view class="label">性别</view>
				<input type="text" @click="changeGender(1)" v-if="userInfo" disabled :value="['女生', '男生'][userInfo.gender]" placeholder="请选择" />
				<uni-icons type="right" size="16" color="#fff"></uni-icons>
			</view>
			<view class="base-textarea">
				<textarea v-model="userInfo.motto" maxlength="200" placeholder="对自己进行自我介绍，越详细越受欢迎哦。" />
				<view class="textcount">{{ (userInfo.motto || '').length }}/200</view>
			</view>
		</view>
		<!-- 提交按钮 -->
		<button @click="submit" style="background-color: #7d68fe; color: #fff; border-radius: 20rpx; margin-top: 30rpx">提交信息</button>
		<!-- 性别选择弹窗 -->
		<uni-popup type="bottom" ref="popupInfo" :safe-area="false" borderRadius="20rpx 20rpx 0 0" background-color="#fff">
			<view class="inner">
				<view class="title">您的性别是？</view>
				<view class="selection">
					<button :class="{ selected: userInfo.gender !== 0 }" @click="changeGender(0, 1)">男生</button>
					<button :class="{ selected: userInfo.gender === 0 }" @click="changeGender(0, 0)">女生</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { updateUser, getQiniuToken } from '../../api/api';
import { upload } from '../../api/uploadApi';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 选择文件
const selectFile = () => {
	uni.chooseMessageFile({
		count: 5, // 最多选择5个文件
		type: 'all', // 可选类型：all, image, video, file
		extension: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'], // 允许的文件后缀
		success: (res) => {
			userInfo.value.avatar_url = res.tempFiles[0].path;
		},
		fail: (err) => {
			uni.showToast({ title: '选择文件失败', icon: 'none' });
			console.error('小程序选择文件失败:', err);
		}
	});
};

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 用户信息
const userInfo = ref({});
// 选择头像
const onchooseavatar = (e) => {
	// 本地显示
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
// 选择姓名
const changeName = (e) => {
	userInfo.value.name = e.detail.value;
};
// 性别弹窗dom
const popupInfo = ref();
// 选择性别
const changeGender = (option, gender) => {
	if (option === 1) {
		popupInfo.value.open();
	} else {
		userInfo.value.gender = gender;
		popupInfo.value.close();
	}
};
// 提交信息
const submit = async () => {
	// 图片处理
	const { token } = await getQiniuToken();
	// console.log('token', token);
	const uploadResult = await upload('avatar', userInfo.value.avatar_url, token);
	userInfo.value.avatar_url = uploadResult.url;

	// 发送请求
	const updateResult = await updateUser(userInfo.value);
	// 更新用户信息
	uni.setStorageSync('userInfo', userInfo.value);
	setTimeout(function () {
		uni.showToast({ title: '修改成功', icon: 'success' });
	}, 500);
};

// 挂载
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo
	userInfo.value = uni.getStorageSync('userInfo');
});
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
		button {
			width: 200rpx;
			height: 200rpx;
			border-radius: 50%;
			background-color: #7d68fe;
			padding: 0;
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
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
				width: 80rpx;
			}
			input {
				width: 300rpx;
			}
		}
		.base-textarea {
			position: relative;
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
			.textcount {
				position: absolute;
				bottom: 60rpx;
				right: 40rpx;
				color: gray;
				font-size: 14px;
			}
		}
	}
	/* 性别选择弹窗 */
	uni-popup {
		width: 100%;
		.inner {
			width: 100%;
			height: 600rpx;
			padding: 40rpx;
			.title {
				text-align: center;
				font-size: 20px;
				font-weight: 600;
				margin-bottom: 40rpx;
				color: black;
			}
			.selection {
				width: 100%;
				height: 400rpx;
				button {
					margin-bottom: 30rpx;
					border-radius: 40rpx;
					&.selected {
						background-color: #7d68fe;
						color: #fff;
					}
				}
			}
		}
	}
}
</style>
