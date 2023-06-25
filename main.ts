function response(id: string, data: any, error = "") {
	window.parent.postMessage(JSON.stringify({ id, data, error }), "*");
}

function uuid(): string {
	const s: string[] = [];
	const hexDigits = "0123456789abcdef";
	for (let i = 0; i < 36; i++) {
		const f = Math.floor(Math.random() * 0x10);
		s[i] = hexDigits.substring(f, f + 1);
	}
	s[14] = "4";
	const s19: any = s[19];
	const i = (s19 & 0x3) | 0x8;
	s[19] = hexDigits.substring(i, i + 1);
	s[8] = s[13] = s[18] = s[23] = "-";
	return s.join("");
}

// 暴露API接口供业务系统调用
export function exportAPI(apiHandlers: Record<string, Function>, legalOrigin?: (origin: string) => boolean) {
	window.addEventListener("message", function (e: any) {
		let data: any = {};
		try {
			data = JSON.parse(e.data);
		} catch (e) {
			window.console.error(e);
			return;
		}
		const id = data.id;
		if (legalOrigin && !legalOrigin(e.origin)) {
			response(id, null, "illegal origin");
			return;
		}

		if (!data.actionName) {
			response(id, null, "Missing actionName field");
			return;
		}
		const handler = apiHandlers[data.actionName];
		if (!handler) {
			response(id, null, `The function ${data.actionName} does not exist`);
			return;
		}
		const resp = handler(...data.params);
		if (!resp || !resp.then) {
			response(id, resp);
			return;
		}
		resp.then((data: any) => {
			response(id, data);
		});
	});
}

export function excute<T>(frameID: string, actionName: string, ...params: any): Promise<T> {
	return new Promise((resolve, reject) => {
		const frame: HTMLIFrameElement = (window.frames as any)[frameID];
		if (!frame) return;
		const id = uuid();
		function listener(e: any) {
			window.removeEventListener("message", listener);
			let resp: any = {};
			try {
				resp = JSON.parse(e.data);
			} catch (e) {
				window.console.error(e);
				return;
			}
			if (!resp.id || resp.id !== id) return;
			if (resp.error) {
				reject(resp.error);
				return;
			}
			let data: any = resp.data;
			try {
				data = JSON.parse(resp.data);
			} catch (e) {}
			resolve(data);
		}
		window.addEventListener("message", listener);
		const requestData = { id, actionName, params };
		frame.contentWindow?.postMessage(JSON.stringify(requestData), frame.src);
	});
}
