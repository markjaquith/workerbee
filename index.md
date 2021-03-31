## Worker Bee

A lovely tool for composing Cloudflare Workers.

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
