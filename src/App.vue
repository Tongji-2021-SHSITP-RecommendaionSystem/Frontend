<template>
	<div>
		<div id="nav" v-if="headerVisible" class="ui fixed inverted menu">
			<img src="./assets/logo.png" width="40" height="40" />
			<router-link class="item" to="/">Home</router-link>
			<router-link class="item" to="/about">About</router-link>
			<router-link class="item" to="/login">Login</router-link>
		</div>
		<div class="ui main text container">
			<router-view @toggle-header="toggleHeader" @toggle-footer="toggleFooter" />
		</div>
		<div v-if="footerVisible" class="ui inverted vertical footer segment">
			<div class="ui center aligned container">
				<div class="ui stackable inverted divided grid">
					<div class="three wide column">
						<h4 class="ui inverted header">Group 1</h4>
						<div class="ui inverted link list">
							<a href="#" class="item">Link One</a>
							<a href="#" class="item">Link Two</a>
							<a href="#" class="item">Link Three</a>
							<a href="#" class="item">Link Four</a>
						</div>
					</div>
					<div class="three wide column">
						<h4 class="ui inverted header">Group 2</h4>
						<div class="ui inverted link list">
							<a href="#" class="item">Link One</a>
							<a href="#" class="item">Link Two</a>
							<a href="#" class="item">Link Three</a>
							<a href="#" class="item">Link Four</a>
						</div>
					</div>
					<div class="three wide column">
						<h4 class="ui inverted header">Group 3</h4>
						<div class="ui inverted link list">
							<a href="#" class="item">Link One</a>
							<a href="#" class="item">Link Two</a>
							<a href="#" class="item">Link Three</a>
							<a href="#" class="item">Link Four</a>
						</div>
					</div>
					<div class="seven wide column">
						<h4 class="ui inverted header">Footer Header</h4>
						<p>
							Extra space for a call to action inside the footer
							that could help re-engage users.
						</p>
					</div>
				</div>
				<div class="ui inverted section divider"></div>
				<div class="ui horizontal inverted small divided link list">
					<a class="item" href="#">Site Map</a>
					<a class="item" href="#">Contact Us</a>
					<a class="item" href="#">Terms and Conditions</a>
					<a class="item" href="#">Privacy Policy</a>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

.main.container {
	margin-top: 10em;
}

.ui.footer.segment {
	margin: 5em 0em 0em;
	padding: 5em 0em;
}

#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #45698d;
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
	footerVisible: boolean = true;
	toggleHeader(visible: boolean) {
		this.headerVisible = visible;
	}
	toggleFooter(visible: boolean) {
		this.footerVisible = visible;
	}
}
</script>
