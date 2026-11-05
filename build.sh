#!/usr/bin/env bash
# Assembles partials into index.html. Run: bash build.sh
set -euo pipefail
cd "$(dirname "$0")"
ORDER=(hero hospitality founder)
{
cat <<'HEAD'
<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OKLA-POS — Local POS & Payments, Chickasha, Oklahoma</title>
<meta name="description" content="Locally owned point-of-sale systems and payment processing for Oklahoma restaurants and retailers. On-site setup, wiring, training and local support from Chickasha, OK.">
<meta name="theme-color" content="#1D1A16">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/base.css">
HEAD
for p in "${ORDER[@]}"; do [ -f "css/$p.css" ] && echo "<link rel=\"stylesheet\" href=\"css/$p.css\">"; done
echo '</head>'
echo '<body>'
echo '<a class="skip" href="#main">Skip to content</a>'
for p in "${ORDER[@]}"; do [ -f "partials/$p.html" ] && { echo "<!-- ===== $p ===== -->"; cat "partials/$p.html"; }; done
echo '<script src="js/core.js" defer></script>'
for p in "${ORDER[@]}"; do [ -f "js/$p.js" ] && echo "<script src=\"js/$p.js\" defer></script>"; done
echo '</body>'
echo '</html>'
} > index.html
echo "built index.html"
