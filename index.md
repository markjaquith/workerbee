## Cloudflare Workers can be intimidating

They're super powerful, but writing and managing them can feel overwhelming.
Worker Bee is here to help make composing Cloudflare Workers fast and fun.

## It's This Easy

### Forbid a directory

```js
import handleFetch, { forbidden } from 'workerbee'

handleFetch({
  routes: router => {
    router.any('/phpmyadmin/:any*', forbidden('Go away'))
  }
})
```

### Redirect a directory to the root of another domain

```js
import handleFetch, { setHost, removePathPrefix, redirect } from 'workerbee'

handleFetch({
  routes: router => {
    router.get(
      '/oldblog/:any*',
      setHost('newblog.example.com'), removePathPrefix('/oldblog'), redirect(301)
    )
  }
})
```
