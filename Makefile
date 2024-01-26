.DEFAULT_GOAL := default

IMAGE ?= rg.fr-par.scw.cloud/averagemarcus/devstats-viewer:latest

export DOCKER_CLI_EXPERIMENTAL=enabled

.PHONY: build # Build the project
build: lint check-format fetch-deps
	@go build -o kube-image-prefetch main.go

.PHONY: docker-build # Build the docker image
docker-build:
	@docker build -t $(IMAGE) .

.PHONY: docker-publish # Push the docker image to the remote registry
docker-publish:
	@docker push $(IMAGE)

.PHONY: release # Release the latest version of the application
release:
	kubectl --namespace devstats-viewer set image deployment devstats-viewer web=rg.fr-par.scw.cloud/averagemarcus/devstats-viewer:$(SHA)

.PHONY: help # Show this list of commands
help:
	@echo "kube-image-prefetch"
	@echo "Usage: make [target]"
	@echo ""
	@echo "target	description" | expand -t20
	@echo "-----------------------------------"
	@grep '^.PHONY: .* #' Makefile | sed 's/\.PHONY: \(.*\) # \(.*\)/\1	\2/' | expand -t20

default: test
