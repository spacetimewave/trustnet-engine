import { Account } from '.'
import { Core } from '../core'
import { ISeedBlock } from '../models/ISeedBlock'

describe('Account module test suite', () => {
	it('Account initialization', async () => {
		const account = new Account()
		await account.init()
		const verification = await account.verifySeedBlock()
		expect(verification).toEqual(true)
	})

	it('Account login', async () => {
		const account = new Account()
		const blockPrivateKey =
			'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgqMoGPTZa4VNdH4igg5ozVCvZye77j55oCP8RVm0p782hRANCAARratd8ZHk7rnRxt42qKnCWXNo8aPU9jcazKd153okkNuZLrTig3BB9C6MkEv2s2zxzxIY0paMngEAfFCqIkXS9'
		const seedBlock: ISeedBlock = {
			version: 1,
			address:
				'0x000400a600b000b3001a009b0069009e0067002e003600760071001d006a0051001b006a000100f6001a00a4004000a1003e0046000b00ea0079009a00dd00820064001b0036003700e60070000300b900f0006f0002001d00f7006d004f00c4003000da0027008900a90016002d00b900f10073002b0019004c00e7006900fe00b5',
			public_key:
				'0x000400fa009d005400470078001b0088006d005100c7000f005e00940031009e001b00a9002200380080003100e9007500d00092006500e5006800d600610092006100ab00ef007f007d006900f700e10099004400fd009d00c1008f0014002d002200ca002d004d006c006c002300de00c300c900c200a300900086008800890089',
			update_id: 1,
			signature:
				'0x00e70014001b008700600015009e008d00cf003c009400f2006f009a00f00075005f0044003c001a002e00b20051006b00a700c000d50066000e00ce0045007e00d9003e00150003006200bb00890043004a000e00fe007500fe001800650091007300fa000f001700e5003000ab0001006300c2008d004b002e0025001b0019',
		}
		await account.login(blockPrivateKey, seedBlock)
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
		await account.init()
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
		const hostingProviderAddresses = [
			'localhost:3000',
			'hosting.spacetimewave.com',
		]
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
		const hostingProviderAddresses = [
			'localhost:3000',
			'hosting.spacetimewave.com',
			'hosting.wave.com',
		]
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
