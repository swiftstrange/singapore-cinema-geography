# Stage 1D bulk-ingestion report

## Scope and integrity

This stage is a discovery and reconciliation layer only. The 36-row operations core and 30-row sites core were not altered. No coordinates, Mapbox resources, website files, or new verified core records were created.

## Raw-source result

| Source | Raw rows | Result |
|---|---:|---|
| Wikipedia: List of cinemas in Singapore | 122 | All visible current, defunct, and transfer/redevelopment-table rows transcribed to candidate_source_broadlist.csv. |
| BiblioAsia: A Century of Singapore's Cinemas | 9 | Explicitly named places/operations transcribed; narrative article, not a census. |
| Roots / NHB | 5 | Relevant place/site records transcribed. |
| Official current-operator lists | 5 | Explicit current-location listings transcribed. |
| Cinema Treasures Singapore listing | 0 | Listing reached, but the research surface did not expose a complete extractable paginated result set. No partial selective scrape was represented as complete. |
| **Total raw source rows** | **141** | Cross-source repetitions retained by design. |

The Wikipedia prose says 29 current and 149 defunct outlets. Its retrieved visible tables instead enumerate 29 current, 87 defunct and 6 transfer/redevelopment rows: 122 total. There is no continuation in the retrieved 367-line page. The 62-row difference is a source-internal limitation, not a gap filled by inference.

## Merged candidate inventory (pre-consolidation)

master_candidate_inventory.csv contains every ingested source row as a separate discovery record (141 rows). A conservative name-plus-reported-location comparison yields **136 textual candidate identities**. These are not asserted to be 136 distinct operations or sites: renamed theatres, transferred vendors, redevelopment sites, and same-name cinemas remain unresolved.

| Reconciliation status | Raw discovery rows |
|---|---:|
| already_verified | 37 |
| possible_same_site_operation | 7 |
| possible_duplicate | 1 |
| needs_verification | 96 |
| unresolved / excluded | 0 |

The 37 matched rows point to the existing core rather than creating records. They represent roughly 25 existing operation identities and 22 existing sites after repeated cross-source references and multi-operation sites are recognised. This is a matching aid, not a re-verification pass.

## What the broad list makes visible

- **Temporal range:** reported openings span the 1900s through 2026; source coverage is densest after 1970, especially 1980s-2000s new-town and multiplex records.
- **Geographic range:** central-city/Rochor/Outram/Geylang/Kallang sit alongside Queenstown, Toa Payoh, Ang Mo Kio, Bedok/Tampines/Pasir Ris/Changi, Jurong, Clementi, Woodlands/Sembawang/Yishun, Punggol/Sengkang, Bukit Batok/Choa Chu Kang and Hougang/Kovan.
- **Overlap clusters for later review:** Lido; Cathay; Rex; Majestic/Queen's; Prince/Jade/Shaw Tower; Golden Mile Tower; Balestier (Hoover/President); Queenstown/Venus/Golden City; Toa Payoh; Ang Mo Kio (Broadway/Jubilee/New Town/New Crown); Clementi (Empress/321); and mall/operator handovers at Causeway Point, Century Square, Cineleisure, Jem, Downtown East, West Mall and Yishun 10.

## Estimated scale—not an asserted final count

The source list mixes buildings, outlets, individual theatres and later operator handovers, so it cannot yet produce a defensible final operation/site total. The 136 textual candidates are a **verification workload**, not the population. A provisional planning envelope is roughly **105-125 probable operation histories** at **90-110 possible physical sites**, subject to address and continuity review.

## Core gaps to address next

1. Reconcile against a complete Cinema Treasures extraction when an accessible page-by-page export becomes available.
2. Resolve rename/reopening and site-sharing clusters before counting operations or sites.
3. Verify historical street addresses with institutional/archival sources; broad-list areas are not geocodable addresses.
4. Treat reported screens, seats and tenure as source claims requiring date/configuration review, not final quantitative fields.
5. Preserve the two pre-existing unresolved geocodes (Broadway Plaza and Jurong Drive-In); this stage did not revisit them.
