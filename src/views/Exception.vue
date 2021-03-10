<template>
	<div>
		<h1>{{ status }}</h1>
		<h2>{{ message }}</h2>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"

class Props {
	status!: number;
	message!: string;
}
export default class ExceptionView extends Vue.with(Props) {
	created() {
		this.status = Number.parseInt(this.$route.params.status as string);
		this.message = this.$route.params.message as string;
	}
}
</script>