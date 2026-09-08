# Stage 2C — Targeted Address Resolution for Ungeocoded Verified Sites

Date completed: 2026-09-06  
Scope: only the ten sites marked `insufficient_address` at the end of Stage 2B. No candidate, operation, chronology, or venue-classification expansion was undertaken.

## Starting inventory and outcomes

| Site | Associated operation(s) | Starting historical address | Why Stage 2B could not geocode it | Stage 2C outcome |
|---|---|---|---|---|
| S016 | Paris Cinematograph | Malay Theatre, Victoria Street | Theatre/site has no documented street number or redevelopment identity. | Still unresolved. |
| S017 | Sultan Theatre | Chong Pang Road roundabout | Institutional evidence locates it at a former roundabout, not a surviving numbered building. | Still unresolved. |
| S018 | Oriental Theatre | New Bridge Road | Street-only reference; no securely evidenced historic building or redevelopment site. | Still unresolved. |
| S019 | Jubilee Theatre | North Bridge Road | Institutional sources identify the Raffles Hotel-annex/Jubilee Hall redevelopment but not a defensible point within it. | Still unresolved. |
| S020 | Galaxy Cinema | Geylang Road | Street-only historical wording. | Resolved high: The Galaxy, 32 Onan Road. |
| S026 | Ang Mo Kio Cinema | Ang Mo Kio Town Centre | District-level historical wording. | Resolved high: former premises identified as Big Mac Centre, 51 Ang Mo Kio Avenue 3. |
| S027 | Jubilee Cinema Ang Mo Kio | Ang Mo Kio Avenue 8 | Street-only historical wording. | Resolved medium: 61 Ang Mo Kio Avenue 8 / Jubilee Square building association. |
| S028 | New Crown Cinema | Ang Mo Kio Town Centre | District-level historical wording. | Resolved medium: 5 Ang Mo Kio Central 2 / Djitsun Mall building association. |
| S029 | New Town Cinema | Ang Mo Kio Town Centre | District-level historical wording. | Resolved medium: 5 Ang Mo Kio Central 2 / Djitsun Mall building association. |
| S030 | Savoy Cinema | Boon Lay | District-level historical wording. | Still unresolved: evidence says it was beside Boon Lay Shopping Centre, not which precise building or parcel. |

## Geocoding result

Five sites were accepted after address-first research:

- High confidence: S020 and S026. Both have a documented modern address/site identity and an exact Mapbox rooftop address result.
- Medium confidence: S027, S028 and S029. Their Mapbox results are rooftop addresses, but the historical-to-modern site relationship is supported by indirect building/redevelopment evidence rather than a direct historic numbered address. The confidence therefore remains medium.
- Still unresolved: S016, S017, S018, S019 and S030. No coordinate was assigned, including no street centroid or nearby unrelated POI.

The spatially usable count is now **28 of 35 sites (80.0%)**: 23 high-confidence and 5 medium-confidence. This falls short of the aspirational 30-site target, but retains the required evidence standard.

## Historical versus modern address handling

`sites.csv` now separates `historical_address`, `modern_geocoding_address`, `address_source_ids`, and `geocode_match_type`. The key redevelopment cases are:

- **S020:** historical Geylang Road; current building The Galaxy at 32 Onan Road. The Muslim Converts' Association’s history describes The Galaxy as a former cinema-cum-shopping centre.
- **S026:** historical Ang Mo Kio Avenue 3; current/redevelopment address 51 Ang Mo Kio Avenue 3 (Big Mac Centre / 51@AMK). The cinema-to-Big-Mac-Centre connection is a specialist local-history source, while the present address is independently confirmed by a government register.
- **S027–S029:** historic Ang Mo Kio town-centre records remain intact. Modern building-address values are geocoding aids, not retroactive historical addresses.

## Remaining uncertainty

The five unresolved sites require a stronger source that connects the cinema to a precise numbered building, parcel, or defensible redevelopment footprint. The present evidence is insufficient for Paris Cinematograph, Sultan Theatre, Oriental Theatre, Jubilee Theatre on North Bridge Road, and Savoy Cinema.

## Readiness decision

Spatial coverage is sufficient to begin **exploratory**, explicitly confidence-filtered mapping of the verified dataset. It is not sufficient to represent all 35 sites as geographically complete or to make precision-sensitive claims about the five unresolved historical locations. No Mapbox tileset, style, website, or final spatial interpretation was created.
