<template>
	<navbar />
	<view class="sort">
		<!-- 排行榜 -->
		<view class="sort-ranking">
			<view @click="toRank(2)" class="ranking-item">
				<text class="title">热门榜</text>
				<text class="english">Hot ranking</text>
			</view>
			<view @click="toRank(0)"class="ranking-item">
				<text class="title">点赞榜</text>
				<text class="english">Like ranking</text>
			</view>
			<view @click="toRank(1)"class="ranking-item">
				<text class="title">收藏榜</text>
				<text class="english">Rating ranking</text>
			</view>
		</view>
		<!-- 标题 -->
		<view class="sort-title">🪁壁纸分类</view>
		<!-- 类型分类 -->
		<view class="sort-tyoe">
			<view class="type-live type" style="background-color: #203440">
				<navigator url="/pages/live/live" class="content">
					<view class="title">动态壁纸</view>
					<view class="english">Live wallpaper</view>
				</navigator>
				<image src="/static/images/sort_live.png" mode="aspectFill"></image>
			</view>
			<view class="type-live type" style="background-color: #27274c">
				<navigator url="/pages/album/album"  class="content">
					<view class="title">专辑</view>
					<view class="english">Special subject</view>
				</navigator>
				<image src="/static/images/sort_album.png" mode="aspectFill"></image>
			</view>
			<view class="type-live type" style="background-color: #655636">
				<navigator url="/pages/tablet/tablet"  class="content">
					<view class="title">平板</view>
					<view class="english">Tablet computer</view>
				</navigator>
				<image src="/static/images/sort_phone.png" mode="aspectFill"></image>
			</view>
			<view class="type-live type" style="background-color: #88383a">
				<navigator url="/pages/avatar/avatar" class="content">
					<view class="title">头像</view>
					<view class="english">Head sculpture</view>
				</navigator>
				<image src="/static/images/sort_avator.png" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 标题 -->
		<view class="sort-title">🎖️分类精选</view>
		<!-- 分类精选 -->
		<view class="sort-list">
			<navigator url="/pages/sortList/sortList" class="list-item" v-for="(item,index) in sort" :key="index">
				<image :src="item.cover" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>{{item.name}}</text>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import { selecCategoryPage } from '../../api/api';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 分类数据
const sort = ref();
// 分页获取分类的参数
const sortParams = reactive({
	type: 0,
	status: 1,
	page: 1,
	pagesize: 100
});
//  分页获取分类方法
const getSort = async () => {
	const result = await selecCategoryPage(sortParams);
	sort.value = result;
	// console.log('sort',sort.value)
};
// 挂载
onLoad(() => {
	getSort();
});

// 跳转到排行榜页面
const toRank = (type)=>{
	uni.navigateTo({
		url: `/pages/rank/rank?type=${type}`
	});
}
</script>

<style lang="scss">
.sort {
	margin-top: 192rpx;
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 排行榜 */
	.sort-ranking {
		width: 100%;
		height: 120rpx;
		position: relative;
		display: flex;
		justify-content: space-between;
		.ranking-item {
			width: 31%;
			height: 100%;
			padding: 12rpx 0;
			background-color: #23232b;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			border-radius: 20rpx;
			box-shadow: 0 1px 20px -6px #00000080;
			.title {
				font-weight: 600;
				font-size: 20px;
			}
			.english {
				font-size: 12px;
			}
		}
	}
	/* 标题 */
	.sort-title {
		position: relative;
		margin: 50rpx 0;
		font-weight: 700;
		font-size: 20px;
	}
	/* 类型分类 */
	.sort-tyoe {
		position: relative;
		width: 100%;
		margin: 30rpx 0;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		.type {
			width: 48%;
			height: 146rpx;
			background-color: pink;
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			.content {
				width: 70%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-left: 30rpx;
				.title {
					font-weight: 600;
					font-size: 18px;
				}
				.english {
					font-size: 12px;
				}
			}
			image {
				margin-top: 30rpx;
				width: 30%;
				height: 80rpx;
				transform: rotate(-45deg);
			}
		}
	}
	/* 分类精选 */
	.sort-list {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 28vw;
			height: 44vw;
			margin-bottom: 30rpx;
			border-radius: 30rpx;
			position: relative;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
			.item-time {
				width: 100%;
				position: absolute;
				top: 0;
				display: flex;
				align-items: center;
				text {
					font-size: 12px;
					background-color: rgba(201, 114, 80, 0.8);
					border-radius: 10px 0 10px 0;
					padding: 2px 4px;
				}
			}
			.item-title {
				width: 100%;
				position: absolute;
				bottom: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8px 0;
				background-color: rgba(40, 40, 40, 1.8);
				border-radius: 0 0 10px 10px;
				text {
					font-size: 13px;
					font-weight: 700;
				}
			}
		}
	}
}
</style>
