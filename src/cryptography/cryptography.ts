/* eslint-disable object-shorthand */
import { Web3 } from 'web3'

export class Cryptography {

	public static BLOCKCHAIN_DEFAULT_PROVIDER: string = 'http://localhost:7545'
	public static web3: Web3 = new Web3(this.BLOCKCHAIN_DEFAULT_PROVIDER)
	
	public static hash(message: string): string | undefined {
		const hash = this.web3.utils.sha3(message)
		return hash
	}

	public static async sign(message: string, privateKey: string): Promise<string> {
		try {
			if (privateKey === undefined) {
				throw Error()
			}

			const hash = this.hash(message)
			if (hash === undefined) {
				throw Error()
			}

			const signature = this.web3.eth.accounts.sign(hash, privateKey).signature

			return signature
		} catch (err) {
			throw Error()
		}
	}

	public static async generateKeyPair(): Promise<CryptoKeyPair> {
		const keypair = await crypto.subtle.generateKey(
			{
			  name: "RSA-OAEP",
			  modulusLength: 2048,
			  publicExponent: new Uint8Array([1, 0, 1]), // 65537
			  hash: "SHA-256",
			},
			true,
			["encrypt", "decrypt"]
		  );
	
		return keypair;
	}

	public static async encrypt(message: string, publicKey: CryptoKey, ): Promise<ArrayBuffer> {
		const encryptedtext = await crypto.subtle.encrypt(
			{name: "RSA-OAEP"},
			publicKey,
			new TextEncoder().encode(message)
		  );
		return encryptedtext;
	}

	public static async decrypt(encryptedMessage:BufferSource, privateKey:CryptoKey): Promise<string> {
		const decrypted = await crypto.subtle.decrypt(
			{name: "RSA-OAEP"},
			privateKey,
			encryptedMessage
		  );
		const decryptedtext = new TextDecoder().decode(decrypted);
		return decryptedtext;
	}
}
