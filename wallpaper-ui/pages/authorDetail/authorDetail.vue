<template>
	<view class="authordetail">
		<!-- 毛玻璃背景 -->
		<view class="authordetail-background"></view>
		<!-- 头部导航 -->
		<view class="authordetail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>用户详情</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 账号信息 -->
		<view class="authordetail-info">
			<view class="info-left">
				<image v-if="userInfo.avatar_url" :src="userInfo.avatar_url" mode="aspectFill"></image>
			</view>
			<view class="info-right">
				<view class="name" v-if="userInfo.name">{{ userInfo.name }}</view>
				<view class="userid" v-if="userInfo.id">id：{{ userInfo.id }}</view>
				<view class="sex" v-if="userInfo">性别：{{ getGender(userInfo.gender) }}</view>
			</view>
		</view>
		<!-- 标语 -->
		<view class="authordetail-slogan" v-if="userInfo.motto">{{ userInfo.motto }}</view>
		<!-- 反馈信息 -->
		<view class="authordetail-feedback">
			<view class="feedback-follow feedback">
				<view class="count">525</view>
				<view class="label">关注</view>
			</view>
			<view class="feedback-fans feedback">
				<view class="count">35</view>
				<view class="label">粉丝</view>
			</view>
			<view class="feedback-like feedback">
				<view class="count">1525</view>
				<view class="label">获赞</view>
			</view>
			<view class="feedback-favorites feedback">
				<view class="count">2525</view>
				<view class="label">下载</view>
			</view>
			<view class="feedback-followbtn">关注</view>
			<view class="feedback-call">
				<uni-icons type="search" color="#fff"></uni-icons>
			</view>
		</view>
		<!-- 选项按钮 -->
		<view class="authordetail-selects">
			<view class="work selected">手机(6)</view>
			<view class="album">平板(0)</view>
			<view class="album">头像(0)</view>
			<view class="statement">
				<uni-icons type="info" size="22" color="#fff"></uni-icons>
				<text style="margin-left: 4px">声明</text>
			</view>
		</view>
		<!-- 作品列表 -->
		<view class="authordetail-works">
			<view @click="toPreview(item, index)" v-for="(item, index) in works" :key="index" class="works-item">
				<image :src="item.url" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { getGender } from '../../utils/customize';
import { selecWallpaperPageByUserId } from '../../api/api';
import { reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 用户信息
const userInfo = ref({});
// 用户的作品
const works = ref([]);
// 获取用户作品的参数
const worksParams = reactive({
	type: 1,
	user_id: '',
	status: 1,
	page: 1,
	pagesize: 9
});
// 是否加载全部
const isEnd = ref(false);
// 获取用户作品的方法
const getWorks = async () => {
	if (!isEnd.value) {
		worksParams.user_id = userInfo.value.id;
		const result = await selecWallpaperPageByUserId(worksParams);
		result.map(item => item.labels = JSON.parse(item.labels))
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
	// 获取用户信息
	const user_item = JSON.parse(decodeURIComponent(options.item));
	userInfo.value = user_item;
	// 获取用户作品
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
	background-color: #2c333e;
	padding: 30rpx;
	padding-top: 200rpx;
	overflow: auto;
	/* 毛玻璃背景 */
	.authordetail-background {
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
	.authordetail-navbar {
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
	/* 账号信息 */
	.authordetail-info {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		.info-left {
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
		.info-right {
			margin-left: 30rpx;
			width: calc(100% - 180rpx);
			height: 130rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.name {
				font-weight: 600;
			}
			.userid {
				color: #797979;
				font-size: 12px;
			}
			.sex {
				color: #797979;
				font-size: 12px;
			}
		}
	}
	/* 标语 */
	.authordetail-slogan {
		position: relative;
		font-size: 14px;
		color: #797979;
		margin-bottom: 30rpx;
	}
	/* 反馈信息 */
	.authordetail-feedback {
		width: 100%;
		height: 120rpx;
		margin-bottom: 4rpx;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.feedback {
			display: flex;
			flex-direction: column;
			align-items: center;
			.count {
			}
			.label {
				font-size: 14px;
				color: #797979;
			}
		}
		.feedback-followbtn {
			background-color: #ff6243;
			padding: 8rpx 24rpx;
			border-radius: 20rpx;
			font-size: 14px;
		}
		.feedback-call {
			padding: 5rpx 16rpx;
			border-radius: 20rpx;
			border: 1px solid #fff;
		}
	}
	/* 选项按钮 */
	.authordetail-selects {
		position: relative;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px dotted #fff;
		padding-bottom: 20rpx;
		margin-bottom: 30rpx;
		.work,
		.album {
			padding: 10rpx 31rpx;
			border-radius: 40rpx;
			&.selected {
				background-color: #6849ff;
			}
		}
		.share,
		.statement {
			display: flex;
			align-items: center;
		}
	}
	/* 作品列表 */
	.authordetail-works {
		position: relative;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.works-item {
			width: calc(34% - 20rpx);
			height: 350rpx;
			margin-right: 20rpx;
			margin-bottom: 30rpx;
			border-radius: 20rpx;
			border: 1px solid #fff;
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
