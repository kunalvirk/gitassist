import inquirer from "inquirer";
import simpleGit from "simple-git";


const checkIfRepo = async (dir) => await simpleGit(dir).checkIsRepo();



/**
 * Create a new branch
 * @param branchName
 * @param fromBranch
 */
function checkoutBranch(branchName, fromBranch, git) {
    
    if (fromBranch) {
        git.checkoutBranch(branchName, fromBranch, (err, result) => {
          if (err) {
            console.error(`Error checking out branch '${branchName}' from '${fromBranch}':`, err);
            return;
          }
          console.log(`Checked out new branch '${branchName}' from '${fromBranch}'`);
        });
      } else {
        git.revparse(['--abbrev-ref', 'HEAD'], (err, currentBranch) => {
          if (err) {
            if (err.message === 'HEAD') {
              console.warn('Repository is in detached HEAD state');
              git.checkout('main', (err, result) => {
                if (err) {
                  console.error(`Error checking out branch 'main':`, err);
                  return;
                }
                console.log(`Checked out branch 'main'`);
                git.checkoutBranch(branchName, 'main', (err, result) => {
                  if (err) {
                    console.error(`Error checking out new branch '${branchName}' from 'main':`, err);
                    return;
                  }
                  console.log(`Checked out new branch '${branchName}' from 'main'`);
                });
              });
            } else {
              console.error('Error retrieving current branch:', err);
            }
            return;
          }


          git.checkout(currentBranch, (err, result) => {
            if (err) {
              console.error(`Error checking out branch '${currentBranch}':`, err);
              return;
            }
            git.checkoutBranch(branchName, currentBranch, (err, result) => {
              if (err) {
                console.error(`Error checking out new branch '${branchName}' from '${currentBranch}':`, err);
                return;
              }
              console.log(`Checked out new branch '${branchName}' from '${currentBranch}'`);
            });
          });
        });
      }
  }
  

const createNewBranch = async (dir, git) => {

    try {
        const ifRepo = await checkIfRepo(dir);
        const { branchName, fromBranch } = await inquirer.prompt([
            {
              type: 'input',
              name: 'branchName',
              message: 'New branch name:'
            },
            {
              type: 'input',
              name: 'fromBranch',
              message: 'Base branch (leave blank to use the current branch):',
              default: ''
            }
          ]);

          checkoutBranch(branchName, fromBranch, git);

    } catch(e) {
        console.log(e);
    }

}


/**
 * Commit your changes
 * 
 */
const commitChanges = async (dir, git) => {

    try {
        // First check the repo status
        const status = await git.status();
        
        if (status.modified.length != 0) {
            const filesAsChoices = status.modified.map((file, idx) => {
                return {
                    name: file,
                    value: idx + 1
                }
            });

            // Ask user which files it want to commit (by default check all)
            const toCommit = await inquirer.prompt([
                {
                    type: 'checkbox',
                    message: 'Select the files to commit',
                    name: 'files',
                    choices: filesAsChoices
                }
            ]);

            console.log("------")
            console.log("Following file(s) will be added to commit");
            console.log("------" + "\n")
            const filesToCommit = filesAsChoices.reduce((result, option) => {
                if (toCommit.files.includes(option.value)) {
                    console.log(option.value + ". " +option.name);
                    result.push(option.name);
                }
                return result;
            }, []);

            // Ask for the commit message
            const commitMsg = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'commit_msg',
                    message: 'Enter a commit message: '
                }
            ]);

            // Add files
            git.add(filesToCommit).then(() => {
                console.log('Files added successfully');
                return git.commit(commitMsg.commit_msg);
            }).then(() => {
                console.log('Changes committed successfully');
            }).catch((err) => {
                console.error('Error adding/committing files:', err);
            });
        
        } else {
            console.log("Working tree is clean");
        }

    } catch (e) {
        console.log("e", e)
    }

}



export {createNewBranch, commitChanges};