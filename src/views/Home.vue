<template>
	<div id="news-container">
		<div id="tabular" class="ui top attached tabular menu">
			<div class="active item">智能推荐</div>
			<div class="item">政治</div>
			<div class="item">经济</div>
			<div class="item">科技</div>
			<div class="item">体育</div>
			<div class="item">娱乐</div>
			<div class="item">不同视角</div>
		</div>
		<div
			class="ui bottom attached active tab segment"
			style="background-color:transparent"
		>
			<div id="news" class="ui grid" :class="gridColumn" v-if="ready">
				<div
					class="column"
					style="padding:1em"
					v-for="info in newsInfos"
					:key="info.id"
				>
					<NewsCard
						style="margin:0 auto"
						:id="info.id"
						:title="info.title"
						:url="info.url"
						:image="info.image"
						:date="info.date"
						:source="info.source"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
#news-container {
	background-image: url("../assets/image/background/default.jpg");
}
#tabular {
	justify-content: center;
	padding-top: 10px;
}
#tabular > .item {
	color: white;
	cursor: pointer;
}
#tabular > .active.item {
	color: black;
}
#news {
	height: 100%;
	margin: 0;
	padding: 2em 3em;
}
</style>

<script lang="ts">
import "basic-type-extensions";
import Axios, { AxiosError } from "axios";
import { Options, Vue } from "vue-class-component";
import NewsCard from "../components/NewsCard.vue";
import ErrorHandler from "../error-handler";

import type { News } from "news-recommendation-entity";

const translator = ["zero", "one", "two", "three", "four", "five", "six"];
class Props {
	count?: number;
}
@Options({
	components: {
		NewsCard,
	},
	emits: {
		startLoading: (label?: string) => true,
		finishLoading: () => true,
	},
})
export default class HomeView extends Vue.with(Props) {
	ready: boolean = false;
	newsInfos!: News[];
	height!: number;
	width!: number;
	gridColumn: string[] = ["five", "column"];
	onWindowResize() {
		this.height = window.innerHeight;
		this.width = window.innerWidth;
		this.gridColumn.splice(0, 1, translator[Math.floor(this.width / 300)]);
	}

	async created() {
		this.$emit("startLoading", "推荐中");
		this.onWindowResize();
		if ((document as any).global.pending === true)
			await Promise.wait(() => !(document as any).global.pending, 100);
		Axios.get("/api/news/recommendation", {
			params: {
				count: this.count ?? 12,
				random: true
			},
		}).then(
			response => {
				Axios.get("/api/news/infos", {
					params: {
						ids: (response.data as Record<"ids", number[]>).ids,
					},
				}).then(
					response => {
						this.newsInfos = (response.data as any).infos;
						this.ready = true;
						this.$emit("finishLoading");
					},
					(error: AxiosError) =>
						ErrorHandler.axios(error, this.$router)
				);
			},
			(error: AxiosError) => ErrorHandler.axios(error, this.$router)
		);
	}
	mounted() {
		window.addEventListener("resize", this.onWindowResize);
	}
	unmounted() {
		this.$emit("finishLoading");
		window.removeEventListener("resize", this.onWindowResize);
	}
}
</script>
