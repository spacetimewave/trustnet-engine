import type { IBlockHeader } from './IBlockHeader'

export interface IBlock {
	header: IBlockHeader
	content: string
}
