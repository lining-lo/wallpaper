<template>
	<navbar />
	<view class="author">
		<!-- 欢迎及介绍 -->
		<navigator url="/pages/poster/poster" class="author-welcome">
			<view class="welcome-title">欢迎创作者分享您的壁纸</view>
			<view class="welcome-tip">
				<text>点击查看详情</text>
			</view>
		</navigator>
		<!-- 创作者列表 -->
		<view class="author-list">
			<view @click="toUserDetail(item)" class="list-item" v-for="(item, index) in userList" :key="index">
				<view class="item-info">
					<view class="info-left">
						<view class="avator">
							<image :src="item.avatar_url" mode="aspectFill"></image>
						</view>
						<view class="name">{{ item.name }}</view>
					</view>
					<view url="/pages/authorDetail/authorDetail" class="info-right">查看全部</view>
				</view>
				<view class="item-works">
					<view class="works-item">
						<image :src="item.work_url_1" mode="aspectFill"></image>
					</view>
					<view class="works-item">
						<image :src="item.work_url_2" mode="aspectFill"></image>
					</view>
					<view class="works-item">
						<image :src="item.work_url_3" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import { selecUserPage } from '../../api/api';
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';

// 是否加载全部
const isEnd = ref(false);
// 用户数据
const userList = ref([]);
// 分页获取用户参数
const userParams = reactive({
	page: 1,
	pagesize: 8
});
// 获取排序列表方法
const getUserList = async () => {
	if (!isEnd.value) {
		const result = await selecUserPage(userParams);
		userList.value = [...userList.value, ...result];
		console.log(userList.value);
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};
// 跳转到用户详情
const toUserDetail = (item) => {
	const author_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/authorDetail/authorDetail?item=${encodeURIComponent(author_item)}`
	});
};
// 挂载
onLoad(() => {
	// 获取用户
	getUserList();
});
// 触底加载更加排序数据
onReachBottom(() => {
	userParams.page++;
	getUserList();
});
</script>

<style lang="scss">
.author {
	margin-top: 192rpx;
	width: 100%;
	height: 100%;
	padding: 30rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 欢迎及介绍 */
	.author-welcome {
		width: 100%;
		height: 240rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		background-image: url(https://img0.baidu.com/it/u=349784041,132589072&fm=253&fmt=auto&app=120&f=JPEG?w=654&h=345);
		background-size: cover;
		background-position: center;
		border-radius: 40rpx;
		padding: 12rpx 30rpx;
		font-family: cursive;
		box-shadow: 0 -2px 4px 0px #626069;
		.welcome-title {
			width: fit-content;
			font-weight: 700;
			background-color: rgba(40, 40, 40, 0.8);
			font-size: 20px;
		}
		.welcome-tip {
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			text {
				padding: 8rpx 30rpx;
				background-color: #050506;
				border-radius: 40rpx;
				font-weight: 500;
				font-size: 14px;
			}
		}
	}
	/* 创作者列表 */
	.author-list {
		width: 100%;
		margin: 80rpx 0;
		position: relative;
		.list-item {
			width: 100%;
			height: 446rpx;
			border-radius: 30rpx;
			padding: 0 20rpx 20rpx 20rpx;
			margin-bottom: 100rpx;
			box-shadow: 0 0px 0px 2px #343335;
			.item-info {
				width: 100%;
				height: 78rpx;
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;
				.info-left {
					display: flex;
					position: relative;
					.avator {
						position: absolute;
						top: -60rpx;
						width: 112rpx;
						height: 112rpx;
						border-radius: 50%;
						image {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
						border: 2px solid #fff;
					}
					.name {
						margin-left: 140rpx;
						font-size: 18px;
						font-weight: 600;
						max-width: 300rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				.info-right {
					font-size: 13px;
					color: #b8b8b9;
				}
			}
			.item-works {
				width: 100%;
				height: 330rpx;
				display: flex;
				justify-content: space-between;
				.works-item {
					width: 32%;
					height: 100%;
					border-radius: 10rpx;
					background-color: #2c2c2c;
					image {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
				}
			}
		}
	}
}
</style>
