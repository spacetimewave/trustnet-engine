import { IBlock } from './IBlock'
import { ISeedBlock } from './ISeedBlock'

export interface IAccount {
	seedBlock: ISeedBlock
	accountBlocks: IBlock[]
}
