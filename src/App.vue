<template>
	<header id="navigator" class="ui inverted segment" v-if="headerVisible">
		<div class="ui inverted secondary menu">
			<router-link class="item" to="/">主页</router-link>
			<a
				href="https://github.com/Tongji-2021-SHSITP-RecommendaionSystem"
				class="item"
				>仓库</a
			>
			<a href="https://github.com/truemogician" class="item">作者</a>
			<router-link class="item right" to="/login" @click="logout"
				>登出</router-link
			>
		</div>
	</header>
	<div id="main">
		<div id="loading" v-show="loading">
			<div class="ui active inverted dimmer">
				<div class="ui large text loader">{{ loadingLabel }}</div>
			</div>
		</div>
		<router-view
			v-show="!loading"
			@toggle-header="toggleHeader"
			@start-loading="startLoading"
			@finish-loading="loading = false"
		/>
	</div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	text-align: center;
	color: #21413e;
	display: flex;
	flex-flow: column;
	height: 100%;
}
#main {
	margin: 0 auto;
	flex-grow: 1;
	flex-shrink: 0;
	flex-basis: auto;
	width: 100%;
}
#navigator {
	margin: 0 auto;
	width: 100%;
	flex-grow: 0;
	flex-shrink: 1;
	flex-basis: auto;
}
#navigator a {
	font-weight: bold;
	font-size: medium;
	color: #657585;
}
#navigator a.router-link-exact-active {
	color: #42b983;
}
</style>

<script lang="ts">
import Axios from "axios";
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
	loading: boolean = false;
	pending: boolean = false;
	loadingLabel: string = "载入中";
	toggleHeader(visible: boolean) {
		this.headerVisible = visible;
	}
	startLoading(label?: string) {
		this.loading = true;
		if (label) this.loadingLabel = label;
	}
	logout() {
		Axios.delete("/api/user/login");
	}
}
</script>
