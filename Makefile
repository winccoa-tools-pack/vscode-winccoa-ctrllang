.PHONY: all clean install build package test-local

# Variables
BIN_DIR := bin
EXTENSION_NAME := winccoa-ctrllang
VERSION := $(shell node -p "require('./package.json').version")
EXT_PUBLISHER := RichardJanisch
EXT_NAME := winccoa-ctrllang
EXT_ID := $(EXT_PUBLISHER).$(EXT_NAME)
NPM := npm
VSCE := npx vsce

# Test workspace configuration
TEST_WORKSPACE ?= DevEnv.code-workspace
CODE_BIN ?= code
FORCE_CLOSE_VSCODE ?= no
SKIP_UNINSTALL ?= yes
CLOSE_OLD_WINDOW ?= no

# Local build counter file
LOCAL_COUNTER_FILE := $(BIN_DIR)/.local_build_counter

# OS Detection
ifeq ($(OS),Windows_NT)
    DETECTED_OS := Windows
    RM := del /Q /F
    RMDIR := rmdir /S /Q
    MKDIR := mkdir
    KILL_CODE := taskkill /IM Code.exe /F 2>nul || echo "No VS Code process found"
else
    DETECTED_OS := $(shell uname -s)
    RM := rm -f
    RMDIR := rm -rf
    MKDIR := mkdir -p
    KILL_CODE := pkill -f "$(CODE_BIN)" 2>/dev/null || echo "No VS Code process found"
endif

# Default target
all: clean install build package

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf out dist node_modules language-server/src/*.js language-server/src/*.js.map
	@rm -rf $(BIN_DIR)
	@echo "Clean complete."

# Install dependencies
install:
	@echo "Installing dependencies..."
	@$(NPM) install
	@echo "Dependencies installed."

# Build TypeScript sources
build:
	@echo "Building extension..."
	@$(NPM) run compile
	@echo "Build complete."

# Package extension into .vsix file (production release)
package:
	@echo "Packaging production release..."
	@-$(MKDIR) $(BIN_DIR) 2>/dev/null || true
	@echo "Updating version badge in README.md..."
	@node -e "const fs=require('fs'); let c=fs.readFileSync('README.md','utf8'); c=c.replace(/!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[^)]*\)/,'![Version](https://img.shields.io/badge/version-$(VERSION)-blue.svg)'); fs.writeFileSync('README.md',c);"
	@$(VSCE) package --out $(BIN_DIR)/$(EXTENSION_NAME)-$(VERSION).vsix
	@echo "Extension packaged to $(BIN_DIR)/$(EXTENSION_NAME)-$(VERSION).vsix"

# Quick build without cleaning
quick: build package

# Development watch mode
watch:
	@$(NPM) run watch

# Watch language server
watch-server:
	@$(NPM) run watch:server

# Local test target - Build, package with local stamp, replace extension, restart VS Code
test-local:
	@node scripts/test-local.js $(BIN_DIR) $(EXTENSION_NAME) $(VERSION) $(EXT_ID) $(CODE_BIN) $(TEST_WORKSPACE)

# Help target
help:
	@echo "Available targets:"
	@echo "  all          - Clean, install, build and package (default)"
	@echo "  clean        - Remove build artifacts and node_modules"
	@echo "  install      - Install npm dependencies"
	@echo "  build        - Compile TypeScript sources"
	@echo "  package      - Create .vsix package in bin/ directory"
	@echo "  quick        - Build and package without cleaning"
	@echo "  watch        - Watch and recompile extension on changes"
	@echo "  watch-server - Watch and recompile language server on changes"
	@echo "  test-local   - Build, package with local stamp, replace extension in VS Code, restart with test workspace"
	@echo "  help         - Show this help message"
	@echo ""
	@echo "Local Test Configuration:"
	@echo "  TEST_WORKSPACE        - Path to test workspace (default: ./test-scripts)"
	@echo "  CODE_BIN              - VS Code binary (default: code, use 'code-insiders' for Insiders)"
	@echo "  FORCE_CLOSE_VSCODE    - Close all VS Code instances before opening (default: no, use 'yes' to force)"
	@echo "  Example: make test-local TEST_WORKSPACE=/path/to/workspace CODE_BIN=code-insiders FORCE_CLOSE_VSCODE=yes"
