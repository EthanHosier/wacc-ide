import { NextResponse } from "next/server";

const { spawnSync } = require("child_process");
const fs = require("fs");

const JAR_FILENAME = "wacc-compiler";
const JAVA_EXECUTABLE = "java";
const ARGUMENT = "file.wacc";
const COMPILED_FILENAME = "file.s";
const EXECUTABLE_NAME = "executable";

const TIMEOUT_IN_SECONDS = 3;

export async function POST(req: Request) {
  const { fileContents, input } = await req.json();

  try {
    fs.writeFileSync("file.wacc", fileContents);
  } catch (err) {
    return new Response("Error writing to file", {
      status: 500,
    });
  }

  const command = [JAVA_EXECUTABLE, "-jar", JAR_FILENAME, ARGUMENT];

  const result = spawnSync(command[0], command.slice(1));

  if (result.status !== 0) {
    return NextResponse.json(
      {
        error: "Error compiling wacc to asm",
        compilerStatus: result.status,
        output: result.stdout.toString().split("Compiling file.wacc...")[1],
      },
      { status: 200 }
    );
  }

  const runCommand = ["gcc", "-o", EXECUTABLE_NAME, COMPILED_FILENAME]; // Modify as needed
  const runResult = spawnSync(runCommand[0], runCommand.slice(1));

  if (runResult.status !== 0) {
    return NextResponse.json(
      {
        error: "Error assembling asm to binary",
      },
      { status: 500 }
    );
  }

  const inputStr = input.join(" ");
  const sanitizedInputStr = sanitizeInput(inputStr);

  const executeCommand = [
    "timeout",
    `${TIMEOUT_IN_SECONDS}s`,
    "sh",
    "-c",
    `echo "${sanitizedInputStr}" | ./${EXECUTABLE_NAME}`,
  ];
  const executeResult = spawnSync(executeCommand[0], executeCommand.slice(1), {
    timeout: TIMEOUT_IN_SECONDS * 1000,
  });

  const timeout = executeResult.status === null;

  return NextResponse.json(
    {
      error: timeout && "Timeout",
      compilerStatus: executeResult.status ?? 124,
      output: timeout ? "Error: Timeout" : executeResult.stdout.toString(),
    },
    { status: 200 }
  );
}

function sanitizeInput(inputStr: string) {
  return inputStr.replace(/[$`"\\]/g, "\\$&");
}
