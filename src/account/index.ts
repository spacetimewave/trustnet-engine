import { IAccount } from '../models/IAccount'
import { IBlock } from '../models/IBlock'
import { Core } from '../core'
import { IKeyPair } from '../models/IKeyPair'
import { ISeedBlock } from '../models/ISeedBlock'
import { IDnsRecord } from '../models/IDnsRecord'
import { IDnsRecordMessage } from '../models/IDnsRecordMessage'
import { IDnsProvider } from '../models/IDnsProvider'

export class Account {
	private core: Core

	public accountPublicKey?: string
	public blockPublicKey?: string
	private blockPrivateKey?: string

	// public accountDomains: IDomainName[] = []
	// public accountDomainRoutes: IDomainNameRoute[] = []

	private seedBlock?: ISeedBlock
	private accountBlocks: IBlock[] = []

	constructor(core: Core | undefined = undefined) {
		this.core = core ?? new Core()
	}

	async init(
		saveBlockPrivateKey?: boolean,
	): Promise<{ accountKeyPair: IKeyPair; blockKeyPair: IKeyPair }> {
		const accountKeyPair = await Core.generateSignatureKeyPair()
		const blockKeyPair = await Core.generateSignatureKeyPair()
		this.accountPublicKey = accountKeyPair.publicKey
		this.blockPublicKey = blockKeyPair.publicKey
		this.accountBlocks = []
		this.seedBlock = await Core.generateSeedBlock(
			accountKeyPair.publicKey,
			blockKeyPair.publicKey,
			1,
			1,
		)

		this.seedBlock = await Core.signSeedBlock(
			this.seedBlock,
			accountKeyPair.privateKey,
		)

		if (saveBlockPrivateKey) {
			this.blockPrivateKey = blockKeyPair.privateKey
		}

		return {
			accountKeyPair: accountKeyPair,
			blockKeyPair: blockKeyPair,
		}
	}

	isAccountInitialized(): boolean {
		return (
			this.accountPublicKey !== undefined &&
			this.blockPublicKey !== undefined &&
			this.seedBlock !== undefined
		)
	}

	isBlockPrivateKeyInitialized(): boolean {
		return this.blockPrivateKey !== undefined
	}

	async createNewBlock(
		content: string,
		blockPrivateKey?: string,
	): Promise<IBlock> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}

		const nextBlockId = this.accountBlocks.length + 1

		const unsignedblockHeader = await Core.generateBlockHeader(
			content,
			this.accountPublicKey!,
			this.blockPublicKey!,
			nextBlockId,
			1,
			1,
		)
		const signedBlockHeader = await Core.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const blockMetadata = Core.generateBlockMetadata(this.seedBlock!)
		const block = Core.generateBlock(signedBlockHeader, content, blockMetadata)
		this.accountBlocks.push(block)
		return block
	}

	async updateBlock(
		content: string,
		blockId: number,
		blockPrivateKey: string,
	): Promise<IBlock> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}
		const blockIndex = this.accountBlocks.findIndex(
			(block) => block.header.block_id === blockId,
		)
		if (blockIndex === -1) {
			throw new Error('Block not found')
		}

		const olderBlock = this.accountBlocks[blockIndex]

		const unsignedblockHeader = await Core.generateBlockHeader(
			content,
			this.accountPublicKey!,
			this.blockPublicKey!,
			olderBlock.header.block_id,
			olderBlock.header.update_id + 1,
			1,
		)
		const signedBlockHeader = await Core.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)
		const blockMetadata = Core.generateBlockMetadata(this.seedBlock!)
		const block = Core.generateBlock(signedBlockHeader, content, blockMetadata)
		this.accountBlocks[blockIndex] = block
		return block
	}

	async deleteBlock(blockId: number, blockPrivateKey: string): Promise<IBlock> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}
		const blockIndex = this.accountBlocks.findIndex(
			(block) => block.header.block_id === blockId,
		)
		if (blockIndex === -1) {
			throw new Error('Block not found')
		}

		const olderBlock = this.accountBlocks[blockIndex]

		const unsignedblockHeader = await Core.generateBlockHeader(
			'',
			this.accountPublicKey!,
			this.blockPublicKey!,
			olderBlock.header.block_id,
			olderBlock.header.update_id + 1,
			1,
		)
		const signedBlockHeader = await Core.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)
		const blockMetadata = Core.generateBlockMetadata(this.seedBlock!)
		const block = Core.generateBlock(signedBlockHeader, '', blockMetadata)
		this.accountBlocks[blockIndex] = block
		return block
	}

	async verifyBlock(blockId: number): Promise<boolean> {
		const blockIndex = this.accountBlocks.findIndex(
			(block) => block.header.block_id === blockId,
		)
		if (blockIndex === -1) {
			throw new Error('Block not found')
		}

		const block = this.accountBlocks[blockIndex]

		return await Core.verifyBlock(block)
	}

	async verifySeedBlock(): Promise<boolean> {
		if (this.seedBlock === undefined) {
			throw new Error('Seed block undefined')
		}
		return await Core.verifySeedBlockSignature(this.seedBlock!)
	}

	async exportAccount(): Promise<IAccount> {
		return {
			seedBlock: this.seedBlock!,
			accountBlocks: this.accountBlocks,
		}
	}

	async importAccount(
		seedBlock: ISeedBlock,
		accountBlocks: IBlock[],
	): Promise<void> {
		this.seedBlock = seedBlock
		this.accountBlocks = accountBlocks
	}

	public static async getNameServerByDomain(
		domainName: string,
	): Promise<IDnsProvider | undefined> {
		const nameServer = await Core.getNameServerByDomain(domainName)
		return nameServer
	}

	public async getDnsRecord(
		domainName: string,
		nameServerAddress: string,
	): Promise<IDnsRecord | undefined> {
		return await this.core.getDnsRecord(domainName, nameServerAddress)
	}

	public async createDnsRecord(
		domainName: string,
		hostingProviderAddresses: string[],
		blockPrivateKey?: string,
	): Promise<void> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}

		const dnsRecord: IDnsRecord = {
			domainName: domainName,
			accountPublicKey: this.accountPublicKey!,
			hostingProviderAddresses: hostingProviderAddresses,
		}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			dnsRecord,
			this.accountPublicKey!,
			blockPrivateKey ?? this.blockPrivateKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const dnsRecordMessage: IDnsRecordMessage = Core.generateMessage(
			signedMessageHeader,
			dnsRecord,
			messageMetadata,
		)
		const nameServer = await Account.getNameServerByDomain(domainName)

		return await this.core.createDnsRecord(
			dnsRecordMessage,
			nameServer!.nameServerAddress[0],
		)
	}

	public async updateDnsRecord(
		domainName: string,
		hostingProviderAddresses: string[],
		blockPrivateKey?: string,
	): Promise<void> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}
		const dnsRecord: IDnsRecord = {
			domainName: domainName,
			accountPublicKey: this.accountPublicKey!,
			hostingProviderAddresses: hostingProviderAddresses,
		}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			dnsRecord,
			this.accountPublicKey!,
			blockPrivateKey ?? this.blockPrivateKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const dnsRecordMessage: IDnsRecordMessage = Core.generateMessage(
			signedMessageHeader,
			dnsRecord,
			messageMetadata,
		)
		const nameServer = await Account.getNameServerByDomain(domainName)

		return await this.core.updateDnsRecord(
			dnsRecordMessage,
			nameServer!.nameServerAddress[0],
		)
	}

	public async deleteDnsRecord(
		domainName: string,
		hostingProviderAddresses: string[],
		blockPrivateKey?: string,
	): Promise<void> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}
		const dnsRecord: IDnsRecord = {
			domainName: domainName,
			accountPublicKey: this.accountPublicKey!,
			hostingProviderAddresses: hostingProviderAddresses,
		}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			dnsRecord,
			this.accountPublicKey!,
			blockPrivateKey ?? this.blockPrivateKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const dnsRecordMessage: IDnsRecordMessage = Core.generateMessage(
			signedMessageHeader,
			dnsRecord,
			messageMetadata,
		)
		const nameServer = await Account.getNameServerByDomain(domainName)
		return await this.core.deleteDnsRecord(
			dnsRecordMessage,
			nameServer!.nameServerAddress[0],
		)
	}
}
