# NPM SCRIPT INSTRUCTIONS

- npm run dev to open webpack dev server
- npm run cleanup to check for lint and prettier errors
- npm run deploy to publish project when done
- check that github pages is set to gh-pages branch in repo settings

# GIT BRANCH WORKFLOW

1. create a new branch with `git checkout -b branch-name`
2. write code on new branch
3. use git push origin branch-name
4. when done, use `git checkout main`
5. use `git merge branch-name` to merge feature into the main branch
6. use `git push` to push changes
7. remove branch with `git branch -d branch-name` and `git push orgin --delete branch-name`
