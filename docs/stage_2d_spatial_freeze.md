# Stage 2D — Final Geocoding Sanity Check and Spatial Data Freeze

Date frozen: 2026-09-06  
Scope: final consistency audit of the existing 35-site / 42-operation verified dataset. No new broad research, candidates, operations, tilesets, styles, or interpretation were undertaken.

## Corrections and audit decisions

### S030 Savoy Cinema

S030 is now `matched` with **high** confidence. The verified historical/site address is **90 Boon Lay Place, Singapore 649884**. Mapbox returned *90 Boon Lay Place Food Court* at the same street number and postcode (1.34745533, 103.71206559). The food court is recorded as present-day use of the redeveloped site, with match type `exact address / redeveloped site`.

### Ang Mo Kio sites

| Site | Final decision | Rationale |
|---|---|---|
| S026 Ang Mo Kio Cinema | Include high | Stored evidence connects the cinema premises to Big Mac Centre / 51 Ang Mo Kio Avenue 3; Mapbox returned the exact rooftop address. |
| S027 Jubilee Cinema Ang Mo Kio | Exclude unresolved | The stored evidence identifies Ang Mo Kio Avenue 8 but does not securely link the cinema to the previously accepted 61-address redevelopment building. The coordinate was removed. |
| S028 New Crown Cinema | Include medium | Documentary business-register evidence identifies 5 Ang Mo Kio Central 2; Mapbox returned the exact address, but the historic-to-modern relationship is not primary-source strength. |
| S029 New Town Cinema | Include medium | Same documented building association and confidence qualification as S028. |

No other obvious mismatch requiring a coordinate change was identified in the final audit. Historical and modern geocoding addresses remain separate where recorded.

## Frozen spatial state

| Classification | Sites | Share of 35 |
|---|---:|---:|
| `include_high` | 24 | 68.6% |
| `include_medium` | 4 | 11.4% |
| `exclude_unresolved` | 7 | 20.0% |
| Spatially usable total | 28 | 80.0% |

The unresolved sites are S014 Broadway Cinema / Broadway Plaza, S015 Jurong Drive-In Cinema, S016 Paris Cinematograph, S017 Sultan Theatre, S018 Oriental Theatre, S019 Jubilee Theatre on North Bridge Road, and S027 Jubilee Cinema Ang Mo Kio.

## Freeze outputs

- `spatial_sites.csv` contains the 28 high- and medium-confidence physical sites.
- `spatial_operations.csv` contains the 35 operations attached to those sites, with inherited site coordinates and site confidence.
- The complete master tables remain retained. Their `spatial_use` fields explicitly distinguish `include_high`, `include_medium`, and `exclude_unresolved`.

The frozen spatial dataset is ready for exploratory mapping, provided medium-confidence records remain distinguishable and the seven excluded sites are not represented as mapped locations.
