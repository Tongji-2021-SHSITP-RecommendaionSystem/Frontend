<template>
	<div id="navigator" class="ui inverted segment" v-if="headerVisible">
		<div class="ui inverted secondary menu">
			<router-link class="item" to="/">主页</router-link>
			<router-link class="item" to="/about">关于</router-link>
			<router-link class="item" to="/login">登录</router-link>
		</div>
	</div>
	<div id="main" :style="{ backgroundImage: backgoundImagePath }">
		<router-view @toggle-header="toggleHeader" @set-background-image="setBackgroundImage" />
	</div>
</template>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	text-align: center;
	color: #21413e;
}
#main {
	padding: 2em;
	margin: 0 auto;
	background-size: 100% 100%;
}
#navigator {
	margin: 0 auto;
	a {
		font-weight: bold;
		font-size: medium;
		color: #1b2c3d;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
@Options({
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				document.title = to.meta.title || "Beyonews";
			},
		},
	},
})
export default class App extends Vue {
	headerVisible: boolean = true;
	backgroundImage: string = "default.jpg";
	get backgoundImagePath(): string {
		return `url("./assets/image/background/${this.backgroundImage}")`
	}
	toggleHeader(visible: boolean) {
		this.headerVisible = visible;
	}
	setBackgroundImage(filename: string) {
		this.backgroundImage = filename;
	}
}
</script>
