## 0.7.1 (Feb 28, 2025)

### Core

- **DNS**: Update ".stw" dns provider resolution ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.7.0 (Feb 28, 2025)

### Account

- **init**: Save block private key by default | **BREAKING CHANGE** ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **login**: Login with seed block and block private key. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.6.11 (Feb 28, 2025)

### Core

- **DNS**: DNS fix. Now DNS requests use HTTP POST protocol. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.6.10 (Feb 17, 2025)

### Account

- **DNS**: DNS fix. Use Block and Account public keys to generate message header. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.6.4 to 0.6.9 (Feb 16, 2025)

### Account

- **ESModules and CommonJS**: Change ViteJS build mode. Build for NodeJS (CommonJS) and Browser (ESModules). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.6.3 (Feb 16, 2025)

### Account

- **verifyMessage**: Verify message. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.6.2 (Feb 16, 2025)

### Models

- **DNS API**: Update DNS API endpoints to perform CRUD endpoints. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.6.1 (Feb 16, 2025)

### Models

- **IGetDnsRecordContent and IGetDnsRecordMessage**: Get Dns Record Message Content Definition. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **ICreateDnsRecordContent and ICreateDnsRecordMessage**: Create Dns Record Message Content Definition. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **IUpdateDnsRecordContent and IUpdateDnsRecordMessage**: Update Dns Record Message Content Definition. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **IDeleteDnsRecordContent and IDeleteDnsRecordMessage**: Delete Dns Record Message Content Definition. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.6.0 (Feb 10, 2025)

### Account

- **getNameServerByDomain**: Get Name Servers of a domain. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **getDnsRecord**: Get DNS record of an account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **createDnsRecord**: Create DNS record of an account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **updateDnsRecord**: Update DNS record of an account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **deleteDnsRecord**: Delete DNS record of an account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

### Core

- **generateMessageHeader**: Generate Message Header from message and account information. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **generateMessageMetadata**: Generate Message Metadata from seed block. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **generateMessage**: Generate Message Metadata and Message Header. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **signMessageHeader**: Sign Message Header. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **signMessage**: Sign Message by signing Messsage Header. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **verifyMessageContent**: Verify output hash of the message content. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **verifyMessageAddress**: Verify message header address. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **verifyMessageHeaderSignature**: Verify message header signature. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **verifyMessage**: Verify the message by verifying signature, address, and output hash of the content. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **getNameServerByDomain**: Get Name Servers of a domain. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **getNameServerByExtension**: Get Name Servers of a domain by domain extension. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **getDnsRecord**: Get DNS record of an account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **createDnsRecord**: Create DNS record of an account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **updateDnsRecord**: Update DNS record of an account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **deleteDnsRecord**: Delete DNS record of an account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

### Constants

- **NAME_SERVERS**: Default Name Servers until decentralized repository for DNS providers is implemented. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

### Models

- **IMessage**: Message model that consists of a message, its header and its metadata. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **IMessageHeader**: Message Header model. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **IMessageMetadata**: Message Metadata model. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **IDnsProvider**: Name Server Provider Model. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **IDnsRecord**: DNS Record that constists of a domain name, hosting providers and account public key. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **IDnsRecordMessage**: IMessage model that contains a DnsRecord as message content. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.5.4 (Feb 3, 2025)

### Global

- **NodeJS**: Fix "The current file is a CommonJS module" bug in NodeJS. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.5.3 (Feb 3, 2025)

### Core

- **IDomainNameEntry**: Build before publish bug issue fix. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.5.2 (Feb 3, 2025)

### Core

- **IDomainNameEntry**: Export IDomainNameEntry definition. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.5.1 (Feb 2, 2025)

### Core

- **IDomainNameEntry**: Update IDomainNameEntry definition. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.5.0 (Feb 2, 2025)

### Core

- **getUserDomainNameEntry**: Get a domain name entry. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **createUserDomainNameEntry**: Get a domain name entry. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **updateUserDomainNameEntry**: Get a domain name entry. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **deleteUserDomainNameEntry**: Get a domain name entry. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

### http

- **http**: Http instance to make HTTP requests. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **request**: Base HTTP request method. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **get**: GET HTTP method. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **post**: POST HTTP method. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **put**: PUT HTTP method. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **delete**: DELETE HTTP method. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.4.0 (Jan 23, 2025)

### Cryptography

- **isPublicKeyFormatValid**: Check if the public key is in a valid format. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **isPrivateKeyFormatValid**: Check if the private key is in a valid format. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **generateKeyPair**: Now returns a private key in base64 string format. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **stringToPrivateKey**: Transforms a base64 key string to CryptoKey. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **privateKeyToString**: Transforms a CryptoKey to base64 key string. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **abtob64**: Transforms an ArrayBuffer to base64 string. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **b64toab**: Transforms abase64 string to ArrayBuffer. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.3.4 (Jan 20, 2025)

### Account

- **Account**: Export Account pubkey and Block pubkey from Account object. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.3.3 (Jan 20, 2025)

### Models

- **Models**: Export Model Object Interface fix to enable typing. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.3.2 (Jan 20, 2025)

### Account

- **Account**: Export Account Module fix. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.3.1 (Jan 20, 2025)

### Account

- **Account**: Export Account Module fix. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.3.0 (Jan 19, 2025)

### Account

- **Account**: Account module is created to facilitate interaction with accounts through Object Oriented Programming (OOP). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **constructor()**: Create Account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **init()**: Initialize Account, account key-pairs, block key-pairs, seed block, and account blocks. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **isAccountInitialized()**: Check if account and block public keys, and seed block are already generated. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **isBlockPrivateKeyInitialized()**: Check if block private key is stored within the Account instance. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **createNewBlock()**: Create new Block for the account. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **updateBlock()**: Update an account's Block. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **deleteBlock()**: Delete an account's Block. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **verifyBlock()**: Verify an account's Block. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **verifySeedBlock()**: Verify an account's Seed Block. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **importAccount()**: Import an account (blocks and seed block). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **exportAccount()**: Export an account (blocks and seed block). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

### Core

- **TrustNetEngine**: TrustNetEngine module is renamed to Core. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.2.0 (Jan 13, 2025)

### TrustNetEngine

- **API**: API module is renamed to TrustNetEngine, and all its methods are exposed. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

## 0.1.0 (April 8, 2024)

### Models

- **Block**: Define Block v0.1.0. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Block Header**: Define Block Header v0.1.0. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Block Metadata**: Define Block Metadata v0.1.0. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Seed Block**: Define Seed Block v0.1.0. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Key Pair**: Define Key Pair v0.1.0. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

### API

- **Hash**: `Keccak SHA-3` hash function. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Signature key-pair**: Generate signature key pair using `ECDSA P-256`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Sign**: Sign message using `ECDSA P-256`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Verify**: Verify `ECDSA P-256` message signature. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Generate Block Header**: Generate Block Header (v0.1.0). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Generate Seed Block**: Generate Seed Block (v0.1.0). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Sign Block Header**: Sign Block Header (v0.1.0) using `ECDSA P-256`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Sign Seed Block**: Sign Seed Block (v0.1.0) using `ECDSA P-256`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Verify Block Header signature**: Verify Block Header signature (v0.1.0) using `ECDSA P-256`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Verify Seed Block signature**: Verify Seed Block signature (v0.1.0) using `ECDSA P-256`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Verify Block Content**: Verify Block Content (v0.1.0) matches Block Output Hash (v0.1.0) using `Keccak SHA-3`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Verify Block Address**: Verify Block Address (v0.1.0) matches Seed Block Address (v0.1.0). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Verify Block Public Key**: Verify Block Public Key (v0.1.0) matches Seed Block Public Key (v0.1.0). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Generate Block Metadata**: Generate Block Metadata (v0.1.0). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Generate Block**: Generate Block (v0.1.0). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Sign Block**: Sign Block (v0.1.0) by signing Block Header (v0.1.0). ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Verify Block**: Verify Block (v0.1.0) by verifying Block Content, Block Address, Block Public Key, Header Block Signature and Seed Block Signature. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))

### Cryptography

- **Hash**: `Keccak SHA-3` hash function. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Signature key-pair**: Generate signature key pair using `ECDSA P-256` curve. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Sign**: Sign message using `ECDSA SHA-256`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Verify**: Verify `ECDSA SHA-256` message signature. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Encryption key-pair**: Generate encryption key pair using `RSA-OAEP SHA-256` with `mod-2048 exp-65537` params. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Encrypt**: Encrypt message using `RSA-OAEP`. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Decrypt**: Decrypt `RSA-OAEP` encrypted message. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Hexadecimal Encoder**: Encode `UTF-16` string into `Hexadecimal` string. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Hexadecimal Decoder**: Decode `Hexadecimal` string into `UTF-16` string. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Array Buffer Encoder**: Encode string into Array Buffer. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Array Buffer Decoder**: Decode Array Buffer into string. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Public Key Encoder**: Encode string into public CryptoKey. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Public Key Decoder**: Decode public CryptoKey into string. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Private Key Encoder**: Encode string into private CryptoKey. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
- **Private Key Decoder**: Decode private CryptoKey into string. ([@javierhersan](https://github.com/javierhersan) in [#00000](https://github.com/spacetimewave/trustnet-engine))
