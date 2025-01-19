import { Cryptography } from '../cryptography'
import type { IBlock } from '../models/IBlock'
import type { IBlockHeader } from '../models/IBlockHeader'
import type { IBlockMetadata } from '../models/IBlockMetadata'
import type { IKeyPair } from '../models/IKeyPair'
import type { ISeedBlock } from '../models/ISeedBlock'

export class Core {
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
			output_hash: await hash(JSON.stringify(content)),
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
		header.signature = await sign(information, privateKey)
		return header
	}

	public static async signSeedBlock(
		block: ISeedBlock,
		privateKey: string,
	): Promise<ISeedBlock> {
		const information =
			block.version + block.address + block.public_key + block.update_id
		block.signature = await sign(information, privateKey)
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
		return await verify(information, header.signature ?? '', header.public_key)
	}

	public static async verifySeedBlockSignature(
		block: ISeedBlock,
	): Promise<boolean> {
		const information =
			block.version + block.address + block.public_key + block.update_id
		return await verify(information, block.signature ?? '', block.address)
	}

	public static async verifyBlockContent(block: IBlock): Promise<boolean> {
		return (
			(await hash(JSON.stringify(block.content))) === block.header.output_hash
		)
	}

	public static verifyBlockAddress(block: IBlock): boolean {
		return block.header.address === block.metadata.seed_block?.address
	}

	public static verifyBlockPublicKey(block: IBlock): boolean {
		return block.header.public_key === block.metadata.seed_block?.public_key
	}

	public static generateMetadata(seedBlock: ISeedBlock): IBlockMetadata {
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
		block.header = await signBlockHeader(block.header, privateKey)
		return block
	}

	public static async verifyBlock(block: IBlock): Promise<boolean> {
		return (
			(await verifyBlockContent(block)) &&
			verifyBlockAddress(block) &&
			verifyBlockPublicKey(block) &&
			(await verifyBlockHeaderSignature(block.header)) &&
			(await verifySeedBlockSignature(block.metadata.seed_block))
		)
	}

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

// Export the trustnet-engine methods
export const hash = Core.hash.bind(Core)
export const generateSignatureKeyPair = Core.generateSignatureKeyPair.bind(Core)
export const sign = Core.sign.bind(Core)
export const verify = Core.verify.bind(Core)
export const generateBlockHeader = Core.generateBlockHeader.bind(Core)
export const generateSeedBlock = Core.generateSeedBlock.bind(Core)
export const signBlockHeader = Core.signBlockHeader.bind(Core)
export const signSeedBlock = Core.signSeedBlock.bind(Core)
export const verifyBlockHeaderSignature =
	Core.verifyBlockHeaderSignature.bind(Core)
export const verifySeedBlockSignature = Core.verifySeedBlockSignature.bind(Core)
export const verifyBlockContent = Core.verifyBlockContent.bind(Core)
export const verifyBlockAddress = Core.verifyBlockAddress.bind(Core)
export const verifyBlockPublicKey = Core.verifyBlockPublicKey.bind(Core)
export const generateMetadata = Core.generateMetadata.bind(Core)
export const generateBlock = Core.generateBlock.bind(Core)
export const signBlock = Core.signBlock.bind(Core)
export const verifyBlock = Core.verifyBlock.bind(Core)
