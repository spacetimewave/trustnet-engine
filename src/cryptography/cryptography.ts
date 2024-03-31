/* eslint-disable object-shorthand */
import { Web3 } from 'web3'
import { Keccak } from 'sha3'

export class Cryptography {

	public static BLOCKCHAIN_DEFAULT_PROVIDER: string = 'http://localhost:7545'
	public static web3: Web3 = new Web3(this.BLOCKCHAIN_DEFAULT_PROVIDER)
	
	public static async generateSignatureKeyPair(): Promise<CryptoKeyPair> {
		const keypair = await crypto.subtle.generateKey(
			{
			  name: "ECDSA",
			  namedCurve: "P-256K",
			},
			true,
			["sign", "verify"]
		  );
	
		return keypair;
	}
	
	public static async hash(message: string): Promise<string> {
		const hash = new Keccak(256);
		hash.update(message);
		return "0x"+hash.digest('hex')
	}

	public static async sign(message: string, privateKey: CryptoKey): Promise<ArrayBuffer> {
		try {
			if (privateKey === undefined) {
				throw Error()
			}

			const hash = await this.hash(message)
			if (hash === undefined) {
				throw Error()
			}

			const signature = await crypto.subtle.sign("ECDSA", privateKey, this.arrayBufferEncode(hash))

			return signature
		} catch (err) {
			throw Error()
		}
	}

	public static async verify(message: string, signature: ArrayBuffer, publicKey: CryptoKey): Promise<boolean> {
		try {

			const hash = await this.hash(message)
			if (hash === undefined) {
				throw Error()
			}

			const verification = await crypto.subtle.verify("ECDSA", publicKey, signature, this.arrayBufferEncode(hash))
			
			return verification
		} catch (err) {
			throw Error()
		}
	}

	public static async generateEncryptionKeyPair(): Promise<CryptoKeyPair> {
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

	public static arrayBufferEncode(str: string): ArrayBuffer {
		const encoder = new TextEncoder();
    	return encoder.encode(str).buffer;
	}

	public static arrayBufferDecode(buffer: ArrayBuffer): string {
		const decoder = new TextDecoder();
		return decoder.decode(buffer);
	}
}
