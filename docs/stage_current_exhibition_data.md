# Current exhibition data supplementation

## Scope and freeze

Completed on 8 September 2026. This was a data-only supplementation pass. No Mapbox tileset, style, website file, map state, page component, or CSS file was created or modified.

The current-exhibition inventory is deliberately independent of `operations.csv`: a present-day venue may share a building with a historic cinema, but it is not inferred from a historic operation's status. Inclusion requires a stable Singapore location and verified recurring or regular public screenings. Festivals, pop-ups, private-hire-only venues, and venues currently closed were excluded.

## Golden Mile audit and result

The protected pre-edit audit found that `SGC-S-011` already existed with high-confidence Mapbox rooftop coordinates at 6001 Beach Road, and that `SGC-O-015` already represented The Projector at Golden Mile Tower. `Golden Theatre` appeared only as an address variant rather than an operation; Filmhouse had no operation, evidence, or continuity-case entry. The existing continuity GeoJSON did not include Golden Mile.

The valid site identifier has been retained and clarified. The historic address is now held separately as `6001 Beach Road`; the modern Mapbox address is `6001 Beach Road, Singapore 199589`. The verified coordinate remains 1.301929, 103.864161 with high confidence. Current site use records Filmhouse and Carnival Cinemas, which are co-located in Golden Mile Tower but occupy distinct cinema spaces.

The historical operation sequence is now:

`Golden Theatre (SGC-O-043) → The Projector at Golden Mile Tower (SGC-O-015) → Filmhouse (SGC-O-044)`

Golden Theatre is a 1973 operation associated with Chong Gay Theatres and the original large cinema at Golden Mile Tower. Its original configuration is documented as one hall, later subdivided into three theatres. The exact capacity is intentionally unresolved: credible sources give 1,896, 1,900, and about 1,500 seats, so `seats` is blank and `seats_status=conflicting`. No reliable evidence was found for a specific circular seating configuration, and the dataset does not assert one.

The Projector is now explicitly linked to Golden Theatre as predecessor and Filmhouse as successor. A 2014 soft-launch/founding claim and a January 2015 regular-programme opening claim are both retained in `evidence.csv`; the master record retains 2014 as its year-level value rather than pretending those claims are identical. Its final closure date is 19 August 2025. Its two-hall, 430-seat configuration is constrained to 2016. Documented legacy elements include Golden Theatre signs, floor lettering, and repaired flip-up seats.

Filmhouse opened on 3 February 2026 in The Projector's former three-screen Level 5 space. Filmhouse's own FAQ describes it as a new business entity under different ownership and management, so it is explicitly a distinct operation, not a rename. The three-screen value is dated to 2026; no seating capacity has been fabricated. The new processed continuity table sets Golden Mile as the sole `primary` case and changes Lido to `secondary`.

## Current-exhibition inventory

`data/processed/current_exhibition_spaces.csv` contains 33 included venues, all geocoded through Mapbox Search & Geocoding at site/building level.

| Category | Included spaces |
|---|---:|
| commercial | 27 |
| independent_curated | 2 |
| heritage_hybrid | 1 |
| institutional_curated | 3 |
| **Total** | **33** |

The commercial inventory includes all 16 locations named in Golden Village's current official venue table, all eight locations in Shaw Theatres' official current venue list, and Carnival Golden Mile, EagleWings Cinematics, and MY Cinemas Causeway Point. The curated/heritage/institutional inventory includes Filmhouse, SFS Somerset, Capitol Theatre, Oldham Theatre, Objectifs, and Le Theatre at Alliance Francaise.

Four candidates were investigated and excluded from the current map-ready inventory: ArtScience Cinema (officially closed from 1 September 2026), SAS Cineplex Causeway Point (temporarily closed), GV Tiong Bahru (ceased 30 March 2026), and GV Plaza Singapura (ceased 17 August 2026). The complete exclusion rationale is in `data/interim/current_exhibition_research_log.csv`.

## Geocoding and co-location notes

All 33 included records have coordinates. Twenty-eight are high-confidence direct Mapbox rooftop-address matches. Five have medium confidence: GV Downtown East and GV Jurong Point are matched to a verified building POI; EagleWings is matched to a different tenant POI in the verified KAP building; and Shaw Balestier and Waterway Point retain exact rooftop coordinates but have a postal-code mismatch with the operator's address. Each mismatch is preserved in the inventory.

Important co-locations are explicit:

- Filmhouse and Carnival Cinemas share Golden Mile Tower's mapped building address; Filmhouse is linked to the historic Golden Theatre/Projector chain, whereas Carnival is a separate Level 3 operation.
- SFS Somerset is in Hall 6 of GV Cineleisure. It shares the building coordinate with GV Cineleisure but is a separate operator and auditorium.
- Current Capitol Theatre shares the historic Capitol site coordinate. The historic `1 Stamford Road` and current `17 Stamford Road` address conventions remain separate.

## Source limits and review queue

The inventory uses current operator/institution pages as its primary evidence wherever available, with Mapbox result metadata retained rather than substituted for source evidence. Golden Village's current venue table identifies the 16 active locations but does not expose every unit address in the same view, so the exact venue addresses are recorded alongside their Mapbox results. Carnival's official booking page was live but displayed a booking-connection issue; it is therefore classed `active_limited`, not treated as conclusively daily-operating. Capitol Theatre is likewise `active_limited` because its public film schedule is limited alongside a broader performance programme.

Before a later map export, review the two Shaw postal-code differences and the three building-POI coordinates if address-level placement becomes analytically material. The current-exhibition dataset itself is ready for a later, separately approved Mapbox data update; no such update was made in this stage.
