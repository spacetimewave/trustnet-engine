import { Core } from '.'

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
})
