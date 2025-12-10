.PHONY: all clean install build package

# Variables
BIN_DIR := bin
EXTENSION_NAME := winccoa-ctrllang
NPM := npm
VSCE := npx vsce

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

# Package extension into .vsix file
package: build
	@echo "Packaging extension..."
	@mkdir -p $(BIN_DIR)
	@$(VSCE) package --out $(BIN_DIR)/$(EXTENSION_NAME).vsix
	@echo "Extension packaged to $(BIN_DIR)/$(EXTENSION_NAME).vsix"

# Quick build without cleaning
quick: build package

# Development watch mode
watch:
	@$(NPM) run watch

# Watch language server
watch-server:
	@$(NPM) run watch:server

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
	@echo "  help         - Show this help message"
