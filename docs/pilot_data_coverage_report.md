# Pilot enrichment coverage report

## Scope and coverage logic

The enrichment pass retains the original 15 operations across 11 sites. It adds no operation and performs no geocoding. Each field is now classified as `verified`, `conflicting`, `unknown_or_missing`, or `not_applicable`. A blank closing date for the documented current Shaw Lido operation is `not_applicable`, not a missing value. Both total-record and applicable-record coverage are reported.

| Field | Verified | Conflicting | Unknown/missing | Not applicable | Total coverage | Applicable coverage |
|---|---:|---:|---:|---:|---:|---:|
| Opening date/year | 15 | 0 | 0 | 0 | 100.0% | 100.0% |
| Closing date/year | 6 | 0 | 8 | 1 | 40.0% | 42.9% of 14 |
| Precise historical address | 14 | 0 | 1 | 0 | 93.3% | 93.3% |
| Venue type | 12 | 0 | 3 | 0 | 80.0% | 80.0% |
| `mall_based` | 8 | 0 | 7 | 0 | 53.3% | 53.3% |
| Screens, time-aware | 6 | 0 | 9 | 0 | 40.0% | 40.0% |
| Seats, time-aware | 7 | 0 | 8 | 0 | 46.7% | 46.7% |

The machine-readable coverage and derived-variable tests are in `data/processed/pilot_coverage_report.csv` and `data/processed/pilot_derived_numeric_availability.csv`.

## Improvements from enrichment

- Exact historical textual addresses were established for Capitol (historic 1 Stamford Road/current 17 Stamford Road), Cathay (2 Handy Road), and all three Shaw Towers operations (100 Beach Road). Only GV Yishun lacks a contemporaneous address source.
- Cathay’s opening date was corrected to 3 October 1939. Venus and Golden City now have 1984 closure years. Queenstown Cinema’s 1999 closure, two halls and 1,715-seat capacity are now retained as medium-confidence, corroborated specialist evidence.
- Building evidence supports controlled venue types for Cathay, Capitol, Queenstown, the Margaret Drive venues, Shaw Towers, Shaw House and Golden Mile Tower. `mall_based` remains unknown unless the building evidence clearly supports yes or no.
- New time-specific capacity observations: GV Yishun 1,477 seats after its 2010 renovation and The Projector 430 seats in its reported 2016 two-hall configuration. Neither is projected to an earlier configuration.

## Quantitative viability

### Screen count: not viable as a primary project-wide layer

Only 6 of 15 operations (40.0%) have a reliable time-aware screen count. This is below the 60% viability threshold and at the lowest edge of the risky range. It could support a selective clearly scoped case comparison but not one of the assignment’s two project-wide quantitative layers.

### Seating capacity: possible but risky; not yet a primary layer

Seven operations (46.7%) have time-aware capacities. This falls in the 40–59% range: suitable only for a selective-period or case-study layer with prominent missing-data disclosure. The values span multiple configurations and periods, so they cannot be used as a single contemporaneous national comparison without further research.

## Legitimate fallback numeric variables

| Variable | Availability | Assessment |
|---|---:|---|
| Documented operations per site | 11/11 sites (100.0%) | Strong future site-level variable; values range from 1 to 3 in this pilot. |
| Operation duration in years | 6/14 applicable operations (42.9%) | Valid only where opening and closing years are source-backed; currently selective. |
| Active cinema count by time slice | 7/15 operations (46.7%) | Not yet robust because closure chronology is incomplete. |
| Active cinema count by spatial unit | 0/11 sites (0.0%) | Not calculable until later approved geocoding and spatial assignment. |

## Qualitative candidates for a later chapter

1. Capitol Theatre — archival architecture audience memories conservation and redevelopment.
2. Cathay Cinema / Building — 1939 opening air-conditioning history wartime history and surviving landmark fabric.
3. Queen’s / Majestic Theatre — opera origins rename sequence wartime use Chinese cultural history and mall conversion.
4. Queenstown Cinema and Bowling Centre — neighbourhood leisure community memories and redevelopment; requires stronger source corroboration.
5. Golden Theatre / The Projector — reuse of an older cinema building independent-cinema history and closure/redevelopment context.

## Preliminary observations, not conclusions

The deliberately varied pilot makes repeated reuse and reconfiguration highly visible: Queen’s became Majestic, Jade 2 became Jade Classics, Shaw House moved from five to eleven halls across dated refurbishments, and Golden Mile Tower was reused by The Projector. It also includes neighbourhood commercial-centre cases at Queenstown and early multi-hall cases at Shaw Towers and Yishun. These are promising hypotheses for the final spatial story, not evidence of a Singapore-wide pattern: the sample was intentionally selected for variation and is too small and incomplete to establish a historical conclusion.

No further operations, geocoding, Mapbox resources, website, or final narrative have been created. Review is required before expansion.
