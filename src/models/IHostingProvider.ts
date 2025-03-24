export interface IHostingProvider {
	ownerPublicAddress: string // public address of the owner of the hosting
	hostingName: string // name of the hosting provider
	hostingServerAddresses: string[] // addresses (e.g. IP, URL) of the hosting servers
}
