import {RefreshTokenMutex} from "./refresh-token-mutex.class";

async function fetch(shouldAuth: boolean) {
	console.log('refresh function called');
	await new Promise(res => setTimeout(res, 500));
	return {
		body: 'MESSAGE_X',
		status: shouldAuth ? 200 : 401,
	}
}

test('should handle requests normally', async () => {

	let token = 1;

	const mutex = new RefreshTokenMutex(async () => {
		// just wait a second and increment the token
		await new Promise((res) => setTimeout(res, 500));
		token++;
	});

	const finalResult = await mutex.startRequest(
		async () => {
			return fetch(true);
		},
		(response) => {
			return response.status === 401;
		}
	);

	expect(finalResult.body).toEqual('MESSAGE_X');
});
