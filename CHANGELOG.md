## 0.3.3 (Jan 20, 2025)

### Account

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
