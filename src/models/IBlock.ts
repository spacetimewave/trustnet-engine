import type { IBlockHeader } from './IBlockHeader'
import type { IBlockMetadata } from './IBlockMetadata'

export interface IBlock {
	header: IBlockHeader
	content: string
	metadata: IBlockMetadata
}
