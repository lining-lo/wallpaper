<template>
	<navbar />
	<view class="sort">
		<!-- 毛玻璃背景 -->
		<view class="sort-background"></view>
		<!-- 排行榜 -->
		<view class="sort-ranking">
			<navigator url="/pages/rank/rank" class="ranking-item">
				<text class="title">热门榜</text>
				<text class="english">Hot ranking</text>
			</navigator>
			<navigator url="/pages/rank/rank" class="ranking-item">
				<text class="title">点赞榜</text>
				<text class="english">Like ranking</text>
			</navigator>
			<navigator url="/pages/rank/rank" class="ranking-item">
				<text class="title">收藏榜</text>
				<text class="english">Rating ranking</text>
			</navigator>
		</view>
		<!-- 分类精选 -->
		<view class="sort-list">
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
			<navigator url="/pages/sortList/sortList" class="list-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				<view class="item-time">
					<text>2天前更新</text>
				</view>
				<view class="item-title">
					<text>可爱萌宠</text>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script setup>
	import navbar from '../../components/navbar.vue';
</script>

<style lang="scss">
.sort {
	margin-top: 192rpx;
	width: 100%;
	height: 100%;
	padding: 30rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.sort-background {
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
			background-color: #262a50;
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
	/* 分类精选 */
	.sort-list {
		width: 100%;
		margin: 60rpx 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 28vw;
			height: 44vw;
			margin-bottom: 30rpx;
			border-radius: 30rpx;
			border: 1px solid #fff;
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
