# Examples

## Blocking access to XML-RPC (WordPress)

```js
import handleFetch, { forbidden } from 'workerbee'

handleFetch({
	routes: (router) => {
		router.any('/xmlrpc.php', forbidden('XML-RPC has been disabled'))
	},
})
```

## Blocking user agents from your site completely

```js
import handleFetch, {
	addHandlerIf,
	any,
	header,
	contains,
	forbidden,
} from 'workerbee'

const userAgent = header('User-Agent')
const blockedUserAgent = 'BadBot'
const anotherBlockedUserAgent = 'Annoying Slurper'

handleFetch({
	request: addHandlerIf(
		userAgent(
			any(contains(blockedUserAgent), contains(anotherBlockedUserAgent)),
		),
		forbidden('Go away'),
	),
})
```

Note that you can also clean up your logic by boiling some of this nested stuff
down to simpler values. Nothing fancy going on here, just building up the same
functionality bit-by-bit using variable names that make it very clear what is
happening.

```js
// Continuing from the section above handleFetch().

const blockedAgents = [blockedUserAgent, anotherBlockedUserAgent]
const containsBlockedAgent = any(...blockedAgents.map(contains))
const userAgentIsBlocked = userAgent(containsBlockedAgent)

handleFetch({
	request: addHandlerIf(userAgentIsBlocked, forbidden('Go away')),
})
```
