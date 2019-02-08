npm run build-demo-gh
cd dist/apps/table-demo-app
git init
git remote add origin git@github.com:shlomiassaf/angrid.git
git remote add public_origin git@github.com:shlomiassaf/table-demo.git
git add .
git commit -m "update"
git branch gh-pages
git push --set-upstream origin gh-pages -f
git push --set-upstream public_origin gh-pages -f
