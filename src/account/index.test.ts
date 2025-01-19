import { Account } from '.'

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
})
