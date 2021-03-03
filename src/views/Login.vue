<template>
	<div class="login">
		<div class="ui middle aligned center aligned grid">
			<div class="column">
				<h2 class="ui teal image header">
					<img src="../assets/logo.png" class="image" />
					<div class="content">
						账号登录
					</div>
				</h2>
				<form class="ui large form">
					<div class="ui stacked segment">
						<div class="field">
							<div class="ui left icon input">
								<i class="user icon"></i>
								<input type="text" name="email" placeholder="E-mail address" />
							</div>
						</div>
						<div class="field">
							<div class="ui left icon input">
								<i class="lock icon"></i>
								<input type="password" name="password" placeholder="Password" />
							</div>
						</div>
						<div class="ui fluid large teal submit button">Login</div>
					</div>
					<div class="ui error message"></div>
				</form>
				<div class="ui message">
					新用户？ <router-link to="/register">加入我们</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "Login",
	emits: {
		toggleHeader: (_visible: boolean) => true,
		toggleFooter: (_visible: boolean) => true,
	},
	methods: {},
	beforeRouteEnter(to, from, next) {
		next(component => {
			(component as any).$emit("toggleHeader", false);
			(component as any).$emit("toggleFooter", false);
		});
	},
	beforeRouteLeave(to, from, next) {
		if (to.name != "register") {
			this.$emit("toggleHeader", true);
			this.$emit("toggleFooter", true);
		}
		next();
	},
});
</script>
