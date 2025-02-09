export interface IDnsRecord {
	domainName: string // domain name (e.g. account.com, account.org)
	accountPublicKey: string // domain name (e.g. account.com, account.org)
	hostingProviderAddresses: string[] // addresses (e.g. IP, URL) of domain hosting providers
}
