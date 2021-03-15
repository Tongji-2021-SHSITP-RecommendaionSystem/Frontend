import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import HomeView from "../views/Home.vue"
import About from "../views/About.vue"
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
		path: "/about",
		name: "About",
		component: About
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
		path: "/news?id=:id",
		name: "News",
		component: NewsView,
		props: true,
	},
	{
		path: "/exception?status=:status",
		name: "Exception",
		component: ExceptionView,
		props: true
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
router.beforeEach((to, from, next) => {
	if (to.name == "Exception") {
		if (to.params.status == "401")
			next({ name: "Login" });
		else
			next();
	}
	else
		next();
})
export default router
