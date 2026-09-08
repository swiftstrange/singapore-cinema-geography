# Stage 3B — Mapbox-Ready Feature and Layer Specification

Date: 2026-09-07  
Status: specification only. No GeoJSON, Mapbox tileset, Mapbox style, or website has been created.

## Design basis

The frozen spatial subset contains 35 verified operations at 28 sites: 24 sites have high-confidence coordinates and four have medium-confidence coordinates. Seven unresolved sites stay outside all spatial products. The map design must represent documented openings and site continuity, not a complete historic cinema market, closure trend, or citywide disappearance story.

## Proposed Mapbox tilesets

| Proposed dataset / tileset | Features | Geometry | Purpose | Primary chapter use |
|---|---:|---|---|---|
| `cinema_operations` | 35 operations | Point | One feature per spatially usable verified operation. Shows documented opening geography, chronological colour, venue context, and Chapter 3 filters. | Chapters 1–3 |
| `cinema_sites` | 28 sites | Point | One feature per physical site. Shows the number of documented cinema lives at an address. | Chapter 4 overview |
| `cinema_continuity_cases` | 6 repeated sites | Point | One feature per site with two or more documented operations, enriched with concise sequence and continuity information. | Chapter 4 case selection |

The third layer is intentionally not a duplicate of the operations data. It is a qualitative site-continuity product derived from the six repeated-address cases.

## 1. Cinema operations feature schema

Feature ID: `record_id`  
Geometry: Point from `site_longitude`, `site_latitude`  
Source: `data/processed/spatial_operations.csv`, enriched only from the frozen master operation/site fields needed below.

| Field | Type | Source / derivation | Required | Null handling | Styling / interaction purpose | Chapters |
|---|---|---|---|---|---|---|
| `record_id` | string | operation `record_id` | Yes | Never null | Feature ID, joins | 1–4 |
| `site_id` | string | operation `site_id` | Yes | Never null | Join to site / case layer | 1–4 |
| `cinema_name` | string | operation `name` | Yes | Never null | Popup label | 1–4 |
| `opening_year` | number | operation `opening_year` | No | One unknown value is omitted from colour scale and shown as “opening year not documented” | Quantitative colour | 1 |
| `opening_period` | string | Derived from `opening_year` | Yes | `unknown` for blank year | Chapter filter / legend | 1, 3 |
| `venue_type` | string | operation `venue_type` | Yes | Retain `unknown` | Evidence-level categorical value | 2, 3 |
| `venue_display` | string | Derived display vocabulary below | Yes | `other_or_unknown` | Legend / filter | 2 |
| `mall_based` | string | operation `mall_based` | Yes | Retain `unknown` | Popup and filter | 2 |
| `mall_name` | string | operation `mall_name` | No | Hide when blank | Popup | 2 |
| `operator` | string | operation `operator` | Yes | Display “operator not documented” for `unknown` | Popup | 1, 4 |
| `operation_status` | string | operation `operation_status` | Yes | Never null in frozen table | Cautious popup context only; not a closure-count layer | 1 |
| `closing_year` | number | operation `closing_year` | No | Hide when blank | Popup only; never aggregate | 1 |
| `site_address` | string | site canonical/historical address | Yes | Never null for spatial rows | Popup | 1–4 |
| `geocode_confidence` | string | site `geocode_confidence` | Yes | Never null | Confidence treatment | 1–4 |
| `new_town_focus` | string | Frozen analytical flag: `Toa Payoh`, `Ang Mo Kio`, `Queenstown`, `Boon Lay`, or `none` | Yes | `none` | Chapter 3 filter / label logic | 3 |

## 2. Cinema sites feature schema

Feature ID: `site_id`  
Geometry: Point from site longitude/latitude  
Source: `data/processed/spatial_sites.csv` plus frozen `site_derived_fields.csv` and repeated-site output.

| Field | Type | Source / derivation | Required | Null handling | Styling / interaction purpose | Chapters |
|---|---|---|---|---|---|---|
| `site_id` | string | site `site_id` | Yes | Never null | Feature ID / joins | 4 |
| `site_address` | string | site `canonical_address` | Yes | Never null | Label / popup | 4 |
| `historical_address` | string | site `historical_address` | No | Hide if blank or identical to site address | Popup | 4 |
| `modern_geocoding_address` | string | site field | No | Hide if blank | Contextual popup only | 4 |
| `documented_operations_per_site` | integer | frozen derived site field | Yes | Never null, range 1–3 | Quantitative feature size | 4 |
| `operation_names` | string | derived operation-name summary | Yes | Never null | Popup | 4 |
| `earliest_opening_year` | number | derived site field | No | Hide if absent | Popup / temporal context | 4 |
| `latest_opening_year` | number | derived site field | No | Hide if absent | Popup / temporal context | 4 |
| `continuity_case` | boolean | `true` where count is 2 or more | Yes | Never null | Filter / outline / link | 4 |
| `continuity_note` | string | repeated-site output/site notes | No | Hide if blank | Popup | 4 |
| `site_current_use` | string | site `site_current_use` | No | Hide when `unknown` | Present-day context | 4 |
| `geocode_confidence` | string | site field | Yes | Never null | Confidence treatment | 4 |

## 3. Continuity-case feature schema

Feature ID: `site_id`  
Geometry: Point copied from the corresponding spatial site  
Source: `data/analysis/repeated_sites.csv`, joined to the frozen spatial-site geometry.

| Field | Type | Required | Meaning / use |
|---|---|---|---|
| `site_id` | string | Yes | Feature ID and join key. |
| `site_address` | string | Yes | Case title / popup. |
| `operation_count` | integer | Yes | 2 or 3 documented operations; supports Chapter 4 emphasis. |
| `operation_sequence` | string | Yes | Concise documented operation sequence. |
| `opening_years` | string | Yes | Semicolon-separated chronology; preserves `unknown` rather than inventing a year. |
| `operators` | string | Yes | Known operators in sequence. |
| `venue_type_sequence` | string | Yes | Venue-setting continuity/change. |
| `continuity_note` | string | Yes | Redevelopment, reopening, co-location, rename, or rebuild clarification. |
| `evidence_strength` | string | Yes | Current repeated-site evidence classification; all present cases are `high`. |
| `geocode_confidence` | string | Yes | Spatial-confidence disclosure. |

## Quantitative layer 1: opening year controls operation colour

- **Field type:** number.
- **Mapped coverage:** 34/35 spatial operations (97.1%). One operation has an unknown opening year and receives a neutral “not documented” treatment.
- **Observed mapped range:** 1930–2017.
- **Recommended scale:** stepped historical classes, rather than continuous interpolation. The data represent discrete documented opening events, and the chapter argument uses historically meaningful waves rather than an implied smooth gradient.
- **Recommended bins:** `1930–1949`, `1950–1969`, `1970–1989`, `1990–2009`, `2010–2017`, plus `opening year not documented`.
- **Analytical question:** *When did this cinema enter the city?*

## Quantitative layer 2: documented operations per site controls site size

- **Field type:** integer.
- **Coverage:** 28/28 spatial sites.
- **Observed range:** 1–3 documented operations.
- **Recommended scale:** stepped sizes, not continuous scaling: `1`, `2`, and `3+` operations. The small, discrete range makes continuous interpolation visually misleading.
- **Legend / tooltip language:** “Documented cinema operations at this address in this dataset.” This must not be presented as a complete count of all historical cinema lives.
- **Analytical question:** *How many cinema lives has this address had?*

## Venue-type categorical layer

Raw frozen values and counts across the 35 spatial operations:

| Raw value | Count | Proposed display category |
|---|---:|---|
| `standalone` | 1 | Standalone cinema |
| `community/neighbourhood commercial centre` | 11 | Community / new-town commercial centre |
| `mixed_use_complex` | 10 | Mixed-use cinema complex |
| `mall_integrated` | 9 | Mall-integrated cinema |
| `other` | 1 | Other / not classified |
| `unknown` | 3 | Other / not classified |

The display layer therefore has five visible categories: **Standalone cinema**, **Community / new-town commercial centre**, **Mixed-use cinema complex**, **Mall-integrated cinema**, and **Other / not classified**. Merging `other` and `unknown` is justified because each is too sparse for a separate visual category and neither supports a more specific interpretation. No final colours are specified here.

## Chapter 3: new-town cinema-wave implementation

### Options evaluated

- **Option A — filter main operations layer:** use `opening_period` = `1970–1989` and `new_town_focus` values. This is the recommended implementation.
- **Option B — dedicated new-town subset tileset:** not recommended; it duplicates operation geometry and would make the Chapter 3 filter look like a separate dataset rather than an analytical view.
- **Option C — contextual town polygons / labels:** useful only if a reliable, appropriately licensed boundary or label source is added later. It is supplementary, not required for the initial implementation.

Use Option A, optionally with plain text labels for four named places. Highlight these frozen operation records:

| Focus | Operation records | Mapping confidence |
|---|---|---|
| Toa Payoh | SGC-O-016 Kong Chian (1972); SGC-O-017 Central (1987); SGC-O-018 Toa Payoh Cinema (1972) | High |
| Ang Mo Kio | SGC-O-032 Ang Mo Kio Cinema (1980); SGC-O-034 New Crown (1980); SGC-O-035 New Town (1980) | High for O032; medium for O034–O035 |
| Queenstown | SGC-O-008 Queenstown Cinema and Bowling Centre (1977) | Medium |
| Boon Lay | SGC-O-036 Savoy Cinema (1978) | High |

Jubilee Cinema Ang Mo Kio is excluded because its site remains unresolved. Venus and Golden City (both 1965) may be shown as earlier Queenstown context but do not belong in the strict 1970–1989 filter.

## Confidence handling

Retain `geocode_confidence` in every Mapbox product. Medium-confidence records are SGC-S-007 (Queenstown), SGC-S-023 (GV Jurong Point), SGC-S-028 (New Crown), and SGC-S-029 (New Town), corresponding to four operations in the operation layer.

Use a documented visual distinction for medium confidence—such as a different outline or reduced opacity—and disclose it in every relevant legend. Also retain a `high-only` filter for precision-sensitive views. Chapter 3 should label the two medium-confidence Ang Mo Kio records and the Queenstown record; none should silently appear equivalent to a high-confidence feature. The seven unresolved sites remain absent from all geometry products and are disclosed in method text, not fabricated as points.

## Chapter 4 qualitative-case support

| Site | Operations | Evidence / narrative value | Recommendation |
|---|---|---|---|
| SGC-S-009, 350 Orchard Road (Lido) | Lido Cineplex (1993) → Shaw Theatres Lido reimagining (2011) | Clear documented rebuild/reimagining, operator continuity, time-aware screens, high geocode confidence, and strong visual/architectural potential. | **Primary case candidate** |
| SGC-S-012, 600 Lorong 4 Toa Payoh | Kong Chian (1972) → Central (1987) | Dated reopening and neighbourhood/new-town context; directly links Chapter 3 to Chapter 4. | **Secondary case candidate** |
| SGC-S-008, 100 Beach Road (Shaw Towers) | Prince/Jade/Jade Classics | Rich three-operation hall/rebrand history, but needs careful explanation because it is co-location rather than simple succession. | Reserve / supporting case |
| SGC-S-013, 450 Lorong 6 Toa Payoh | Toa Payoh Cinema → Entertainment Centre | Strong transformation idea, but later opening chronology remains unknown. | Reserve / supporting case |
| SGC-S-003, 80 Eu Tong Sen Street | Queen's → Majestic | Clear historical successor/rename relationship, but venue type is not yet resolved. | Reserve / supporting case |
| SGC-S-033, 360 Balestier Road | Hoover → President | Strong site record, but documented relationship is shared-site/co-location rather than a simple replacement. | Reserve / supporting case |

## Popup content

### Operation popup

`cinema_name`; opening year or “not documented”; status and closing year only where recorded; display venue type; operator; site address; mall name when recorded; and a short geocode-confidence note.

### Site popup

Site address; documented operation count; operation names; earliest/latest documented opening year; one continuity/redevelopment note; present-day site use when documented; and geocode confidence.

### Continuity-case popup

Site address; operation sequence; opening-year sequence; operators; concise continuity note; and a link/identifier for the relevant qualitative chapter case. Do not expose source-register IDs or extensive research notes in the popup.

## Assignment requirement check

| Requirement | Specification response |
|---|---|
| At least 3 Mapbox tilesets | Operations (35), sites (28), continuity cases (6). |
| At least 4 progressive chapters | Opening/Chapter 1 uses operation chronology; Chapter 2 venue context; Chapter 3 filtered new-town opening wave; Chapter 4 site continuity and qualitative cases. |
| Two quantitative visual layers | `opening_year` controls operation colour; `documented_operations_per_site` controls site size. |
| Qualitative chapter | Chapter 4 uses continuity sequences, redevelopment notes, selected archival/visual research later, and the six-case layer. |
| Categorical layer distinguished from quantitative | `venue_type` is a categorical filter/legend only; it is not represented as a quantitative layer. |

## Exact GeoJSON exports for the next stage

| File | Source / filter | Expected features | Geometry | Mapbox use |
|---|---|---:|---|---|
| `data/mapbox/cinema_operations.geojson` | Frozen spatial operations; all `include_high` and `include_medium` records | 35 | Point | Operation chronology, venue, and Chapter 3 filtered view. |
| `data/mapbox/cinema_sites.geojson` | Frozen spatial sites; all `include_high` and `include_medium` sites | 28 | Point | Site-size layer and Chapter 4 overview. |
| `data/mapbox/cinema_continuity_cases.geojson` | Repeated-sites output joined to frozen spatial-site geometry | 6 | Point | Chapter 4 case-selection and qualitative continuity layer. |

## Approval-sensitive decisions for the next stage

The feature structure is ready. Before creating GeoJSON or Mapbox resources, obtain approval for: (1) final layer colours and marker-size values; (2) whether medium-confidence features use a visual distinction in every chapter or only in precision-sensitive views; and (3) whether a later licensed new-town polygon/label context layer is desirable. These choices do not change the frozen historical dataset.
