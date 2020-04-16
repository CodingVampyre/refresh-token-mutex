import { EventEmitter } from 'events';
import { v1 as uuid } from 'uuid';

export class Queue extends EventEmitter {

	private requestStack: string[] = [];

	public push(): string {
		const id = uuid();
		this.requestStack.push(id);
		return id;
	}

	public resolve() {
		for (const requestIds of this.requestStack) {
			this.emit(requestIds);
		}
	}

}
