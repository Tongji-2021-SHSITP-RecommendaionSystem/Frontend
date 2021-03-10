<template>
	<div class="ui card">
		<div class="content">
			<div class="right floated meta">{{ interval(date) }}</div>
			{{ source }}
		</div>
		<div class="image">
			<router-link :to="target">
				<img :src="image" />
			</router-link>
		</div>
		<div class="content">
			<span class="header">{{ title }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
class Props {
	id!: number;
	title!: string;
	url!: string;
	image!: string;
	date!: Date;
	source!: string;
}
export default class NewsCard extends Vue.with(Props) {
	get target() {
		return {
			name: "News",
			params: {
				id: this.id
			}
		}
	}
	interval(from: Date, to?: Date): string {
		to = to ?? new Date();
		let delta = Math.round((to.getTime() - from.getTime()) / 3600000);
		let result = "";
		if (delta >= 8760) {
			result += `${Math.floor(delta / 8760)}年`;
			delta %= 8760;
		}
		if (delta >= 24) {
			result += `${Math.floor(delta / 24)}天`;
			delta %= 24;
		}
		result += `${delta}时`;
		return result;
	}
}
</script>
