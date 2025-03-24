import { IHostingProvider } from './IHostingProvider'
import { IMessage, IUnauthenticatedMessage } from './IMessage'
import { IMessageHeader } from './IMessageHeader'
import { IMessageMetadata } from './IMessageMetadata'

export interface IGetHostingProvidersFromMarketplaceContent {
	search: string // search hosting providers
}

export interface IGetHostingProvidersFromMarketplaceMessage extends IMessage {
	header: IMessageHeader
	content: IGetHostingProvidersFromMarketplaceContent
	metadata: IMessageMetadata
}

export interface IGetHostingProvidersFromMarketplaceUnauthenticatedMessage
	extends IUnauthenticatedMessage {
	content: IGetHostingProvidersFromMarketplaceContent
}

export interface ICreateHostingProviderInMarketplaceContent {
	hostingProvider: IHostingProvider
}

export interface ICreateHostingProviderInMarketplaceMessage extends IMessage {
	header: IMessageHeader
	content: ICreateHostingProviderInMarketplaceContent
	metadata: IMessageMetadata
}

export interface IUpdateHostingProviderInMarketplaceContent {
	hostingProvider: IHostingProvider
}

export interface IUpdateHostingProviderInMarketplaceMessage extends IMessage {
	header: IMessageHeader
	content: IUpdateHostingProviderInMarketplaceContent
	metadata: IMessageMetadata
}

export interface IDeleteHostingProviderInMarketplaceContent {
	hostingName: string
}

export interface IDeleteHostingProviderInMarketplaceMessage extends IMessage {
	header: IMessageHeader
	content: IDeleteHostingProviderInMarketplaceContent
	metadata: IMessageMetadata
}
