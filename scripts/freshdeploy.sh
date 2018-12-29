cd ..

git reset --hard
git pull -X theirs

npm i
npm run build

serve -s build -p 5001 &