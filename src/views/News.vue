<template>
	<div v-if="ready" class="ui main text container">
		<a :href="url">
			<h1 class="ui header">{{ title }}</h1>
		</a>
		<p class="meta">{{ `${formatDate(date)} ${source}` }}</p>
		<div id="article" class="ui segment" v-html="article" />
	</div>
</template>

<style lang="scss">
#article {
	text-align: left;
	text-indent: 1em;
}
.ui.main.text.container {
	margin-top: 2em;
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";
import Axios, { AxiosResponse, AxiosError } from "axios";
import News from "../../../Backend/src/entity/News";
import ErrorHandler from '../error-handler';

type Stringfy<T> = { [K in keyof T]: Function extends T[K] ? T[K] : string };
class Props {
	id!: number;
}
export default class NewsView extends Vue.with(Props) {
	ready: boolean = false;
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
		Axios.get("/api/news/getNews", {
			params: { id: this.id }
		}).then(
			(response: AxiosResponse<Stringfy<News>>) => {
				const news = response.data;
				this.title = news.title;
				this.url = news.url;
				this.source = news.source;
				this.date = new Date(news.date);
				this.article = news.article;
				this.ready = true;
			},
			(error: AxiosError) => ErrorHandler.axios(error, this.$router)
		);
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
