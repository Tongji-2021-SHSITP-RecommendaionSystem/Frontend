<template>
	<div class="register">
		<div class="ui middle aligned center aligned grid">
			<div class="column">
				<h2 class="ui image header">
					<div class="content">欢迎来到</div>
					<img src="../assets/image/logo-pure.png" class="image" />
					<div class="content">闻所未闻</div>
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
							:class="[registerButtonColor, loading]"
							:disabled="status != 'Valid'"
							@click="onSubmit"
						>注册</button>
					</div>
					<div class="ui error message"></div>
				</div>
				<div class="ui error message" v-show="errorMessage != ''">
					<i class="close icon"></i>
					<div class="header">{{ errorMessage }}</div>
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
	background-size: cover;
	.column {
		opacity: 0.8;
		.ui.header {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 1em;
			.content {
				padding: 0.5em;
				color: rgb(34, 58, 85);
			}
		}
		.ui.segment,
		.ui.message {
			background-color: rgba($color: #ffffff, $alpha: 0.5);
		}
	}
}
</style>

<script lang="ts">
import Axios, { AxiosError } from "axios";
import { Vue, Options } from "vue-class-component";
import { Color } from "../assets/types";

type RegisterStatus = "Incomplete" | "Invalid" | "Valid";

@Options({
	emits: {
		toggleHeader: (visible: boolean) => typeof visible == "boolean",
	},
})
export default class RegisterView extends Vue {
	loading: string = "";
	timeLeft: number = 0;
	errorMessage: string = "";
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
		this.loading = "loading";
		(document as any).global.pending = true;
		Axios.post("/api/user/register", {
			username: this.username,
			password: this.password,
			email: this.email,
			code: this.code,
		}).then(
			response => {
				this.loading = "";
				(document as any).global.pending = false;
				this.$router.push({ name: "Home" });
			},
			(error: AxiosError) => {
				this.loading = "";
				(document as any).global.pending = false;
				this.errorMessage = error.response!.data
			}
		);
	}

	mounted() {
		this.$emit("toggleHeader", false);
		$(".icon.close", this.$el).on("click", function() {
			$(this).parent().hide();
		});
	}
	unmounted() {
		this.$emit("toggleHeader", true);
	}
}
</script>
