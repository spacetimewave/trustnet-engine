import { User } from './User'

describe('User', () => {
	it('Hash', async () => {
		const user = new User('0xb794f5ea0ba39494ce839613fffba74279579268')
		expect(user.hash('message')).toEqual(
			'0xc2baf6c66618acd49fb133cebc22f55bd907fe9f0d69a726d45b7539ba6bbe08',
		)
	})
})
