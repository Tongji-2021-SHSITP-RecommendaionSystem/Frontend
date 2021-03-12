<template>
	<div class="about">
		<h1>This is an about page</h1>
		<div class="ui labeled button">
			<div class="ui red button">
				<i class="heart icon"></i> Like
			</div>
			<a class="ui basic red left pointing label">1,048</a>
		</div>
		<button class="ui primary double loading button">Loading</button>
	</div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component"

export default class About extends Vue { }
</script>