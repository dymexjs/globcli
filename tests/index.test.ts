import assert from "node:assert/strict";
import { describe, test, afterEach } from "node:test";
import { type ChildProcess, fork, type ForkOptions } from "node:child_process";
import { resolve } from "node:path";

describe("globcli", () => {
  afterEach(() => {
    // Clean up all the processes after every test.
    forkedProcesses.forEach((child) => child.kill());
    forkedProcesses.clear();
  });
  const forkedProcesses = new Set<ChildProcess>();

  const EXECUTABLE_PATH = resolve("./bin/index.js");

  function runglobcli(args: Array<string>, options: ForkOptions = {}): ChildProcess {
    const newProcess = fork(EXECUTABLE_PATH, args, Object.assign({ silent: true }, options));

    forkedProcesses.add(newProcess);
    return newProcess;
  }

  function awaitExit(exitingProcess: ChildProcess): Promise<number> {
    return new Promise((resolve) => exitingProcess.once("exit", resolve));
  }

  async function assertExitCode(exitingProcess: ChildProcess, expectedExitCode: number): Promise<void> {
    const exitCode = await awaitExit(exitingProcess);
    assert.strictEqual(exitCode, expectedExitCode, `Expected an exit code of ${expectedExitCode} but got ${exitCode}.`);
  }

  async function getOutput(runningProcess: ChildProcess): Promise<{ stdout: string; stderr: string }> {
    let stdout = "";
    let stderr = "";

    runningProcess.stdout?.on("data", (data: string) => (stdout += data));
    runningProcess.stderr?.on("data", (data: string) => (stderr += data));
    await awaitExit(runningProcess);
    return { stdout, stderr };
  }

  async function awaitOutput(runningProcess: ChildProcess): Promise<string> {
    const output = await getOutput(runningProcess);
    return output.stdout;
  }

  async function awaitErr(runningProcess: ChildProcess): Promise<string> {
    const output = await getOutput(runningProcess);
    return output.stderr;
  }

  test("should throw an Error on missing COMMAND", async () => {
    const child = runglobcli([], { silent: true });
    assert.match(await awaitErr(child), /COMMAND required/);
  });
  test("should throw an Error on failing COMMAND", async () => {
    const child = runglobcli(["--", "false"], { silent: true });
    await assertExitCode(child, 1);
  });
  test("should throw an Error on unknown COMMAND", async () => {
    const child = runglobcli(["NOENTRY_COMMAND"]);
    assert.match(await awaitErr(child), /NOENTRY_COMMAND/);
  });
  test("should respect --ignore", async () => {
    const child = runglobcli(["--ignore", "tests/index.test.ts", "--", "echo", "tests/*.ts", "src/*.ts"]);
    const output = await awaitOutput(child);
    assert.doesNotMatch(output, /tests\/index\.test\.ts/);
    assert.match(output, /src\/index\.ts/);
  });

  test("should respect --node", async () => {
    const child = runglobcli(["--node", "--", "echo", "*/ /*/package.json"]);
    await assertExitCode(child, 0);
  });
});
