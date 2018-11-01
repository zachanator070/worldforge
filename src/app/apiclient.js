import ApiError from "./exceptions";

class ApiClient {

	static WIKI_PLACE='place';
	static WIKI_PERSON = 'person';
	static WIKI_ITEM = 'item';
	static WIKI_ABILITY = 'ability';
	static WIKI_SPELL = 'spell';
	static WIKI_ARTICLE = 'article';

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
		return await this.checkForGoodResponse(response);
	}

	async getCurrentUser() {
		let response = await fetch(
			'/api/users/current',
			{
				method: "GET"
			}
		);
		return await this.jsonOrError(response);
	}

	async logout() {
		let response = await fetch(
			'/api/auth/logout',
			{
				method: "GET",
			}
		);
	}

	async isAuthed(){
		const response = await fetch(
			'/api/auth/session/check',
			{
				method: 'GET'
			}
		);
		return response.status === 200;
	}

	async register(email, password, displayName) {
		let response = await fetch(
			'/api/auth/register',
			{
				method: "POST",
				body: JSON.stringify({email: email, password: password, displayName: displayName}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return await this.jsonOrError(response);
	}

	async fetchAvailableWorlds() {
		let response = await fetch(
			'/api/worlds',
			{
				method: 'GET'
			}
		);
		return await this.jsonOrError(response);
	}

	async createWorld(name, isPublic){
		let response = await fetch(
			'/api/worlds',
			{
				method: 'POST',
				body: JSON.stringify({name: name, public: isPublic}),
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				}
			}
		);
		return await this.jsonOrError(response);
	};

	async getUser(id){
		let response = await fetch(
			`/api/users/${id}`,
			{
				method: 'GET'
			}
		);
		return await this.jsonOrError(response);
	}

	async setCurrentWorld(world){
		let response = await fetch(
			`/api/users/current`,
			{
				method: 'PUT',
				body: JSON.stringify({currentWorld: world._id}),
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				}
			}
		);
		return await this.jsonOrError(response);
	}

	async getWorld(id){
		let getWorldResponse = await fetch(
			`/api/worlds/${id}`,
			{
				method: 'GET'
			}
		);
		return await this.jsonOrError(getWorldResponse);
	}

	async updateWorld(world){
		let response = await fetch(
			`/api/worlds/${world._id}`,
			{
				method: 'PUT',
				body: JSON.stringify(world),
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				}
			}
		);
		return await this.jsonOrError(response);
	}

	async createWikiPage(name, worldId, type){
		let response = await fetch(
			'/api/wikiPages',
			{
				method: 'POST',
				body: JSON.stringify({name: name, world: worldId, type: type}),
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				}
			}
		);
		return await this.jsonOrError(response);
	}

	async updateWiki(wiki){
		let response = await fetch(
			`/api/wikiPages/${wiki._id}`,
			{
				method: 'PUT',
				body: JSON.stringify(wiki),
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				}
			}
		);
		return await this.jsonOrError(response);
	}

	async jsonOrError(response){
		const payload = await response.json();

		if(response.status === 200){
			return payload;
		}
		throw new ApiError(payload.error || payload.message);
	}

	async checkForGoodResponse(response){
		if(response.status === 200){
			return true;
		}
		const payload = await response.json();
		throw new ApiError(payload.error || payload.message);
	}

	async postImage(file){
		const formData  = new FormData();
		formData.append('data', file);
		let response = await fetch(
			'/api/images',
			{
				method: 'POST',
				body: formData
			}
		);
		return await this.jsonOrError(response);
	}

	async getImage(id){
		let response = await fetch(
			`/api/images/${id}`,
			{
				method: 'GET',
			}
		);
		return await this.jsonOrError(response);
	}

	async getWiki(id){
		let response = await fetch(
			`/api/wikiPages/${id}`,
			{
				method: 'GET',
			}
		);
		return await this.jsonOrError(response);
	}

	async getChunks(imageId){
		let response = await fetch(
			`/api/chunks/?imageId=${imageId}`,
			{
				method: 'GET',
			}
		);
		return await this.jsonOrError(response);
	}

	async getChunk(chunkId){
		let response = await fetch(
			`/api/chunks/data/${chunkId}`,
			{
				method: 'GET',
			}
		);
		return await response.arrayBuffer();
	}
}

export default ApiClient;