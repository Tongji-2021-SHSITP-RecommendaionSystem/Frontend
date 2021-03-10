<template>
	<div class="home">Text</div>
</template>

<script lang="ts">
import Axios, { AxiosResponse, AxiosError } from "axios";
import { Options, Vue } from 'vue-class-component';
import NewsCard from "../components/NewsCard.vue";
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
	newsInfos!: News[];
	async mounted() {
		await Axios.get("/api/news/recommend", {
			params: { count: this.count ?? 6 }
		}).then(
			(response: AxiosResponse<API.News.Recommend.Response>) => {
				Axios.get<API.News.GetNewsInfos.Response>("/api/news/getNewsInfos", {
					params: {
						ids: response.data.ids
					}
				}).then(
					response => this.newsInfos = response.data.infos,
					(error: AxiosError) => {
						console.log(error);
						this.$router.push({
							name: "Exception",
							params: {
								status: error.response?.status!,
								message: error.response?.statusText!
							}
						});
					}
				)
			},
			(error: AxiosError) => {
				console.log(error);
				this.$router.push({
					name: "Exception",
					params: {
						status: error.response?.status!,
						message: error.response?.statusText!
					}
				});
			}
		);
	}
}

</script>
