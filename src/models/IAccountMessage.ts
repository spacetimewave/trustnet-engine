import { IMessage, IUnauthenticatedMessage } from './IMessage'
import { IMessageHeader } from './IMessageHeader'
import { IMessageMetadata } from './IMessageMetadata'
import { ISeedBlock } from './ISeedBlock'

export interface IGetAccountSeedBlockContent {
	accountPublicKey: string
}

export interface IGetAccountSeedBlockUnauthenticatedMessage
	extends IUnauthenticatedMessage {
	content: IGetAccountSeedBlockContent
}

export interface IGetAccountSeedBlockMessage extends IMessage {
	header: IMessageHeader
	content: IGetAccountSeedBlockContent
	metadata: IMessageMetadata
}

export interface ICreateAccountSeedBlockContent {
	seedBlock: ISeedBlock
}

export interface ICreateAccountSeedBlockMessage
	extends IUnauthenticatedMessage {
	content: ICreateAccountSeedBlockContent
}
