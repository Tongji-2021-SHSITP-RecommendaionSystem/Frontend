<template>
	<div class="news">
		<div id="operation" v-if="ready" class="ui container">
			<i
				class="thumbs up icon huge"
				:class="{ outline: thumb != true }"
				@click="() => feedback(true)"
			/>
			<i
				class="thumbs down icon huge"
				:class="{ outline: thumb != false }"
				@click="() => feedback(false)"
			/>
		</div>
		<div v-if="ready" class="ui main text container">
			<div class="ui segment">
				<a :href="url">
					<h1 class="ui header">{{ title }}</h1>
				</a>
				<p class="meta">{{ `${formatDate(date)} ${source}` }}</p>
			</div>
			<div id="analysis" class="ui segment">
				<p>关键词：{{ keywords.join("，") }}</p>
				<p>
					摘要：
					{{ summary.join("\n") }}
				</p>
			</div>
			<div id="article" class="ui segment" v-html="article" />
		</div>
	</div>
</template>

<style scoped>
.news {
	width: 100%;
	height: 100%;
	padding-top: 2em;
	background-image: url("../assets/image/background/news.jpg");
	background-size: 100% auto;
}
.news .ui.main.text.container .ui.segment {
	margin-top: 1em;
	margin-bottom: 1em;
	background-color: rgba(255, 255, 255, 0.85);
}
#article,
#analysis {
	text-align: left;
	font-size: large;
}
#article :deep() p {
	line-height: 2em;
	text-indent: 2em;
	margin: 2em auto;
}
#analysis p {
	line-height: 1.5em;
	margin: 2em auto;
}
#analysis p:first-child {
	margin-top: 0;
}
#analysis p:last-child {
	margin-bottom: 0;
}
#operation {
	display: flex;
	flex-direction: column;
	position: absolute;
}
#operation i {
	margin: 2em auto;
}
</style>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import jQuery from "jquery";
import Axios, { AxiosError } from "axios";
import { News } from "news-recommendation-entity";
import ErrorHandler from "../error-handler";

type Stringfy<T> = { [K in keyof T]: Function extends T[K] ? T[K] : string };
class Props {
	id!: string;
}
@Options({
	props: {
		id: String,
	},
})
export default class NewsView extends Vue.with(Props) {
	ready: boolean = false;
	title!: string;
	url!: string;
	source!: string;
	date!: Date;
	article!: string;
	startTime!: number;
	endTime!: number;
	keywords!: string[];
	summary!: string[];
	thumb: boolean | null = null;
	formatDate(date: Date): string {
		return `${date.getFullYear()}/${date.getMonth() +
			1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}
	feedback(thumb: boolean) {
		this.thumb = this.thumb == thumb ? null : thumb;
	}
	async created() {
		Promise.all([
			Axios.get("/api/news", {
				params: { id: this.id },
			}).then(
				response => {
					const news = response.data as Stringfy<News>;
					this.title = news.title;
					this.url = news.url;
					this.source = news.source;
					this.date = new Date(news.date);
					this.article = news.article;
					this.startTime = Date.now();
				},
				(error: AxiosError) => ErrorHandler.axios(error, this.$router)
			),
			Axios.get("/api/news/analysis", {
				params: { id: this.id },
			}).then(
				response => {
					const data = response.data as any;
					this.keywords = data.keywords;
					this.summary = data.summary;
				},
				(error: AxiosError) => ErrorHandler.axios(error, this.$router)
			),
		]).then(() => (this.ready = true));
	}
	updated() {
		jQuery(this.$el)
			.find("#article>p")
			.each((_, element) => {
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
		Axios.post("/api/user/history", {
			id: Number(this.id),
			startTime: this.startTime,
			endTime: this.endTime,
		}).then(() => ((document as any).global.pending = false));
	}
}
</script>
