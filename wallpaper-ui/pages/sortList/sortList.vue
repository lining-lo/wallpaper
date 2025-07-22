<template>
	<navbar />
	<view class="sortlist">
		<!-- 毛玻璃背景 -->
		<view class="sortlist-background"></view>
		<!-- 分类内容列表 -->
		<view class="sortlist-content">
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
			</navigator>
			<navigator url="/pages/preview/preview" class="content-item">
				<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
			</navigator>
		</view>
	</view>
</template>

<script setup>
import navbar from '../../components/navbar.vue';
</script>

<style lang="scss">
.sortlist {
	margin-top: 192rpx;
	width: 100%;
	height: 1200px;
	padding: 30rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.sortlist-background {
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
	/* 分类内容列表 */
	.sortlist-content {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.content-item {
			width: 28.5vw;
			height: 60vw;
			border-radius: 20rpx;
			border: 1px solid #fff;
			margin-bottom: 30rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
