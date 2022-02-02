# Contributing

When contributing to this repository, please read the following thoroughly beforehand and follow the information outlined.  

## Pull Request Conditions

- Ensure that all code is clean and organized to a reasonable extent. 
- Do not submit PRs that break or modify the goal of this project, such as changing its target behavior from maximum accuracy to maximum efficiency with compromised accuracy. 
- Whenever possible, do not submit PRs that change the structure of the project unless it is thoroughly discussed and agreed upon beforehand. In such cases, the only thing being modified within the PR should be the project structure. 

## Adding cutouts - the quick and easy guide

0. Fork the project and make a branch and whatnot.
1. Duplicate whichever existing cutout is most similar to the one you're trying to add in `src/cutouts`, or start from scratch by following `src/cutouts/CutoutGenerator.js`.
2. Modify it to generate the cutout of your spec. Whenever possible, make sure it has absolutely no dependency on other cutout types.
3. Name this new file in the format `TypePart[Style]` both for its class name and file, such as `SwitchMXBasic`, `SwitchAlpsSKCM`, `StabilizerAlpsAT101`, etc.
4. Add an entry to the cutout selection drop-downs in `src/App.js` with a human-readable label and reasonable value.
5. Add an import to your new cutout at the top of `src/PlateBuilder.js` alongside the others.
6. Add your cutout to its respective switch block in `src/PlateBuilder.js` where the cutout generator is instantiated, using the select value that you decided on in step 4 as the identifier.
7. Add a description of your new cutout in a brief, thorough manner in `src/HelpPanes.js`.
8. Test that it is functional, and submit a PR.

## Code of Conduct

- Follow basic human etiquette.
- Keep the content legal and agreeable.
- Keep everything all-age, all-race, all-gender, all-human friendly.
- Discussion of controversial/sensitive topics such as politics, religion, etc. are strictly forbidden. They are not necessary for creating a plate generator.