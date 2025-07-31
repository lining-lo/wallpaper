<template>
	<view class="tablet">
		<!-- 头部导航 -->
		<view class="tablet-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>头像</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 分享列表 -->
		<view class="tablet-list">
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=216582298,3602301589&fm=253&fmt=auto&app=138&f=JPEG?w=1280&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=1513068137,1646092566&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=2214390293,1743378790&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=3323616325,3326340828&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=544395028,1162978146&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img1.baidu.com/it/u=602726056,1588251948&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img1.baidu.com/it/u=2017298677,1232869669&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=1168818121,1846403284&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img2.baidu.com/it/u=2977503666,3440827556&fm=253&fmt=auto&app=138&f=JPEG?w=833&h=500" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img1.baidu.com/it/u=1325007346,3701422741&fm=253&fmt=auto&app=138&f=JPEG?w=1422&h=800" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/tabletDetail/tabletDetail" class="list-item">
				<image src="https://img0.baidu.com/it/u=2286122249,2715711643&fm=253&fmt=auto&app=138&f=JPEG?w=874&h=500" mode="aspectFill"></image>
			</navigator>
		</view>
	</view>
</template>

<script setup>
// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss">
.tablet {
	width: 100%;
	height: 100%;
	background-color: #262a50;
	padding: 10rpx;
	padding-top: 192rpx;
	overflow: auto;
	/* 头部导航栏 */
	.tablet-navbar {
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
	/* 分享列表 */
	.tablet-list {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 49.5%;
			height: 140px;
			border-radius: 10rpx;
			background-color: #262a50;
			box-shadow: 0 1px 20px -6px #00000080;
			margin-bottom: 10rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
			.item-title {
				font-size: 13px;
				padding: 20rpx;
				font-weight: 600;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.item-info {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 12px;
				padding: 0 20rpx;
				.info-user {
					display: flex;
					justify-content: space-between;
					align-items: center;
					image {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
					}
					text {
						display: block;
						margin-left: 8rpx;
					}
				}
				.info-like {
					display: flex;
					align-items: center;
					.count {
						margin-left: 8rpx;
					}
				}
			}
		}
	}
}
</style>
