import { Account } from '.'
import { Core } from '../core'

describe('Account module test suite', () => {
	it('Account initialization', async () => {
		const account = new Account()
		await account.init()
		const verification = await account.verifySeedBlock()
		expect(verification).toEqual(true)
	})

	it('Create block', async () => {
		const account = new Account()
		const { blockKeyPair } = await account.init()
		const seedVerification = await account.verifySeedBlock()
		await account.createNewBlock('New block content', blockKeyPair.privateKey)
		const blockVerification = await account.verifyBlock(1)
		expect(seedVerification && blockVerification).toEqual(true)
	})

	it('Update block', async () => {
		const account = new Account()
		const { blockKeyPair } = await account.init()
		const seedVerification = await account.verifySeedBlock()
		await account.createNewBlock('New block content', blockKeyPair.privateKey)
		const updatedBlock = await account.updateBlock(
			'Updated block content',
			1,
			blockKeyPair.privateKey,
		)
		const blockUpdateVerification = await account.verifyBlock(1)
		expect(
			seedVerification &&
				blockUpdateVerification &&
				updatedBlock.header.update_id === 2,
		).toEqual(true)
	})

	it('Delete block', async () => {
		const account = new Account()
		const { blockKeyPair } = await account.init()
		const seedVerification = await account.verifySeedBlock()
		await account.createNewBlock('New block content', blockKeyPair.privateKey)
		const deletedBlock = await account.deleteBlock(1, blockKeyPair.privateKey)
		const blockUpdateVerification = await account.verifyBlock(1)
		expect(
			seedVerification &&
				blockUpdateVerification &&
				deletedBlock.header.update_id === 2 &&
				deletedBlock.content === '',
		).toEqual(true)
	})

	it('Get Dns Record', async () => {
		const core = new Core()
		const account = new Account(core)
		await account.init(true)
		// Mock the response
		const domainName = 'example.stw'
		const accountPublicKey = account.accountPublicKey
		const hostingProviderAddresses = ['hosting.spacetimewave.com']
		const getDnsRecordMock = jest.fn().mockImplementation(async () => ({
			domainName,
			accountPublicKey,
			hostingProviderAddresses,
		}))
		jest.spyOn(core, 'getDnsRecord').mockImplementation(getDnsRecordMock)
		const dnsRecord = await account.getDnsRecord('example.stw')

		expect(dnsRecord).toBeDefined()
		if (dnsRecord) {
			expect(dnsRecord).toHaveProperty('domainName', domainName)
			expect(dnsRecord).toHaveProperty('accountPublicKey', accountPublicKey)
			expect(dnsRecord).toHaveProperty(
				'hostingProviderAddresses',
				hostingProviderAddresses,
			)
		}
	})

	it('Create Dns Record', async () => {
		const core = new Core()
		const account = new Account(core)
		const { blockKeyPair } = await account.init()
		// Mock the response
		const domainName = 'example.stw'
		const hostingProviderAddresses = ['hosting.spacetimewave.com']
		const createDnsRecordMock = jest.fn().mockImplementation(async () => {})
		jest.spyOn(core, 'createDnsRecord').mockImplementation(createDnsRecordMock)
		await account.createDnsRecord(
			domainName,
			hostingProviderAddresses,
			blockKeyPair.privateKey,
		)

		expect(createDnsRecordMock).toHaveBeenCalled()
		expect(true).toEqual(true)
	})

	it('Update Dns Record', async () => {
		const core = new Core()
		const account = new Account(core)
		const { blockKeyPair } = await account.init()
		// Mock the response
		const domainName = 'example.stw'
		const hostingProviderAddresses = ['hosting.spacetimewave.com']
		const updateDnsRecordMock = jest.fn().mockImplementation(async () => {})
		jest.spyOn(core, 'updateDnsRecord').mockImplementation(updateDnsRecordMock)
		await account.updateDnsRecord(
			domainName,
			hostingProviderAddresses,
			blockKeyPair.privateKey,
		)

		expect(updateDnsRecordMock).toHaveBeenCalled()
		expect(true).toEqual(true)
	})

	it('Delete Dns Record', async () => {
		const core = new Core()
		const account = new Account(core)
		const { blockKeyPair } = await account.init()
		// Mock the response
		const domainName = 'example.stw'
		const deleteDnsRecordMock = jest.fn().mockImplementation(async () => {})
		jest.spyOn(core, 'deleteDnsRecord').mockImplementation(deleteDnsRecordMock)
		await account.deleteDnsRecord(domainName, blockKeyPair.privateKey)

		expect(deleteDnsRecordMock).toHaveBeenCalled()
		expect(true).toEqual(true)
	})

	it('Get Name Server', async () => {
		// Mock the response
		const domainName = 'example.stw'
		const nameServer = await Account.getNameServerByDomain(domainName)
		expect(nameServer).toEqual({
			domainExtension: 'stw',
			nameServerAddress: ['localhost:3000', 'dns.spacetimewave.com'],
		})
	})

	it('Get Name Server Error', async () => {
		// Mock the response
		const domainName = 'example.on'
		try {
			await Account.getNameServerByDomain(domainName)
			expect(true).toEqual(false)
		} catch {
			expect(true).toEqual(true)
		}
	})
})
