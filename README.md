# export iframe api

## 说明

iframe 页面通过使用 window.postMessage 通信来导出 api (函数)，从而避开跨域限制，并支持在父页面调用 api，获取返回值。

## 使用方式

### 1. 安装

```sh
npm install ifapi --save
```

### 2. 使用

#### 1. iframe 页面导出 api

```ts
const handlers = {
    greet: function(name: string) {
        alert(`hello, ${name}`);
    },
    sum: function(a: number, b: number) {
        return a + b;
    }
}

exportAPI(handlers);
```

#### 2. 导出的 api 被调用时校验 origin

```ts
function vertify(origin: string) {
    return origin == "www.xxxx.com";
}

exportAPI(handlers, vertify);
```

#### 3. parent 页面调用 api
```ts
	// <iframe id="my-frame" src="http://www.test.com/iframe.html"></iframe>
	excute("my-frame", "sum", 1, 2)
		.then((data) => console.log(data))
		.catch((error) => console.error(error));
```
