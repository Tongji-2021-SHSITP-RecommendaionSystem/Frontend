<template>
	<div>
		<h1>{{ status }}</h1>
		<h2>{{ message }}</h2>
	</div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";

class Props {
	status!: number;
	message!: string;
}
@Options({
	props: {
		status: Number,
		message: String,
	},
})
export default class ExceptionView extends Vue.with(Props) {}
</script>
