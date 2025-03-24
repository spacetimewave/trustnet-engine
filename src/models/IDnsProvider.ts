export interface IDnsProvider {
	ownerPublicAddress: string // public address of the owner of the domain
	domainExtension: string // domain extension (e.g. .com, .org, .net)
	nameServerAddress: string[] // addresses (e.g. IP, URL) of the name server (or domain provider)
}
