export interface IMessageHeader {
	version: number
	output_hash: string
	address: string
	public_key: string
	signature: string | undefined
}
