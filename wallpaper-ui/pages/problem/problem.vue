<template>
	<view class="problem">
		<!-- 头部导航 -->
		<view class="problem-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>意见反馈</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 反馈内容 -->
		<view class="problem-content">
			<view class="content-type">
				<view @click="changeType(0)" class="type" :class="{ selected: addProblemParams.type === 0 }">意见反馈</view>
				<view @click="changeType(1)" class="type" :class="{ selected: addProblemParams.type === 1 }">需求壁纸</view>
			</view>
			<view class="content-textarea">
				<textarea
					v-model="addProblemParams.content"
					maxlength="200"
					:placeholder="
						addProblemParams.type === 0 ? '请描述您遇到的问题或建议（尽量详细一些，您的反馈是我们进步的动力）' : '请详细描述您想要的壁纸特征（如颜色、风格、元素等）'
					"
				/>
				<view class="textcount">{{ (addProblemParams.content || '').length }}/200</view>
			</view>
		</view>
		<!-- 提交按钮 -->
		<button @click="submit" style="background-color: #08416f; color: #fff; border-radius: 20rpx; margin-top: 30rpx">提交信息</button>
	</view>
</template>

<script setup>
import { addProblem } from '../../api/api';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 用户信息
const userInfo = ref({});
// 添加反馈的参数
const addProblemParams = reactive({
	user_id: userInfo.value.id || '',
	type: 0,
	content: ''
});
// 选择反馈的类型
const changeType = (type = 0) => {
	addProblemParams.type = type;
	console.log(addProblemParams.type);
};
// 挂载
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo
	userInfo.value = uni.getStorageSync('userInfo');
});

// 提交信息
const submit = async () => {
	if (addProblemParams.content.length < 15) {
		return uni.showToast({ title: '内容不得不低于15字', icon: 'none' });
	}
	userInfo.value = uni.getStorageSync('userInfo');
	addProblemParams.user_id = userInfo.value.id || ''; // 优先用最新存储值
    await addProblem(addProblemParams);
	uni.showToast({ title: '提交成功', icon: 'success' });
	addProblemParams.content = '';
};
</script>

<style lang="scss">
.problem {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;

	/* 头部导航栏 */
	.problem-navbar {
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
	/* 反馈内容 */
	.problem-content {
		width: 100%;
		.content-type {
			width: 100%;
			background-color: #2d2d2d;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 10rpx;
			overflow: hidden;
			.type {
				width: 50%;
				padding: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #757575;
				font-weight: 600;
				&.selected {
					color: #2196f3;
					border-bottom: 2px solid #2196f3;
				}
			}
		}
		.content-textarea {
			position: relative;
			padding: 40rpx 0;
			width: 100%;
			height: 560rpx;
			textarea {
				width: 100%;
				height: 100%;
				background-color: #2d2d2d;
				padding: 30rpx 40rpx;
				border-radius: 10rpx;
				color: #757575;
				font-weight: 600;
				line-height: 1.5;
				letter-spacing: 2px;
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
}
</style>
