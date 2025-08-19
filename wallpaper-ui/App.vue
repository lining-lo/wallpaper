<script>
export default {
	onLaunch: function () {
		console.log('App Launch');
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
	page, body, html, #app {
	  background-color: #141414 !important; 
	}
@import '@/uni_modules/uview-plus/index.scss';
@import 'common/style.scss';

</style>
