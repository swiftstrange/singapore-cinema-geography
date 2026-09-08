# Stage 2B — Coordinated Geocoding and Chronology Normalisation

Date completed: 2026-09-06  
Scope frozen: the existing verified core of 42 cinema operations at 35 physical sites. No new candidates or operations were added.

## Geocoding outcome

Mapbox Search & Geocoding was used only for physical sites with a verified building-level address. Historical addresses remain unchanged in `sites.csv`; the geocoding fields record a separate, auditable spatial match.

| Outcome | Sites | Share of 35 sites |
|---|---:|---:|
| Matched, high confidence | 21 | 60.0% |
| Matched, medium confidence | 2 | 5.7% |
| Spatially usable total | 23 | 65.7% |
| Explicitly unresolved | 2 | 5.7% |
| Insufficient building-level address; not queried | 10 | 28.6% |

The ten Stage 2B matched sites add nine high-confidence rooftop matches and one medium-confidence same-address POI match. The latter is S023 (Golden Village Jurong Point): Mapbox did not return a building-address feature, so its point must not be represented as rooftop-precise.

S014 (Broadway Cinema / Broadway Plaza) and S015 (Jurong Drive-In) were retained as unresolved exactly as instructed. No approximate, manual, centroid, or unrelated-POI coordinates were assigned. Ten other sites lack a sufficiently precise building address, so no Mapbox request was made for them.

At the operation level, 30 of 42 operations are attached to a matched site; 29 of those 30 have a documented opening year.

## Chronology normalisation

`operation_status` now uses only the controlled values below. This is a labelling normalisation; it does not invent an opening, closure, or reopening date.

| Status | Operations | Meaning |
|---|---:|---|
| `current` | 6 | Documented as currently operating in the existing record set. |
| `closed` | 15 | Documented as closed. |
| `uncertain` | 21 | Existing record had an unknown, renamed, or rebuilt status and requires further chronology resolution before stronger claims. |

Opening year is present for 41 of 42 operations (97.6%), ranging from 1904 to 2017. Closing year is present for 16 records, but closure completeness must be interpreted with the normalised status: current operations are not missing a closure date, and uncertain operations are not assumed closed.

## Quantitative-layer readiness

### Layer 1: documented operations per site

Classification: **STRONG / usable as a derived site-level size variable.**

The metric is fully derivable for all 35 relational sites. It ranges from 1 to 3 documented operations per site; six sites have more than one recorded operation. For a spatial map it is immediately usable at the 23 matched sites. It must be labelled as a count of *documented operations in this dataset*, not a complete historical total for a building or neighbourhood.

### Layer 2: opening year

Classification: **STRONG / usable as an operation-level colour variable.**

It has 41/42 coverage (97.6%) across 1904–2017, including 29/30 currently spatially usable operations. It can directly control a sequential or diverging Mapbox colour scale once mapping work is authorised. The visualisation must retain operation-level records, because successor, rename, and rebuild relationships at the same site can legitimately have different opening years.

Together these are the approved preliminary quantitative design: site point size for `documented_operations_per_site`, and operation point colour for `opening_year`. No tileset or Mapbox style was created in Stage 2B.

## Remaining data-quality constraints

- Full geographic representation remains incomplete: 12 of 35 sites lack usable coordinates (two explicitly unresolved and ten address-insufficient).
- The 21 `uncertain` chronology statuses require later evidence work before treating dates or continuity as definitive.
- S023 is usable only at medium confidence and should be symbolised or filtered accordingly in any later precision-sensitive output.
- The derived count is a documented-record metric, not a census of all cinemas ever operating at a site.

These issues do not block a clearly scoped prototype using the 23 matched sites, but they do block claims that a map spatially represents the complete 35-site verified core.

## Recommended next step

After approval, prepare mapping-ready feature specifications and a geometry export from the 23 matched sites, preserving confidence and uncertainty fields. Address refinement for the ten insufficient-address sites should precede any attempt to improve their spatial coverage; it is not a geocoding task.
