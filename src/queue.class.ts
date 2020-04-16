
type IRequestFunction = (...params: any[]) => Promise<any>;

export class Queue {

	private requestStack: IRequestFunction[] = [];

	public push(requestFunction: IRequestFunction) {
		this.requestStack.push(requestFunction);
	}

	public resolve() {
		for (const requestFunction of this.requestStack) { requestFunction().catch() }
	}

}
