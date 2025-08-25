<template>
	<view class="albumdetail">
		<!-- 头部导航 -->
		<view class="albumdetail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>壁纸专辑</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 专辑封面 -->
		<view class="albumdetail-cover">
			<image v-if="coverInfo" :src="coverInfo.cover" mode="aspectFill"></image>
			<view class="item-info">
				<view class="info-like">
					<text class="fill"></text>
					<text v-if="coverInfo">{{ coverInfo.wallpaper_count }}</text>
				</view>
				<view class="info-title">
					<text v-if="coverInfo" class="name">{{ coverInfo.name }}</text>
					<text class="count" v-if="coverInfo">{{ coverInfo.total_likes }}人喜欢</text>
				</view>
			</view>
		</view>
		<!-- 专辑内容列表 -->
		<view class="albumdetail-content">
			<view @click="toPreview(item, index)" class="content-item" v-for="(item, index) in albumList" :key="index">
				<image :src="item.url" lazy-load mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { getRandomID } from '../../utils/customize';
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

// 封面信息
const coverInfo = ref();
// 专辑列表
const albumList = ref([]);
// 是否加载全部
const isEnd = ref(false);

// 获取专辑列表参数
const albumListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 1,
	category_id: '',
	status: 1,
	page: 1,
	pagesize: 9
});
// 获取专辑列表方法
const getAlbumList = async () => {
	if (!isEnd.value) {
		// 发送请求
		albumListParams.category_id = coverInfo.value.id;
		// 从本地存储重新读取一次，避免依赖onShow的时机
		userInfo.value = uni.getStorageSync('userInfo');
		albumListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
		const result = await selecWallpaperPageByCategoryId(albumListParams);
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
		albumList.value = [...albumList.value, ...result];
		uni.setStorageSync(fromPage.value, JSON.stringify(albumList.value));
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};
// 页面唯一标识
const fromPage = ref('')
// 挂载
onLoad((options) => {
	// 获取唯一标识
	fromPage.value = 'albumdetail-' + getRandomID()
	
	// 获取封面信息
	const category_item = JSON.parse(decodeURIComponent(options.item));
	coverInfo.value = category_item;
	// 获取专辑列表数据
	getAlbumList();
});
// 销毁页面时
onUnload(() => {
	uni.removeStorageSync(fromPage.value);
});
// 触底加载更加专辑数据
onReachBottom(() => {
	albumListParams.page++;
	getAlbumList();
});

// 跳转到壁纸预览界面
const toPreview = (item, index) => {
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${index}&from=${encodeURIComponent(fromPage.value)}`
	});
};
</script>

<style lang="scss">
.albumdetail {
	width: 100%;
	min-height: 100vh;
	padding-top: 180rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.albumdetail-navbar {
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
	/* 专辑封面 */
	.albumdetail-cover {
		width: 100%;
		height: 360rpx;
		margin-bottom: 10rpx;
		position: relative;
		image {
			width: 100%;
			height: 100%;
		}
		.item-info {
			width: 100%;
			height: 100%;
			padding: 50rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: absolute;
			top: 0;
			.info-title {
				display: flex;
				justify-content: space-between;
				.name {
					font-weight: 700;
					background-color: rgb(40, 40, 40, 0.8);
					font-size: 20px;
					font-family: cursive;
				}
				.count {
					display: flex;
					align-items: center;
					font-size: 12px;
					padding: 0 8px;
					background-color: rgba(40, 40, 40, 0.8);
					border-radius: 10px;
				}
			}
			.info-like {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				text {
					font-size: 12px;
					padding: 4px 16px;
					background-color: rgba(40, 40, 40, 0.8);
					border-radius: 20px;
				}
			}
		}
	}
	/* 分类内容列表 */
	.albumdetail-content {
		padding: 30rpx;
		position: relative;
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.content-item {
			width: 214rpx;
			height: 450rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}
}
</style>
