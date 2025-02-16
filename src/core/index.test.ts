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

		jest.spyOn(httpModule, 'get').mockImplementation(httpGet)
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
		jest.spyOn(httpModule, 'put').mockImplementation(httpPut)
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
		jest.spyOn(httpModule, 'delete').mockImplementation(httpDelete)
		// Test
		await core.deleteDnsRecord(signedDnsRecordMessage, 'http://localhost:3000')
		expect(httpDelete).toHaveBeenCalled()
		expect(true).toEqual(true)
	})
})
