import {
	generateBlock,
	generateBlockHeader,
	generateMetadata,
	generateSeedBlock,
	generateSignatureKeyPair,
	signBlockHeader,
	signSeedBlock,
	verifyBlock,
	verifySeedBlockSignature,
} from '../core'
import { IAccount } from '../models/IAccount'
import { IBlock } from '../models/IBlock'
import { IKeyPair } from '../models/IKeyPair'
import { ISeedBlock } from '../models/ISeedBlock'

export class Account {
	public accountPublicKey?: string
	public blockPublicKey?: string
	private blockPrivateKey?: string
	// private accountProviders?: []
	// private accountDomains?: []
	private seedBlock?: ISeedBlock
	private accountBlocks: IBlock[] = []

	constructor() {}

	async init(
		saveBlockPrivateKey?: boolean,
	): Promise<{ accountKeyPair: IKeyPair; blockKeyPair: IKeyPair }> {
		const accountKeyPair = await generateSignatureKeyPair()
		const blockKeyPair = await generateSignatureKeyPair()
		this.accountPublicKey = accountKeyPair.publicKey
		this.blockPublicKey = blockKeyPair.publicKey
		this.accountBlocks = []
		this.seedBlock = await generateSeedBlock(
			accountKeyPair.publicKey,
			blockKeyPair.publicKey,
			1,
			1,
		)

		this.seedBlock = await signSeedBlock(
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

		const unsignedblockHeader = await generateBlockHeader(
			content,
			this.accountPublicKey!,
			this.blockPublicKey!,
			nextBlockId,
			1,
			1,
		)
		const signedBlockHeader = await signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)

		const blockMetadata = generateMetadata(this.seedBlock!)
		const block = generateBlock(signedBlockHeader, content, blockMetadata)
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

		const unsignedblockHeader = await generateBlockHeader(
			content,
			this.accountPublicKey!,
			this.blockPublicKey!,
			olderBlock.header.block_id,
			olderBlock.header.update_id + 1,
			1,
		)
		const signedBlockHeader = await signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)
		const blockMetadata = generateMetadata(this.seedBlock!)
		const block = generateBlock(signedBlockHeader, content, blockMetadata)
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

		const unsignedblockHeader = await generateBlockHeader(
			'',
			this.accountPublicKey!,
			this.blockPublicKey!,
			olderBlock.header.block_id,
			olderBlock.header.update_id + 1,
			1,
		)
		const signedBlockHeader = await signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey ?? this.blockPrivateKey!,
		)
		const blockMetadata = generateMetadata(this.seedBlock!)
		const block = generateBlock(signedBlockHeader, '', blockMetadata)
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

		return await verifyBlock(block)
	}

	async verifySeedBlock(): Promise<boolean> {
		if (this.seedBlock === undefined) {
			throw new Error('Seed block undefined')
		}
		return await verifySeedBlockSignature(this.seedBlock!)
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
}
