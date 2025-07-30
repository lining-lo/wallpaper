<template>
	<view class="albumdetail">
		<!-- 毛玻璃背景 -->
		<view class="albumdetail-background"></view>
		<!-- 头部导航 -->
		<view class="albumdetail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>壁纸专辑</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 专辑封面 -->
		<view class="albumdetail-cover">
			<image v-if="coverInfo" :src="coverInfo.cover" mode="aspectFill"></image>
			<view class="item-info">
				<view class="info-like">
					<text class="fill"></text>
					<text>12</text>
				</view>
				<view class="info-title">
					<text v-if="coverInfo" class="name">{{ coverInfo.name }}</text>
					<text class="count">208人喜欢</text>
				</view>
			</view>
		</view>
		<!-- 分类内容列表 -->
		<view class="albumdetail-content">
			<view @click="toPreview(item, index)" class="content-item" v-for="(item, index) in albumList" :key="index">
				<image :src="item.url" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { selecWallpaperPageByCategoryId } from '../../api/api';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 封面信息
const coverInfo = ref();
// 专辑列表
const albumList = ref([]);
// 是否加载全部
const isEnd = ref(false);
// 获取专辑列表参数
const albumListParams = reactive({
	type: 1,
	category_id: '',
	status: 1,
	page: 1,
	pagesize: 6
});
// 获取专辑列表方法
const getAlbumList = async () => {
	if (!isEnd.value) {
		// 发送请求
		albumListParams.category_id = coverInfo.value.id;
		const result = await selecWallpaperPageByCategoryId(albumListParams);
		result.map((item) => (item.labels = JSON.parse(item.labels)));
		// 存入数据
		albumList.value = [...albumList.value, ...result];
		uni.setStorageSync('wallpapers', JSON.stringify(albumList.value));
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};
// 挂载
onLoad((options) => {
	// 获取封面信息
	const category_item = JSON.parse(decodeURIComponent(options.item));
	coverInfo.value = category_item;
	// 获取专辑列表数据
	getAlbumList();
});
// 触底加载更加专辑数据
onReachBottom(() => {
	albumListParams.page++;
	getAlbumList();
});

// 跳转到壁纸预览界面
const toPreview = (item, index) => {
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${index}`
	});
};
</script>

<style lang="scss">
.albumdetail {
	width: 100%;
	min-height: 100vh;
	padding-top: 180rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.albumdetail-background {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		filter: blur(40px);
		-webkit-backdrop-filter: blur(40rpx);
		background-image: url(https://img2.baidu.com/it/u=2681334238,2875512996&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=625);
		background-size: cover;
		background-position: center;
	}
	/* 头部导航栏 */
	.albumdetail-navbar {
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
	/* 专辑封面 */
	.albumdetail-cover {
		width: 100%;
		height: 360rpx;
		margin-bottom: 30rpx;
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
			border: 1px solid #fff;
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
