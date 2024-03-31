/* eslint-disable object-shorthand */
import { Web3 } from 'web3'

export class User {
	public publicKey: string
	public privateKey: string | undefined

	public blocked: boolean = false
	public signaturePassword: string | undefined
	public signatureProof: string | undefined

	public usernames: string[] = []
	public blockchain: string[] = []
	public providers: string[] = []

	public web3: Web3
	public BLOCKCHAIN_DEFAULT_PROVIDER: string = 'http://localhost:7545'

	constructor(publicKey: string, privateKey: string | undefined = undefined, node: string | undefined) {
		this.publicKey = publicKey
		this.privateKey = privateKey
		this.web3 = new Web3(node ?? this.BLOCKCHAIN_DEFAULT_PROVIDER)
	}

	public async getAccountProviders(): Promise<void> {}
	public async getUsername(): Promise<void> {}
	public async getGenesisBlock(): Promise<void> {}
	public async getBlock(): Promise<void> {}

	public async signGenesisBlock(): Promise<void> {}
	public async validateGenesisBlock(): Promise<void> {}

	public hash(message: string): string | undefined {
		const hash = this.web3.utils.sha3(message)
		return hash
	}

	public async sign(message: string, privateKey: string): Promise<string> {
		try {
			if (privateKey === undefined) {
				throw Error()
			}

			const hash = this.hash(message)
			if (hash === undefined) {
				throw Error()
			}

			const signature = this.web3.eth.accounts.sign(hash, privateKey).signature

			return signature
		} catch (err) {
			throw Error()
		}
	}

	public async buildHeader(
		content: string,
		blockId: number,
		updateId: number,
	): Promise<any> {
		content = JSON.stringify(content)
		const outputHash = this.hash(content)
		const address = this.publicKey
		const information = blockId + updateId + address + outputHash
		const privateKey = '0x00000'

		const signature = await this.sign(information, privateKey)

		const header = {
			address: address,
			output_hash: outputHash,
			block_id: blockId,
			update_id: updateId,
			signature: signature,
		}

		return header
	}

	public async post(): Promise<void> {}
	public async verifyBlock(): Promise<void> {}

	public async verifyHeader(): Promise<void> {}

	public async generateKeyPair(): Promise<void> {}
	public async encrypt(): Promise<void> {}
	public async decrypt(): Promise<void> {}
}
