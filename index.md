# Worker Bee

Cloudflare Workers are super powerful, but writing and managing them can feel overwhelming.
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

const redirectToNewBlogWithoutPathPrefix = [
  setHost('newblog.example.com'),
  removePathPrefix('/oldblog'),
  redirect(301),
]

handleFetch({
  routes: router => {
    router.get('/oldblog/:any*', ...redirectToNewBlogWithoutPathPrefix)
  }
})
```

### Blocking user agents from your site completely

```js
import handleFetch, {
	addHandlerIf,
	any,
	header,
	contains,
	forbidden,
} from 'workerbee'

const userAgent = header('User-Agent')
const blockedAgents = ['BadBot', 'Annoying Slurper']
const containsBlockedAgent = any(...blockedAgents.map(contains))
const userAgentIsBlocked = userAgent(containsBlockedAgent)

handleFetch({
	request: addHandlerIf(userAgentIsBlocked, forbidden('Go away')),
})
```
