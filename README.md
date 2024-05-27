<p align="center">

  <h1 align="center">🎞️MovieHub🎞️</h1>
  <h2 align="center">Discover, Share, and Engage with Films Like Never Before!</h2>

<div align="center">
<h3 align="center">MovieHub aims to address the need for movie enthusiasts to explore, discuss and review films on a social platform that is usable and interactive. With it providing users with a one-stop destination for all their movie related needs. A priority of this project is to surpass existing platforms, by offering a superior user experience and unparalleled depth of content.
</h3>
<div align="center">

  # 🍿Badges #
![GitHub issues](https://img.shields.io/github/issues/COS301-SE-2024/MovieHub)
![GitHub pull requests](https://img.shields.io/github/issues-pr/COS301-SE-2024/MovieHub)
![GitHub pull requests](https://img.shields.io/github/languages/count/COS301-SE-2024/MovieHub)
![GitHub pull requests](https://img.shields.io/github/last-commit/COS301-SE-2024/MovieHub)
![GitHub pull requests](https://img.shields.io/github/repo-size/COS301-SE-2024/MovieHub)
  
</div>


# Video Demo Recordings # 

Insert gif or link to demo


# Documentation #

[Documentation](https://linktodocumentation)

# Team Members #
Professional profiles of team members, including links to LinkedIn and GitHub profiles

<table>
<tr>
  <td> </td>
  <td> Member Name </td>
  <td> Group Role </td>
  <td> Description </td>
  <td> Socials </td>
</tr>

<tr>
  <td></td>
  <td> Tlhalefo Dikolomela </td>
  <td> Project Manager, Database Administrator </td>
  <td> I am a final year Computer Science student, who enjoys learning and challenging myself. I have good planning, management and leadership skills. I am most proficient in Java, C++, JavaScript and Python. 
  <td>
        <a href="https://github.com/tlh26">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=flat-square&logo=github" alt="GitHub">
        </a><br>
        <a href="https://www.linkedin.com/in/tlhalefo-dikolomela-222608202">
          <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square&logo=linkedin" alt="LinkedIn">
        </a><br>
  </td>
</tr>

<tr>
  <td></td>
  <td> Asakundwi Siphuma </td>
  <td> UI/UX Designer, Frontend Developer </td>
  <td></td>
  <td>
        <a href="">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=flat-square&logo=github" alt="GitHub">
        </a><br>
        <a href="https://www.linkedin.com/in/asa-siphuma-07397b262/">
          <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square&logo=linkedin" alt="LinkedIn">
        </a><br>
  </td>
</tr>

<tr>
  <td></td>
  <td> Jayson </td>
  <td> Back-end developer</td>
  <td></td>
  <td>
        <a href="">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=flat-square&logo=github" alt="GitHub">
        </a><br>
        <a href="">
          <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square&logo=linkedin" alt="LinkedIn">
        </a><br>
  </td>
</tr>

<tr>
  <td></td>
  <td> Zandile Modise </td>
  <td> Quality Assurance Engineer, Frontend Developer</td>
  <td></td>
  <td>
        <a href="https://github.com/ZandileModise">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=flat-square&logo=github" alt="GitHub">
        </a><br>
        <a href="https://www.linkedin.com/in/zandile-modise-640a0b1ab/">
          <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square&logo=linkedin" alt="LinkedIn">
        </a><br>
  </td>
</tr>

<tr>
  <td></td>
  <td> Charlize Hanekom </td>
  <td> DevOps Engineer, Backend Developer</td>
  <td></td>
  <td>
        <a href="">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=flat-square&logo=github" alt="GitHub">
        </a><br>
        <a href="">
          <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square&logo=linkedin" alt="LinkedIn">
        </a><br>
  </td>
</tr>

<tr>
  <td></td>
  <td> Itumeleng Moshokoa </td>
  <td> Frontend Developer</td>
  <td></td>
  <td>
        <a href="">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=flat-square&logo=github" alt="GitHub">
        </a><br>
        <a href="https://www.linkedin.com/in/itumeleng-moshokoa-835622287/">
          <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square&logo=linkedin" alt="LinkedIn">
        </a><br>
  </td>
</tr>

</table>

# Project Management #

[Project Board] (https://github.com/orgs/COS301-SE-2024/projects/72)

# Branching Strategy #
We will use GitFlow as our branching strategy, as such we will have main, development and feature branches.
![image](https://github.com/COS301-SE-2024/MovieHub/assets/40609889/cd25443f-1e72-4d25-a7d6-37e84984c0e4)

Once develop has acquired enough features for a release (or a predetermined release date is approaching), you fork a release branch off of develop. Creating this branch starts the next release cycle, so no new features can be added after this point—only bug fixes, documentation generation, and other release-oriented tasks should go in this branch. Once it's ready to ship, the release branch gets merged into main and tagged with a version number. In addition, it should be merged back into develop, which may have progressed since the release was initiated.
![image](https://github.com/COS301-SE-2024/MovieHub/assets/40609889/a64330e9-8fd3-48f3-8dce-7a3c93a8fe36)

Maintenance or “hotfix” branches are used to quickly patch production releases. Hotfix branches are a lot like release branches and feature branches except they're based on main instead of the develop branch. This is the only branch that should fork directly off of main. As soon as the fix is complete, it should be merged into both main and develop (or the current release branch), and main should be tagged with an updated version number.
![image](https://github.com/COS301-SE-2024/MovieHub/assets/40609889/062066e4-5dcd-48cc-ad5c-a620619435e8)

# Branch Naming Convention #
To make sure everyone knows exactly where each branch is located, we will follow this naming convention:
main\
development\
dev/backend\
dev/frontend\
All feature branches must be named as follows:\
dev/environment/feature/sub-feature\
For example:\
dev/back/auth/login\
This implies that there is an authentication branch that was branched from backend and furthermore a login branch was then branched from there.\
