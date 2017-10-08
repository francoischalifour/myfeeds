git diff --staged --diff-filter=dx --name-only HEAD | grep ".*\.js$" | xargs -I % sh -c './node_modules/.bin/prettier --write %; git add %'
