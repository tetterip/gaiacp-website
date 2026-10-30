// gaiacp.digital: the screenshot tabs, and the star count and latest release read from GitHub.
// The page works without this file: the links still go to GitHub, only the numbers are missing.
(function () {
    'use strict';

    var REPO = 'tetterip/GaiaCP';
    var CACHE_KEY = 'gaiacp-site-github';
    var CACHE_MS = 60 * 60 * 1000;

    document.documentElement.classList.add('js');

    // Screenshot tabs
    var tabs = document.querySelectorAll('[role="tab"]');
    function select(tab) {
        tabs.forEach(function (t) {
            var on = t === tab;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
    }
    tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab); });
        tab.addEventListener('keydown', function (e) {
            var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
            if (!step) return;
            var next = tabs[(i + step + tabs.length) % tabs.length];
            select(next);
            next.focus();
        });
    });
    if (tabs.length) select(tabs[0]);

    // Stars and latest release
    function read() {
        try {
            var saved = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
            if (saved && Date.now() - saved.at < CACHE_MS) return saved;
        } catch (e) {}
        return null;
    }
    function save(data) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
    }
    function show(data) {
        if (typeof data.stars === 'number') {
            var text = data.stars >= 1000 ? (data.stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(data.stars);
            document.querySelectorAll('[data-stars]').forEach(function (el) { el.textContent = '★ ' + text; });
        }
        if (data.version) {
            document.querySelectorAll('[data-version]').forEach(function (el) { el.textContent = data.version; });
        }
        if (data.zip) {
            document.querySelectorAll('[data-download]').forEach(function (el) { el.href = data.zip; });
        }
    }
    function get(url) {
        return fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
            .then(function (r) { return r.ok ? r.json() : null; })
            .catch(function () { return null; });
    }

    var cached = read();
    if (cached) { show(cached); return; }

    Promise.all([
        get('https://api.github.com/repos/' + REPO),
        get('https://api.github.com/repos/' + REPO + '/releases/latest')
    ]).then(function (res) {
        var data = { at: Date.now() };
        if (res[0] && typeof res[0].stargazers_count === 'number') data.stars = res[0].stargazers_count;
        if (res[1] && res[1].tag_name) {
            data.version = res[1].tag_name;
            (res[1].assets || []).forEach(function (a) {
                if (/^gaiacp-.*\.zip$/.test(a.name)) data.zip = a.browser_download_url;
            });
        }
        show(data);
        if (data.stars !== undefined || data.version) save(data);
    });
})();
