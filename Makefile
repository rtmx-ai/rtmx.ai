# rtmx.ai — local CI parity with Deploy Website
SHELL := /bin/bash
.DEFAULT_GOAL := help

## help: Show targets
.PHONY: help
help:
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/^## //' | column -t -s ':'

## hooks: Install git hooks (pre-push runs full Playwright + build)
.PHONY: hooks
hooks:
	git config core.hooksPath .githooks
	@chmod +x .githooks/pre-push scripts/ci-local.sh
	@echo "Git hooks installed from .githooks/ (pre-push → scripts/ci-local.sh)"

## test: Alias for CI-local gate (build + worker + e2e)
.PHONY: test
test: test-ci

## test-ci: Mirror Deploy Website (build, form-proxy, Playwright)
.PHONY: test-ci
test-ci:
	./scripts/ci-local.sh
