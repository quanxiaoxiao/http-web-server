## install

npm intall @quanxiaoxiao/http-web-server

## Usage

```javascript
const path = require('path');
const app = require('@quanxiaoxiao/http-web-server');


app({
  port: 3312,
  loggerPathName: path.resolve(__dirname, 'logs', 'logger.log'),
  resource: {
    projectName: 'x-quan-name',
    projectKey: 'x-quan-key',
    resourcePath: path.resolve(__dirname, 'statics'),
    dbPathName: path.resolve(__dirname, 'db', 'index.json'),
    projects: {
      demo: {
        key: '2VCap3jg8b0BrFlOvNkQi4Sd7XytKTGq',
        pages: {
          '/demo': () => 'index.html',
          '/static/demo(.*)': (matches) => matches[1],
        },
      },
    },
  },
  api: {
    '/test': {
      body: 'test',
    },
  },
});
```

## Update resource

```shell
tar -cf - dist | curl -X POST --data-binary @- -H 'x-quan-name: demo' -H 'x-quan-key: 2VCap3jg8b0BrFlOvNkQi4Sd7XytKTGq' http://localhost:3312/resource
```
