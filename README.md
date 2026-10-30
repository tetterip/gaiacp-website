# gaiacp.digital

The website of [GaiaCP](https://github.com/tetterip/GaiaCP), the open source billing and provisioning panel for small
hosting businesses: **https://gaiacp.digital** (English) and **https://gaiacp.digital/el/** (Greek).

Plain static files, no build step: edit the HTML, push to `main`, and Plesk Git deploys it.

```
index.html          English page
el/index.html       Greek page (same layout; keep both in step)
404.html
assets/style.css    the only stylesheet (light and dark from prefers-color-scheme)
assets/site.js      screenshot tabs; star count and latest release from the GitHub API (cached an hour)
assets/img/         logos, screenshots (.webp, light + dark), social.png for link previews
.htaccess           HTTPS, no www, security headers, caching (Apache)
robots.txt, sitemap.xml
```

## Screenshots

Taken from the demo data (`php artisan db:seed --class=DemoSeeder` on a fresh SQLite) at 1440×900 and 390×844, scale 2,
then saved as WebP 1600 px wide (phone 780 px). Keep a light and a dark copy of each admin screenshot.

## Preview

```
php -S localhost:8000      # or: python3 -m http.server
```

## Licence

GPL-3.0-or-later, like GaiaCP.
