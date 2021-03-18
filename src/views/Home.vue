<template>
	<div id="news" class="ui five column grid" v-if="ready">
		<div class="column" style="padding:1em" v-for="info in newsInfos" :key="info.id">
			<news-card
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
</template>

<style lang="scss">
#news {
	height: 100%;
	margin: 0;
	padding: 2em 3em;
	background-image: url("../assets/image/background/default.jpg");
	background-size: 100% 100%;
}
</style>

<script lang="ts">
import "basic-type-extensions";
import Axios, { AxiosResponse, AxiosError } from "axios";
import { Options, Vue } from 'vue-class-component';
import NewsCard from "../components/NewsCard.vue";
import ErrorHandler from "../error-handler"
import { API } from "../../../Backend/src/api"
import News from '../../../Backend/src/entity/News';

class Props {
	count?: number
}
@Options({
	components: {
		NewsCard,
	},
	emits: {
		startLoading: (label?: string) => true,
		finishLoading: () => true
	}
})
export default class HomeView extends Vue.with(Props) {
	ready: boolean = false;
	newsInfos!: News[];
	async created() {
		this.$emit("startLoading", "推荐中");
		if ((document as any).global.pending === true)
			await Promise.wait(() => !(document as any).global.pending, 100);
		Axios.get("/api/news/recommend", {
			params: { count: this.count ?? 10 }
		}).then(
			(response: AxiosResponse<API.News.Recommend.Response>) => {
				Axios.get<API.News.GetNewsInfos.Response>("/api/news/getNewsInfos", {
					params: {
						ids: response.data.ids
					}
				}).then(
					response => {
						this.newsInfos = response.data.infos;
						this.ready = true;
						this.$emit("finishLoading");
					},
					(error: AxiosError) => ErrorHandler.axios(error, this.$router)
				)
			},
			(error: AxiosError) => ErrorHandler.axios(error, this.$router)
		);
	}
	unmounted() {
		this.$emit("finishLoading");
	}
}
</script>
