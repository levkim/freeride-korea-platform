# ADR 0030: Athlete Program Non-Commercial Model

## Status

Accepted

## Context

The Athlete Program is not a paid course or tour product. Its purpose is to show and operate a Korean rider development system: current athlete level, training focus, competition participation, results, video review, and long-term growth records.

Showing a `price` field on Athlete Program detail pages or draft forms makes the program look like a revenue-generating product, which conflicts with the brand purpose of developing Korean freeride athletes for FWT, Olympic, and global competition pathways.

## Decision

Athlete Program content with subtype `Freeride` does not use the shared `price` field.

- The admin category draft form hides the price input for Athlete Program drafts.
- Persisted metadata stores `price` as `null` for Athlete Program drafts.
- Public category detail pages do not display `Price` for Athlete Program content.
- Seed Athlete Program content removes the sample price value.

## Consequences

The Athlete Program page can focus on development data instead of commercial details. Tour, education, shop, and membership content can continue to use price or fee information where it is operationally relevant.
