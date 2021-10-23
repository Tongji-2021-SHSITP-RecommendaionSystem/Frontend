<template>
	<div class="news">
		<div v-if="ready" class="ui main text container">
			<div class="ui segment">
				<a :href="url">
					<h1 class="ui header">{{ title }}</h1>
				</a>
				<p class="meta">{{ `${formatDate(date)} ${source}` }}</p>
			</div>
			<div id="article" class="ui segment" v-html="article" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.news {
	width: 100%;
	height: 100%;
	padding-top: 2em;
	background-image: url("../assets/image/background/news.jpg");
	background-size: 100% auto;
	.ui.main.text.container {
		.ui.segment {
			margin-top: 1em;
			margin-bottom: 1em;
			background-color: rgba($color: #ffffff, $alpha: 0.85);
		}
		#article {
			text-align: left;
			font-size: large;
			/deep/ p {
				line-height: 2em;
				text-indent: 2em;
				margin: 2em auto;
			}
		}
	}
}
</style>

<script lang="ts">
import { Vue } from "vue-class-component";
import jQuery from "jquery";
import Axios, { AxiosResponse, AxiosError } from "axios";
import { News } from "news-recommendation-entity";
import ErrorHandler from "../error-handler";

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
		return `${date.getFullYear()}/${date.getMonth() +
			1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}
	async created() {
		Axios.get("/api/news", {
			params: { id: this.id },
		}).then(
			(response: AxiosResponse<Stringfy<News>>) => {
				const news = response.data;
				this.title = news.title;
				this.url = news.url;
				this.source = news.source;
				this.date = new Date(news.date);
				this.article = news.article;
				this.ready = true;
				this.startTime = Date.now();
			},
			(error: AxiosError) => ErrorHandler.axios(error, this.$router)
		);
	}
	updated() {
		jQuery(this.$el)
			.find("#article>p")
			.each((index, element) => {
				const el = jQuery(element);
				if (el.children("img,video").length) {
					el.css("display", "flex");
					el.css("flex-direction", "column");
					el.css("justify-content", "center");
				}
			});
	}
	beforeUnmount() {
		this.endTime = Date.now();
		(document as any).global.pending = true;
		Axios.post("/api/user/history", null, {
			params: {
				id: this.id,
				startTime: this.startTime,
				endTime: this.endTime,
			},
		}).then(() => ((document as any).global.pending = false));
	}
}
</script>
