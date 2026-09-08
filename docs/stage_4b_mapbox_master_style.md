# Stage 4B — Mapbox master style record

## Approved resource

- Style name: `Singapore Cinema Geography`
- Owner: `strange1989`
- Style ID: `cmtq74ywn00g801r2gri5d7v0`
- Style URI: `mapbox://styles/strange1989/cmtq74ywn00g801r2gri5d7v0`
- Visibility: private
- Persistent published style: yes
- Additional Mapbox styles or tilesets created in Stage 4B: none

The style uses only the three existing published Stage 4A tilesets. Mapbox Studio internally names the style sources with their full tileset URIs; the displayed friendly labels are cinema_operations, cinema_sites, and cinema_continuity_cases.

| Dataset | Tileset URI | Published vector source layer |
|---|---|---|
| Cinema operations | `mapbox://strange1989.k7sgtzdhwl42` | `92a301efdab2e0544d5e` |
| Cinema sites | `mapbox://strange1989.bz0cuqrwxaee` | `584d3d6339eb7d64f78d` |
| Continuity cases | `mapbox://strange1989.0oxt98o5dqfe` | `fdcb78ae177016b95d2c` |

## Basemap

Mapbox Standard is imported with the night preset. Points of interest, road labels, and 3D objects are hidden; transit and place labels remain visible. This leaves the historical points legible without treating the basemap as evidence.

## Custom layers

| ID | Purpose | Source | Default state |
|---|---|---|---|
| `01_operations_opening_year` | Opening-year chronology | cinema operations | visible |
| `02_operations_venue_type` | Venue-context comparison | cinema operations | hidden |
| `03_operations_highlight` | Chapter-selected operation | cinema operations | hidden |
| `04_sites_operation_count` | Documented operations per site | cinema sites | hidden |
| `05_continuity_cases` | Continuity/redevelopment cases | continuity cases | hidden |
| `06_case_highlight` | Chapter-selected continuity case | continuity cases | hidden |

## Visual encodings

### Opening chronology

`01_operations_opening_year` uses a stepped, non-rainbow sequence: unknown `#7E7882`; before 1950 `#B78A5D`; 1950–1969 `#D7A95F`; 1970–1989 `#D7A95F`; 1990–2009 `#DD754D`; 2010 onward `#F1D6A7`. The application can later use opening-year filters without changing this style.

### Venue context

`02_operations_venue_type` maps the exported `venue_type_display` values: standalone `#C78B61`; community/new-town commercial centre `#D6A85D`; mixed-use cinema complex `#A77E9E`; mall-integrated `#6FA4A1`; other or unknown `#85808A`.

### Continuity and quantitative encodings

`04_sites_operation_count` uses discrete circle radii of 4, 7, and 10 pixels for one, two, and three-or-more documented operations at a site. `05_continuity_cases` uses 10, 8, and 6 pixels for primary, secondary, and supporting cases. Highlight layers use warm pale fill with a contrasting outline and remain filtered to placeholder values until Stage 4C supplies a chapter selection.

Medium-confidence features are retained but subdued: operations use opacity 0.58 (otherwise 0.90); site counts use 0.45 (otherwise 0.72).

## Verification

The final style was retrieved and validated against the Mapbox style specification: six layers, three sources, no validation errors or warnings, private visibility, and non-draft status. A fresh Studio preview loaded at Singapore-wide extent with only `01_operations_opening_year` visible; the five optional analytical/highlight layers were confirmed off by default. Source bindings were also checked in Studio’s source selector.

## Deferred to Stage 4C

No story chapters, Mapbox styles, tilesets, or websites beyond this single master style were created. Stage 4C remains responsible for exact camera choreography, chapter-specific filters/highlights, and any presentation decisions around popups or labels.
