SHELL := /bin/bash

PKG ?= bun

.PHONY: help install dev build preview lint lint-fix typecheck check clean reset open outdated upgrade upgrade-latest audit

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	$(PKG) install

dev: ## Run dev server with HMR
	$(PKG) run dev

build: ## Production build
	$(PKG) run build

preview: build ## Build and preview production bundle
	$(PKG) run preview

lint: ## Lint the project
	$(PKG) run lint

lint-fix: ## Lint and apply fixable issues
	$(PKG) run lint --fix

typecheck: ## Run TypeScript without emitting
	$(PKG) run typecheck

check: typecheck lint build ## Run all quality gates

clean: ## Remove build output
	rm -rf dist node_modules/.vite

reset: clean ## Wipe build output and node_modules
	rm -rf node_modules bun.lock

open: ## Open the local dev server in default browser
	@command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:5173 || open http://localhost:5173

outdated: ## Show dependencies that have newer versions
	$(PKG) outdated || true

upgrade: ## Upgrade dependencies inside their semver ranges
	$(PKG) update

upgrade-latest: ## Bump every dependency to the latest version, then verify
	$(PKG) update --latest
	$(MAKE) install
	$(MAKE) check

audit: ## Audit dependencies for known vulnerabilities
	$(PKG) audit || true
