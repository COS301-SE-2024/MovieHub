# MovieHub



## MovieHub - Project Decription
MovieHub aims to address the need for movie enthusiasts to explore, discuss and review films on a social platform that is usable and interactive. With it providing users with a one-stop destination for all their movie related needs. A priority of this project is to surpass existing platforms, by offering a superior user experience and unparalleled depth of content.





## Video Demo Recordings 

Insert gif or link to demo


## Documentation

[Documentation](https://linktodocumentation)


## Project Mangement

[Project Board](https://github.com/orgs/COS301-SE-2024/projects/72)

## Branching Strategy
We will use GtiFlow as our branching strategy, as such we will have main, development and feature branches.
![image](https://github.com/COS301-SE-2024/MovieHub/assets/40609889/cd25443f-1e72-4d25-a7d6-37e84984c0e4)

Once develop has acquired enough features for a release (or a predetermined release date is approaching), you fork a release branch off of develop. Creating this branch starts the next release cycle, so no new features can be added after this point—only bug fixes, documentation generation, and other release-oriented tasks should go in this branch. Once it's ready to ship, the release branch gets merged into main and tagged with a version number. In addition, it should be merged back into develop, which may have progressed since the release was initiated.
![image](https://github.com/COS301-SE-2024/MovieHub/assets/40609889/a64330e9-8fd3-48f3-8dce-7a3c93a8fe36)

Maintenance or “hotfix” branches are used to quickly patch production releases. Hotfix branches are a lot like release branches and feature branches except they're based on main instead of develop. This is the only branch that should fork directly off of main. As soon as the fix is complete, it should be merged into both main and develop (or the current release branch), and main should be tagged with an updated version number.
![image](https://github.com/COS301-SE-2024/MovieHub/assets/40609889/062066e4-5dcd-48cc-ad5c-a620619435e8)

## Branch Naming Convention
To make sure everyone knows exactly where each branch is located we will follow this naming convention:
main\
development\
dev/backend\
dev/frontend\
All feature branches must be named as follows:\
dev/environment/feature/subfeature\
For example:\
dev/back/auth/login\
This implies that there is an authentication branch that was branched from backend and furthermore a login branch was then branched from there.\

