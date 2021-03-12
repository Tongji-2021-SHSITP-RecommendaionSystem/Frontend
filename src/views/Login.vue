<template>
	<div class="login">
		<div class="ui middle aligned center aligned grid">
			<div class="column">
				<h2 class="ui black image header">
					<img src="../assets/image/logo.png" class="image" />
					<div class="content">账号登录</div>
				</h2>
				<div class="ui large form">
					<div class="ui stacked segment">
						<div class="field" :class="[emailInputStatus]">
							<div class="ui left icon input">
								<i class="user icon"></i>
								<input type="text" name="email" placeholder="邮箱" v-model="email" @focusout="onFocusOut" />
							</div>
						</div>
						<div class="field">
							<div class="ui left icon input">
								<i class="lock icon"></i>
								<input
									type="password"
									name="password"
									placeholder="密码"
									v-model="password"
									@keypress="onKeyPress"
								/>
							</div>
						</div>
						<button
							class="ui fluid large teal submit button"
							:disabled="!emailExist || isEmpty(password)"
							@click="onLogin"
						>登录</button>
					</div>
				</div>
				<div class="ui error message" v-show="errorMessage != ''">
					<i class="close icon"></i>
					<div class="header">{{ errorMessage }}</div>
				</div>
				<div class="ui message">
					新用户？
					<router-link to="/register">加入我们</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.login {
	max-width: 50em;
	margin: 0 auto;
	margin-top: 10em;
}
</style>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Axios, { AxiosError } from "axios";
import $ from "jquery";

@Options({
	emits: {
		toggleHeader: (visible: boolean) => typeof visible == "boolean",
		setBackgroundImage: (filename: string) => typeof filename == "string"
	},
	watch: {
		emailExist(this: LoginView, value) {
			if (value == false)
				this.errorMessage = "邮箱未注册";
			else
				this.errorMessage = "";
		},
	},
})
export default class LoginView extends Vue {
	email: string = "";
	password: string = "";
	emailExist: boolean | null = null;
	errorMessage: string = "";

	get emailInputStatus() {
		switch (this.emailExist) {
			case true:
				return "success";
			case false:
				return "error";
			default:
				return "";
		}
	}
	get loginError() {
		return this.errorMessage != "";
	}

	isEmpty(str: string): boolean {
		return str == "";
	}
	onFocusOut() {
		if (this.isEmpty(this.email)) this.emailExist = null;
		else if (!/^\w+@\w+\.+\w+$/.test(this.email)) this.emailExist = false;
		else {
			Axios.get("/api/user/hasUser", {
				params: {
					email: this.email,
				},
			}).then(response => {
				this.emailExist = response.data.exist;
			});
		}
	}
	onLogin() {
		Axios.get("/api/user/login", {
			params: {
				email: this.email,
				password: this.password,
			},
		}).then(
			_ => this.$router.push("/"),
			(error: AxiosError) => {
				if (error.response!.status == 400)
					this.$router.push("/");
				else
					this.errorMessage = error.response?.data;
			}
		);
	}
	onKeyPress(key: KeyboardEvent) {
		if (key.code == "Enter")
			this.onLogin();
	}

	created() {
		this.$emit("toggleHeader", false);
		this.$emit("setBackgroundImage", "login.png");
		$(".icon.close", this.$el).on("click", function() {
			$(this).parent().hide();
		});
	}
	unmounted() {
		this.$emit("toggleHeader", true);
	}
}
</script>
