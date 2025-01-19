import { TrustNetEngine } from '.'

describe('Core module test suite', () => {
	it('Hash Unit Test', async () => {
		expect(await TrustNetEngine.hash('Message')).toEqual(
			'0x9a59efbc471b53491c8038fd5d5fe3be0a229873302bafba90c19fbe7d7c7f35',
		)
	})

	it('Signature e2e test', async () => {
		const keyPair = await TrustNetEngine.generateSignatureKeyPair()
		const publicKey = keyPair.publicKey
		const privateKey = keyPair.privateKey
		const message = 'Message'
		const signature = await TrustNetEngine.sign(message, privateKey)
		const verification = await TrustNetEngine.verify(
			message,
			signature,
			publicKey,
		)
		expect(verification).toEqual(true)
	})

	it('Block Header Signature Unit Test', async () => {
		const accountkeyPair = await TrustNetEngine.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey

		const blockKeyPair = await TrustNetEngine.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedblockHeader = await TrustNetEngine.generateBlockHeader(
			'Content',
			accountPublicKey,
			blockPublicKey,
			1,
			1,
			1,
		)

		const signedBlockHeader = await TrustNetEngine.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey,
		)

		expect(
			await TrustNetEngine.verifyBlockHeaderSignature(signedBlockHeader),
		).toEqual(true)
	})

	it('Seed Block Signature Unit Test', async () => {
		const accountkeyPair = await TrustNetEngine.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await TrustNetEngine.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey

		const unsignedSeedBlock = await TrustNetEngine.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await TrustNetEngine.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		expect(
			await TrustNetEngine.verifySeedBlockSignature(signedSeedBlock),
		).toEqual(true)
	})

	it('Block Unit Test', async () => {
		const accountkeyPair = await TrustNetEngine.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await TrustNetEngine.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const content = 'Hello world!'

		const unsignedblockHeader = await TrustNetEngine.generateBlockHeader(
			content,
			accountPublicKey,
			blockPublicKey,
			1,
			1,
			1,
		)

		const signedBlockHeader = await TrustNetEngine.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey,
		)

		const unsignedSeedBlock = await TrustNetEngine.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await TrustNetEngine.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const blockMetadata = TrustNetEngine.generateMetadata(signedSeedBlock)
		const block = TrustNetEngine.generateBlock(
			signedBlockHeader,
			content,
			blockMetadata,
		)

		expect(await TrustNetEngine.verifyBlock(block)).toEqual(true)
	})
})
