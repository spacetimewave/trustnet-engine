import { IDnsProvider } from '../models/IDnsProvider'

export const NAME_SERVERS: IDnsProvider[] = [
	{
		domainExtension: 'stw',
		nameServerAddress: ['localhost:3000', 'dns.spacetimewave.com'],
	},
]
