<template>
	<div class="ui main text container">
		<a :href="url">
			<h1 class="ui header">{{ title }}</h1>
		</a>
		<p class="meta">{{ `${formatDate(date)} ${source}` }}</p>
		<div v-html="article" />
	</div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Axios, { AxiosResponse, AxiosError } from "axios";
import Config from "../config";
import News from "../../../Backend/src/entity/News";

class Props {
	id!: number;
}
export default class NewsView extends Vue.with(Props) {
	title!: string;
	url!: string;
	source!: string;
	date!: Date;
	article!: string;
	startTime!: number;
	endTime!: number;
	formatDate(date: Date): string {
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
	}
	async created() {
		let retries = Config.retries;
		do {
			await Axios.get("/api/news/getNews", {
				params: { id: this.id }
			}).then(
				(response: AxiosResponse<News>) => {
					retries = 0;
					const news = response.data;
					this.title = news.title;
					this.url = news.url;
					this.source = news.source;
					this.date = news.date;
					this.article = news.article;
				},
				(error: AxiosError) => {
					if ((error.response!.status / 100) >> 0 == 5)
						retries -= 1;
					else
						retries = 0;
				}
			);
		} while (retries > 0);
	}
	mounted() {
		this.startTime = Date.now();
	}
	unmounted() {
		this.endTime = Date.now();
		Axios.post("/api/user/readNews", null, {
			params: {
				id: this.id,
				startTime: this.startTime,
				endTime: this.endTime
			}
		});
	}
}
</script>
