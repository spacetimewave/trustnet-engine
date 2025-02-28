import { IDnsProvider } from '../models/IDnsProvider'

export const NAME_SERVERS: IDnsProvider[] = [
	{
		domainExtension: 'stw',
		nameServerAddress: [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		],
	},
]
