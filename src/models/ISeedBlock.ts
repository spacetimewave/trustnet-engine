export interface ISeedBlock {
	version: number
	address: string
	public_key: string
	update_id: number
	signature: string | undefined
}
