# RTMX Whitepapers Build System
# Requires: typst (https://typst.app)

TYPST := typst
ROOT := ..
SOURCES := $(wildcard *.typ)
PDFS := $(SOURCES:.typ=.pdf)

.PHONY: all clean watch

all: $(PDFS)

%.pdf: %.typ ../templates/rtmx-theme.typ
	$(TYPST) compile --root $(ROOT) $< $@

clean:
	rm -f *.pdf

watch:
	@echo "Watching for changes... (Ctrl+C to stop)"
	@for src in $(SOURCES); do \
		$(TYPST) watch --root $(ROOT) $$src $${src%.typ}.pdf & \
	done; \
	wait

# Individual targets
rtmx-101.pdf: rtmx-101.typ ../templates/rtmx-theme.typ
	$(TYPST) compile --root $(ROOT) $< $@

patterns.pdf: patterns.typ ../templates/rtmx-theme.typ
	$(TYPST) compile --root $(ROOT) $< $@
