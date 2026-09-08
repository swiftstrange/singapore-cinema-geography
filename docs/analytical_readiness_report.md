# Stage 2A analytical readiness and data-adequacy audit

## Scope

This audit uses only the verified core: 42 operations linked to 35 physical sites. No candidate, source, core record or coordinate was added or changed.

## Field coverage

| Field | Valid | Missing/unknown | Coverage |
|---|---:|---:|---:|
| Operation name; site ID; reported address | 42 | 0 | 100.0% |
| Opening year/date | 41 | 1 | 97.6% |
| Closing year/date | 16 | 26 | 38.1% total-record coverage |
| Operation status | 24 | 18 | 57.1% |
| Operator | 33 | 9 | 78.6% |
| Venue type | 39 | 3 | 92.9% |
| Mall based | 29 | 13 | 69.0% |
| Mall name | 12 | 30 | 28.6% total-record coverage |
| Predecessor/successor field | 6 | 36 | 14.3% |
| Screens | 12 | 30 | 28.6% |
| Seats | 11 | 31 | 26.2% |

No closing date is counted as missing for the six records explicitly marked open. The residual limitation is that 18 operations retain an unknown status, making a blank closing field ambiguous rather than safely current.

## Temporal readiness

The following practical snapshots use only known opening/closing years and explicit open status. “Ambiguous” means the operation began by that year but lacks a defensible closure/status determination. “Unclassifiable” means chronology does not establish the relevant period; these totals are not Singapore-wide cinema counts.

| Snapshot | Confidently active | Ambiguous | Unclassifiable/inactive |
|---|---:|---:|---:|
| 1930 | 1 | 3 | 38 |
| 1950 | 1 | 6 | 35 |
| 1970 | 4 | 7 | 31 |
| 1985 | 5 | 14 | 23 |
| 1995 | 5 | 21 | 16 |
| 2005 | 1 | 22 | 19 |
| 2015 | 4 | 25 | 13 |
| Present (2026) | 7 | 20 | 15 |

Temporal comparison is **not viable as a quantitative count series**. It is usable only as a documented-case display with explicit uncertainty, because opening coverage is high but status/closing evidence is incomplete.

## Geographic readiness

Of 35 sites, 13 are confidently geocoded (`matched`), 0 are recorded as approximate, 2 are unresolved geocodes and 20 have verified addresses but no geocode started. Thus **13 sites (37.1%) are spatially usable now**. The core spans central areas, Queenstown, Toa Payoh, Ang Mo Kio, Bedok/Tampines, Jurong, Clementi, Punggol and Marine Parade, but remains concentrated in the central, south-central and selected new-town examples. Apparent gaps are evidence gaps, not evidence of historical absence.

## Site-lineage readiness

| Documented operations at a site | Sites |
|---|---:|
| 1 | 29 |
| 2 | 5 |
| 3+ | 1 |

The maximum is three operations at 100 Beach Road (Prince 1 and 2; Jade 1 and 2; Jade Classics). Other multiple-operation sites are 80 Eu Tong Sen Street, 350 Orchard Road, 600 Lorong 4 Toa Payoh, 450 Lorong 6 Toa Payoh and 360 Balestier Road.

`documented_operations_per_site` is **usable with caveats** as a point attribute after geocoding. It measures documented relational complexity, not all historic cinema activity at a site or Singapore-wide intensity.

## Venue context

| Venue type | Operations |
|---|---:|
| community/neighbourhood commercial centre | 14 |
| mixed_use_complex | 10 |
| mall_integrated | 9 |
| other | 5 |
| standalone | 1 |
| unknown | 3 |

Mall based is yes for 11, no for 18 and unknown for 13 operations. Venue type is more analytically informative than the binary mall field because it distinguishes neighbourhood-centre, mixed-use, mall-integrated, standalone and other settings. Its 92.9% coverage makes it **usable with caveats**; the deliberately sampled core is not a population sample.

## Proposed analytical-layer assessment

| Layer | Assessment | Reason |
|---|---|---|
| Historical cinema geography | WEAK / DO NOT USE yet | Only 37.1% of sites geocoded; temporal status is incomplete. |
| Active cinema count by area/time | WEAK / DO NOT USE | The core is not complete enough for Singapore-wide count claims. |
| Documented operations per site | USABLE WITH CAVEATS | Relationally complete for 35 listed sites; needs coordinated geocoding. |
| Operation duration | WEAK / DO NOT USE | Only 16 operations have a closing year/date. |
| Venue type / urban context | USABLE WITH CAVEATS | 39/42 controlled classifications, but sample and chronology bias remain. |
| Screens / seats | WEAK / DO NOT USE | 28.6% and 26.2% coverage respectively. |

## Assignment readiness

The current core can support a qualitative chapter and a lineage-based spatial layer once sites are geocoded. It cannot yet support a defensible pair of project-wide quantitative Mapbox layers: duration and capacity are too incomplete, while area/time counts would overstate dataset completeness. At least three tilesets and four progressive chapters are therefore **not yet analytically ready**.

The strongest eventual combination is: (1) documented site lineage / operations per site; (2) venue type / urban context; and (3) carefully labelled documented-case historical snapshots. The second item is categorical rather than a numeric size/colour control, so it does not satisfy the two-quantitative-layer requirement by itself.

## Critical gaps and immediate next step

**Critical before spatial analysis:** geocode the 20 sites with verified full addresses using the approved site-level workflow, while retaining the two known unresolved cases; and resolve operation status/closure treatment for the 18 unknown-status records so temporal eligibility can be calculated consistently.

**Desirable:** establish closure dates for the subset intended for duration analysis; complete mall-name fields where mall-based is yes.

**Non-essential:** broad screens/seats recovery across all operations. Present coverage does not justify it as a primary project-wide layer.

The recommended immediate next step is a coordinated, address-validated geocoding pass paired with a narrow status/chronology normalisation audit—not renewed broad candidate discovery.
