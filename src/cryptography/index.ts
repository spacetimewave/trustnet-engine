import { Keccak } from 'sha3'
import type { IKeyPair } from '../models/IKeyPair'

export class Cryptography {
	public static hash(message: string): string {
		const hash = new Keccak(256)
		hash.update(message)
		return '0x' + hash.digest('hex')
	}

	public static async generateSignatureKeyPair(): Promise<IKeyPair> {
		const cryptoKeyPair = await crypto.subtle.generateKey(
			{
				name: 'ECDSA',
				namedCurve: 'P-256',
			},
			true,
			['sign', 'verify'],
		)
		const keyPair: IKeyPair = {
			publicKey: await this.publicKeyToString(cryptoKeyPair.publicKey),
			privateKey: await this.privateKeyToString(cryptoKeyPair.privateKey),
		}
		return keyPair
	}

	public static async sign(
		message: string,
		privateKey: string,
	): Promise<string> {
		try {
			const hash = this.hash(message)
			const signature = await crypto.subtle.sign(
				{
					name: 'ECDSA',
					hash: 'SHA-256',
				},
				await this.stringToPrivateKey(privateKey),
				this.stoab(hash),
			)
			return this.hexEncode(this.abtos(signature))
		} catch (err) {
			console.log(err)
			throw Error()
		}
	}

	public static async verify(
		message: string,
		signature: string,
		publicKey: string,
	): Promise<boolean> {
		try {
			const hash = this.hash(message)
			const verification = await crypto.subtle.verify(
				{
					name: 'ECDSA',
					hash: 'SHA-256',
				},
				await this.stringToPublicKey(publicKey),
				this.stoab(this.hexDecode(signature)),
				this.stoab(hash),
			)
			return verification
		} catch (err) {
			throw Error()
		}
	}

	public static async generateEncryptionKeyPair(): Promise<CryptoKeyPair> {
		const keypair = await crypto.subtle.generateKey(
			{
				name: 'RSA-OAEP',
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]), // 65537
				hash: 'SHA-256',
			},
			true,
			['encrypt', 'decrypt'],
		)
		return keypair
	}

	public static async encrypt(
		message: string,
		publicKey: CryptoKey,
	): Promise<ArrayBuffer> {
		const encryptedtext = await crypto.subtle.encrypt(
			{ name: 'RSA-OAEP' },
			publicKey,
			new TextEncoder().encode(message),
		)
		return encryptedtext
	}

	public static async decrypt(
		encryptedMessage: BufferSource,
		privateKey: CryptoKey,
	): Promise<string> {
		const decrypted = await crypto.subtle.decrypt(
			{ name: 'RSA-OAEP' },
			privateKey,
			encryptedMessage,
		)
		const decryptedtext = new TextDecoder().decode(decrypted)
		return decryptedtext
	}

	public static hexEncode(string: string): string {
		let result = ''
		for (let i = 0; i < string.length; i++) {
			const hex = string.charCodeAt(i).toString(16)
			result += ('000' + hex).slice(-4)
		}
		// Add '0x' hexadecimal prefix
		return '0x' + result
	}

	public static hexDecode(string: string): string {
		// Remove '0x' hexadecimal prefix
		if (string.startsWith('0x')) {
			string = string.slice(2)
		}
		const hexes = string.match(/.{1,4}/g) ?? []
		let back = ''
		for (let i = 0; i < hexes.length; i++) {
			back += String.fromCharCode(parseInt(hexes[i], 16))
		}
		return back
	}

	public static abtos(buffer: ArrayBuffer): string {
		return String.fromCharCode.apply(null, [...new Uint8Array(buffer)])
	}

	public static stoab(str: string): ArrayBuffer {
		return Uint8Array.from(str, (x) => x.charCodeAt(0)).buffer
	}

	public static async publicKeyToString(key: CryptoKey): Promise<string> {
		return this.hexEncode(this.abtos(await crypto.subtle.exportKey('raw', key)))
	}

	public static async stringToPublicKey(key: string): Promise<CryptoKey> {
		return await crypto.subtle.importKey(
			'raw',
			this.stoab(this.hexDecode(key)),
			{
				name: 'ECDSA',
				namedCurve: 'P-256',
			},
			true,
			['verify'],
		)
	}

	public static abtob64(arrayBuffer: ArrayBuffer): string {
		const base64Key = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
		return base64Key
	}

	public static b64toab(base64String: string): ArrayBuffer {
		const binaryKey = atob(base64String)
		const keyBuffer = new Uint8Array(binaryKey.length)
		for (let i = 0; i < binaryKey.length; i++) {
			keyBuffer[i] = binaryKey.charCodeAt(i)
		}
		return keyBuffer.buffer
	}

	public static async privateKeyToString(key: CryptoKey): Promise<string> {
		const exportedKey = await crypto.subtle.exportKey('pkcs8', key)
		const base64Key = this.abtob64(exportedKey)
		return base64Key
	}

	public static async stringToPrivateKey(key: string): Promise<CryptoKey> {
		return await crypto.subtle.importKey(
			'pkcs8',
			this.b64toab(key),
			{
				name: 'ECDSA',
				namedCurve: 'P-256',
			},
			true,
			['sign'],
		)
	}

	public static isPublicKeyFormatValid(publicKey: string): boolean {
		const publicKeyRegex = /^0x([0-9a-fA-F]){260}$/
		return publicKeyRegex.test(publicKey)
	}

	public static isPrivateKeyFormatValid(privateKey: string): boolean {
		const privateKeyRegex = /^[A-Za-z0-9+/=]{184}$/
		return privateKeyRegex.test(privateKey)
	}
}
