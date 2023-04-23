import inquirer from "inquirer"
import ora from "ora";
import { commitChanges, createNewBranch } from "./methods/git.js";

const mainMenu = async (dir, _git) => {
    const choices = [
        'Create a new branch',
        'Commit changes',
        'Push changes',
        'Pull changes',
        'Exit'
    ];

    const { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Select an action:',
        choices
    });

    switch (choice) {
    case 'Create a new branch':
        createNewBranch(dir, _git);
        break;
    case 'Commit changes':
        commitChanges(dir, _git);
        break;
    case 'Push changes':
        let push_loader = ora('Pushing changes...').start();
        _git.push().then(() => {
            push_loader.succeed("Changes pushed successfully");
        }).catch(err => {
            console.log("An error occured", err);
        })
        break;
    case 'Pull changes':
        let pull_loader = ora('Pulling changes...').start();
        _git.push().then(() => {
            pull_loader.succeed("Changes pulled successfully");
        }).catch(err => {
            console.log("An error occured", err);
        })
        
        break;
    case 'Exit':
        console.log('Exiting...');
        process.exit(0);
    }
}

export default mainMenu;