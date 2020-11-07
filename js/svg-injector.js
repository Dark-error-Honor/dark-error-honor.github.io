!(function (t, e) {
	'use strict';
	function r(t) {
		t = t.split(' ');
		for (var e = {}, r = t.length, n = []; r--; ) e.hasOwnProperty(t[r]) || ((e[t[r]] = 1), n.unshift(t[r]));
		return n.join(' ');
	}
	var n = 'file:' === t.location.protocol,
		i = e.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1'),
		o =
			Array.prototype.forEach ||
			function (t, e) {
				if (void 0 === this || null === this || 'function' != typeof t) throw new TypeError();
				var r,
					n = this.length >>> 0;
				for (r = 0; n > r; ++r) r in this && t.call(e, this[r], r, this);
			},
		a = {},
		l = 0,
		s = [],
		u = [],
		c = {},
		f = function (t) {
			return t.cloneNode(!0);
		},
		p = function (t, e) {
			(u[t] = u[t] || []), u[t].push(e);
		},
		d = function (t) {
			for (var e = 0, r = u[t].length; r > e; e++)
				!(function (e) {
					setTimeout(function () {
						u[t][e](f(a[t]));
					}, 0);
				})(e);
		},
		v = function (e, r) {
			if (void 0 !== a[e]) a[e] instanceof SVGSVGElement ? r(f(a[e])) : p(e, r);
			else {
				if (!t.XMLHttpRequest) return r('Browser does not support XMLHttpRequest'), !1;
				(a[e] = {}), p(e, r);
				var i = new XMLHttpRequest();
				(i.onreadystatechange = function () {
					if (4 === i.readyState) {
						if (404 === i.status || null === i.responseXML)
							return (
								r('Unable to load SVG file: ' + e),
								n &&
									r(
										'Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver.'
									),
								r(),
								!1
							);
						if (!(200 === i.status || (n && 0 === i.status)))
							return r('There was a problem injecting the SVG: ' + i.status + ' ' + i.statusText), !1;
						if (i.responseXML instanceof Document) a[e] = i.responseXML.documentElement;
						else if (DOMParser && DOMParser instanceof Function) {
							var t;
							try {
								var o = new DOMParser();
								t = o.parseFromString(i.responseText, 'text/xml');
							} catch (l) {
								t = void 0;
							}
							if (!t || t.getElementsByTagName('parsererror').length)
								return r('Unable to parse SVG file: ' + e), !1;
							a[e] = t.documentElement;
						}
						d(e);
					}
				}),
					i.open('GET', e),
					i.overrideMimeType && i.overrideMimeType('text/xml'),
					i.send();
			}
		},
		h = function (e, n, a, u) {
			var f = e.getAttribute('data-src') || e.getAttribute('src');
			if (!/\.svg/i.test(f)) return void u('Attempted to inject a file with a non-svg extension: ' + f);
			if (!i) {
				var p = e.getAttribute('data-fallback') || e.getAttribute('data-png');
				return void (p
					? (e.setAttribute('src', p), u(null))
					: a
					? (e.setAttribute('src', a + '/' + f.split('/').pop().replace('.svg', '.png')), u(null))
					: u('This browser does not support SVG and no PNG fallback was defined.'));
			}
			-1 === s.indexOf(e) &&
				(s.push(e),
				e.setAttribute('src', ''),
				v(f, function (i) {
					if ('undefined' == typeof i || 'string' == typeof i) return u(i), !1;
					var a = e.getAttribute('id');
					a && i.setAttribute('id', a);
					var p = e.getAttribute('title');
					p && i.setAttribute('title', p);
					var d = []
						.concat(i.getAttribute('class') || [], 'injected-svg', e.getAttribute('class') || [])
						.join(' ');
					i.setAttribute('class', r(d));
					var v = e.getAttribute('style');
					v && i.setAttribute('style', v);
					var h = [].filter.call(e.attributes, function (t) {
						return /^data-\w[\w\-]*$/.test(t.name);
					});
					o.call(h, function (t) {
						t.name && t.value && i.setAttribute(t.name, t.value);
					});
					var g,
						m,
						b,
						y,
						A,
						w = {
							clipPath: ['clip-path'],
							'color-profile': ['color-profile'],
							cursor: ['cursor'],
							filter: ['filter'],
							linearGradient: ['fill', 'stroke'],
							marker: ['marker', 'marker-start', 'marker-mid', 'marker-end'],
							mask: ['mask'],
							pattern: ['fill', 'stroke'],
							radialGradient: ['fill', 'stroke'],
						};
					Object.keys(w).forEach(function (t) {
						(g = t), (b = w[t]), (m = i.querySelectorAll('defs ' + g + '[id]'));
						for (var e = 0, r = m.length; r > e; e++) {
							(y = m[e].id), (A = y + '-' + l);
							var n;
							o.call(b, function (t) {
								n = i.querySelectorAll('[' + t + '*="' + y + '"]');
								for (var e = 0, r = n.length; r > e; e++) n[e].setAttribute(t, 'url(#' + A + ')');
							}),
								(m[e].id = A);
						}
					}),
						i.removeAttribute('xmlns:a');
					for (var x, S, k = i.querySelectorAll('script'), j = [], G = 0, T = k.length; T > G; G++)
						(S = k[G].getAttribute('type')),
							(S && 'application/ecmascript' !== S && 'application/javascript' !== S) ||
								((x = k[G].innerText || k[G].textContent), j.push(x), i.removeChild(k[G]));
					if (j.length > 0 && ('always' === n || ('once' === n && !c[f]))) {
						for (var M = 0, V = j.length; V > M; M++) new Function(j[M])(t);
						c[f] = !0;
					}
					var E = i.querySelectorAll('style');
					o.call(E, function (t) {
						t.textContent += '';
					}),
						e.parentNode.replaceChild(i, e),
						delete s[s.indexOf(e)],
						(e = null),
						l++,
						u(i);
				}));
		},
		g = function (t, e, r) {
			e = e || {};
			var n = e.evalScripts || 'always',
				i = e.pngFallback || !1,
				a = e.each;
			if (void 0 !== t.length) {
				var l = 0;
				o.call(t, function (e) {
					h(e, n, i, function (e) {
						a && 'function' == typeof a && a(e), r && t.length === ++l && r(l);
					});
				});
			} else
				t
					? h(t, n, i, function (e) {
							a && 'function' == typeof a && a(e), r && r(1), (t = null);
					  })
					: r && r(0);
		};
	'object' == typeof module && 'object' == typeof module.exports
		? (module.exports = exports = g)
		: 'function' == typeof define && define.amd
		? define(function () {
				return g;
		  })
		: 'object' == typeof t && (t.SVGInjector = g);
})(window, document);
