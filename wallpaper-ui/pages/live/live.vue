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
			<view @click="toLiveDetail(item,index)" class="list-item" v-for="(item, index) in liveList" :key="index">
				<view class="item-img">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
				<view class="item-info">
					<view class="title">{{ item.title }}</view>
					<view class="count">
						<view class="row">
							<uni-icons v-if="item.is_downloaded >= 1" type="cloud-download-filled" color="#2196f3" size="16"></uni-icons>
							<uni-icons v-else type="cloud-download" color="#2196f3" size="16"></uni-icons>
							<text style="margin-left: 10rpx; color: #fff">{{ item.download_count }}</text>
						</view>
						<view class="row">
							<uni-icons  v-if="item.is_liked >= 1"  type="heart-filled" color="#ed1c24" size="16"></uni-icons>
							<uni-icons v-else type="heart" color="#ed1c24" size="16"></uni-icons>
							<text style="margin-left: 10rpx; color: #fff">{{ item.like_count }}</text>
						</view>
						<view class="row">
							<uni-icons v-if="item.is_collected >= 1" type="star-filled" color="#ffff7f" size="16"></uni-icons>
							<uni-icons v-else type="star" color="#ffff7f" size="16"></uni-icons>
							<text style="margin-left: 10rpx; color: #fff">{{ item.collect_count }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onShow, onReachBottom,onUnload } from '@dcloudio/uni-app';
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
		// 处理数据
		const processedResult = result.map((item) => {
			// 安全解析 labels
			try {
				const labels = typeof item.labels === 'string' && item.labels ? JSON.parse(item.labels) : [];
				item.labels = labels;
				item.title = labels.join('·');
			} catch (err) {
				console.error('解析 labels 失败:', err);
				item.labels = [];
			}
			return item;
		});
		// 存入数据
		liveList.value = [...liveList.value, ...result];
		uni.setStorageSync('live-wallpapers', JSON.stringify(liveList.value));
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
});
// 销毁页面时
onUnload(() => {
	uni.removeStorageSync('live-wallpapers');
});
// 触底加载更加专辑数据
onReachBottom(() => {
	liveListParams.page++;
	getliveList();
});

// 跳转到详情页
const toLiveDetail = (item, index) => {
	const from = 'live-wallpapers';
	const preview_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/liveDetail/liveDetail?id=${item.id}&index=${index}&from=${encodeURIComponent(from)}`
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
					margin: 20rpx 0 14rpx 0;
					font-size: 13px;
					color: #fff;
					font-weight: 600;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.count {
					display: flex;
					align-items: center;
					font-size: 11px;
					.row {
						margin-right: 20rpx;
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}
}
</style>
