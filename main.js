function response(id, data, error = "") {
    window.parent.postMessage(JSON.stringify({ id, data, error }), "*");
}
function uuid() {
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        const f = Math.floor(Math.random() * 0x10);
        s[i] = hexDigits.substring(f, f + 1);
    }
    s[14] = "4";
    const s19 = s[19];
    const i = (s19 & 0x3) | 0x8;
    s[19] = hexDigits.substring(i, i + 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}
// 暴露API接口供业务系统调用
export function expose(apiHandlers, originVertify) {
    function listener(e) {
        let data = {};
        try {
            data = JSON.parse(e.data);
        }
        catch (e) {
            window.console.error(e);
            return;
        }
        const id = data.id;
        if (originVertify && !originVertify(e.origin)) {
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
        resp.then((data) => {
            response(id, data);
        });
    }
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
}
export function excute(frameID, actionName, ...params) {
    console.log(frameID);
    return new Promise((resolve, reject) => {
        var _a;
        const frame = window.frames[frameID];
        console.log(frame);
        if (!frame) {
            reject(`iframe not found: ${frameID}`);
            return;
        }
        ;
        const id = uuid();
        function listener(e) {
            console.log(e);
            window.removeEventListener("message", listener);
            let resp = {};
            try {
                resp = JSON.parse(e.data);
            }
            catch (e) {
                window.console.error(e);
                return;
            }
            if (!resp.id || resp.id !== id)
                return;
            if (resp.error) {
                reject(resp.error);
                return;
            }
            let data = resp.data;
            try {
                data = JSON.parse(resp.data);
            }
            catch (e) { }
            resolve(data);
        }
        window.addEventListener("message", listener);
        const requestData = { id, actionName, params };
        console.log(requestData);
        (_a = frame.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify(requestData), "*");
    });
}
