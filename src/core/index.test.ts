import { Core } from '.'
import http from '../http'
import { IDnsRecord } from '../models/IDnsRecord'
import {
	IGetDnsRecordMessage,
	ICreateDnsRecordMessage,
	IUpdateDnsRecordMessage,
	IDeleteDnsRecordMessage,
	ICreateDnsRecordContent,
} from '../models/IDnsRecordMessage'
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
})
