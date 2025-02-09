export interface IDnsProvider {
	domainExtension: string // domain extension (e.g. .com, .org, .net)
	nameServerAddress: string[] // addresses (e.g. IP, URL) of the name server (or domain provider)
}
