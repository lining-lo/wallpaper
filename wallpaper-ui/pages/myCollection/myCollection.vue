<template>
	<view class="mycollection">
		<!-- 头部导航 -->
		<view class="mycollection-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>下载记录</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 瀑布流列表 -->
		<view class="mycollection-waterfall">
			<!-- 循环渲染列表项 -->
			<navigator url="/pages/mycollectionList/mycollectionList" class="waterfall-item" v-for="(item, index) in collectionWallpapers" :key="index">
				<!-- 主图片（宽度固定，高度自适应） -->
				<image :src="item.url" mode="widthFix" lazy-load class="item-img"></image>
				<!-- 图片类型 -->
				<view class="item-type">
					<text>手机壁纸</text>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script setup>
import { selectUserWallpapers } from '../../api/api';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 下载壁纸数据
const collectionWallpapers = ref([]);
// 下载壁纸参数
const collectionParams = reactive({
	user_id: '',
	type: 1,
	page: 1,
	pagesize: 20
});
// 获取下载壁纸数据
const getCollectionWallpapers = async()=>{
	collectionParams.user_id = userInfo.value.id
	const result = await selectUserWallpapers(collectionParams)
	collectionWallpapers.value = result
}

// 用户信息
const userInfo = ref();
// token信息
const token = ref();
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');
	
	// 获取下载的壁纸数据
	getCollectionWallpapers()
});


</script>

<style lang="scss">
.mycollection {
	margin-top: 180rpx; /* 适配navbar高度 */
	width: 100%;
	min-height: 100vh;
	background-color: #262a50;
	padding: 10rpx;
	box-sizing: border-box; /* 防止padding导致宽度溢出 */
	overflow-x: hidden; /* 隐藏横向滚动条 */

	/* 头部导航栏 */
	.mycollection-navbar {
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

	/* 瀑布流容器：核心样式 */
	.mycollection-waterfall {
		column-count: 2; /* 固定2列 */
		column-gap: 10rpx; /* 列间距 */
		/* 瀑布流子项 */
		.waterfall-item {
			position: relative;
			break-inside: avoid; /* 防止内容被分割 */
			-webkit-break-inside: avoid; /* 兼容小程序 */
			margin-bottom: 10rpx; /* 子项底部间距 */
			border-radius: 20rpx;
			background-color: #262a50;
			box-shadow: 0 1px 20px -6px rgba(0, 0, 0, 0.5);
			overflow: hidden; /* 裁剪超出圆角的内容 */
			/* 主图片样式 */
			.item-img {
				width: 100%;
				max-height: 620rpx;
				display: block; /* 消除图片底部默认间距 */
			}
			/* 图片类型 */
			.item-type {
				position: absolute;
				top: 0;
				left: 0;
				width: 170rpx;
				height: 50rpx;
				background-color: #03a9f4;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 20rpx 0 20rpx 0;
				font-size: 14px;
			}
		}
	}
}
</style>
