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
							<image :src="item.avatar_url" lazy-load mode="aspectFill"></image>
						</view>
						<view class="name">{{ item.name }}</view>
					</view>
					<view url="/pages/authorDetail/authorDetail" class="info-right">查看全部</view>
				</view>
				<view class="item-works">
					<view class="works-item">
						<image :src="item.work_url_1" lazy-load mode="aspectFill"></image>
					</view>
					<view class="works-item">
						<image :src="item.work_url_2" lazy-load mode="aspectFill"></image>
					</view>
					<view class="works-item">
						<image :src="item.work_url_3" lazy-load mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="recommend-list">
				<view @click="toPreview(item, index)" class="list-item" v-for="(item, index) in rankList" :key="index">
					<image :src="item.url" lazy-load mode="aspectFill"></image>
				</view>
			</view>
			<!-- 加载提示 -->
			<view class="loading" v-if="isLoading">——————&nbsp;&nbsp;加载中...&nbsp;&nbsp;——————</view>
			<!-- 到底提示 -->
			<view class="end-tip" :style="{ opacity: isEnd && userList.length > 0 ? '1' : '0' }">——————&nbsp;&nbsp;已经到底啦~&nbsp;&nbsp;——————</view>
		</view>
		<!-- 前往顶部 -->
		<view class="tools-top" :class="{ 'is-visible': isShow }" @click="toTop">
			<image src="/static/images/top.png" mode="aspectFill"></image>
		</view>
	</view>
	<tabbar />
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import tabbar from '../../components/tabbar.vue';
import { selecUserPage } from '../../api/api';
import { onLoad, onShow, onReachBottom, onPageScroll } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';

// 是否加载全部
const isEnd = ref(false);
// 创作者数据
const userList = ref([]);
// 加载状态控制
const isLoading = ref(false);
// 分页获取创作者参数
const userParams = reactive({
	page: 1,
	pagesize: 12
});
// 获取创作者列表方法
const getUserList = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			const result = await selecUserPage(userParams);
			userList.value = [...userList.value, ...result];
			console.log(userList.value);
			// 是否到底
			if (result.length === 0) {
				isEnd.value = true;
			}
		} catch (error) {
			console.error('获取数据失败:', error);
			// 失败时回退页码，方便重试
			userParams.page--;
		} finally {
			isLoading.value = false; // 解锁加载状态
		}
	}
};
// 跳转到创作者详情
const toUserDetail = (item) => {
	const author_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/authorDetail/authorDetail?item=${encodeURIComponent(author_item)}`
	});
};
// 挂载
onLoad(() => {
	// 获取创作者
	getUserList();
});
// 触底加载更加排序数据
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		userParams.page++;
		getUserList();
	}
});

// 存储当前滚动高度（px 单位）
const currentScrollTop = ref(0);
// 显示与隐藏图标
const isShow = ref(false);
// 实时监听页面滚动，获取滚动高度
onPageScroll((e) => {
	// e.scrollTop 即为当前页面滚动高度（px 单位）
	currentScrollTop.value = e.scrollTop;
	if (e.scrollTop >= 20) {
		isShow.value = true;
	} else {
		isShow.value = false;
	}
});
// 回到顶部核心方法
const toTop = () => {
	uni.pageScrollTo({
		scrollTop: 0, // 滚动到顶部的距离（必须为 0，代表最顶部）
		duration: 300 // 滚动动画时长（单位 ms，可选，0 表示无动画）
	});
};
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
		margin-top: 80rpx;
		position: relative;
		padding-bottom: 140rpx;
		.list-item {
			width: 100%;
			height: 446rpx;
			border-radius: 30rpx;
			padding: 0 20rpx 20rpx 20rpx;
			margin-bottom: 60rpx;
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
		/* 到底提示样式 */
		.loading,
		.end-tip {
			color: #888;
			text-align: center;
			padding: 30rpx 0;
			padding-bottom: 52rpx;
			font-size: 14px;
			width: 100%;
		}
	}
	/* 前往顶部 */
	.tools-top {
		/* 基础定位 */
		position: fixed;
		bottom: 260rpx;
		right: 30rpx; // 最终停靠位置
		z-index: 999;
		width: 82rpx;
		height: 82rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.5);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;

		/* 隐藏状态（右侧外部） */
		transform: translateX(150rpx); // 向右偏移150rpx（超出屏幕）
		opacity: 0;
		visibility: hidden; // 不响应点击

		/* 动画过渡 */
		transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease, visibility 1s ease;

		/* 图标样式 */
		image {
			width: 60%;
			height: 60%;
		}

		/* 显示状态（从右侧滑入） */
		&.is-visible {
			transform: translateX(0); // 回到正常位置
			opacity: 1;
			visibility: visible;
		}

		/* 点击反馈 */
		&:active {
			transform: translateX(0) scale(0.95);
		}
	}
}
</style>
