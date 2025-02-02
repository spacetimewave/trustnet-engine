import { Core } from '.'
import http from '../http'

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

		const blockMetadata = Core.generateMetadata(signedSeedBlock)
		const block = Core.generateBlock(signedBlockHeader, content, blockMetadata)

		expect(await Core.verifyBlock(block)).toEqual(true)
	})

	it('Get Domain Name Entry Test', async () => {
		// Initializations
		const username = 'username.stw'
		const urls = ['username.com', 'username.net']
		const ips = ['10.10.10.10']
		// Mocking
		const dnsEntryResponse = {
			domainName: username,
			domainUrls: urls,
			domainIPs: ips,
		}
		const httpGet = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 200,
			json: async () => dnsEntryResponse,
		}))
		const httpModule = new http()
		jest.spyOn(httpModule, 'get').mockImplementation(httpGet)
		// Test
		const core = new Core(httpModule)
		const domainNameEntry = await core.getUserDomainNameEntry(
			'username.stw',
			'http://localhost:3000',
		)

		expect(domainNameEntry).toBeDefined()
		if (domainNameEntry) {
			expect(domainNameEntry).toHaveProperty('domainName', username)
			expect(domainNameEntry).toHaveProperty('domainUrls', urls)
			expect(domainNameEntry).toHaveProperty('domainIPs', ips)
		}
	})

	it('Create Domain Name Entry Test', async () => {
		// Initializations
		const username = 'username.stw'
		const urls = ['username.com', 'username.net']
		const ips = ['10.10.10.10']
		//Mocking
		const dnsEntryResponse = {
			domainName: username,
			domainUrls: urls,
			domainIPs: ips,
		}
		const httpPost = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 201,
		}))
		const httpModule = new http()
		jest.spyOn(httpModule, 'post').mockImplementation(httpPost)
		// Test
		const core = new Core(httpModule)
		await core.createUserDomainNameEntry(
			dnsEntryResponse,
			'http://localhost:3000',
		)

		expect(httpPost).toHaveBeenCalled()
		expect(true).toEqual(true)
	})

	it('Update Domain Name Entry Test', async () => {
		// Initializations
		const username = 'username.stw'
		const urls = ['username.org']
		const ips = ['10.8.10.8']
		//Mocking
		const dnsEntryResponse = {
			domainName: username,
			domainUrls: urls,
			domainIPs: ips,
		}
		const httpPut = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 204,
		}))
		const httpModule = new http()
		jest.spyOn(httpModule, 'put').mockImplementation(httpPut)
		// Test
		const core = new Core(httpModule)
		await core.updateUserDomainNameEntry(
			dnsEntryResponse,
			'http://localhost:3000',
		)

		expect(httpPut).toHaveBeenCalled()
		expect(true).toEqual(true)
	})

	it('Delete Domain Name Entry Test', async () => {
		// Initializations
		const username = 'username.stw'
		const urls = ['username.org']
		const ips = ['10.8.10.8']
		//Mocking
		const dnsEntryResponse = {
			domainName: username,
			domainUrls: urls,
			domainIPs: ips,
		}
		const httpDelete = jest.fn().mockImplementation(async () => ({
			ok: true,
			status: 204,
		}))
		const httpModule = new http()
		jest.spyOn(httpModule, 'delete').mockImplementation(httpDelete)
		// Test
		const core = new Core(httpModule)
		await core.deleteUserDomainNameEntry(
			dnsEntryResponse,
			'http://localhost:3000',
		)

		expect(httpDelete).toHaveBeenCalled()
		expect(true).toEqual(true)
	})
})
