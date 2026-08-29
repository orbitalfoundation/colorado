#!/usr/bin/env bash
# Assemble the static site and rsync it to the colorado exe.dev VM.
# First run also provisions a Caddy container serving :8000 -> :80.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VM=colorado.exe.xyz
SSH="ssh -o StrictHostKeyChecking=accept-new exedev@$VM"

echo "› assembling dist"
rm -rf "$ROOT/dist"; mkdir -p "$ROOT/dist"
cp "$ROOT"/site/*.html "$ROOT"/site/*.js "$ROOT"/site/*.mjs "$ROOT/dist/"
cp -r "$ROOT/lib" "$ROOT/data" "$ROOT/site/img" "$ROOT/dist/"
cp "$ROOT/dist/story.html" "$ROOT/dist/index.html"   # the story is the front door
sed -i "s|<span data-build></span>|<span data-build>· built $(date +%Y-%m-%d)</span>|" "$ROOT/dist/"*.html

echo "› rsync -> $VM:/srv/site"
$SSH 'sudo mkdir -p /srv/site && sudo chown exedev /srv /srv/site'
rsync -az --delete -e "ssh -o StrictHostKeyChecking=accept-new" "$ROOT/dist/" "exedev@$VM:/srv/site/"
scp -o StrictHostKeyChecking=accept-new "$ROOT/deploy/Caddyfile" "exedev@$VM:/srv/Caddyfile"

scp -o StrictHostKeyChecking=accept-new "$ROOT/deploy/river.mjs" "exedev@$VM:/srv/river.mjs"

echo "› ensure river voice + caddy"
$SSH '
  test -f /srv/river.env || printf "# the river voice (OpenRouter). Fill both to go live; service restarts on deploy.\nOPENROUTER_API_KEY=\nRIVER_MODEL=\nDAILY_CAP=400\n" > /srv/river.env
  docker network inspect rivernet >/dev/null 2>&1 || docker network create rivernet
  docker rm -f river >/dev/null 2>&1 || true
  docker run -d --name river --restart unless-stopped --network rivernet \
    --env-file /srv/river.env -v /srv/river.mjs:/srv/river.mjs:ro \
    node:22-alpine node /srv/river.mjs >/dev/null
  docker inspect colorado-web >/dev/null 2>&1 && docker rm -f colorado-web >/dev/null
  docker run -d --name colorado-web --restart unless-stopped --network rivernet -p 8000:80 \
    -v /srv/site:/srv/site:ro -v /srv/Caddyfile:/etc/caddy/Caddyfile:ro caddy:2-alpine >/dev/null
'
echo "› done: https://colorado.exe.xyz"
