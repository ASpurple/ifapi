## 说明

iframe 内嵌页面通过使用 window.postMessage 通信来导出一些函数供父级页面调用，从而避开跨域限制，在父页面调用导出的函数可直接获取到函数返回值。

## 使用方式

### 1. 安装

```sh
npm install ifapi --save
```

### 2. 使用

#### 1. iframe 内嵌页面导出 api

```ts
import { expose } from 'ifapi';

const handlers = {
    greet: function(name: string) {
        alert(`hello, ${name}`);
    },
    sum: function(a: number, b: number) {
        return a + b;
    }
}

expose(handlers);
```

#### 2. 父级页面调用 api
```ts
import { excute } from 'ifapi';

// <iframe id="my-frame" src="http://www.test.com/iframe.html"></iframe>

excute("my-frame", "greet");

excute("my-frame", "sum", 1, 2)
	.then((data) => console.log(data))
	.catch((error) => console.error(error));
```

#### 3. 导出的 api 被调用时校验 origin

```ts
import { expose } from 'ifapi';

function vertify(origin: string) {
    return origin == "www.xxxx.com";
}

expose(handlers, vertify);
```

#### 4. 取消导出

```ts
import { expose } from 'ifapi';

const unExpose = expose(handlers);

unExpose(); // 取消导出
```
