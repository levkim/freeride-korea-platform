# ADR 0081: GitHub Actions Visibility

## Status

Accepted

## Context

The project now has CI, smoke QA, and a local preflight command. Operators still need an obvious place to confirm the latest GitHub Actions result after pushing to `main`.

## Decision

Add GitHub Actions visibility in two places:

- README CI badge linked to the workflow
- `/admin/deployment` section with the workflow URL and an external link

## Consequences

The deployment handoff now includes both local verification commands and a visible GitHub CI status path. This reduces the chance of deploying without checking whether the latest pushed commit passed CI.
