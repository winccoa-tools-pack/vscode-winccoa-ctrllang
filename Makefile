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
	@mkdir -p $(BIN_DIR)
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
	@echo "========================================"
	@echo "Starting Local Test Setup..."
	@echo "OS: $(DETECTED_OS)"
	@echo "========================================"
	@echo ""
	@echo "[1/5] Creating local build counter..."
	@$(MKDIR) $(BIN_DIR)
	@if [ ! -f $(LOCAL_COUNTER_FILE) ]; then echo "0" > $(LOCAL_COUNTER_FILE); fi
	@LOCAL_COUNT=$$(cat $(LOCAL_COUNTER_FILE)); \
	NEW_COUNT=$$((LOCAL_COUNT + 1)); \
	echo $$NEW_COUNT > $(LOCAL_COUNTER_FILE); \
	LOCAL_VSIX="$(BIN_DIR)/$(EXTENSION_NAME)-$(VERSION)-local-$$NEW_COUNT.vsix"; \
	echo "[2/5] Packaging to $$LOCAL_VSIX (includes build via vscode:prepublish)..."; \
	echo "Updating version badge in README.md..."; \
	sed -i.bak 's|!\[Version\](https://img.shields.io/badge/version-[^)]*)|![Version](https://img.shields.io/badge/version-$(VERSION).local.'$$NEW_COUNT'-blue.svg)|' README.md; \
	echo "Backing up package.json..."; \
	cp package.json package.json.bak; \
	echo "Modifying displayName for local build..."; \
	ORIGINAL_DISPLAY_NAME=$$(node -p "require('./package.json').displayName"); \
	node -e "const fs=require('fs'); const p=require('./package.json'); p.displayName='$$ORIGINAL_DISPLAY_NAME [LOCAL-$$NEW_COUNT]'; fs.writeFileSync('package.json', JSON.stringify(p, null, 2) + '\n')"; \
	$(VSCE) package -o $$LOCAL_VSIX; \
	PACKAGE_RESULT=$$?; \
	echo "Restoring package.json from backup..."; \
	mv package.json.bak package.json; \
	echo "Restoring README.md from backup..."; \
	mv README.md.bak README.md; \
	if [ $$PACKAGE_RESULT -ne 0 ]; then exit 1; fi; \
	echo ""; \
	if [ "$(SKIP_UNINSTALL)" != "yes" ]; then \
		echo "[3/5] Uninstalling existing extension ($(EXT_ID))..."; \
		$(CODE_BIN) --uninstall-extension $(EXT_ID) 2>/dev/null || echo "Extension not installed or already removed"; \
		echo ""; \
	else \
		echo "[3/5] Skipping uninstall (SKIP_UNINSTALL=yes)"; \
		echo ""; \
	fi; \
	echo "[4/5] Installing new extension from $$LOCAL_VSIX..."; \
	$(CODE_BIN) --install-extension $$LOCAL_VSIX --force || exit 1; \
	sleep 1; \
	echo ""; \
	echo "[5/5] Reloading VS Code window..."; \
	if [ "$(FORCE_CLOSE_VSCODE)" = "yes" ]; then \
		echo "⚠️  Closing ALL VS Code instances (FORCE_CLOSE_VSCODE=yes)..."; \
		$(KILL_CODE); \
		sleep 2; \
		echo "Opening workspace: $(TEST_WORKSPACE)"; \
		$(CODE_BIN) $(TEST_WORKSPACE) & \
	elif [ "$(CLOSE_OLD_WINDOW)" = "yes" ]; then \
		echo "🔄 Closing old test workspace window and opening fresh..."; \
		$(CODE_BIN) --reuse-window $(TEST_WORKSPACE) 2>/dev/null || true; \
		sleep 0.5; \
		$(CODE_BIN) --command workbench.action.closeWindow 2>/dev/null || true; \
		sleep 1; \
		echo "Opening fresh workspace window: $(TEST_WORKSPACE)"; \
		$(CODE_BIN) --new-window $(TEST_WORKSPACE) & \
	else \
		echo "ℹ️  Opening workspace in new window: $(TEST_WORKSPACE)"; \
		$(CODE_BIN) --new-window $(TEST_WORKSPACE) & \
	fi; \
	echo ""; \
	echo "========================================"; \
	echo "Local Test Setup Complete!"; \
	echo "Extension ID: $(EXT_ID)"; \
	echo "VSIX: $$LOCAL_VSIX"; \
	echo "Workspace: $(TEST_WORKSPACE)"; \
	echo "Build Counter: $$NEW_COUNT"; \
	echo "========================================";

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
