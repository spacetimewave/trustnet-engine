import { NAME_SERVERS } from '../constants/dns'
import { Cryptography } from '../cryptography'
import http from '../http'
import type { IBlock } from '../models/IBlock'
import type { IBlockHeader } from '../models/IBlockHeader'
import type { IBlockMetadata } from '../models/IBlockMetadata'
import { IDnsProvider } from '../models/IDnsProvider'
import { IDnsRecord } from '../models/IDnsRecord'
import {
	IGetDnsRecordMessage,
	ICreateDnsRecordMessage,
	IUpdateDnsRecordMessage,
	IDeleteDnsRecordMessage,
} from '../models/IDnsRecordMessage'
import type { IKeyPair } from '../models/IKeyPair'
import { IMessage } from '../models/IMessage'
import { IMessageHeader } from '../models/IMessageHeader'
import { IMessageMetadata } from '../models/IMessageMetadata'
import type { ISeedBlock } from '../models/ISeedBlock'

export class Core {
	public http: http

	constructor(http_module: http | undefined = undefined) {
		this.http = http_module ?? new http()
	}

	public static async hash(message: string): Promise<string> {
		return Cryptography.hash(message)
	}

	public static async generateSignatureKeyPair(): Promise<IKeyPair> {
		return await Cryptography.generateSignatureKeyPair()
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
		publicKey: string,
		blockId: number,
		updateId: number,
		version: number = 1,
	): Promise<IBlockHeader> {
		const header: IBlockHeader = {
			version,
			output_hash: await this.hash(JSON.stringify(content)),
			address,
			public_key: publicKey,
			block_id: blockId,
			update_id: updateId,
			signature: undefined,
		}
		return header
	}

	public static async generateSeedBlock(
		address: string,
		publicKey: string,
		updateId: number,
		version: number = 1,
	): Promise<ISeedBlock> {
		const header: ISeedBlock = {
			version,
			address,
			public_key: publicKey,
			update_id: updateId,
			signature: undefined,
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
			header.public_key +
			header.block_id +
			header.update_id
		header.signature = await this.sign(information, privateKey)
		return header
	}

	public static async signSeedBlock(
		block: ISeedBlock,
		privateKey: string,
	): Promise<ISeedBlock> {
		const information =
			block.version + block.address + block.public_key + block.update_id
		block.signature = await this.sign(information, privateKey)
		return block
	}

	public static async verifyBlockHeaderSignature(
		header: IBlockHeader,
	): Promise<boolean> {
		const information =
			header.version +
			header.output_hash +
			header.address +
			header.public_key +
			header.block_id +
			header.update_id
		return await this.verify(
			information,
			header.signature ?? '',
			header.public_key,
		)
	}

	public static async verifySeedBlockSignature(
		block: ISeedBlock,
	): Promise<boolean> {
		const information =
			block.version + block.address + block.public_key + block.update_id
		return await this.verify(information, block.signature ?? '', block.address)
	}

	public static async verifyBlockContent(block: IBlock): Promise<boolean> {
		return (
			(await this.hash(JSON.stringify(block.content))) ===
			block.header.output_hash
		)
	}

	public static verifyBlockAddress(block: IBlock): boolean {
		return block.header.address === block.metadata.seed_block?.address
	}

	public static verifyBlockPublicKey(block: IBlock): boolean {
		return block.header.public_key === block.metadata.seed_block?.public_key
	}

	public static generateBlockMetadata(seedBlock: ISeedBlock): IBlockMetadata {
		const metadata: IBlockMetadata = { seed_block: seedBlock }
		return metadata
	}

	public static generateBlock(
		header: IBlockHeader,
		content: string,
		metadata: IBlockMetadata,
	): IBlock {
		const block: IBlock = { header, content, metadata }
		return block
	}

	public static async signBlock(
		block: IBlock,
		privateKey: string,
	): Promise<IBlock> {
		block.header = await this.signBlockHeader(block.header, privateKey)
		return block
	}

	public static async verifyBlock(block: IBlock): Promise<boolean> {
		return (
			(await this.verifyBlockContent(block)) &&
			this.verifyBlockAddress(block) &&
			this.verifyBlockPublicKey(block) &&
			(await this.verifyBlockHeaderSignature(block.header)) &&
			(await this.verifySeedBlockSignature(block.metadata.seed_block))
		)
	}

	public static async generateMessageHeader(
		content: any,
		address: string,
		publicKey: string,
		version: number = 1,
	): Promise<IMessageHeader> {
		const header: IMessageHeader = {
			version,
			output_hash: await this.hash(JSON.stringify(content)),
			address,
			public_key: publicKey,
			signature: undefined,
		}
		return header
	}

	public static generateMessageMetadata(
		seedBlock: ISeedBlock,
	): IMessageMetadata {
		const metadata: IMessageMetadata = { seed_block: seedBlock }
		return metadata
	}

	public static generateMessage(
		header: IMessageHeader,
		content: any,
		metadata: IMessageMetadata,
	): IMessage {
		const message: IMessage = { header, content, metadata }
		return message
	}

	public static async signMessageHeader(
		header: IMessageHeader,
		privateKey: string,
	): Promise<IMessageHeader> {
		const information =
			header.version + header.output_hash + header.address + header.public_key
		header.signature = await this.sign(information, privateKey)
		return header
	}

	public static async signMessage(
		message: IMessage,
		privateKey: string,
	): Promise<IMessage> {
		message.header = await this.signMessageHeader(message.header, privateKey)
		return message
	}

	public static async verifyMessageContent(
		message: IMessage,
	): Promise<boolean> {
		return (
			(await this.hash(JSON.stringify(message.content))) ===
			message.header.output_hash
		)
	}

	public static verifyMessageAddress(message: IMessage): boolean {
		return message.header.address === message.metadata.seed_block?.address
	}

	public static verifyMessagePublicKey(message: IMessage): boolean {
		return message.header.public_key === message.metadata.seed_block?.public_key
	}

	public static async verifyMessageHeaderSignature(
		header: IMessageHeader,
	): Promise<boolean> {
		const information =
			header.version + header.output_hash + header.address + header.public_key
		return await this.verify(
			information,
			header.signature ?? '',
			header.public_key,
		)
	}

	public static async verifyMessage(message: IMessage): Promise<boolean> {
		return (
			(await this.verifyMessageContent(message)) &&
			this.verifyMessageAddress(message) &&
			this.verifyMessagePublicKey(message) &&
			(await this.verifyMessageHeaderSignature(message.header)) &&
			(await this.verifySeedBlockSignature(message.metadata.seed_block))
		)
	}

	public static async getNameServerByDomain(
		domainName: string,
	): Promise<IDnsProvider | undefined> {
		const domainExtension = domainName.split('.').pop()
		if (!domainExtension) {
			throw new Error('Invalid domain name')
		}
		const nameServer = await Core.getNameServerByExtension(domainExtension)
		if (!nameServer) {
			throw new Error('Name server not found')
		}
		return nameServer
	}

	// TODO: Implement NAME_SERVER distributed repository
	public static async getNameServerByExtension(
		domainExtension: string,
	): Promise<IDnsProvider | undefined> {
		return NAME_SERVERS.find((ns) => ns.domainExtension === domainExtension)
	}

	public async getDnsRecord(
		dnsRecordMessage: IGetDnsRecordMessage,
		nameServerAddress: string,
	): Promise<IDnsRecord | undefined> {
		const response = await this.http.get(
			`${nameServerAddress}/api/v1/dns/record`,
			dnsRecordMessage,
		)

		if (response.status === 404 || !response.ok) {
			console.log(response)
			return undefined
		}

		const dnsRecord: IDnsRecord = await response.json()
		return dnsRecord
	}

	public async createDnsRecord(
		dnsRecordMessage: ICreateDnsRecordMessage,
		nameServerAddress: string,
	): Promise<void> {
		const response = await this.http.post(
			`${nameServerAddress}/api/v1/dns/record`,
			dnsRecordMessage,
		)
		if (response.status === 201 || response.status === 200) {
			return
		} else {
			throw new Error('Failed to create domain name entry')
		}
	}

	public async updateDnsRecord(
		dnsRecordMessage: IUpdateDnsRecordMessage,
		nameServerAddress: string,
	): Promise<void> {
		const response = await this.http.put(
			`${nameServerAddress}/api/v1/dns/record`,
			dnsRecordMessage,
		)
		if (response.status === 204 || response.status === 200) {
			return
		} else {
			throw new Error('Failed to create domain name entry')
		}
	}

	public async deleteDnsRecord(
		dnsRecordMessage: IDeleteDnsRecordMessage,
		domainAddress: string,
	): Promise<void> {
		const response = await this.http.delete(
			`${domainAddress}/api/v1/dns/record`,
			dnsRecordMessage,
		)
		if (response.status === 200 || response.status === 204) {
			return
		} else {
			throw new Error('Failed to delete domain name entry')
		}
	}

	// public static async getUserSeedBlockByUsername(
	// 	username: string,
	// 	domainUrl: string,
	// ): Promise<ISeedBlock | undefined> {

	// }

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
