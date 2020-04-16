import {Queue} from "./queue.class";

type AnyFunction = (...params: any[]) => any;

export class RefreshTokenMutex {
	constructor(
		private readonly refresh: AnyFunction,
	) { }

	private mayDoRequests: boolean = true;

	private queue: Queue = new Queue();

	public async startRequest(
		requestFunction: AnyFunction,
		refreshCondition: (...params: any[]) => boolean,
	): Promise<any> {
		// NOT BLOCKED
		if (this.mayDoRequests) {

			// execute
			const response = await requestFunction();

			// if a token must be refreshed
			if (refreshCondition(response)) {
				this.block();
				await this.refresh();
				this.unblock();
				return this.startRequest(requestFunction, refreshCondition);
			}

			return response;
		} else { // BLOCKED
			this.queue.push(requestFunction);
		}
	}

	private block() {
		this.mayDoRequests = false;
	}

	private unblock() {
		this.mayDoRequests = true;
		this.queue.resolve();
	}
}
