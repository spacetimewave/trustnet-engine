import { IMessageHeader } from './IMessageHeader'
import { IMessageMetadata } from './IMessageMetadata'

export interface IMessage {
	header: IMessageHeader
	content: any
	metadata: IMessageMetadata
}
