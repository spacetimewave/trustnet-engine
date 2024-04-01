import { Web3 } from 'web3'
import type { IBlockHeader } from '../models/IBlockHeader'
import { Cryptography } from '../cryptography'

export class API {
	public web3: Web3
	public BLOCKCHAIN_DEFAULT_PROVIDER: string = 'http://localhost:7545'

	constructor(provider: string | undefined) {
		this.web3 = new Web3(provider ?? this.BLOCKCHAIN_DEFAULT_PROVIDER)
	}

	public static async hash(message: string): Promise<string> {
		return await Cryptography.hash(message)
	}

	public static async sign(
		message: string,
		privateKey: string,
	): Promise<string> {
		return await Cryptography.sign(message, privateKey)
	}

	public static async verify(
		message: string,
		signature: string,
		publicKey: string,
	): Promise<boolean> {
		return await Cryptography.verify(message, signature, publicKey)
	}

	public static async generateBlockHeader(
		content: string,
		address: string,
		blockId: number,
		updateId: number,
		version: number = 1,
	): Promise<IBlockHeader> {
		const header: IBlockHeader = {
			version,
			output_hash: await this.hash(JSON.stringify(content)),
			address,
			block_id: blockId,
			update_id: updateId,
			signature: null,
		}
		return header
	}

	public static async signBlockHeader(
		header: IBlockHeader,
		privateKey: string,
	): Promise<IBlockHeader> {
		const information =
			header.version +
			header.output_hash +
			header.address +
			header.block_id +
			header.update_id
		header.signature = await this.sign(information, privateKey)
		return header
	}

	public static async verifyBlockHeaderSignature(
		header: IBlockHeader,
		publicKey: string,
	): Promise<boolean> {
		const information =
			header.version +
			header.output_hash +
			header.address +
			header.block_id +
			header.update_id
		return await this.verify(information, header.signature ?? '', publicKey)
	}

	public async verifyBlock(): Promise<void> {}
	public async getAccountProviders(): Promise<void> {}
	public async getUsername(): Promise<void> {}
	public async getGenesisBlock(): Promise<void> {}
	public async getBlock(): Promise<void> {}
	public async signGenesisBlock(): Promise<void> {}
	public async validateGenesisBlock(): Promise<void> {}
	public async post(): Promise<void> {}
	public async generateKeyPair(): Promise<void> {}
	public async encrypt(): Promise<void> {}
	public async decrypt(): Promise<void> {}
}
