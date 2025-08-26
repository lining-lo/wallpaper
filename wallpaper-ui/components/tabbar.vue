<template>
	<view class="tabbar">
		<view class="tabbar-content">
			<view v-for="(item, index) in tabList" :key="index" class="content-item" :class="{ active: current === index }" @click="switchTab(index)">
				<view class="icon-wrapper" :class="{ 'audio-icon': item.name === 'audio' }">
					<image :src="current === index ? item.selectedIconPath : item.iconPath" mode="aspectFit" class="icon"></image>
				</view>
				<text class="text" :class="{ 'active-text': current === index }">{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';

// 响应式数据（pagePath 与 pages.json 保持一致）
const current = ref(0);
const tabList = ref([
	{
		text: '首页',
		pagePath: 'pages/index/index',
		iconPath: '/static/images/home.png',
		selectedIconPath: '/static/images/s-home.png'
	},
	{
		text: '分类',
		pagePath: 'pages/sort/sort',
		iconPath: '/static/images/sort.png',
		selectedIconPath: '/static/images/s-sort.png'
	},
	{
		text: '创作者',
		pagePath: 'pages/author/author',
		iconPath: '/static/images/author.png',
		selectedIconPath: '/static/images/s-author.png'
	},
	{
		text: '广场',
		pagePath: 'pages/share/share',
		iconPath: '/static/images/share.png',
		selectedIconPath: '/static/images/s-share.png'
	},
	{
		text: '我的',
		pagePath: 'pages/my/my',
		iconPath: '/static/images/my.png',
		selectedIconPath: '/static/images/s-my.png'
	}
]);

// 初始化当前选中的tab
const initCurrentTab = () => {
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	const currentPath = currentPage.route;
	const matchedIndex = tabList.value.findIndex((item) => item.pagePath === currentPath);
	if (matchedIndex !== -1) {
		current.value = matchedIndex;
	}
};

onShow(() => initCurrentTab());

// 切换tab方法（核心优化：使用nextTick确保图标先更新再跳转）
const switchTab = async (index) => {
	// 1. 先更新current状态（触发图标切换）
	current.value = index;

	// 2. 等待Vue完成DOM更新（确保图标src已切换）
	await nextTick();

	// 3. 再执行页面跳转
	const targetPath = tabList.value[index].pagePath;
	uni.switchTab({
		url: `/${targetPath}`,
		success: () => {
			console.log('跳转成功，路径：', `/${targetPath}`);
		},
		fail: (err) => {
			console.error('跳转失败详情：', err);
			// 失败时回滚状态（可选）
			current.value = tabList.value.findIndex((item) => item.pagePath === getCurrentPages()[0].route);
		}
	});
};
</script>

<style lang="scss" scoped>
.tabbar {
	position: fixed;
	bottom: 40rpx;
	width: 100%;
	height: 120rpx;
	display: flex;
	justify-content: center;
	z-index: 999;

	.tabbar-content {
		width: 90%;
		height: 100%;
		border-radius: 60rpx;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(30px);
		display: flex;
		justify-content: space-around;
		align-items: center;
		.content-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex: 1;
			height: 100%;
			position: relative;

			.icon-wrapper {
				width: 60rpx;
				height: 60rpx;
				margin-bottom: 6px;

				&.audio-icon {
					width: 95rpx;
					height: 95rpx;
					margin-top: -30rpx;
					background: #ffffff;
					border-radius: 50%;
					box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.icon {
					width: 100%;
					height: 100%;
					transition: opacity 0.1s ease; /* 增加过渡动画，让切换更自然 */
				}
			}

			.text {
				font-size: 20rpx;
				color: #e5e5e5;
				font-weight: 600;
				transition: color 0.1s ease;

				&.active-text {
					color: #e5e5e5;
				}
			}
		}
	}
}
</style>
