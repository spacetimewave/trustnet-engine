import { IDnsProvider } from './IDnsProvider'
import { IMessage, IUnauthenticatedMessage } from './IMessage'
import { IMessageHeader } from './IMessageHeader'
import { IMessageMetadata } from './IMessageMetadata'

export interface IGetDnsProvidersFromMarketplaceContent {
	search: string // search dns providers
}

export interface IGetDnsProvidersFromMarketplaceMessage extends IMessage {
	header: IMessageHeader
	content: IGetDnsProvidersFromMarketplaceContent
	metadata: IMessageMetadata
}

export interface IGetDnsProvidersFromMarketplaceUnauthenticatedMessage
	extends IUnauthenticatedMessage {
	content: IGetDnsProvidersFromMarketplaceContent
}

export interface ICreateDnsProviderInMarketplaceContent {
	dnsProvider: IDnsProvider
}

export interface ICreateDnsProviderInMarketplaceMessage extends IMessage {
	header: IMessageHeader
	content: ICreateDnsProviderInMarketplaceContent
	metadata: IMessageMetadata
}

export interface IUpdateDnsProviderInMarketplaceContent {
	dnsProvider: IDnsProvider
}

export interface IUpdateDnsProviderInMarketplaceMessage extends IMessage {
	header: IMessageHeader
	content: IUpdateDnsProviderInMarketplaceContent
	metadata: IMessageMetadata
}

export interface IDeleteDnsProviderInMarketplaceContent {
	dnsExtension: string
}

export interface IDeleteDnsProviderInMarketplaceMessage extends IMessage {
	header: IMessageHeader
	content: IDeleteDnsProviderInMarketplaceContent
	metadata: IMessageMetadata
}
