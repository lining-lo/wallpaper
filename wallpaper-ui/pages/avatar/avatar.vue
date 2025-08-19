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
			<view @click="toAvatarDetail(item, index)" class="list-item" v-for="(item, index) in avatarList" :key="index">
				<image :src="item.url" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';
import { selecWallpaperPageByCategoryId } from '../../api/api';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 用户信息
const userInfo = ref({});
// token信息
const token = ref();
// 定义首次加载标记
const isFirstLoad = ref(true);
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');

	// 仅在非首次显示时执行逻辑
	if (!isFirstLoad.value) {
		// 如果需要每次显示都刷新列表（比如更新点赞/收藏状态），可重新调用接口
		// 重置页码为 1，重新加载第一页数据（避免重复叠加）
		avatarListParams.page = 1;
		avatarList.value = []; // 清空原有列表
		isEnd.value = false; // 重置到底状态
		getAvatarList(); // 重新请求数据
	}
});

// 专辑列表
const avatarList = ref([]);
// 是否加载全部
const isEnd = ref(false);

// 获取专辑列表参数
const avatarListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 4,
	category_id: 'K3pR7sT9qL',
	status: 1,
	page: 1,
	pagesize: 24
});
// 获取专辑列表方法
const getAvatarList = async () => {
	if (!isEnd.value) {
		// 从本地存储重新读取一次，避免依赖onShow的时机
		userInfo.value = uni.getStorageSync('userInfo');
		avatarListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
		const result = await selecWallpaperPageByCategoryId(avatarListParams);
		result.map((item) => {
			// 安全解析 labels，避免格式错误导致崩溃
			try {
				item.labels = typeof item.labels === 'string' && item.labels ? JSON.parse(item.labels) : [];
			} catch (err) {
				console.error('解析 labels 失败:', err);
				item.labels = []; // 解析失败时用空数组兜底
			}
			return item;
		});
		// 存入数据
		avatarList.value = [...avatarList.value, ...result];
		uni.setStorageSync('wallpapers', JSON.stringify(avatarList.value));
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};
// 挂载
onLoad((options) => {
	// 获取专辑列表数据
	getAvatarList();

	// 延迟标记非首次，确保在 onShow 之后执行
	nextTick(() => {
		isFirstLoad.value = false;
	});
});
// 触底加载更加专辑数据
onReachBottom(() => {
	avatarListParams.page++;
	getAvatarList();
});

// 跳转到壁纸预览界面
const toAvatarDetail = (item, index) => {
	uni.navigateTo({
		url: `/pages/avatarDetail/avatarDetail?id=${item.id}&index=${index}`
	});
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
