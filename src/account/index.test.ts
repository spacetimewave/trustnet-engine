import { Account } from '.'
import { Core } from '../core'
// import { ISeedBlock } from '../models/ISeedBlock'

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

	it('Get Dns Record Unauthenticated', async () => {
		const core = new Core()
		const account = new Account(core)
		await account.init()
		// Mock the response
		const domainName = 'example.stw'
		const accountPublicKey = account.accountPublicKey
		const hostingProviderAddresses = ['hosting.spacetimewave.com']
		const getDnsRecordUnauthenticated = jest
			.fn()
			.mockImplementation(async () => ({
				domainName,
				accountPublicKey,
				hostingProviderAddresses,
			}))
		jest
			.spyOn(core, 'getDnsRecordUnauthenticated')
			.mockImplementation(getDnsRecordUnauthenticated)
		const dnsRecord = await account.getDnsRecordUnauthenticated('example.stw')

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
			nameServerAddress: [
				'http://localhost:3000',
				'https://dns.spacetimewave.com',
			],
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

	it('Account login', async () => {
		const core = new Core()
		const account = new Account(core)
		const domainName = 'example.stw'
		const blockPrivateKey =
			'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgglrLerfi3kGgJ7cqnT694DszzQxGIqvyu2rV9DobxnahRANCAATajZq5ts+fH/m2e5trFyhwNzhyT/FOcISKp0qfM+5ry7etpSGcA9bcY4WfrgJ34TUOG4PxS+bXXCWauRsml0vw'

		// Mocking
		const createAccountSeedBlockResponse = {
			version: 1,
			address:
				'0x000400c100a4004e003d006500f900b6005c00620057004600d8006b002f0028002300dd002a008c00ba008e00b200f000b6007e009800f2005a00760013008000ec00bd000700a800e200b2008300c400f2003e0015008e001c0018006000f000110011001f0007004c005d000b00cb004d008e00a40057007600190081000e0096',
			public_key:
				'0x000400da008d009a00b900b600cf009f001f00f900b6007b009b006b001700280070003700380072004f00f1004e00700084008a00a7004a009f003300ee006b00cb00b700ad00a50021009c000300d600dc00630085009f00ae0002007700e10035000e001b008300f1004b00e600d7005c0025009a00b9001b00260097004b00f0',
			update_id: 1,
			signature:
				'0x0031009900bf008e0003009d00f900ac007100b700c900dc004e003e00a40071008a007b001400e60019003100e1009f00750087000a0023007c002f0012008100160077009c005000b400650030003700d900d0009500ae00ba00c200b900db00bc003100fe00ce009000a90041007900740008004d00a1009b000d009b00a9',
		}
		const getAccountSeedBlockByUsernameUnauthenticated = jest
			.fn()
			.mockImplementation(async () => createAccountSeedBlockResponse)
		jest
			.spyOn(core, 'getAccountSeedBlockByUsernameUnauthenticated')
			.mockImplementation(getAccountSeedBlockByUsernameUnauthenticated)

		// Test
		await account.login(domainName, blockPrivateKey)
		const verification = await account.verifySeedBlock()
		expect(verification).toEqual(true)
	})

	it('Account signup', async () => {
		const core = new Core()
		const account = new Account(core)
		// Mocking
		const createAccountSeedBlock = jest
			.fn()
			.mockImplementation(async () => ({})) // It should return a seed block (but for this case an empty object is enough)
		jest
			.spyOn(core, 'createAccountSeedBlock')
			.mockImplementation(createAccountSeedBlock)

		// Test
		await account.signup(['https://hosting.provider.com'])
		const verification = await account.verifySeedBlock()
		expect(verification).toEqual(true)
	})
})
