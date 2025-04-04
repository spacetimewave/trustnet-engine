import { Core } from '.'
import http from '../http'
import {
	ICreateDnsProviderInMarketplaceMessage,
	IDeleteDnsProviderInMarketplaceMessage,
	IGetDnsProvidersFromMarketplaceMessage,
	IUpdateDnsProviderInMarketplaceMessage,
} from '../models/IDnsMarketplaceMessage'
import { IDnsRecord } from '../models/IDnsRecord'
import {
	IGetDnsRecordMessage,
	ICreateDnsRecordMessage,
	IUpdateDnsRecordMessage,
	IDeleteDnsRecordMessage,
	ICreateDnsRecordContent,
} from '../models/IDnsRecordMessage'
import {
	ICreateHostingProviderInMarketplaceMessage,
	IDeleteHostingProviderInMarketplaceMessage,
	IGetHostingProvidersFromMarketplaceMessage,
	IUpdateHostingProviderInMarketplaceMessage,
} from '../models/IHostingMarketplaceMessage'
import { ISeedBlock } from '../models/ISeedBlock'

describe('Core module test suite', () => {
	it('Hash Unit Test', async () => {
		expect(await Core.hash('Message')).toEqual(
			'0x9a59efbc471b53491c8038fd5d5fe3be0a229873302bafba90c19fbe7d7c7f35',
		)
	})

	it('Signature e2e test', async () => {
		const keyPair = await Core.generateSignatureKeyPair()
		const publicKey = keyPair.publicKey
		const privateKey = keyPair.privateKey
		const message = 'Message'
		const signature = await Core.sign(message, privateKey)
		const verification = await Core.verify(message, signature, publicKey)
		expect(verification).toEqual(true)
	})

	it('Block Header Signature Unit Test', async () => {
		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedblockHeader = await Core.generateBlockHeader(
			'Content',
			accountPublicKey,
			blockPublicKey,
			1,
			1,
			1,
		)

		const signedBlockHeader = await Core.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey,
		)

		expect(await Core.verifyBlockHeaderSignature(signedBlockHeader)).toEqual(
			true,
		)
	})

	it('Seed Block Signature Unit Test', async () => {
		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		expect(await Core.verifySeedBlockSignature(signedSeedBlock)).toEqual(true)
	})

	it('Verify Block Private Key with Seed Block Unit Test', async () => {
		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		expect(
			await Core.verifyBlockPrivateKeyWithSeedBlock(
				blockPrivateKey,
				signedSeedBlock,
			),
		).toEqual(true)
	})

	it('Block Unit Test', async () => {
		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const content = 'Hello world!'

		const unsignedblockHeader = await Core.generateBlockHeader(
			content,
			accountPublicKey,
			blockPublicKey,
			1,
			1,
			1,
		)

		const signedBlockHeader = await Core.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey,
		)

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const blockMetadata = Core.generateBlockMetadata(signedSeedBlock)
		const block = Core.generateBlock(signedBlockHeader, content, blockMetadata)

		expect(await Core.verifyBlock(block)).toEqual(true)
	})

	it('Sign and Verify Message Signature', async () => {
		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const content = 'Hello world!'

		const unsignedMessageHeader = await Core.generateMessageHeader(
			content,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const signedMessageHeader = await Core.signMessageHeader(
			unsignedMessageHeader,
			blockPrivateKey,
		)

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const signedMessage = Core.generateMessage(
			signedMessageHeader,
			content,
			messageMetadata,
		)

		expect(await Core.verifyMessage(signedMessage)).toEqual(true)
	})

	it('Get DNS Record Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const domainName = 'username.stw'
		const getDnsRecordContent = {
			domainName,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			getDnsRecordContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedDnsRecordMessage: IGetDnsRecordMessage = Core.generateMessage(
			unsignedMessageHeader,
			getDnsRecordContent,
			messageMetadata,
		)
		const signedDnsRecordMessage: IGetDnsRecordMessage = await Core.signMessage(
			unsignedDnsRecordMessage,
			blockPrivateKey,
		)

		// Mocking
		const hostingProviderAddresses = [
			'username.com',
			'username.net',
			'10.10.10.10',
		]
		const dnsRecordExpectedResponse = {
			domainName,
			accountPublicKey,
			hostingProviderAddresses,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => dnsRecordExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsRecordResponse = await core.getDnsRecord(
			signedDnsRecordMessage,
			'http://localhost:3000',
		)

		expect(dnsRecordResponse).toBeDefined()
		if (dnsRecordResponse) {
			expect(dnsRecordResponse).toHaveProperty('domainName', domainName)
			expect(dnsRecordResponse).toHaveProperty(
				'hostingProviderAddresses',
				hostingProviderAddresses,
			)
		}
	})

	it('Create DNS Record Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const domainName = 'username.stw'
		const hostingProviderAddresses = [
			'username.com',
			'username.net',
			'10.10.10.10',
		]
		const dnsRecord: IDnsRecord = {
			domainName,
			accountPublicKey,
			hostingProviderAddresses,
		}
		const createDnsRecordContent: ICreateDnsRecordContent = {
			dnsRecord,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			createDnsRecordContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedDnsRecordMessage: ICreateDnsRecordMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				createDnsRecordContent,
				messageMetadata,
			)
		const signedDnsRecordMessage: ICreateDnsRecordMessage =
			await Core.signMessage(unsignedDnsRecordMessage, blockPrivateKey)
		// Mocking
		const httpPost = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 201,
			json: async () => dnsRecord,
		}))
		jest.spyOn(httpModule, 'post').mockImplementation(httpPost)
		// Test

		await core.createDnsRecord(signedDnsRecordMessage, 'http://localhost:3000')
		expect(httpPost).toHaveBeenCalled()
		expect(true).toEqual(true)
	})

	it('Update Domain Name Record Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const domainName = 'username.stw'
		const hostingProviderAddresses = [
			'username.com',
			'username.net',
			'10.10.10.10',
		]
		const dnsRecord: IDnsRecord = {
			domainName,
			accountPublicKey,
			hostingProviderAddresses,
		}
		const createDnsRecordContent: ICreateDnsRecordContent = {
			dnsRecord,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			createDnsRecordContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedDnsRecordMessage: IUpdateDnsRecordMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				createDnsRecordContent,
				messageMetadata,
			)
		const signedDnsRecordMessage: IUpdateDnsRecordMessage =
			await Core.signMessage(unsignedDnsRecordMessage, blockPrivateKey)
		// Mocking
		const httpPut = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 204,
		}))
		jest.spyOn(httpModule, 'post').mockImplementation(httpPut)
		// Test
		await core.updateDnsRecord(signedDnsRecordMessage, 'http://localhost:3000')
		expect(httpPut).toHaveBeenCalled()
		expect(true).toEqual(true)
	})

	it('Delete Domain Name Record Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const domainName = 'username.stw'
		const deleteDnsRecordContent = {
			domainName,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			deleteDnsRecordContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedDnsRecordMessage: IDeleteDnsRecordMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				deleteDnsRecordContent,
				messageMetadata,
			)
		const signedDnsRecordMessage: IDeleteDnsRecordMessage =
			await Core.signMessage(unsignedDnsRecordMessage, blockPrivateKey)
		// Mocking
		const httpDelete = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 204,
		}))
		jest.spyOn(httpModule, 'post').mockImplementation(httpDelete)
		// Test
		await core.deleteDnsRecord(signedDnsRecordMessage, 'http://localhost:3000')
		expect(httpDelete).toHaveBeenCalled()
		expect(true).toEqual(true)
	})

	it('Get Account Seed Block Unauthenticated Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountSeedBlockMessage = {
			content: {
				accountPublicKey: 'accountPublicKey',
			},
		}
		const hostingProviderAddresses = ['https://hosting.com']

		// Mocking
		const seedBlockExpectedResponse = {
			version: 1,
			address:
				'0x0004003e0005007a001500c200b200740025007300ef00b1009900af00d4006800a800270074006800da009c008000e00069008700fc0059005a000e00f3001d00aa0029005500a400dc006000e9003900a5008f00140098002300dc00b600e000c1009c000e000900d5001800d800e3008f0061007e00470034003f007f0005007f',
			public_key:
				'0x000400e1009400a5007900620029009a00f1007f00a900bb005200b900b70045002a0034009b004a00b8008e004000c500e200860001000f00b0005100010016006100ed004c00050001002c00ad008700d6005700000025009a00e3005c00780099004b007e003400b700b5003d00cc00a3007100b200af005500d7005a0000009d',
			update_id: 1,
			signature:
				'0x00be00d40099003b002f00b9009000dd0069002500a30012002e007700ef00620075008e006000250084003900780071000a002f006500df00eb002800d7006300bc00dc003e00a4002600fb00ca00b8000500cd00e600a600f20090004200cf007f00ca00c400b20062003d00f3009d00ee00b5002e00ea009d009b00670008',
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => seedBlockExpectedResponse,
		}))
		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)

		// Test
		const seedBlockResponse = await core.getAccountSeedBlockUnauthenticated(
			accountSeedBlockMessage,
			hostingProviderAddresses,
		)
		expect(seedBlockResponse).toBeDefined()
		if (seedBlockResponse) {
			expect(seedBlockResponse === seedBlockExpectedResponse).toEqual(true)
		}
	})

	it('Get Account Seed Block by Username Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		// Mocking
		const getAccountSeedBlockUnauthenticatedResponse = {
			version: 1,
			address:
				'0x0004003e0005007a001500c200b200740025007300ef00b1009900af00d4006800a800270074006800da009c008000e00069008700fc0059005a000e00f3001d00aa0029005500a400dc006000e9003900a5008f00140098002300dc00b600e000c1009c000e000900d5001800d800e3008f0061007e00470034003f007f0005007f',
			public_key:
				'0x000400e1009400a5007900620029009a00f1007f00a900bb005200b900b70045002a0034009b004a00b8008e004000c500e200860001000f00b0005100010016006100ed004c00050001002c00ad008700d6005700000025009a00e3005c00780099004b007e003400b700b5003d00cc00a3007100b200af005500d7005a0000009d',
			update_id: 1,
			signature:
				'0x00be00d40099003b002f00b9009000dd0069002500a30012002e007700ef00620075008e006000250084003900780071000a002f006500df00eb002800d7006300bc00dc003e00a4002600fb00ca00b8000500cd00e600a600f20090004200cf007f00ca00c400b20062003d00f3009d00ee00b5002e00ea009d009b00670008',
		}
		const getAccountSeedBlockUnauthenticated = jest
			.fn()
			.mockImplementation(
				async () => getAccountSeedBlockUnauthenticatedResponse,
			)
		jest
			.spyOn(core, 'getAccountSeedBlockUnauthenticated')
			.mockImplementation(getAccountSeedBlockUnauthenticated)

		const getDnsRecordUnauthenticatedResponse: IDnsRecord = {
			domainName: 'example.stw',
			accountPublicKey:
				'0x000400e1009400a5007900620029009a00f1007f00a900bb005200b900b70045002a0034009b004a00b8008e004000c500e200860001000f00b0005100010016006100ed004c00050001002c00ad008700d6005700000025009a00e3005c00780099004b007e003400b700b5003d00cc00a3007100b200af005500d7005a0000009d',
			hostingProviderAddresses: ['https://hosting.com'],
		}

		const getDnsRecordUnauthenticated = jest
			.fn()
			.mockImplementation(async () => getDnsRecordUnauthenticatedResponse)
		jest
			.spyOn(core, 'getDnsRecordUnauthenticated')
			.mockImplementation(getDnsRecordUnauthenticated)

		// Test
		const seedBlockResponse =
			await core.getAccountSeedBlockByUsernameUnauthenticated('example.stw')
		expect(seedBlockResponse).toBeDefined()
		if (seedBlockResponse) {
			expect(
				seedBlockResponse === getAccountSeedBlockUnauthenticatedResponse,
			).toEqual(true)
		}
	})

	it('Create Account Seed Block Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		// Mocking
		const createAccountSeedBlockResponse: ISeedBlock = signedSeedBlock
		const httpPost = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => createAccountSeedBlockResponse,
		}))
		jest.spyOn(httpModule, 'post').mockImplementation(httpPost)

		// Test
		const seedBlockResponse = await core.createAccountSeedBlock(
			signedSeedBlock,
			['https://hosting.com'],
		)
		expect(seedBlockResponse).toBeDefined()
		if (seedBlockResponse) {
			expect(seedBlockResponse === createAccountSeedBlockResponse).toEqual(true)
		}
	})

	it('Get DNS Provider From Marketplace Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const search = '.stw'
		const getDnsProviderFromMarketplaceContent = {
			search,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			getDnsProviderFromMarketplaceContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedDnsProvidersMessage: IGetDnsProvidersFromMarketplaceMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				getDnsProviderFromMarketplaceContent,
				messageMetadata,
			)
		const signedDnsProvidersMessage: IGetDnsProvidersFromMarketplaceMessage =
			await Core.signMessage(unsignedDnsProvidersMessage, blockPrivateKey)

		// Mocking
		const ownerPublicAddress =
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2'
		const domainExtension = 'stw'
		const nameServerAddress = [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		]
		const dnsProviderExpectedResponse = {
			ownerPublicAddress,
			domainExtension,
			nameServerAddress,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => dnsProviderExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsProvidersResponse =
			await core.getDnsProvidersFromMarketplaceUnauthenticated(
				signedDnsProvidersMessage,
				'http://marketplace:3000',
			)

		expect(dnsProvidersResponse).toBeDefined()
		if (dnsProvidersResponse) {
			expect(dnsProvidersResponse).toHaveProperty(
				'ownerPublicAddress',
				ownerPublicAddress,
			)
			expect(dnsProvidersResponse).toHaveProperty(
				'domainExtension',
				domainExtension,
			)
			expect(dnsProvidersResponse).toHaveProperty(
				'nameServerAddress',
				nameServerAddress,
			)
		}
	})

	it('Create DNS Provider From Marketplace Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const ownerPublicAddress =
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2'
		const domainExtension = 'stw'
		const nameServerAddress = [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		]
		const createDnsProviderFromMarketplaceContent = {
			ownerPublicAddress,
			domainExtension,
			nameServerAddress,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			createDnsProviderFromMarketplaceContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedDnsProvidersMessage: ICreateDnsProviderInMarketplaceMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				createDnsProviderFromMarketplaceContent,
				messageMetadata,
			)
		const signedDnsProvidersMessage: ICreateDnsProviderInMarketplaceMessage =
			await Core.signMessage(unsignedDnsProvidersMessage, blockPrivateKey)

		// Mocking
		const dnsProviderExpectedResponse = {
			ownerPublicAddress,
			domainExtension,
			nameServerAddress,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => dnsProviderExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsProvidersResponse = await core.addDnsProviderToMarketplace(
			signedDnsProvidersMessage,
			'http://marketplace:3000',
		)

		expect(dnsProvidersResponse).toBeDefined()
		if (dnsProvidersResponse) {
			expect(dnsProvidersResponse).toHaveProperty(
				'ownerPublicAddress',
				ownerPublicAddress,
			)
			expect(dnsProvidersResponse).toHaveProperty(
				'domainExtension',
				domainExtension,
			)
			expect(dnsProvidersResponse).toHaveProperty(
				'nameServerAddress',
				nameServerAddress,
			)
		}
	})

	it('Update DNS Provider From Marketplace Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const ownerPublicAddress =
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2'
		const domainExtension = 'stw'
		const nameServerAddress = [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		]
		const updateDnsProviderFromMarketplaceContent = {
			ownerPublicAddress,
			domainExtension,
			nameServerAddress,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			updateDnsProviderFromMarketplaceContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedDnsProvidersMessage: IUpdateDnsProviderInMarketplaceMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				updateDnsProviderFromMarketplaceContent,
				messageMetadata,
			)
		const signedDnsProvidersMessage: IUpdateDnsProviderInMarketplaceMessage =
			await Core.signMessage(unsignedDnsProvidersMessage, blockPrivateKey)

		// Mocking
		const dnsProviderExpectedResponse = {
			ownerPublicAddress,
			domainExtension,
			nameServerAddress,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => dnsProviderExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsProvidersResponse = await core.updateDnsProviderToMarketplace(
			signedDnsProvidersMessage,
			'http://marketplace:3000',
		)

		expect(dnsProvidersResponse).toBeDefined()
		if (dnsProvidersResponse) {
			expect(dnsProvidersResponse).toHaveProperty(
				'ownerPublicAddress',
				ownerPublicAddress,
			)
			expect(dnsProvidersResponse).toHaveProperty(
				'domainExtension',
				domainExtension,
			)
			expect(dnsProvidersResponse).toHaveProperty(
				'nameServerAddress',
				nameServerAddress,
			)
		}
	})

	it('Delete DNS Provider From Marketplace Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const domainExtension = 'stw'

		const deleteDnsProviderFromMarketplaceContent = {
			domainExtension,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			deleteDnsProviderFromMarketplaceContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedDnsProvidersMessage: IDeleteDnsProviderInMarketplaceMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				deleteDnsProviderFromMarketplaceContent,
				messageMetadata,
			)
		const signedDnsProvidersMessage: IDeleteDnsProviderInMarketplaceMessage =
			await Core.signMessage(unsignedDnsProvidersMessage, blockPrivateKey)

		// Mocking
		const ownerPublicAddress =
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2'
		const nameServerAddress = [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		]
		const dnsProviderExpectedResponse = {
			ownerPublicAddress,
			domainExtension,
			nameServerAddress,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => dnsProviderExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsProvidersResponse = await core.deleteDnsProviderToMarketplace(
			signedDnsProvidersMessage,
			'http://marketplace:3000',
		)

		expect(dnsProvidersResponse).toBeDefined()
		if (dnsProvidersResponse) {
			expect(dnsProvidersResponse).toHaveProperty(
				'ownerPublicAddress',
				ownerPublicAddress,
			)
			expect(dnsProvidersResponse).toHaveProperty(
				'domainExtension',
				domainExtension,
			)
			expect(dnsProvidersResponse).toHaveProperty(
				'nameServerAddress',
				nameServerAddress,
			)
		}
	})

	it('Get Hosting Provider From Marketplace Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const search = '.stw'
		const getHostingProviderFromMarketplaceContent = {
			search,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			getHostingProviderFromMarketplaceContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedHostingProvidersMessage: IGetHostingProvidersFromMarketplaceMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				getHostingProviderFromMarketplaceContent,
				messageMetadata,
			)
		const signedHostingProvidersMessage: IGetHostingProvidersFromMarketplaceMessage =
			await Core.signMessage(unsignedHostingProvidersMessage, blockPrivateKey)

		// Mocking
		const ownerPublicAddress =
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2'
		const hostingName = 'spacetimewave'
		const hostingServerAddress = [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		]
		const hostingProviderExpectedResponse = {
			ownerPublicAddress,
			hostingName,
			hostingServerAddress,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => hostingProviderExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsProvidersResponse =
			await core.getHostingProvidersFromMarketplaceUnauthenticated(
				signedHostingProvidersMessage,
				'http://marketplace:3000',
			)

		expect(dnsProvidersResponse).toBeDefined()
		if (dnsProvidersResponse) {
			expect(dnsProvidersResponse).toHaveProperty(
				'ownerPublicAddress',
				ownerPublicAddress,
			)
			expect(dnsProvidersResponse).toHaveProperty('hostingName', hostingName)
			expect(dnsProvidersResponse).toHaveProperty(
				'hostingServerAddress',
				hostingServerAddress,
			)
		}
	})

	it('Create Hosting Provider From Marketplace Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const ownerPublicAddress =
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2'
		const hostingName = 'spacetimewave'
		const hostingServerAddresses = [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		]
		const createHostingProviderFromMarketplaceContent = {
			ownerPublicAddress,
			hostingName,
			hostingServerAddresses,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			createHostingProviderFromMarketplaceContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedHostingProvidersMessage: ICreateHostingProviderInMarketplaceMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				createHostingProviderFromMarketplaceContent,
				messageMetadata,
			)
		const signedHostingProvidersMessage: ICreateHostingProviderInMarketplaceMessage =
			await Core.signMessage(unsignedHostingProvidersMessage, blockPrivateKey)

		// Mocking
		const hostingProviderExpectedResponse = {
			ownerPublicAddress,
			hostingName,
			hostingServerAddresses,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => hostingProviderExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsProvidersResponse = await core.addHostingProviderToMarketplace(
			signedHostingProvidersMessage,
			'http://marketplace:3000',
		)

		expect(dnsProvidersResponse).toBeDefined()
		if (dnsProvidersResponse) {
			expect(dnsProvidersResponse).toHaveProperty(
				'ownerPublicAddress',
				ownerPublicAddress,
			)
			expect(dnsProvidersResponse).toHaveProperty('hostingName', hostingName)
			expect(dnsProvidersResponse).toHaveProperty(
				'hostingServerAddresses',
				hostingServerAddresses,
			)
		}
	})

	it('Update Hosting Provider From Marketplace Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const ownerPublicAddress =
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2'
		const hostingName = 'spacetimewave'
		const hostingServerAddresses = [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		]
		const updateHostingProviderFromMarketplaceContent = {
			ownerPublicAddress,
			hostingName,
			hostingServerAddresses,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			updateHostingProviderFromMarketplaceContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedHostingProvidersMessage: IUpdateHostingProviderInMarketplaceMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				updateHostingProviderFromMarketplaceContent,
				messageMetadata,
			)
		const signedHostingProvidersMessage: IUpdateHostingProviderInMarketplaceMessage =
			await Core.signMessage(unsignedHostingProvidersMessage, blockPrivateKey)

		// Mocking
		const hostingProviderExpectedResponse = {
			ownerPublicAddress,
			hostingName,
			hostingServerAddresses,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => hostingProviderExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsProvidersResponse = await core.updateHostingProviderToMarketplace(
			signedHostingProvidersMessage,
			'http://marketplace:3000',
		)

		expect(dnsProvidersResponse).toBeDefined()
		if (dnsProvidersResponse) {
			expect(dnsProvidersResponse).toHaveProperty(
				'ownerPublicAddress',
				ownerPublicAddress,
			)
			expect(dnsProvidersResponse).toHaveProperty('hostingName', hostingName)
			expect(dnsProvidersResponse).toHaveProperty(
				'hostingServerAddresses',
				hostingServerAddresses,
			)
		}
	})

	it('Delete Hosting Provider From Marketplace Test', async () => {
		// Initializations
		const httpModule = new http()
		const core = new Core(httpModule)

		const accountkeyPair = await Core.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await Core.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedSeedBlock = await Core.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await Core.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const hostingName = 'spacetimewave'

		const deleteHostingProviderFromMarketplaceContent = {
			hostingName,
		}
		const unsignedMessageHeader = await Core.generateMessageHeader(
			deleteHostingProviderFromMarketplaceContent,
			accountPublicKey,
			blockPublicKey,
			1,
		)

		const messageMetadata = Core.generateMessageMetadata(signedSeedBlock)
		const unsignedHostingProvidersMessage: IDeleteHostingProviderInMarketplaceMessage =
			Core.generateMessage(
				unsignedMessageHeader,
				deleteHostingProviderFromMarketplaceContent,
				messageMetadata,
			)
		const signedHostingProvidersMessage: IDeleteHostingProviderInMarketplaceMessage =
			await Core.signMessage(unsignedHostingProvidersMessage, blockPrivateKey)

		// Mocking
		const ownerPublicAddress =
			'0x0004002900d9009f007400ce00c40014000400f400ff0044003900ae00d3006100700000009900b2003700ff004f006b004c002900be00900089005a0028002c003b00ff0009009e00a700800018008e00d7002b0097009f002f002e002200d600b300530059008f005e005900d800cd00f0008a00e3002a00d7009b000700d400c2'
		const hostingServerAddresses = [
			'http://localhost:3000',
			'https://dns.spacetimewave.com',
		]
		const hostingProviderExpectedResponse = {
			ownerPublicAddress,
			hostingName,
			hostingServerAddresses,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => hostingProviderExpectedResponse,
		}))

		jest.spyOn(httpModule, 'post').mockImplementation(httpGet)
		// Test
		const dnsProvidersResponse = await core.deleteHostingProviderToMarketplace(
			signedHostingProvidersMessage,
			'http://marketplace:3000',
		)

		expect(dnsProvidersResponse).toBeDefined()
		if (dnsProvidersResponse) {
			expect(dnsProvidersResponse).toHaveProperty(
				'ownerPublicAddress',
				ownerPublicAddress,
			)
			expect(dnsProvidersResponse).toHaveProperty('hostingName', hostingName)
			expect(dnsProvidersResponse).toHaveProperty(
				'hostingServerAddresses',
				hostingServerAddresses,
			)
		}
	})
})
