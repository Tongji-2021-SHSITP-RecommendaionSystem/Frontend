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
		component: LoginView
	},
	{
		path: "/register",
		name: "Register",
		component: RegisterView
	},
	{
		path: "/news?id=:id",
		name: "News",
		props: true,
		component: NewsView
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
	routes
});
router.replace("/login");
export default router
