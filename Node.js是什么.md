# Node.js

### Node.js是什么

- Node.js是一门基于chrome浏览器V8引擎的运行环境。
  - 简单讲就是Node.js可以解析并执行JavaScript代码。
  - 在以前只有浏览器可以解析执行Javascript代码。
  - 现在的Javascript可以通过node完全脱离浏览器运行。
- Node.js使用事件驱动，非阻塞的i/o模型（异步），轻量高效。

### 文件读写

```js
// 读文件
fs.readFile('./msg/hello.txt',(err,data)=>{
  if(err){
    return err
  }
  console.log(data.toString())
})

// 写文件
fs.writeFile('./msg/promise.txt','hello promise',()=>{
  console.log('done')

})
```

### http服务

```javascript
const http = require('http');

let server= http.createServer();
server.on('request',(request,response)=>{
    if(request.url=='/index'){
        response.setHeader('Content-type','text/plain;charset=utf-8')
        response.end('hello 世界')
    }else if(request.url=="/login"){
        response.setHeader('Content-type','text/html;charset=utf-8')
        response.write('logina手动阀')
        response.end('<p>hello <a href="#">hh</a></p>')
    }
}).listen(3000,()=>{
    console.log('http://127.0.0.1:3000')
})

```

### mime.json

https://www.jianshu.com/p/5926d5a3b11d



### node中使用模板引擎

npm install art-template --save

```javascript
const template = require('art-template');
const fs = require('fs');
const http = require('http');
let ret ;
fs.readFile('./tpl.html', (err, data) => {
    if (err) {
        return err
    }
    console.log(data)
    let html = data.toString();
    ret = template.render(html, {
        name: 'world手动阀',
        age: '18',
        xx:'nidaye'
    })
    console.log(ret)
})

let server = http.createServer();
server.on('request',(request,response)=>{
    if(request.url=='/'){
        response.end(ret)
    }else if(request.url=='/index'){
        response.end('hello')
    }
}).listen(3100,()=>{
    console.log('http://127.0.0.1:3100')
})


```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <P>hello {{name}}</P>
    <P>hello {{age}}</P>
    <P>hello {{xx}}</P>
</body>
</html>
```

### 服务端渲染

- 就是在服务端使用模板引擎，模板引擎最早诞生于服务端，后来才发展到前端。

- 服务端和客服端渲染的区别
  - 客服端渲染不利于搜索引擎优化（seo）
  - 服务端渲染可以被爬虫抓到，客服端异步渲染很难被爬虫抓取到
  - 真正的网站既不是纯异步也不是纯服务端渲染出来的，而是两者结合做出来的
  - 例如京东的商品列表采用的就是服务端渲染，目的就是为了SEO,而商品评论列表为了用户体验，而且不需要SEO，所以采用客户端渲染

### 重定向

```js
 response.statusCode = 302;
 response.setHeader('Location','/')
```

### 模块化

#### 模块化原理

```js
//node底层代码
var module = {
    exports:{
        foo:'bar',
        add:function(){
            
        } 
    }
}
//为了简化操作，模块中还有一句代码
var exports = module.exports;

//但是最后return module.exports
//所以当赋值exports='xx',最后返回的是{}；
```

#### 模块化加载方式

- 核心模块
	+ 核心模块已经已经被编译到二进制文件中了，我们只需要按照名字加载就可以了
	+ 例如 ：`require('fs')`
- 第三方模块
	1. 以加载`jquery`为例`require('jquery')`
	2. 首先在加载模块文件同级目录下找`node_modules`目录，如果没有，则一层一层向上找，直到找到磁盘根目录，没有找到就报错，` Cannot find module 'jquery'`
	3. 然后找到`node_modules/jquery`的package.json文件下的`main`属性，其属性值为入口文件模块，然后进行加载；如果不存在`main`属性或者为空、或者不存在`package.json`文件，则找`node_modules/jquery/index.js`文件加载

#### 模块查找机制

   1. 优先从缓存加载
   2. 核心模块
   3. 路径形式的文件模块
4. 第三方模块

#### npm命令

![image-20200909180245957](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200909180245957.png)


### 实现数组slice方法

```js
 Array.prototype.mySlice = function () {
        console.log(arguments)
        let start = 0;
        let end = this.length;
        if (arguments.length == 1) {
            start = arguments[0];
        } else if (arguments.length == 2) {
            start = arguments[0];
            end = arguments[1];
        }
        let arr = [];
        for(let i = start;i<end;i++){
            arr.push(this[i])
        }
        return arr
    }
    let arrLike = {
        0:'xx',
        1:'ss',
        2:'ff',
        length:3
    }
    console.log([].mySlice.call(arrLike));
	console.log([1,2,3,4].mySlice());
    console.log([1,2,3,4].mySlice(1))    			     console.log([1,2,3,4].mySlice(1,3))
```
### 实现find和findIndex方法
```js
	Array.prototype.myFind = function (cb) {
        for (let i = 0; i < this.length; i++) {
            if (cb(this[i], i)) {
                return this[i]
            }
        }
        return undefined;
    }
    Array.prototype.myFindIndex = function (cb) {
        for (let i = 0; i < arr.length; i++) {
            if(cb(this[i],i)){
                return i
            }
        }
        return -1;
    };
     let arr = [{
            id: 1,
            name: 'xx'
        },
        {
            id: 2,
            name: 'xx1'
        },
        {
            id: 3,
            name: 'xx2'
        },
        {
            id: 4,
            name: 'xx3'
        },
        {
            id: 2,
            name: 'xx3'
        }
    ]
    let b = arr.myFind((item, index) => {
        return item.id == 3;
    })
    console.log(b)//{id:3,name:'xx2'}
    let c = arr.myFindIndex((item, index) => {
        return item.id == 2;
    })
    console.log(c)//1
```





### express 

```js
//npm install express --save
const express = require('express');
const app = express();
app.get('/',function(req,res){
    res.send('hello express 哈哈');
}).listen(3001,()=>{
    console.log('http://127.0.0.2:3001')
})
app.get('/about',function(req,res){
    res.send('hello express哈哈');
})
```

### 文件操作路径和模块路径

文件操作路径
```js
	//	在文件操作相对路径
	//	./data/a.txt 相对于当前路径
	//	data/a.txt 相对于当前路径
	//	/data/a.txt 绝对路径，当前文件模块所处磁盘根目录
	//	c:/xxx/xx...绝对路径
	//  fs.readFile('./data/a.txt',(err,data)=>{
	//		if(err){
	//			return;
	//		}
	//		console.log(data.toString())
	//	})
```
模块操作路径：
```js
	//这里也是从磁盘根目录开始
	require('/data/foo.js')
	
	//相对路径
	require('./data/foo.js')
	
	//模块加载的路径中相对路径不能省略./
```

### 修改完代码服务器自动重启
```js  npm install --global nodemon```

命令行工具
```js 
node app.js
nodemon app.js
```



### 在Express中使用art-template模板引擎

![image-20200910114122621](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200910114122621.png)

### 在Express中获取表单get请求参数
```js
//Express内置了一个api,可以直接通过req.query来获取
req.query
```

### 在Express中获取表单post请求参数

//在Express中没有内置获取表单POST请求体的API，需要第三方包：`body-parser`
安装：
```js
npm install --save body-parser
```
配置：
```js
var express = require('express')
var bodyParse = require('body-parser')//引包

var app = express()

//配置body-parser，只要加入这个配置，则在req请求对象上会多一个属性body
//可以直接通过req.body来获取表单POST请求头数据了

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
```
使用：
```js
app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
```

| 1 | 2 | 3 |
|---|---|
| x | x | x |


### package.json和package-lock.json

![image-20200911115453525](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200911115453525.png)