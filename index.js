#!/usr/bin/env node

import {simpleGit, CleanOptions} from "simple-git";
import { program } from "commander";
import mainMenu from "./mainMenu.js";

/**
 * Program detail
 */
program
  .name('gitassist')
  .description('CLI to assit with github')
  .argument('[dir]', 'Directory path', process.cwd())
  .action((dir) => {

    /**
     * Configure `simple-git`
     */
    const options = {
        baseDir: dir,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false
    }

    const _git = simpleGit(options);
    _git.clean(CleanOptions.FORCE);

    return mainMenu(dir, _git);
  })
  .version('1.0.0');


program.parse(process.argv)