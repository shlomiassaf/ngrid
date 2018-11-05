cd dist/apps/demo-app
git init
git remote add origin git@github.com:shlomiassaf/table-demo.git
git add .
git commit -m "update"
git branch gh-pages
git push --set-upstream origin gh-pages -f
