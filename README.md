# iframe api binding

## 说明

iframe 页面通过 postMessage 函数导出 api (函数)，并支持在父页面调用 api，获取返回值。

## 使用方式

### 1. 安装

```sh
npm install ifapi --save
```

### 2. 使用

###### 1. iframe 页面导出 api

```ts
const handlers = {
    greet: function(name: string) {
        alert(`hello, ${name}`);
    },
    sum: function(args: { a: number, b: number }) {
        const { a, b } = args;
        return a + b;
    }
}

exportAPI(handlers);
```

###### 2. parent 页面调用 api
```ts
	// <iframe id="my-frame" src="http://www.test.com/frame.html"></iframe>
	excute("my-frame", "sum", { a: 1, b: 2 })
		.then((data) => console.log(data))
		.catch((error) => console.error(error));
```
