import { IAccount } from '../models/IAccount'
import { IBlock } from '../models/IBlock'
import { Core } from '../core'
import { IKeyPair } from '../models/IKeyPair'
import { ISeedBlock } from '../models/ISeedBlock'
import { IDnsRecord } from '../models/IDnsRecord'
import {
	ICreateDnsRecordContent,
	ICreateDnsRecordMessage,
	IDeleteDnsRecordContent,
	IDeleteDnsRecordMessage,
	IGetDnsRecordContent,
	IGetDnsRecordMessage,
	IGetDnsRecordUnauthenticatedMessage,
	IUpdateDnsRecordContent,
	IUpdateDnsRecordMessage,
} from '../models/IDnsRecordMessage'
import { IDnsProvider } from '../models/IDnsProvider'
import { IMessage } from '../models/IMessage'
import {
	ICreateDnsProviderInMarketplaceContent,
	ICreateDnsProviderInMarketplaceMessage,
	IDeleteDnsProviderInMarketplaceContent,
	IDeleteDnsProviderInMarketplaceMessage,
	IGetDnsProvidersFromMarketplaceContent,
	IGetDnsProvidersFromMarketplaceUnauthenticatedMessage,
	IUpdateDnsProviderInMarketplaceContent,
	IUpdateDnsProviderInMarketplaceMessage,
} from '../models/IDnsMarketplaceMessage'
import {
	ICreateHostingProviderInMarketplaceContent,
	ICreateHostingProviderInMarketplaceMessage,
	IDeleteHostingProviderInMarketplaceContent,
	IDeleteHostingProviderInMarketplaceMessage,
	IGetHostingProvidersFromMarketplaceContent,
	IGetHostingProvidersFromMarketplaceUnauthenticatedMessage,
	IUpdateHostingProviderInMarketplaceContent,
	IUpdateHostingProviderInMarketplaceMessage,
} from '../models/IHostingMarketplaceMessage'
import { IHostingProvider } from '../models/IHostingProvider'

export class Account {
	private core: Core

	public accountPublicKey?: string
	public blockPublicKey?: string
	private blockPrivateKey?: string

	// public accountDomains: IDomainName[] = []
	// public accountDomainRoutes: IDomainNameRoute[] = []

	public seedBlock?: ISeedBlock
	private accountBlocks: IBlock[] = []

	constructor(core: Core | undefined = undefined) {
		this.core = core ?? new Core()
	}

	async init(): Promise<{ accountKeyPair: IKeyPair; blockKeyPair: IKeyPair }> {
		const accountKeyPair = await Core.generateSignatureKeyPair()
		const blockKeyPair = await Core.generateSignatureKeyPair()
		this.accountPublicKey = accountKeyPair.publicKey
		this.blockPublicKey = blockKeyPair.publicKey
		this.blockPrivateKey = blockKeyPair.privateKey

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

		return {
			accountKeyPair: accountKeyPair,
			blockKeyPair: blockKeyPair,
		}
	}

	async login(
		domainName: string,
		blockPrivateKeyPair: string,
	): Promise<boolean> {
		try {
			const seedBlock =
				await this.core.getAccountSeedBlockByUsernameUnauthenticated(domainName)

			if (seedBlock === undefined) {
				throw new Error('Seed block not found')
			}

			if (
				(await Core.verifyBlockPrivateKeyWithSeedBlock(
					blockPrivateKeyPair,
					seedBlock,
				)) === false
			) {
				throw new Error('Block Private Key does not match seed block')
			}

			this.accountPublicKey = seedBlock.address
			this.blockPublicKey = seedBlock.public_key
			this.blockPrivateKey = blockPrivateKeyPair
			this.seedBlock = seedBlock
			this.accountBlocks = []
			return true
		} catch (error) {
			return false
		}
	}

	async signup(domainName: string, hostingProviderAddresses: string[]) {
		const { accountKeyPair, blockKeyPair } = await this.init()
		const dnsRecord = await this.createDnsRecord(
			domainName,
			hostingProviderAddresses,
		)
		if (dnsRecord === undefined) {
			throw new Error('Could not create domain name')
		}
		const seedBlock = await this.core.createAccountSeedBlock(
			this.seedBlock!,
			hostingProviderAddresses,
		)
		if (seedBlock === undefined) {
			throw new Error('Could not create seed block')
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

	static async verifySeedBlock(seedBlock: ISeedBlock): Promise<boolean> {
		return await Core.verifySeedBlockSignature(seedBlock)
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

	public async getDnsRecordUnauthenticated(
		domainName: string,
	): Promise<IDnsRecord | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		const getDnsRecordContent: IGetDnsRecordContent = {
			domainName: domainName,
		}

		const getDnsRecordMessage: IGetDnsRecordUnauthenticatedMessage =
			Core.generateUnathenticatedMessage(getDnsRecordContent)
		const nameServer = await Account.getNameServerByDomain(domainName)
		return await this.core.getDnsRecordUnauthenticated(
			getDnsRecordMessage,
			nameServer!.nameServerAddress[0],
		)
	}

	public async getDnsRecord(
		domainName: string,
		blockPrivateKey?: string,
	): Promise<IDnsRecord | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}
		const getDnsRecordContent: IGetDnsRecordContent = {
			domainName: domainName,
		}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			getDnsRecordContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const getDnsRecordMessage: IGetDnsRecordMessage = Core.generateMessage(
			signedMessageHeader,
			getDnsRecordContent,
			messageMetadata,
		)
		const nameServer = await Account.getNameServerByDomain(domainName)
		return await this.core.getDnsRecord(
			getDnsRecordMessage,
			nameServer!.nameServerAddress[0],
		)
	}

	public async createDnsRecord(
		domainName: string,
		hostingProviderAddresses: string[],
		blockPrivateKey?: string,
	): Promise<IDnsRecord> {
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
		const createDnsRecordContent: ICreateDnsRecordContent = {
			dnsRecord: dnsRecord,
		}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			createDnsRecordContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const dnsRecordMessage: ICreateDnsRecordMessage = Core.generateMessage(
			signedMessageHeader,
			createDnsRecordContent,
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
		const updateDnsRecordContent: IUpdateDnsRecordContent = {
			dnsRecord: dnsRecord,
		}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			updateDnsRecordContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const dnsRecordMessage: IUpdateDnsRecordMessage = Core.generateMessage(
			signedMessageHeader,
			updateDnsRecordContent,
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
		blockPrivateKey?: string,
	): Promise<void> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}
		const deleteDnsRecordContent: IDeleteDnsRecordContent = {
			domainName: domainName,
		}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			deleteDnsRecordContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const dnsRecordMessage: IDeleteDnsRecordMessage = Core.generateMessage(
			signedMessageHeader,
			deleteDnsRecordContent,
			messageMetadata,
		)
		const nameServer = await Account.getNameServerByDomain(domainName)
		return await this.core.deleteDnsRecord(
			dnsRecordMessage,
			nameServer!.nameServerAddress[0],
		)
	}

	public async getDnsProvidersFromMarketplaceUnauthenticated(
		search: string,
		marketplaceAddress: string,
	): Promise<IDnsProvider | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		const getDnsProvidersFromMarketplaceContent: IGetDnsProvidersFromMarketplaceContent =
			{
				search: search,
			}

		const getDnsProvidersFromMarketplaceMessage: IGetDnsProvidersFromMarketplaceUnauthenticatedMessage =
			Core.generateUnathenticatedMessage(getDnsProvidersFromMarketplaceContent)
		return await this.core.getDnsProvidersFromMarketplaceUnauthenticated(
			getDnsProvidersFromMarketplaceMessage,
			marketplaceAddress,
		)
	}

	public async createDnsProviderInMarketplace(
		dnsProvider: IDnsProvider,
		marketplaceAddress: string,
		blockPrivateKey?: string,
	): Promise<IDnsProvider | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}

		const getDnsProvidersFromMarketplaceContent: ICreateDnsProviderInMarketplaceContent =
			{
				dnsProvider,
			}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			getDnsProvidersFromMarketplaceContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const getDnsProvidersFromMarketplaceMessage: ICreateDnsProviderInMarketplaceMessage =
			Core.generateMessage(
				signedMessageHeader,
				getDnsProvidersFromMarketplaceContent,
				messageMetadata,
			)
		return await this.core.addDnsProviderToMarketplace(
			getDnsProvidersFromMarketplaceMessage,
			marketplaceAddress,
		)
	}

	public async updateDnsProviderInMarketplace(
		dnsProvider: IDnsProvider,
		marketplaceAddress: string,
		blockPrivateKey?: string,
	): Promise<IDnsProvider | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}

		const updateDnsProvidersFromMarketplaceContent: IUpdateDnsProviderInMarketplaceContent =
			{
				dnsProvider,
			}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			updateDnsProvidersFromMarketplaceContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const getDnsProvidersFromMarketplaceMessage: IUpdateDnsProviderInMarketplaceMessage =
			Core.generateMessage(
				signedMessageHeader,
				updateDnsProvidersFromMarketplaceContent,
				messageMetadata,
			)
		return await this.core.updateDnsProviderToMarketplace(
			getDnsProvidersFromMarketplaceMessage,
			marketplaceAddress,
		)
	}

	public async deleteDnsProviderInMarketplace(
		dnsExtension: string,
		marketplaceAddress: string,
		blockPrivateKey?: string,
	): Promise<IDnsProvider | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}

		const deleteDnsProvidersFromMarketplaceContent: IDeleteDnsProviderInMarketplaceContent =
			{
				dnsExtension,
			}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			deleteDnsProvidersFromMarketplaceContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const deleteDnsProvidersFromMarketplaceMessage: IDeleteDnsProviderInMarketplaceMessage =
			Core.generateMessage(
				signedMessageHeader,
				deleteDnsProvidersFromMarketplaceContent,
				messageMetadata,
			)
		return await this.core.deleteDnsProviderToMarketplace(
			deleteDnsProvidersFromMarketplaceMessage,
			marketplaceAddress,
		)
	}

	public async getHostingProvidersFromMarketplaceUnauthenticated(
		search: string,
		marketplaceAddress: string,
	): Promise<IHostingProvider | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		const getHostingProvidersFromMarketplaceContent: IGetHostingProvidersFromMarketplaceContent =
			{
				search: search,
			}

		const getHostingProvidersFromMarketplaceMessage: IGetHostingProvidersFromMarketplaceUnauthenticatedMessage =
			Core.generateUnathenticatedMessage(
				getHostingProvidersFromMarketplaceContent,
			)
		return await this.core.getHostingProvidersFromMarketplaceUnauthenticated(
			getHostingProvidersFromMarketplaceMessage,
			marketplaceAddress,
		)
	}

	public async createHostingProviderInMarketplace(
		hostingProvider: IHostingProvider,
		marketplaceAddress: string,
		blockPrivateKey?: string,
	): Promise<IHostingProvider | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}

		const createDnsProvidersFromMarketplaceContent: ICreateHostingProviderInMarketplaceContent =
			{
				hostingProvider,
			}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			createDnsProvidersFromMarketplaceContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const createDnsProvidersFromMarketplaceMessage: ICreateHostingProviderInMarketplaceMessage =
			Core.generateMessage(
				signedMessageHeader,
				createDnsProvidersFromMarketplaceContent,
				messageMetadata,
			)
		return await this.core.addHostingProviderToMarketplace(
			createDnsProvidersFromMarketplaceMessage,
			marketplaceAddress,
		)
	}

	public async updateHostingProviderInMarketplace(
		hostingProvider: IHostingProvider,
		marketplaceAddress: string,
		blockPrivateKey?: string,
	): Promise<IHostingProvider | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}

		const updateDnsProvidersFromMarketplaceContent: IUpdateHostingProviderInMarketplaceContent =
			{
				hostingProvider,
			}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			updateDnsProvidersFromMarketplaceContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const updateDnsProvidersFromMarketplaceMessage: IUpdateHostingProviderInMarketplaceMessage =
			Core.generateMessage(
				signedMessageHeader,
				updateDnsProvidersFromMarketplaceContent,
				messageMetadata,
			)
		return await this.core.updateHostingProviderToMarketplace(
			updateDnsProvidersFromMarketplaceMessage,
			marketplaceAddress,
		)
	}

	public async deleteHostingProviderInMarketplace(
		hostingName: string,
		marketplaceAddress: string,
		blockPrivateKey?: string,
	): Promise<IHostingProvider | undefined> {
		if (!this.isAccountInitialized()) {
			throw new Error('Account not initialized')
		}
		if (blockPrivateKey === undefined && !this.isBlockPrivateKeyInitialized()) {
			throw new Error('Private key not initialized')
		}

		const updateDnsProvidersFromMarketplaceContent: IDeleteHostingProviderInMarketplaceContent =
			{
				hostingName,
			}
		const messageMetadata = Core.generateMessageMetadata(this.seedBlock!)
		const unsignedMessageHeader = await Core.generateMessageHeader(
			updateDnsProvidersFromMarketplaceContent,
			this.accountPublicKey!,
			this.blockPublicKey!,
		)
		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const deleteDnsProvidersFromMarketplaceMessage: IDeleteHostingProviderInMarketplaceMessage =
			Core.generateMessage(
				signedMessageHeader,
				updateDnsProvidersFromMarketplaceContent,
				messageMetadata,
			)
		return await this.core.deleteHostingProviderToMarketplace(
			deleteDnsProvidersFromMarketplaceMessage,
			marketplaceAddress,
		)
	}

	static async verifyMessage(message: IMessage): Promise<boolean> {
		return await Core.verifyMessage(message)
	}
}
