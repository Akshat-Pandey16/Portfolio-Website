SHELL := /bin/bash

PKG ?= pnpm

.PHONY: help install dev build preview lint lint-fix typecheck check clean reset open outdated upgrade upgrade-latest audit

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	$(PKG) install

dev: ## Run dev server with HMR
	$(PKG) dev

build: ## Production build
	$(PKG) build

preview: build ## Build and preview production bundle
	$(PKG) preview

lint: ## Lint the project
	$(PKG) lint

lint-fix: ## Lint and apply fixable issues
	$(PKG) lint -- --fix

typecheck: ## Run TypeScript without emitting
	$(PKG) typecheck

check: typecheck lint build ## Run all quality gates

clean: ## Remove build output
	rm -rf dist node_modules/.vite

reset: clean ## Wipe build output and node_modules
	rm -rf node_modules pnpm-lock.yaml

open: ## Open the local dev server in default browser
	@command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:5173 || open http://localhost:5173

outdated: ## Show dependencies that have newer versions
	$(PKG) outdated || true

upgrade: ## Upgrade dependencies inside their semver ranges
	$(PKG) update --recursive

upgrade-latest: ## Bump every dependency to the latest version, then verify
	$(PKG) update --latest --recursive
	$(MAKE) install
	$(MAKE) check

audit: ## Audit dependencies for known vulnerabilities
	$(PKG) audit || true
