rm -rf dist/browser
rm -rf dist/ngrid

$( dirname -- "$0"; )/build.gh-pages.sh

cd dist && mv browser ngrid && npx light-server -s . --historyindex "./ngrid/index.html"