#!/usr/bin/env bash
# Assemble the static site and rsync it to the colorado exe.dev VM.
# First run also provisions a Caddy container serving :8000 -> :80.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VM=colorado.exe.xyz
SSH="ssh -o StrictHostKeyChecking=accept-new exedev@$VM"

echo "› assembling dist"
rm -rf "$ROOT/dist"; mkdir -p "$ROOT/dist"
cp "$ROOT"/site/*.html "$ROOT"/site/*.js "$ROOT/dist/"
cp -r "$ROOT/lib" "$ROOT/data" "$ROOT/dist/"

echo "› rsync -> $VM:/srv/site"
$SSH 'sudo mkdir -p /srv/site && sudo chown exedev /srv /srv/site'
rsync -az --delete -e "ssh -o StrictHostKeyChecking=accept-new" "$ROOT/dist/" "exedev@$VM:/srv/site/"
scp -o StrictHostKeyChecking=accept-new "$ROOT/deploy/Caddyfile" "exedev@$VM:/srv/Caddyfile"

echo "› ensure caddy container"
$SSH 'docker inspect colorado-web >/dev/null 2>&1 || docker run -d --name colorado-web --restart unless-stopped -p 8000:80 -v /srv/site:/srv/site:ro -v /srv/Caddyfile:/etc/caddy/Caddyfile:ro caddy:2-alpine'
$SSH 'docker restart colorado-web >/dev/null'
echo "› done: https://colorado.exe.xyz"
