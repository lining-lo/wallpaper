<template>
	<view class="album">
		<!-- 头部导航 -->
		<view class="album-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>壁纸专辑</text>
			<view></view>
		</view>
		<!-- 专辑列表 -->
		<view class="album-list">
			<view @click="toAlbumDetail(item)" class="list-item" v-for="(item, index) in album" :key="index">
				<image :src="item.cover" lazy-load mode="aspectFill"></image>
				<view class="item-info">
					<view class="info-title">
						<text class="name">{{ item.name }}</text>
						<text class="count">{{ item.wallpaper_count }}</text>
					</view>
					<view class="info-like">
						<text>{{ item.total_likes }}人喜欢</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载提示 -->
		<view class="loading" v-if="isLoading">加载中...</view>
		<!-- 到底提示 -->
		<view class="end-tip" v-if="isEnd && album.length > 0">已经到底啦~</view>
		<!-- 前往顶部 -->
		<view class="tools-top" :class="{ 'is-visible': isShow }" @click="toTop">
			<image src="/static/images/top.png" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script setup>
import { selecCategoryPage } from '../../api/api';
import { onLoad, onPageScroll,onReachBottom } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 专辑数据
const album = ref([]);
// 加载状态控制
const isLoading = ref(false);
// 是否加载全部
const isEnd = ref(false);
// 分页获取专辑的参数
const albumParams = reactive({
	current_userId: 'SVQbwK5rd3',
	type: 1,
	page: 1,
	status: 1,
	pagesize: 12
});
//  分页获取专辑方法
const getAlbum = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			const result = await selecCategoryPage(albumParams);
			// 存入数据
			album.value = [...album.value, ...result];
			// 是否到底
			if (result.length === 0) {
				isEnd.value = true;
			}
		} catch (error) {
			console.error('获取数据失败:', error);
			// 失败时回退页码，方便重试
			shareListParams.page--;
		} finally {
			isLoading.value = false; // 解锁加载状态
		}
	}
};
// 挂载
onLoad(() => {
	getAlbum();
});
// 触底加载更加排序数据
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		albumParams.page++;
		getAlbum();
	}
});
// 跳转到专辑详情
const toAlbumDetail = (item) => {
	const album_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/albumDetail/albumDetail?item=${encodeURIComponent(album_item)}`
	});
};

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
.album {
	width: 100%;
	height: 100%;
	padding: 40rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.album-navbar {
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
	/* 专辑列表 */
	.album-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 100%;
		.list-item {
			width: 100%;
			height: 358rpx;
			margin-bottom: 30rpx;
			border-radius: 20rpx;
			position: relative;
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
			.item-info {
				width: 100%;
				height: 100%;
				padding: 30rpx;
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
					text {
						font-size: 12px;
						padding: 4px 16px;
						background-color: rgba(40, 40, 40, 0.8);
						border-radius: 20px;
					}
				}
			}
		}
	}
	/* 加载提示样式 */
	.loading {
		color: #fff;
		text-align: center;
		padding: 20rpx 0;
		font-size: 14px;
	}
	/* 到底提示样式 */
	.end-tip {
		color: #888;
		text-align: center;
		padding: 30rpx 0;
		padding-bottom: 100rpx;
		font-size: 14px;
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
