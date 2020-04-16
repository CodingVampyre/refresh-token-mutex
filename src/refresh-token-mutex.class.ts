import {Queue} from "./queue.class";

export class RefreshTokenMutex {

	private mayDoRequests: boolean = true;

	private queue: Queue = new Queue();

	public startRequest() {

	}

	private block() {
		this.mayDoRequests = false;
	}

	private unblock() {
		this.mayDoRequests = true;
		this.queue.resolve();
	}
}
