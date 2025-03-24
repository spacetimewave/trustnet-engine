import { IDnsProvider } from '../models/IDnsProvider'

export const NAME_SERVERS: IDnsProvider[] = [
	{
		ownerPublicAddress:
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2',
		domainExtension: 'stw',
		nameServerAddress: [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		],
	},
]
