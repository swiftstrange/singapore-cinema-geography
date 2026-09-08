# Stage 3A — Exploratory Spatial Analysis and Story-Pattern Testing

Date: 2026-09-07  
Dataset: frozen spatial subset of 35 operations at 28 sites (24 high-confidence sites; 4 medium-confidence sites). Seven unresolved sites remain excluded. This is exploratory analysis of verified openings, not a census of all cinemas active in any historical year.

## Temporal distribution of mapped openings

The practical bins reflect the observed mapped opening years. One spatially included operation has no opening year and is reported separately rather than assigned to a period.

| Opening period | Operations | Mapped sites | Confidence observation |
|---|---:|---:|---|
| 1930–1949 | 4 | 3 | All high confidence. |
| 1950–1969 | 4 | 4 | All high confidence. |
| 1970–1989 | 11 | 9 | 8 high-confidence operations; 3 medium-confidence operations. |
| 1990–2009 | 10 | 10 | 9 high-confidence operations; 1 medium-confidence operation. |
| 2010–present | 5 | 5 | All high confidence. |
| Unknown opening year | 1 | 1 | Included spatially, not chronologically binned. |

The strongest temporal feature is the 1970–1989 wave: it is the largest mapped opening bin and is dominated by community/neighbourhood commercial-centre records. This is consistent with a distinct documented new-town cinema geography, but it is not evidence of the complete number of cinemas available at the time.

## Venue-type transformation

The cross-tab is in `venue_type_by_period.csv`. Its most important observations are:

- 1930–1949 is heterogeneous and partly unclassified: one `other`, one mixed-use complex, and two unknowns.
- 1950–1969 has three community/neighbourhood commercial-centre operations and one mixed-use complex.
- 1970–1989 has eight community/neighbourhood operations and three mixed-use operations.
- 1990–2009 is mixed: six mall-integrated, two mixed-use, one standalone, and one unknown operation.
- 2010–present includes three mall-integrated and two mixed-use operations.

This supports a change in the mix of documented venue settings, rather than a simple mall/non-mall replacement. Mixed-use complexes persist into the latest period. The later mall share is also affected by deliberate sampling that strengthened mall examples, so it cannot be treated as a population proportion.

## Repeated cinema sites

Six spatially included sites have two or more documented operations; only S008 has three. They are all high-confidence sites.

| Site | Operations | Interpretation |
|---|---:|---|
| 80 Eu Tong Sen Street | 2 | Queen's/Majestic is a documented post-war successor/rename case. |
| 100 Beach Road | 3 | Co-located Shaw hall and rebrand history, not a simple succession. |
| 350 Orchard Road | 2 | Lido’s 1993 and 2011 configurations demonstrate rebuilding/reimagining at one address. |
| 600 Lorong 4 Toa Payoh | 2 | Kong Chian/Central is a reopening within the documented neighbourhood-commercial site. |
| 450 Lorong 6 Toa Payoh | 2 | Cinema-to-entertainment-centre reconfiguration, although the later operation’s opening year is unresolved. |
| 360 Balestier Road | 2 | Hoover/President were documented at the former-theatre site, now Shaw Plaza. |

These sites form a small but meaningful case-study set. They are not numerous enough to establish a citywide repeated-site spatial cluster.

## Hypothesis tests

| Hypothesis | Result | Evidence and limitation |
|---|---|---|
| H1: openings became geographically decentralised | **PARTIALLY SUPPORTED** | Later records include northern, north-eastern, eastern and western commercial/new-town nodes, while early mapped records are more central/southern. Incomplete historical address coverage and purposive sampling prevent a stronger citywide claim. |
| H2: 1970s–1990s show a distinct new-town cinema geography | **SUPPORTED** | The 1970–1989 wave has eight community/neighbourhood operations out of 11, with Toa Payoh, Ang Mo Kio, Queenstown and Boon Lay examples; later 1990s records add Yishun, Bishan, Jurong and Tampines. |
| H3: later development is more mall-integrated | **PARTIALLY SUPPORTED** | Mall-integrated records account for 6/10 openings in 1990–2009 and 3/5 in 2010–present, but mixed-use formats persist and sampling deliberately includes several malls. |
| H4: some sites show strong continuity | **SUPPORTED** | Six repeated sites document successor, rebuild, reopening, co-location, or rebrand relationships. |
| H5: modern cinema geography is concentrated into fewer and larger nodes | **CANNOT TEST WITH CURRENT DATA** | The dataset does not provide a complete contemporary active-cinema census or reliable comparable screens/seats coverage; closing/status chronology is incomplete. |

## Confidence sensitivity

High-only analysis retains the broad H1, H2, H3 and H4 results. Excluding medium-confidence sites removes Queenstown Cinema, GV Jurong Point, New Crown Cinema and New Town Cinema. This reduces the apparent scale of the Ang Mo Kio and Jurong examples, but does not reverse the documented 1970s–1980s new-town wave or the later mall/mixed-use pattern. No major interpretation depends solely on medium-confidence points.

## Chapter implications

| Proposed chapter | Data support | Appropriate driver | Recommendation |
|---|---|---|---|
| Opening — *Where Would You Go Tonight?* | Partial | Opening-year point map and selected site examples | Keep as an invitation, but do not imply a complete choice set for any single year. |
| Chapter 1 — *A Different City Every Night* | Partial | Opening-period colour map and temporal bins | Keep the idea but narrow its claim to documented opening geographies; a title such as *Cinema Opens into New Towns* would be more precise. |
| Chapter 2 — *The Map Changes, but Some Addresses Return* | Strong | Repeated-sites layer plus `documented_operations_per_site` | Keep; it is directly supported by six repeated mapped sites. |
| Chapter 3 — *Where Did the Night Go?* | Weak | Present-day use and selected redevelopment cases only | Change: incomplete closures do not support a citywide decline/disappearance chapter. Reframe as *Changing Venue Settings* or *Afterlives of Cinema Sites*. |
| Chapter 4 — *One Address, Many Lives* | Strong but overlaps Chapter 2 | Detailed site case studies and continuity notes | Keep as the close-reading/case-study chapter, while Chapter 2 remains the map-scale overview. |

## Quantitative and categorical layers

1. **`opening_year` → feature colour.** This is the strongest chronological field: 34 of 35 spatial operations have a year. It visualises documented opening waves and supports temporal comparison without using unreliable closure totals.
2. **`documented_operations_per_site` → feature size.** This is a fully derivable relational metric for each site. It identifies addresses with multiple documented cinema lives, while being labelled clearly as a dataset count rather than a complete historical total.

The strongest categorical layer is **`venue_type`**, interpreted together with `mall_based` and `mall_name` where documented. It supports the new-town/community, mixed-use, and mall-integrated comparison. For case-study chapters, `continuity_type` and redevelopment/current-use notes are the strongest qualitative companions.

## Recommended story structure

1. Opening: an exploratory opening-year map with confidence visible.
2. Documented opening geographies: early central/southern records, the 1970s–1980s new-town wave, and later regional commercial nodes.
3. Changing venue settings: community/neighbourhood, mixed-use, and mall-integrated formats as overlapping rather than replacement categories.
4. Returning addresses: a map-scale repeated-site layer followed by focused cases at Lido, Toa Payoh, Shaw Towers, and Balestier.
5. Short methodological note: unresolved sites and incomplete closure chronology limit claims about disappearance or market concentration.

## Next step

Prepare a Mapbox-ready GeoJSON/data schema from the frozen `spatial_sites.csv` and `spatial_operations.csv`, including `spatial_use`, `geocode_confidence`, `opening_year`, `documented_operations_per_site`, venue fields, and repeated-site identifiers. Do not create Mapbox resources until the map specification is approved.
