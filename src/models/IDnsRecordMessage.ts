import { IDnsRecord } from './IDnsRecord'
import { IMessage } from './IMessage'
import { IMessageHeader } from './IMessageHeader'
import { IMessageMetadata } from './IMessageMetadata'

export interface IGetDnsRecordContent {
	domainName: string
}

export interface IGetDnsRecordMessage extends IMessage {
	header: IMessageHeader
	content: IGetDnsRecordContent
	metadata: IMessageMetadata
}

export interface ICreateDnsRecordContent {
	dnsRecord: IDnsRecord
}

export interface ICreateDnsRecordMessage extends IMessage {
	header: IMessageHeader
	content: ICreateDnsRecordContent
	metadata: IMessageMetadata
}

export interface IUpdateDnsRecordContent {
	dnsRecord: IDnsRecord
}

export interface IUpdateDnsRecordMessage extends IMessage {
	header: IMessageHeader
	content: IUpdateDnsRecordContent
	metadata: IMessageMetadata
}

export interface IDeleteDnsRecordContent {
	domainName: string
}

export interface IDeleteDnsRecordMessage extends IMessage {
	header: IMessageHeader
	content: IDeleteDnsRecordContent
	metadata: IMessageMetadata
}
