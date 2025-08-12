<template>
	<view class="live">
		<!-- 头部导航 -->
		<view class="live-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>动态壁纸</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 分享列表 -->
		<view class="live-list">
			<view @click="toLiveDetail(item)" class="list-item" v-for="(item, index) in liveList" :key="index">
				<view class="item-img">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
				<view class="item-info">
					<view class="title">{{ item.description }}</view>
					<view class="count">
						<uni-icons type="eye-filled" color="#545454" size="18"></uni-icons>
						<text style="margin-left: 10rpx; color: #545454; font-weight: 600">{{ item.view_count }}</text>
					</view>
				</view>
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
});

// 专辑列表
const liveList = ref([]);
// 是否加载全部
const isEnd = ref(false);

// 获取专辑列表参数
const liveListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 2,
	category_id: 'Q5wE2rT7yU',
	status: 1,
	page: 1,
	pagesize: 20
});
// 获取专辑列表方法
const getliveList = async () => {
	if (!isEnd.value) {
		// 从本地存储重新读取一次，避免依赖onShow的时机
		userInfo.value = uni.getStorageSync('userInfo');
		liveListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
		const result = await selecWallpaperPageByCategoryId(liveListParams);
		// 存入数据
		liveList.value = [...liveList.value, ...result];
		uni.setStorageSync('wallpapers', JSON.stringify(liveList.value));
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};
// 挂载
onLoad((options) => {
	// 获取专辑列表数据
	getliveList();

	// 延迟标记非首次，确保在 onShow 之后执行
	nextTick(() => {
		isFirstLoad.value = false;
	});
});
// 触底加载更加专辑数据
onReachBottom(() => {
	liveListParams.page++;
	getliveList();
});

// 跳转到详情页
const toLiveDetail = (item) => {
	const preview_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/liveDetail/liveDetail?item=${encodeURIComponent(preview_item)}`
	});
};
</script>

<style lang="scss">
.live {
	width: 100%;
	height: 100%;
	background-color: #141414;
	padding: 30rpx;
	padding-top: 192rpx;
	overflow: auto;
	/* 头部导航栏 */
	.live-navbar {
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
	.live-list {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 48%;
			height: 720rpx;
			border-radius: 30rpx;
			background-color: #23232b;
			box-shadow: 0 1px 20px -6px #00000080;
			margin-bottom: 40rpx;
			.item-img {
				width: 100%;
				height: 593rpx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 30rpx 30rpx 0 0;
				}
			}
			.item-info {
				width: 100%;
				height: 127rpx;
				border-radius: 0 0 30rpx 30rpx;
				padding: 0 24rpx;
				.title {
					margin: 14rpx 0 10rpx 0;
				}
				.count {
					display: flex;
					align-items: center;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
