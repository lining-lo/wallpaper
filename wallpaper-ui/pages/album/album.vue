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
	</view>
</template>

<script setup>
import { selecCategoryPage } from '../../api/api';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 专辑数据
const album = ref();
// 分页获取专辑的参数
const albumParams = reactive({
	current_userId: 'SVQbwK5rd3',
	type: 1,
	page: 1,
	status: 1,
	pagesize: 8
});
//  分页获取专辑方法
const getAlbum = async () => {
	const result = await selecCategoryPage(albumParams);
	album.value = result;
	// console.log('album',album.value)
};
// 挂载
onLoad(() => {
	getAlbum();
});
// 跳转到专辑详情
const toAlbumDetail = (item) => {
	const album_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/albumDetail/albumDetail?item=${encodeURIComponent(album_item)}`
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
}
</style>
