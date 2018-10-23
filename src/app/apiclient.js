import ApiError from "./exceptions";

class ApiClient {
	async login(username, password) {
		let response = await fetch(
			'/api/auth/login',
			{
				method: "POST",
				body: JSON.stringify({email: username, password: password}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if(response.status === 200){
			return true;
		}
		else {
			let error = await response.json();
			throw new ApiError(error.error || error.message);
		}
	}

	async getCurrentUser() {
		let response = await fetch(
			'/api/users/current',
			{
				method: "GET"
			}
		);

		if(response.status === 200){
			return response.json();
		}
		else {
			throw ApiError(await response.json());
		}
	}

	async logout() {
		let response = await fetch(
			'/api/auth/logout',
			{
				method: "GET",
			}
		);
		if(response.status === 200){
			return true;
		}
		else {
			throw ApiError(await response.json());
		}
	}
}

export default ApiClient;