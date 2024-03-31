import { Cryptography } from './cryptography'

describe('Cryptography module test suite', () => {
	it('Hash unit test', async () => {
		expect(await Cryptography.hash('Message')).toEqual(
			'0x9a59efbc471b53491c8038fd5d5fe3be0a229873302bafba90c19fbe7d7c7f35',
		)
	})

	it('Encryption e2e test', async () => {
		const keyPair = await Cryptography.generateEncryptionKeyPair()
		const publicKey = keyPair.publicKey
		const privateKey = keyPair.privateKey
		
		const message = "Message"
		const encryptedMessage = await Cryptography.encrypt(message, publicKey)
		const decryptedMessage = await Cryptography.decrypt(encryptedMessage, privateKey)
		expect(decryptedMessage).toEqual(message)
	})

})
