import {RefreshTokenMutex} from "./refresh-token-mutex.class";

test('should handle requests normally', async () => {

	let currentToken = 'a';
	async function fetch(token: string) {

		await new Promise(res => setTimeout(res, 500));
		const status = token === currentToken ? 200 : 401;
		currentToken = 'b';
		return {
			body: 'MESSAGE_X',
			status
		}
	}

	let token = 'a';
	const mutex = new RefreshTokenMutex(async () => {
		// just wait a second and increment the token
		await new Promise((res) => setTimeout(res, 500));
		token = 'b';
	});

	const finalResult = await mutex.startRequest(
		async () => fetch(token),
		(response) => response.status === 401,
	);

	expect(finalResult.body).toEqual('MESSAGE_X');
});

test('should block on errorous response', async () => {

	let currentToken = 'a';
	async function fetch(token: string, num?: number) {
		await new Promise(res => setTimeout(res, 500));
		const status = token === currentToken ? 200 : 401;
		currentToken = 'b';
		return {
			body: 'MESSAGE_X',
			status
		}
	}

	let token = 'a';
	let refreshCalled = 0;
	const mutex = new RefreshTokenMutex(async () => {
		// just wait a second and increment the token
		await new Promise((res) => setTimeout(res, 200));
		token = 'b';
		refreshCalled++;
	});

	mutex.startRequest(
		async () => fetch(token, 1),
		(response) => response.status === 401,
	).then(res => console.log('a', res));

	mutex.startRequest(
		async () => fetch(token, 2),
		(response) => response.status === 401,
	).then(res => console.log('b', res));

	mutex.startRequest(
		async () => fetch(token, 3),
		(response) => response.status === 401,
	).then(res => console.log('c', res));

	await new Promise(res => setTimeout(() => {
		expect(refreshCalled).toEqual(1);
	}, 3000));

});
