import { AxiosError } from "axios";
import { Router } from "vue-router";

export default class ErrorHandler {
	public static axios(error: AxiosError, router: Router, message?: string) {
		console.log(error);
		router.push({
			name: "Exception",
			params: {
				status: error.response!.status,
				message: message ?? error.response!.statusText
			}
		})
	}
}