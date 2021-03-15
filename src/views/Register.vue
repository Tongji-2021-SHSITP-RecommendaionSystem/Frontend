<template>
	<div class="register">
		<div class="ui middle aligned center aligned grid">
			<div class="column">
				<h2 class="ui black image header">
					<img src="../assets/image/logo.png" class="image" />
					<div class="content">欢迎来到闻所未闻</div>
				</h2>
				<div class="ui form">
					<div class="ui stacked segment">
						<div class="field" :class="[
							inputStatus(usernameValid, isEmpty(username)),
						]">
							<div class="ui left icon input">
								<i class="user icon"></i>
								<input type="text" name="username" placeholder="用户名" v-model="username" />
							</div>
						</div>
						<div class="field" :class="[
							inputStatus(passwordValid, isEmpty(password)),
						]">
							<div class="ui left icon input">
								<i class="lock icon"></i>
								<input type="password" name="password" placeholder="密码" v-model="password" />
							</div>
						</div>
						<div
							class="field"
							:class="[
								inputStatus(
									passwordValid && repeatedValid,
									isEmpty(repeated)
								),
							]"
						>
							<div class="ui left icon input">
								<i class="lock icon"></i>
								<input type="password" name="repeatPassword" placeholder="重复密码" v-model="repeated" />
							</div>
						</div>
						<div class="field" :class="[inputStatus(emailValid, isEmpty(email))]">
							<div class="ui left icon input">
								<i class="envelope icon"></i>
								<input type="text" name="email" placeholder="邮箱地址" v-model="email" />
							</div>
						</div>
						<div class="field" :class="[inputStatus(codeValid, isEmpty(code))]">
							<div class="ui left icon input">
								<i class="envelope open outline icon"></i>
								<input type="text" name="code" placeholder="验证码" v-model="code" />
								<button
									v-if="timeLeft == 0"
									class="ui green button"
									:disabled="!/^\w+@\w+\.+\w+$/.test(email)"
									@click="onSendEmail"
								>发送验证邮件</button>
								<button v-else class="ui teal button" disabled>{{ timeLeft }}s</button>
							</div>
						</div>
						<button
							class="ui fluid large button"
							:class="[registerButtonColor]"
							:disabled="status != 'Valid'"
							@click="onSubmit"
						>注册</button>
					</div>
					<div class="ui error message"></div>
				</div>
				<div class="ui message">
					已有账户？
					<router-link to="/login">登录</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.register {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-image: url("../assets/image/background/login.png");
	background-size: 100% 100%;
}
</style>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Color } from "../assets/types";
import Axios from "axios";
import { Router } from "vue-router";

type RegisterStatus = "Incomplete" | "Invalid" | "Valid";

Vue.registerHooks([
	"beforeRouteEnter",
	"beforeRouteLeave",
	"beforeRouteUpdate",
]);
@Options({
	emits: {
		toggleHeader: (visible: boolean) => typeof visible == "boolean",
		toggleFooter: (visible: boolean) => typeof visible == "boolean",
	},
})
export default class RegisterView extends Vue {
	$router!: Router;
	timeLeft: number = 0;
	username: string = "";
	password: string = "";
	repeated: string = "";
	email: string = "";
	code: string = "";

	get usernameValid(): boolean {
		return /^[a-z0-9\-_]{1,32}$/i.test(this.username);
	}
	get passwordValid(): boolean {
		return /^.{1,32}$/.test(this.password);
	}
	get repeatedValid(): boolean {
		return this.repeated == this.password;
	}
	get emailValid(): boolean {
		return /^\w+@\w+\.+\w+$/.test(this.email);
	}
	get codeValid(): boolean {
		return /^[a-z0-9]{4}/i.test(this.code);
	}
	get status(): RegisterStatus {
		if (
			this.isEmpty(this.username) ||
			this.isEmpty(this.password) ||
			this.isEmpty(this.email) ||
			this.isEmpty(this.code)
		)
			return "Incomplete";
		else if (
			!this.usernameValid ||
			!this.passwordValid ||
			!this.emailValid ||
			!this.codeValid
		)
			return "Invalid";
		else return "Valid";
	}
	get registerButtonColor(): Color {
		return this.status == "Valid" ? "green" : "grey";
	}

	isEmpty(str: string): boolean {
		return str == "";
	}
	inputStatus(valid: boolean, empty: boolean): string {
		return valid ? "success" : empty ? "info" : "error";
	}
	onSendEmail() {
		if (this.timeLeft == 0) {
			Axios.post("/api/user/sendEmail", null, {
				params: {
					email: this.email,
				},
			});
			this.timeLeft = 60;
			const timer = setInterval(() => {
				if (--this.timeLeft == 0) clearInterval(timer);
			}, 1000);
		}
	}
	onSubmit() {
		Axios.post("/api/user/register", {
			username: this.username,
			password: this.password,
			email: this.email,
			code: this.code,
		}).then(response => {
			console.log(response.status);
			if (response.status % 100 == 2)
				this.$router.push("/");
		});
	}

	mounted() {
		this.$emit("toggleHeader", false);
	}
	unmounted() {
		this.$emit("toggleHeader", true);
	}
}
</script>
