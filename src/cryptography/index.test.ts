import { Cryptography } from '.'

describe('Cryptography module test suite', () => {
	it('Hash unit test', async () => {
		expect(Cryptography.hash('Message')).toEqual(
			'0x9a59efbc471b53491c8038fd5d5fe3be0a229873302bafba90c19fbe7d7c7f35',
		)
	})

	it('Signature e2e test', async () => {
		const keyPair = await Cryptography.generateSignatureKeyPair()
		const publicKey = keyPair.publicKey
		const privateKey = keyPair.privateKey
		const message = 'Message'
		const signature = await Cryptography.sign(message, privateKey)
		const verification = await Cryptography.verify(
			message,
			signature,
			publicKey,
		)
		expect(verification).toEqual(true)
	})

	it('Encryption e2e test', async () => {
		const keyPair = await Cryptography.generateEncryptionKeyPair()
		const publicKey = keyPair.publicKey
		const privateKey = keyPair.privateKey

		const message = 'Message'
		const encryptedMessage = await Cryptography.encrypt(message, publicKey)
		const decryptedMessage = await Cryptography.decrypt(
			encryptedMessage,
			privateKey,
		)
		expect(decryptedMessage).toEqual(message)
	})

	it('Public key valid format', async () => {
		expect(
			Cryptography.isPublicKeyFormatValid(
				'0x000400f200cc002100e400f8006f00730091003100d9003b009f004200c900fc00c2007400ef00fa00df001e008b0052009e0081001400b700be0021003600dd00e100750043009800c700ba003b00fe0004001b00ca00de001d008e0004004700bb00f6005600fe00f5006d00d1004200400076002e00e600b1000000c900ef0066',
			),
		).toEqual(true)
	})

	it('Private key valid format', async () => {
		expect(
			Cryptography.isPrivateKeyFormatValid(
				'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgwI3usngmXuHvne2VCHUCHyyvX9hWQDCdQILZVMlfZBChRANCAARrx6aPIMETnUdTTEnMs7+tKG381iUFC/96NXlSJ6iDiXE3vi3c8BM0cZj+BD3elD0x7Fk6v1W/CRlZLKjdfAYN',
			),
		).toEqual(true)
	})
})
