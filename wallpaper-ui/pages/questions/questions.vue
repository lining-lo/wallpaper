<template>
	<view class="questions">
		<!-- 头部导航 -->
		<view class="questions-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>常见问题</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 协议内容 -->
		<view class="questions-content">
			<view class="row" v-for="(item, index) in questions" :key="index">
				<view class="label" @click="toggleItem(item)">
					<text>{{ item.title }}</text>
					<uni-icons 
						:type="item.isShow ? 'up' : 'down'" 
						size="20" 
						color="#fff"
						transition: transform 0.3s ease;
					></uni-icons>
				</view>
				<view 
					class="text" 
					:class="{ 'text-visible': item.isShow }"
				>
					<view class="text-content">{{ item.content }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 切换显示状态并添加动画
const toggleItem = (item) => {
	item.isShow = !item.isShow;
};

// 协议内容
const questions = ref([
	{
		title: '⛳ 壁纸永久免费？',
		content: '所有壁纸免费下载，不收取任何费用～因存储成本较高，下载前需观看几秒视频广告支持运营哦～ 记得每天登录领免费能量呀～ ',
		isShow: true
	},
	{
		title: '⛳ 壁纸下载失败？',
		content: '若遇到壁纸下载时一直转圈无法完成或者提示下载失败的情况，可按以下步骤尝试解决：在微信首页下拉 → 找到「我的小程序」→ 长按本小程序删除，重新进入后再试即可～',
		isShow: true
	},
	{
		title: '⛳ 如何设置动态壁纸？',
		content: '1.Android 设备：设置 → 壁纸 → 动态壁纸 / Live Wallpapers → 选择壁纸 → 设置为主屏幕 / 锁屏。2.iOS 设备：设置 → 墙纸 → 选择新墙纸 → 切换至 “动态” 分类 → 选壁纸 → 设置为锁屏 / 主屏幕（或同时设置）。',
		isShow: true
	},
	{
		title: '⛳ 图片加载慢？',
		content: '1.优先使用 WiFi 网络  2.避免高峰时段（12:00-14:00）3.清理小程序缓存',
		isShow: true
	},
	{
		title: '⛳ 找不到想要的壁纸？',
		content: '1.使用「需求壁纸」功能 (我的 → 意见反馈 → 需求壁纸)  2.通过在线客服说明需求 (我的 → 在线客服)  3.联系管理员定制 (需 3-5 个工作日)',
		isShow: true
	},
	{
		title: '⛳ 问题反馈？',
		content: '您可以多渠道联系我们：1.在线客服：每日 9:00-21:00  2.邮箱支持: 2092576148@qq.com 提交您的宝贵建议',
		isShow: true
	}
]);
</script>

<style lang="scss">
.questions {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	
	/* 头部导航栏 */
	.questions-navbar {
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
	
	/* 协议内容 */
	.questions-content {
		width: 100%;
		
		.row {
			width: 100%;
			
			.label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 18px;
				margin-bottom: 20rpx;
				background-color: #212121;
				padding: 10rpx 20rpx;
				border-radius: 12rpx;
				color: #fff;
				cursor: pointer;
				
				uni-icons {
					transition: transform 0.3s ease;
				}
			}
			
			.text {
				/* 基础样式 */
				color: #848485;
				line-height: 1.5;
				letter-spacing: 2px;
				font-size: 17px;
				background-color: #252424;
				border-radius: 10rpx;
				
				/* 过渡动画属性 */
				transition: all 0.3s ease-out;
				
				/* 默认隐藏状态 */
				max-height: 0;
				opacity: 0;
				overflow: hidden;
				padding: 0 30rpx;
				
				.text-content {
					padding: 30rpx 0;
					color: #848485;
				}
			}
			
			/* 显示状态 */
			.text-visible {
				margin-bottom: 60rpx;
				max-height: 1000px; /* 足够大的值容纳内容 */
				opacity: 1;
				padding: 0 30rpx;
			}
		}
	}
}
</style>
