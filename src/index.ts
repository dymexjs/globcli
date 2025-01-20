#!/usr/bin/env node
import debugModule from "debug";
const debug = debugModule("dymexjs:globcli");

import yargs from "yargs";
import { EOL } from "node:os";
import { globSync } from "glob";
import { spawnSync } from "node:child_process";
import { argv as processArgv, exit, platform } from "node:process";
import { hideBin } from "yargs/helpers";

const yarsOptions = yargs()
  .usage(
    [
      "Run programs with globcli support.",
      "",
      "Usage: $0 [OPTION]... -- COMMAND [ARG]... ",
      "Note the -- between the $0 OPTIONS and the COMMAND and its arguments",
    ].join(EOL),
  )
  .demand(1, "COMMAND required")
  // nodir
  .boolean("nodir")
  .describe("nodir", "glob patterns do not match directories, only files")
  // ignore
  .array("ignore")
  .alias("ignore", "i")
  .describe("ignore", "add glob pattern to exclude from matches")
  // node
  .boolean("node")
  .alias("node", "n")
  .describe("node", 'same as `--ignore "node_modules/**"`')
  // help
  .help("help")
  // epilog
  .epilog(["Use 'DEBUG=dymexjs:globcli' to see debug messages"].join(EOL))
  .parserConfiguration({ "strip-aliased": true });

function parseYargs(args: Array<string>) {
  return yarsOptions.parseSync(hideBin(args));
}

function parseGlobOpts(args: ReturnType<typeof parseYargs>) {
  const globOpts: Record<string, unknown> = {};
  if (args.node) {
    args.ignore = args.ignore || [];
    args.ignore.push("node_modules/**");
    delete args.node;
  }
  const ignoreKeys = ["$0", "_", "--"];
  for (const [key, value] of Object.entries(args)) {
    if (!ignoreKeys.includes(key)) {
      Object.defineProperty(globOpts, key, { value, enumerable: true, configurable: false, writable: false });
    }
  }
  return globOpts;
}

function parseCmdArgs(args: ReturnType<typeof parseYargs>) {
  return {
    cmd: args._[0] as string,
    args: args._.slice(1) as Array<string>,
  };
}

function parseGlobArgs(args: Array<string>, globOpts: Record<string, unknown>): Array<string> {
  return args
    .map((arg) => {
      const result = globSync(arg, globOpts);
      return result.length > 0 ? result : [arg];
    })
    .reduce((previous, current) => previous.concat(current), []);
}

function spawnAction(cmd: string, args: Array<string>) {
  const opts: Record<string, unknown> = { stdio: "inherit" };

  if (platform === "win32") {
    args = ["/c", '"' + cmd + '"', ...args];
    cmd = "cmd";
    opts.windowsVerbatimArguments = true;
  }
  debug("Running:", cmd, " - Args:", args, " - Options: ", opts);
  return spawnSync(cmd, args, opts);
}

export function main(args: Array<string>) {
  try {
    debug("args", args);

    const yargsArgs = parseYargs(args);
    debug("yargs args", yargsArgs);

    const globOpts = parseGlobOpts(yargsArgs);
    debug("globArgs", globOpts);

    const cmdArgs = parseCmdArgs(yargsArgs);
    debug("cmdArgs", cmdArgs);

    const globResults = parseGlobArgs(cmdArgs.args, globOpts);
    debug("glob results", globResults);

    const status = spawnAction(cmdArgs.cmd, globResults).status;
    exit(status);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message);
    exit(err.status || 1);
  }
}

main(processArgv);
