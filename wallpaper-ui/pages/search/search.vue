<template>
	<view class="search">
		<!-- 头部导航 -->
		<view class="search-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>搜索</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 搜索部分 -->
		<view class="search-input">
			<up-search
				v-model="keyword"
				height="34"
				bgColor="#2c2c2c"
				color="#fff"
				:actionStyle="{
					color: '#fff',
					fontSize: '16px'
				}"
				@search="toSearch"
				@custom="toSearch"
			></up-search>
		</view>
		<!-- 搜索历史 -->
		<view class="search-history" v-if="keywords.length !== 0">
			<view class="history-title">
				<view class="title">搜索历史</view>
				<uni-icons @click="clearKeywords" type="trash" size="22" color="#fff"></uni-icons>
			</view>
			<view class="history-keywords">
				<view @click="toSearch(item)" class="keywork" v-for="(item, index) in keywords" :key="index">{{ item }}</view>
			</view>
		</view>
		<!-- 热门搜索 -->
		<view class="search-hot">
			<view class="hot-title">
				<view class="title">热门搜索</view>
				<view class="fill"></view>
			</view>
			<view class="hot-keywords">
				<view @click="toSearch(item)" class="keywork" v-for="(item, index) in hotKeywords" :key="index">{{ item }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 搜索关键字
const keyword = ref('');
// 历史记录
const keywords = ref(uni.getStorageSync('keywords') || []);
// 热门搜索
const hotKeywords = ['火影', '蜡笔小新', '简约', '动漫', '美女', '风景', '斗罗大陆', '聊天背景'];
// 添加历史记录
const addKeyword = () => {
	// 1. 过滤空值（避免存入空字符串）
	if (!keyword.value.trim()) return;
	// 2. 去重并保持数组类型（使用Set去重后转回数组）
	const newKeywords = [...new Set([keyword.value, ...keywords.value])];
	// 3. 限制历史记录数量（可选，避免无限增长）
	if (newKeywords.length > 10) {
		newKeywords.pop(); // 超过10条时删除最后一条
	}
	// 4. 更新响应式数据并同步到本地存储
	keywords.value = newKeywords;
	uni.setStorageSync('keywords', newKeywords);
};
// 清除历史记录
const clearKeywords = () => {
	// 1. 先判断是否有历史记录，无记录则直接提示
	if (keywords.value.length === 0) return;
	// 清空响应式数据
	keywords.value = [];
	// 清空本地存储
	uni.removeStorageSync('keywords');
};

onShow(() => {
	// 每次页面显示时，重新读取本地存储的搜索记录
	keywords.value = uni.getStorageSync('keywords');
});

// 搜索事件
const toSearch = (inputKeyword = '') => {
	// 定义最终使用的关键字变量
	let finalKeyword;
	// 处理参数：如果传入了inputKeyword（如从热门/历史点击），优先使用
	if (inputKeyword) {
		finalKeyword = inputKeyword.trim();
		// 同步更新输入框的值
		keyword.value = finalKeyword;
	} else {
		// 否则使用输入框的绑定值
		finalKeyword = keyword.value.trim();
	}
	// 过滤空值
	if (!finalKeyword) {
		return uni.showToast({ title: '请输入内容', icon: 'none' });
	}
	// 添加搜索记录
	addKeyword();
	// 跳转到搜索详情页（使用encodeURIComponent处理特殊字符）
	uni.navigateTo({
		url: `/pages/searchDetail/searchDetail?keyword=${encodeURIComponent(finalKeyword)}`
	});
};
</script>

<style lang="scss">
.search {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.search-navbar {
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
	/* 搜索部分 */
	.search-input {
		width: 100%;
		padding: 0 10rpx;
	}
	/* 搜索历史 */
	.search-history {
		position: relative;
		width: 100%;
		margin: 60rpx 0;
		.history-title {
			padding: 0 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;
		}
		.history-keywords {
			display: flex;
			flex-wrap: wrap;
			.keywork {
				margin-right: 24rpx;
				margin-bottom: 24rpx;
				border-radius: 30rpx;
				padding: 8rpx 36rpx;
				background-color: rgba(255, 255, 255, 0.1);
				font-size: 14px;
			}
		}
	}
	/* 热门搜索 */
	.search-hot {
		position: relative;
		width: 100%;
		margin: 60rpx 0;
		.hot-title {
			padding: 0 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;
		}
		.hot-keywords {
			display: flex;
			flex-wrap: wrap;
			.keywork {
				margin-right: 24rpx;
				margin-bottom: 24rpx;
				border-radius: 30rpx;
				padding: 8rpx 36rpx;
				background-color: rgba(255, 255, 255, 0.1);
				font-size: 14px;
			}
		}
	}
}
</style>
