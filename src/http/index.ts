class http {
	constructor() {}

	public async request(url: string, options: RequestInit): Promise<Response> {
		const response = await fetch(`${url}`, options)
		return response
	}

	public async get(url: string): Promise<Response> {
		return this.request(url, { method: 'GET' })
	}

	public async post(url: string, data?: any): Promise<Response> {
		return this.request(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})
	}

	public async put(url: string, data?: any): Promise<Response> {
		return this.request(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})
	}

	public async delete(url: string): Promise<Response> {
		return this.request(url, { method: 'DELETE' })
	}
}

export default http
