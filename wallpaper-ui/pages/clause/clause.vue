<template>
	<view class="clause">
		<!-- 头部导航 -->
		<view class="clause-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>隐私政策条款</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 条款内容 -->
		<view class="clause-content">
			<view class="row" v-for="(item, index) in clause" :key="index">
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

// 条款内容
const clause = ref([
	{
		title: '🥝隐私政策条款 ',
		content:
			'尊敬的用户，我们非常重视您的隐私和个人信息安全。为了帮助您了解我们在处理您的个人信息时所遵循的原则和采取的措施，我们特此制定了本隐私政策。请您仔细阅读以下内容，以了解我们对个人信息的收集、使用、共享和保护方式。',
		isShow: true
	},
	{
		title: '🥝 个人信息的收集',
		content:
			'当您使用lo的壁纸分享室（以下简称 “本系统”）时，我们会收集您的相关信息，这些信息对于我们提供服务、改进系统以及安全至关重要。我们还会收集您在使用本系统过程中产生的数据，如浏览记录、搜索记录等，以便我们更好地了解您的需求和偏好，从而为您提供更优质的服务。',
		isShow: true
	},
	{
		title: '🥝 个人信息的使用',
		content:
			'我们将使用您的个人信息来提供、改进和优化本系统，包括但不限于：分析用户行为以及提升系统的安全性和稳定性。在符合法律规定的情况下，我们可能会使用您的个人基础信息进行营销和推广活动，如您不希望接收此类信息，请随时告知我们。',
		isShow: true
	},
	{
		title: '🥝 个人信息的共享',
		content:
			'我们将严格保护您的个人信息，不会将其出售或非法提供给第三方。在法律允许或要求的范围内，我们可能会向政府机构、执法部门或第三方披露您的个人信息。',
		isShow: true
	},
	{
		title: '🥝 个人信息的保护',
		content:
			'我们将采取合理的技术和组织措施来保护您的个人信息免受未经授权的访问、披露、更改或破坏。我们的安全措施包括但不限于数据加密、访问控制和定期的安全审查。尽管我们会尽力保护您的个人信息，但互联网传输中的安全风险是无法完全避免的。因此，我们建议您也采取适当的安全措施，如定期更换密码、避免在公共场合透露个人信息等。',
		isShow: true
	},
	{
		title: '🥝 您的权利',
		content:
			'您有权随时查询、更正或删除您的个人信息。如需行使这些权利，请通过我们提供的联系方式与我们联系。如您对我们的隐私政策有任何疑问或建议，也请随时与我们沟通。',
		isShow: true
	},
	{
		title: '🥝 隐私政策的变更',
		content:
			'我们可能会根据法律法规的变化、业务发展的需要或技术进步的要求，对本隐私政策进行不定期的更新和修改。我们会通过系统通知或其他适当方式向您告知这些变更。请您定期查看本隐私政策，以了解我们对个人信息的最新处理方式。',
		isShow: true
	},
]);
</script>

<style lang="scss">
.clause {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	
	/* 头部导航栏 */
	.clause-navbar {
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
	
	/* 条款内容 */
	.clause-content {
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
