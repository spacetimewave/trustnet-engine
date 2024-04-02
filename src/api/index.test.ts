import { API } from '.'

describe('API module test suite', () => {
	it('Hash Unit Test', async () => {
		expect(await API.hash('Message')).toEqual(
			'0x9a59efbc471b53491c8038fd5d5fe3be0a229873302bafba90c19fbe7d7c7f35',
		)
	})

	it('Signature e2e test', async () => {
		const keyPair = await API.generateSignatureKeyPair()
		const publicKey = keyPair.publicKey
		const privateKey = keyPair.privateKey
		const message = 'Message'
		const signature = await API.sign(message, privateKey)
		const verification = await API.verify(message, signature, publicKey)
		expect(verification).toEqual(true)
	})

	it('Block Header Signature Unit Test', async () => {
		const accountkeyPair = await API.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey

		const blockKeyPair = await API.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const unsignedblockHeader = await API.generateBlockHeader(
			'Content',
			accountPublicKey,
			blockPublicKey,
			1,
			1,
			1,
		)

		const signedBlockHeader = await API.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey,
		)

		expect(await API.verifyBlockHeaderSignature(signedBlockHeader)).toEqual(
			true,
		)
	})

	it('Seed Block Signature Unit Test', async () => {
		const accountkeyPair = await API.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await API.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey

		const unsignedSeedBlock = await API.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await API.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		expect(await API.verifySeedBlockSignature(signedSeedBlock)).toEqual(true)
	})

	it('Block Unit Test', async () => {
		const accountkeyPair = await API.generateSignatureKeyPair()
		const accountPublicKey = accountkeyPair.publicKey
		const accountPrivateKey = accountkeyPair.privateKey

		const blockKeyPair = await API.generateSignatureKeyPair()
		const blockPublicKey = blockKeyPair.publicKey
		const blockPrivateKey = blockKeyPair.privateKey

		const content = 'Hello world!'

		const unsignedblockHeader = await API.generateBlockHeader(
			content,
			accountPublicKey,
			blockPublicKey,
			1,
			1,
			1,
		)

		const signedBlockHeader = await API.signBlockHeader(
			unsignedblockHeader,
			blockPrivateKey,
		)

		const unsignedSeedBlock = await API.generateSeedBlock(
			accountPublicKey,
			blockPublicKey,
			1,
			1,
		)

		const signedSeedBlock = await API.signSeedBlock(
			unsignedSeedBlock,
			accountPrivateKey,
		)

		const blockMetadata = API.generateMetadata(signedSeedBlock)
		const block = API.generateBlock(signedBlockHeader, content, blockMetadata)

		console.log(block)
		expect(await API.verifyBlock(block)).toEqual(true)
	})
})
