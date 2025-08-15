<template>
	<view class="authordetail">
		<!-- 头部导航 -->
		<view class="authordetail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>用户详情</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 账号信息 -->
		<view class="authordetail-info">
			<view class="info-user">
				<view class="user-left">
					<image v-if="authorInfo.avatar_url" :src="authorInfo.avatar_url" mode="aspectFill"></image>
				</view>
				<view class="user-right">
					<view class="name" v-if="authorInfo.name">{{ authorInfo.name }}</view>
					<view class="label" v-if="authorInfo">
						<view class="row">
							<view class="count">21</view>
							<view class="title">作品</view>
						</view>
						<view class="row">
							<view class="count">149</view>
							<view class="title">获赞</view>
						</view>
						<view class="row">
							<view class="count">4847</view>
							<view class="title">下载</view>
						</view>
					</view>
				</view>
			</view>
			<view class="info-type">
				<view class="title selected">手机</view>
				<view class="title">平板</view>
				<view class="title">头像</view>
			</view>
		</view>
		<!-- 作品列表 -->
		<view class="authordetail-list">
			<view @click="toPreview(item, index)" class="list-item" v-for="(item, index) in works" :key="index">
				<image :src="item.url" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app';
import { getGender } from '../../utils/customize';
import { selecWallpaperPageByUserId } from '../../api/api';
import { reactive, ref } from 'vue';

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

// 作者信息
const authorInfo = ref({});
// 作者的作品
const works = ref([]);
// 获取作者作品的参数
const worksParams = reactive({
	current_userId: '',
	type: 1,
	user_id: '',
	status: 1,
	page: 1,
	pagesize: 9
});
// 是否加载全部
const isEnd = ref(false);
// 获取作者作品的方法
const getWorks = async () => {
	if (!isEnd.value) {
		worksParams.user_id = authorInfo.value.id;
		// 从本地存储重新读取一次，避免依赖onShow的时机
		userInfo.value = uni.getStorageSync('userInfo');
		worksParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
		console.log(worksParams);
		const result = await selecWallpaperPageByUserId(worksParams);
		result.map((item) => {
			item.labels = JSON.parse(item.labels); // 解析labels为数组（假设存的是JSON字符串）
			if (item.is_collected >= 1) {
				item.isFristCollection = false; // 初始化是否首次收藏标记
			} else {
				item.isFristCollection = true; // 初始化是否首次收藏标记
			}
			return item;
		});
		works.value = [...works.value, ...result];
		uni.setStorageSync('wallpapers', JSON.stringify(works.value));
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};
// 挂载
onLoad((options) => {
	// 获取作者信息
	const author_item = JSON.parse(decodeURIComponent(options.item));
	authorInfo.value = author_item;
	// 获取作者作品
	getWorks();
});
// 触底加载更多
onReachBottom(() => {
	worksParams.page++;
	getWorks();
});
// 跳转到壁纸预览界面
const toPreview = (item, index) => {
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${index}`
	});
};
</script>

<style lang="scss">
.authordetail {
	width: 100%;
	min-height: 100vh;
	background-color: #141414;
	padding-top: 200rpx;
	overflow: auto;
	/* 头部导航栏 */
	.authordetail-navbar {
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
	/* 账号信息 */
	.authordetail-info {
		padding-top: 30rpx;
		width: 100%;
		position: fixed;
		top: 178rpx;
		z-index: 1;
		background-color: #141414;
		.info-user {
			padding: 0 30rpx;
			width: 100%;
			margin-bottom: 50rpx;
			display: flex;
			align-items: center;
			.user-left {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				border: 2px solid #fff;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.user-right {
				margin-left: 30rpx;
				width: calc(100% - 192rpx);
				height: 130rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.name {
					font-size: 20px;
					font-weight: 600;
					margin-bottom: 20rpx;
				}
				.label {
					width: 100%;
					display: flex;
					align-items: center;
					font-weight: 600;
					.row {
						display: flex;
						align-items: center;
						margin-right: 20rpx;
						.count {
							margin-right: 10rpx;
						}
						.title {
							color: #797979;
						}
					}
				}
			}
		}
		.info-type {
			width: 100%;
			height: 130rpx;
			background-color: #1e1d1d;
			border-radius: 40rpx 40rpx 0 0;
			padding: 0 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				padding: 10rpx 70rpx;
				background-color: #23232b;
				border-radius: 40rpx;
				&.selected {
					background-color: #444452;
				}
			}
		}
	}
	/* 作品列表 */
	.authordetail-list {
		padding: 0 30rpx;
		padding-top: 340rpx;
		width: 100%;
		min-height: calc(100vh - 200rpx);
		background-color: #1e1d1d;
		display: flex;
		flex-wrap: wrap;
		.list-item {
			width: calc(34% - 20rpx);
			height: 450rpx;
			margin-right: 20rpx;
			margin-bottom: 30rpx;
			border-radius: 20rpx;
			position: relative;
			&:nth-child(3n) {
				margin-right: 0;
			}
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}
}
</style>
