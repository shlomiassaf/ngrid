node --max-old-space-size=8192 ./node_modules/.bin/ng build --prod --base-href /ngrid/ --deploy-url /ngrid/
node --max-old-space-size=8192 ./node_modules/.bin/ng run ngrid-demo-app:server:production --bundleDependencies all
npm run compile:server
node dist/server

cp dist/browser/index.html dist/browser/404.html
