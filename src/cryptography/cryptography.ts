import { Keccak } from 'sha3'

export class Cryptography {
	
	public static async generateSignatureKeyPair(): Promise<CryptoKeyPair> {
		const keypair = await crypto.subtle.generateKey(
			{
			  name: "ECDSA",
			  namedCurve: "P-256",
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
			const hash = await this.hash(message)
			const signature = await crypto.subtle.sign({
				name: "ECDSA",
				hash: "SHA-256",
			  }, privateKey, this.arrayBufferEncode(hash))
			return signature
		} catch (err) {
			throw Error()
		}
	}

	public static async verify(message: string, signature: ArrayBuffer, publicKey: CryptoKey): Promise<boolean> {
		try {

			const hash = await this.hash(message)
			const verification = await crypto.subtle.verify({
				name: "ECDSA",
				hash: "SHA-256",
			  }, publicKey, signature, this.arrayBufferEncode(hash))
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
