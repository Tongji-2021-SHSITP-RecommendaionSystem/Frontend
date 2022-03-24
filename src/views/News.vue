<template>
	<div class="news">
		<div v-if="ready" class="ui main text container">
			<div id="operation" v-if="ready">
				<span style="height:3em">
					<img
						v-if="reaction == 1"
						src="../assets/image/thumb-up.png"
						@click="() => react(1)"
					/>
					<img
						v-else
						src="../assets/image/thumb-up-outline.png"
						@click="() => react(1)"
					/>
					<span style="color:springgreen">{{ approvalCount }}</span>
				</span>
				<span style="height:3em">
					<img
						v-if="reaction == 2"
						src="../assets/image/thumb-up.png"
						style="transform:rotate(180deg)"
						@click="() => react(2)"
					/>
					<img
						v-else
						src="../assets/image/thumb-up-outline.png"
						style="transform:rotate(180deg)"
						@click="() => react(2)"
					/>
					<span style="color:crimson">{{ oppositionCount }}</span>
				</span>
			</div>
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
	right: 4em;
}
#operation > span {
	height: 64px;
	display: flex;
	align-items: center;
	margin: 16px;
}
#operation > span > img {
	width: 64px;
	height: 64px;
	cursor: pointer;
}
#operation > span > span {
	font-size: xxx-large;
	margin-left: 10px;
}
</style>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import jQuery from "jquery";
import Axios, { AxiosError } from "axios";
import ErrorHandler from "../error-handler";

import type { News, User } from "news-recommendation-entity";

type Stringfy<T> = { [K in keyof T]: Function extends T[K] ? T[K] : string };

class Props {
	id!: string;
}

enum Reaction {
	None,
	Approval,
	Opposition
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
	reaction!: Reaction;
	approvalCount!: number;
	oppositionCount!: number;
	formatDate(date: Date): string {
		return `${date.getFullYear()}/${date.getMonth() +
			1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}
	react(reaction: Reaction) {
		if (this.reaction == Reaction.Approval)
			--this.approvalCount;
		else if (this.reaction == Reaction.Opposition)
			--this.oppositionCount;
		if (this.reaction != reaction) {
			if (reaction == Reaction.Approval)
				++this.approvalCount;
			else if (reaction == Reaction.Opposition)
				++this.oppositionCount;
		}
		this.reaction = this.reaction == reaction ? Reaction.None : reaction;
		Axios.put(
			"/api/news/reaction",
			{
				reaction: this.reaction,
			},
			{ params: { id: this.id } }
		).then(
			() => this.$forceUpdate(),
			(error: AxiosError) => ErrorHandler.axios(error, this.$router)
		);
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
					this.summary = [data.summary[0]];
				},
				(error: AxiosError) => ErrorHandler.axios(error, this.$router)
			),
			Axios.get<Partial<Record<Reaction, number[]>>>(
				"/api/news/reaction",
				{
					params: { id: this.id },
				}
			).then(async response => {
				const data = response.data;
				this.approvalCount = data[Reaction.Approval]?.length ?? 0;
				this.oppositionCount = data[Reaction.Opposition]?.length ?? 0;
				const user = (await Axios.get<User>("/api/user")).data;
				if (data[Reaction.Approval]?.includes(user.id))
					this.reaction = Reaction.Approval;
				else if (data[Reaction.Opposition]?.includes(user.id))
					this.reaction = Reaction.Opposition;
				else this.reaction = Reaction.None;
			}),
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
