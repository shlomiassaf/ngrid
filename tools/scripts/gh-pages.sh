node --max-old-space-size=8192 ./node_modules/.bin/ng build ngrid-demo-app --prod --base-href ngrid
cp dist/apps/ngrid-demo-app/index.html dist/apps/ngrid-demo-app/404.html

cd dist/apps/ngrid-demo-app

git init
git remote add origin git@github.com:shlomiassaf/ngrid.git
git add .
git commit -m "update"
git branch gh-pages
# git push --set-upstream origin gh-pages -f
git push --set-upstream origin gh-pages -f
