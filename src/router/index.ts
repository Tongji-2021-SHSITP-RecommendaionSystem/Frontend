import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import HomeView from "../views/Home.vue"
import LoginView from "../views/Login.vue"
import RegisterView from "../views/Register.vue"
import NewsView from "../views/News.vue"
import ExceptionView from "../views/Exception.vue"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: HomeView
	},
	{
		path: "/login",
		name: "Login",
		component: LoginView,
		props: true
	},
	{
		path: "/register",
		name: "Register",
		component: RegisterView
	},
	{
		path: "/news",
		name: "News",
		component: NewsView,
		props: route => ({ id: route.query.id })
	},
	{
		path: "/exception",
		name: "Exception",
		component: ExceptionView,
		props: true
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
router.beforeEach((to, from, next) => {
	const pFrom = JSON.stringify({
		name: from.name,
		query: from.query,
		params: from.params
	});
	if (to.name == "Exception") {
		if (to.params.status == "401")
			next({
				name: "Login",
				params: { pFrom: pFrom }
			});
		else
			next();
	}
	else
		next();
});
export default router;
