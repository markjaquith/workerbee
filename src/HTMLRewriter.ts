import cheerio from 'cheerio';

/**
 * TODO: This code is not optimized for production!
 *   Usage of cheerio here only simulates stream-oriented parser! It is slow!
 */

function replace(content, options) {
	// TODO: Handle {html:true/false} in options
	this[0].nodeValue = content;
}

function hasAttribute(name) {
	return this.getAttribute(name) !== undefined;
}

function getAttribute(name) {
	return this.attr(name);
}

function setAttribute(name, value) {
	this.attr(name, value);
}

export default class HTMLRewriter {
	selectors: any[] = [];

	on(element, handler) {
		this.selectors.push([element, handler]);
		return this;
	}

	async transform(response) {
		const text = await response.text();
		const $ = cheerio.load(text);

		// Simulate stream-based parser
		this.walk($, $.root());

		return new Response($.root().html(), response);
	}

	walk($, node) {
		const $node = this.wrapElement($, node);

		// Select matching HTMLRewrite handlers
		const matchedHandlers: any[] = [];
		for (const [selector, handler] of this.selectors) {
			if ($node.is(selector)) {
				matchedHandlers.push(handler);
			}
		}

		// Trigger HTMLRewrite handlers on Element
		for (const handler of matchedHandlers) {
			handler.element && handler.element($node);
		}

		// Walk all children
		const lastNode = $node.contents().length - 1;
		const children = $node.contents().toArray();
		for (const [i, child] of children.entries()) {
			if (child.nodeType === 1) {
				this.walk($, child);
			} else {
				const lastInNode =
					i === lastNode || children[i + 1].nodeType !== child.nodeType;
				const $child = this.wrapOther($, child, lastInNode);

				// Trigger HTMLRewrite handlers on Text and Comment
				for (let handler of matchedHandlers) {
					if (child.nodeType === 3) {
						handler.text && handler.text($child);
					} else if (child.nodeType === 8) {
						handler.comments && handler.comments($child);
					}
				}
			}
		}
	}

	wrapElement($, node) {
		const $node = $(node);
		$node.tagName = node.name;

		$node.hasAttribute = hasAttribute.bind($node);
		$node.getAttribute = getAttribute.bind($node);
		$node.setAttribute = setAttribute.bind($node);

		return $node;
	}

	wrapOther($, node, lastInNode) {
		const $node = $(node);

		$node.text = node.nodeValue;
		$node.replace = replace.bind($node);
		if (node.nodeType === 3) {
			$node.lastInTextNode = lastInNode;
		}

		return $node;
	}
}
