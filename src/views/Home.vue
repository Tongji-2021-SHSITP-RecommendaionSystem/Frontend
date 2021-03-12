<template>
	<div class="ui five column grid" v-if="ready">
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

<script lang="ts">
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
})
export default class HomeView extends Vue.with(Props) {
	ready: boolean = false;
	newsInfos!: News[];
	async created() {
		await Axios.get("/api/news/recommend", {
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
					},
					(error: AxiosError) => ErrorHandler.axios(error, this.$router)
				)
			},
			(error: AxiosError) => ErrorHandler.axios(error, this.$router)
		);
	}
}
</script>
