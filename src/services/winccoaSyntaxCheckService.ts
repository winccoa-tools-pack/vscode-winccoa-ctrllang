import * as vscode from "vscode";
import * as cp from "child_process";
import * as fs from "fs";
import * as path from "path";
import { ProjectPathResolver } from "./projectPathResolver";
import { ExtensionOutputChannel } from "../extensionOutput";

interface SyntaxError {
  severity: "ERROR" | "WARNING" | "INFO";
  message: string;
  script: string;
  line?: number;
  column?: number;
}

export class WinccoaSyntaxCheckService {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private outputChannel: vscode.OutputChannel;

  constructor(outputChannel: vscode.OutputChannel) {
    this.diagnosticCollection =
      vscode.languages.createDiagnosticCollection("winccoa-syntax");
    this.outputChannel = outputChannel;
  }

  public async checkFile(document: vscode.TextDocument): Promise<void> {
    const config = vscode.workspace.getConfiguration("winccoa.syntaxCheck");

    // Check if syntax check is enabled
    if (!config.get<boolean>("enabled", true)) {
      ExtensionOutputChannel.trace(
        "SyntaxCheck",
        "Syntax check disabled in settings",
      );
      return;
    }

    // Only check .ctl and .ctrlpp files
    if (document.languageId !== "ctrl" && document.languageId !== "ctrlpp") {
      return;
    }

    const filePath = document.uri.fsPath;
    ExtensionOutputChannel.debug(
      "SyntaxCheck",
      `Checking file: ${path.basename(filePath)}`,
    );

    try {
      const diagnostics = await this.runSyntaxCheck(filePath);
      this.diagnosticCollection.set(document.uri, diagnostics);
    } catch (error) {
      const err = error as Error;
      ExtensionOutputChannel.error(
        "SyntaxCheck",
        `Error checking file: ${err.message}`,
        err,
      );
    }
  }

  private async runSyntaxCheck(filePath: string): Promise<vscode.Diagnostic[]> {
    const resolver = ProjectPathResolver.getInstance();
    const projectPaths = await resolver.getProjectPaths();

    if (!projectPaths || !projectPaths.projectPath) {
      ExtensionOutputChannel.error("SyntaxCheck", "Project path not found");
      vscode.window.showWarningMessage(
        "WinCC OA Syntax Check: Project path not configured",
      );
      return [];
    }

    if (!projectPaths.installPath) {
      ExtensionOutputChannel.error(
        "SyntaxCheck",
        "Installation path not found",
      );
      vscode.window.showWarningMessage(
        "WinCC OA Syntax Check: Installation path not configured",
      );
      return [];
    }

    ExtensionOutputChannel.trace(
      "SyntaxCheck",
      `Project path: ${projectPaths.projectPath}`,
    );
    ExtensionOutputChannel.trace(
      "SyntaxCheck",
      `Installation path: ${projectPaths.installPath}`,
    );

    // Find config file
    const configPath = path.join(projectPaths.projectPath, "config", "config");
    if (!fs.existsSync(configPath)) {
      ExtensionOutputChannel.error(
        "SyntaxCheck",
        `Config file not found: ${configPath}`,
      );
      vscode.window.showWarningMessage(
        `WinCC OA Syntax Check: Config file not found at: ${configPath}`,
      );
      return [];
    }

    // Find WCCOActrl binary
    const isWindows = process.platform === "win32";
    const binaryName = isWindows ? "WCCOActrl.exe" : "WCCOActrl";
    const binaryPath = path.join(projectPaths.installPath, "bin", binaryName);

    if (!fs.existsSync(binaryPath)) {
      ExtensionOutputChannel.error(
        "SyntaxCheck",
        `Binary not found: ${binaryPath}`,
      );
      vscode.window.showWarningMessage(
        `WinCC OA Syntax Check: Binary not found at: ${binaryPath}`,
      );
      return [];
    }

    const args = [
      filePath,
      "-config",
      configPath,
      "-syntax",
      "all",
      "-log",
      "+stdout",
      "-log",
      "-file",
    ];

    ExtensionOutputChannel.trace(
      "SyntaxCheck",
      `Command: ${binaryPath} ${args.join(" ")}`,
    );

    return new Promise((resolve) => {
      const process = cp.spawn(binaryPath, args);
      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        ExtensionOutputChannel.trace(
          "SyntaxCheck",
          `Process exited with code ${code}`,
        );

        const output = stdout + stderr;
        const diagnostics = this.parseOutput(output, filePath);

        if (diagnostics.length > 0) {
          ExtensionOutputChannel.debug(
            "SyntaxCheck",
            `Found ${diagnostics.length} diagnostic(s)`,
          );
        } else {
          ExtensionOutputChannel.trace("SyntaxCheck", "No issues found");
        }
        resolve(diagnostics);
      });

      process.on("error", (error) => {
        ExtensionOutputChannel.error(
          "SyntaxCheck",
          `Failed to start process: ${error.message}`,
          error,
        );
        resolve([]);
      });
    });
  }

  private parseOutput(
    output: string,
    checkedFilePath: string,
  ): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const lines = output.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for error/warning lines
      // Format: "WCCOActrl (0), ..., CTRL, SEVERE/WARNING, <code>, <message>,"
      // Followed by (possibly indented): "Script: <path>"
      // And optionally: "Line: <num> Column: <num>, <detail>"

      if (
        line.includes("CTRL") &&
        (line.includes("SEVERE") || line.includes("WARNING"))
      ) {
        const severity = line.includes("SEVERE") ? "ERROR" : "WARNING";

        // Extract message from current line
        const parts = line.split(",");
        let message = "";
        if (parts.length >= 4) {
          // Get everything after the error code
          message = parts.slice(3).join(",").trim();
        }

        // Look ahead for Script: and Line: info (may be on separate indented lines)
        let foundScript = false;
        let lineNum: number | undefined;
        let colNum: number | undefined;
        let foundScriptLine = false;

        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const nextLine = lines[j].trim();

          // Stop looking if we hit another CTRL WARNING/SEVERE line
          if (
            nextLine.includes("CTRL") &&
            (nextLine.includes("SEVERE") || nextLine.includes("WARNING"))
          ) {
            break;
          }

          if (nextLine.startsWith("Script:")) {
            foundScriptLine = true;

            // Extract script path - handle different formats:
            // "Script: /path/to/file.ctl"
            // "Script: /path/to/file.ctl, Line 1"
            // "Script: /path/to/file.ctl               , Line 1"
            const scriptMatch = nextLine.match(
              /Script:\s*(.+?)(?:\s*,\s*Line|\s+Line|$)/,
            );
            if (scriptMatch) {
              const scriptPath = scriptMatch[1].trim();

              // Normalize paths for comparison
              const normalizedScript = scriptPath.replace(/\\/g, "/");
              const normalizedChecked = checkedFilePath.replace(/\\/g, "/");

              // Only process if it's the file we're checking
              if (
                !normalizedScript.includes(path.basename(normalizedChecked))
              ) {
                break;
              }

              foundScript = true;
            }

            // Check if Line/Column are on the same line as Script:
            // Handle formats: "Line 1", "Line: 1", ", Line 1"
            const lineMatch = nextLine.match(/,?\s*Line:?\s*(\d+)/);
            if (lineMatch) {
              lineNum = parseInt(lineMatch[1], 10);
            }

            const colMatch = nextLine.match(/Column:?\s*(\d+)/);
            if (colMatch) {
              colNum = parseInt(colMatch[1], 10);
            }

            // Extract additional detail message after column
            const detailMatch = nextLine.match(/Column:\s*\d+,\s*(.+)$/);
            if (detailMatch) {
              message = detailMatch[1].trim();
            }

            // If no line number on same line, check next line
            if (!lineNum && j + 1 < lines.length) {
              const nextNextLine = lines[j + 1].trim();
              const lineMatch2 = nextNextLine.match(/,?\s*Line:?\s*(\d+)/);
              if (lineMatch2) {
                lineNum = parseInt(lineMatch2[1], 10);
              }

              const colMatch2 = nextNextLine.match(/Column:?\s*(\d+)/);
              if (colMatch2) {
                colNum = parseInt(colMatch2[1], 10);
              }

              const detailMatch2 = nextNextLine.match(/Column:\s*\d+,\s*(.+)$/);
              if (detailMatch2) {
                message = detailMatch2[1].trim();
              }
            }

            break;
          }
        }

        // Skip if we didn't find a Script: line at all (e.g., Library warnings)
        if (!foundScriptLine) {
          continue;
        }

        // Only create diagnostic if we found the script AND have a line number
        if (foundScript && lineNum !== undefined) {
          const diagnostic = this.createDiagnostic(
            severity,
            message,
            lineNum,
            colNum,
          );
          if (diagnostic) {
            diagnostics.push(diagnostic);
          }
        }
      }
    }

    return diagnostics;
  }

  private createDiagnostic(
    severity: "ERROR" | "WARNING" | "INFO",
    message: string,
    line?: number,
    column?: number,
  ): vscode.Diagnostic | null {
    // Determine line number (0-based)
    let lineNum = 0;
    if (line !== undefined && line > 0) {
      lineNum = line - 1; // VS Code uses 0-based line numbers
    }

    // Determine column number (0-based)
    let colNum = 0;
    if (column !== undefined && column >= 0) {
      colNum = column;
    }

    // Create range
    const range = new vscode.Range(
      lineNum,
      colNum,
      lineNum,
      colNum + 100, // Highlight a reasonable length
    );

    // Determine severity
    let vsSeverity = vscode.DiagnosticSeverity.Warning;
    switch (severity) {
      case "ERROR":
        vsSeverity = vscode.DiagnosticSeverity.Error;
        break;
      case "WARNING":
        vsSeverity = vscode.DiagnosticSeverity.Warning;
        break;
      case "INFO":
        vsSeverity = vscode.DiagnosticSeverity.Information;
        break;
    }

    // Create diagnostic
    const diagnostic = new vscode.Diagnostic(range, message, vsSeverity);
    diagnostic.source = "WinCC OA";

    return diagnostic;
  }

  public clearDiagnostics(uri?: vscode.Uri): void {
    if (uri) {
      this.diagnosticCollection.delete(uri);
    } else {
      this.diagnosticCollection.clear();
    }
  }

  public dispose(): void {
    this.diagnosticCollection.dispose();
  }
}
