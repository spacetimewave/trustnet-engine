import { IDnsRecord } from './IDnsRecord'
import { IMessageHeader } from './IMessageHeader'
import { IMessageMetadata } from './IMessageMetadata'

export interface IDnsRecordMessage {
	header: IMessageHeader
	content: IDnsRecord
	metadata: IMessageMetadata
}
