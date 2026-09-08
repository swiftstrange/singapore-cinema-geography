# Data dictionary

## Core principle

`operations` is the primary historical analytical table: one row represents one distinct cinema operation at a physical location. `sites` represents the location/building and is linked by `site_id`. A documented rename, operator change, closure/reopening, or material rebuild creates a new operation row; it is not silently merged.

Unknown categorical values are `unknown`; unknown numeric/date values are blank. Coverage reporting distinguishes `verified`, `conflicting`, `unknown_or_missing`, and `not_applicable`. A current/open operation has a not-applicable closure field, not a missing closure. Coordinates remain blank until a verified textual address is deliberately geocoded in a later stage.

## `sites.csv`

| Field | Meaning |
|---|---|
| `site_id` | Stable identifier, e.g. `SGC-S-001`. |
| `canonical_address` | Best-supported historical physical-address wording; it is not overwritten by a modern redevelopment address. |
| `address_variants` | Semicolon-separated historical spellings/building names. |
| `address_precision` | `full`, `street_number`, `street`, `district`, or `unknown`. |
| `site_identity_status` | `verified`, `uncertain`, or `unresolved`. |
| `historical_address` | Address wording associated with the historic cinema operation; blank where the canonical address already serves this role and has not required a Stage 2C distinction. |
| `modern_geocoding_address` | A present-day address used to locate a verified redevelopment or surviving building; never replaces `historical_address`. |
| `address_source_ids` | Semicolon-separated source IDs specifically supporting the historical/modern address relationship. |
| `latitude`, `longitude` | Coordinates only where a deliberate, audited Mapbox result has been accepted. |
| `geocode_status` | `matched`, `insufficient_address`, `ambiguous`, or `unresolved`. |
| `geocode_source`, `geocode_confidence` | Geocoder and assessed `high`, `medium`, or `low` confidence. |
| `geocode_match_type` | Nature of the accepted result, e.g. exact address, exact redevelopment address, or verified redevelopment/building association. |
| `spatial_use` | Spatial-freeze inclusion flag: `include_high`, `include_medium`, or `exclude_unresolved`. |
| `site_current_use` | Present-day physical use; distinct from historical operation status. |
| `site_source_ids` | Semicolon-separated routine-source IDs. |
| `site_notes` | Concise identity/current-use notes. |

## `operations.csv`

| Field | Meaning |
|---|---|
| `record_id` | Stable operation identifier, e.g. `SGC-O-001`. |
| `site_id` | Linked physical site. |
| `spatial_use` | Copied from the linked site during the spatial freeze; makes exclusion explicit in the complete master operations table. |
| `name`, `alternate_names`, `name_normalised` | Attested operation name, aliases, and matching-only normalisation. |
| `operator` | Named operator, or `unknown`. |
| `opening_date`, `closing_date` | Best available date in ISO format; blank when not resolved. |
| `opening_year`, `closing_year` | Year retained when full date is unavailable. |
| `date_precision` | `day`, `month`, `year`, `range`, or `unknown`. |
| `operation_status` | `open`, `closed`, `renamed`, `rebuilt`, `unknown`. |
| `predecessor_record_id`, `successor_record_id` | Explicit operation lineage, if evidenced. |
| `continuity_type` | `new_operation`, `rename`, `operator_change`, `reopening`, `rebuilt`, or `unknown`. |
| `address_as_reported` | Operation-era address wording. |
| `venue_type` | `standalone`, `mall_integrated`, `mixed_use_complex`, `community/neighbourhood commercial centre`, `other`, or `unknown`. Historical descriptive labels such as cineplex/multiplex belong in notes unless documentary evidence establishes a building-context type. |
| `mall_based` | `yes`, `no`, or `unknown`; never inferred from name. |
| `mall_name` | Evidenced mall/complex name only. |
| `screens`, `screens_as_of`, `screens_status` | Count, its reference year/date, and `verified`/`conflicting`/`not_reported`/`unknown`. |
| `seats`, `seats_as_of`, `capacity_reference_year`, `seats_status` | Capacity, its reference date/year, and status. `capacity_reference_year` duplicates the year component where that is the only temporal evidence. |
| `operation_source_ids` | Semicolon-separated routine-source IDs. |
| `confidence` | Overall `high`, `medium`, or `low`. |
| `research_status` | `pilot_verified`, `pilot_partial`, or `needs_review`. |
| `notes` | Brief non-evidentiary context and data limitations. |

## `evidence.csv`

Use evidence rows selectively, not for every routine field. Required for conflicting values; chronology; historically important classification; screens; seats; or uncertain site identity.

| Field | Meaning |
|---|---|
| `evidence_id`, `record_id`, `site_id` | Identifier and applicable operation/site. |
| `topic` | `chronology`, `screens`, `seats`, `classification`, `site_identity`, or `conflict`. |
| `field_name`, `claimed_value` | The supported or disputed field/value. |
| `source_id`, `verbatim_evidence` | Linked source and short evidence extract/paraphrase. |
| `claim_status` | `accepted`, `conflicting`, `unresolved`, or `contextual`. |
| `evidence_notes` | Scope, date, or interpretation constraint. |

## `sources/source_register.csv`

One row per source, with `source_id`, tier, organisation, title, publication date, stable URL/archive identifier, access date, source type, and notes.

## Confidence

`high`: direct Tier 1 support or convergent independent reliable sources. `medium`: one credible specialist source or well-supported indirect evidence. `low`: unresolved, ambiguous, or lead-only evidence. Contradictions remain in `evidence.csv`; they are never overwritten.

## `processed/continuity_cases.csv`

One row identifies an evidenced site-level continuity case selected for later interpretation. `case_priority` is `primary`, `secondary`, or `supporting`; it is an editorial selection flag, not a claim of historical importance. `operation_sequence` records distinct entities, while `continuity_note` states whether continuity is spatial, operational, or a documented rename/rebuild. It does not flatten distinct operations into a single cinema.

## `processed/current_exhibition_spaces.csv`

This is an independent present-day inventory, not a filter of the historical operations table. It includes stable locations with verified recurring or regular public screenings on the recorded `verified_date`. Its category is controlled: `commercial`, `independent_curated`, `heritage_hybrid`, or `institutional_curated`.

Required core fields identify the venue, operator/institution, category, address, coordinates, status, screening and programme patterns, building context, sources, source tier, verification date, and address/geocode confidence. `mapbox_returned_address`, `mapbox_match_type`, and `geocode_mismatch_note` preserve the actual Mapbox result and any discrepancy instead of overwriting the researched venue address. `map_include=yes` means the coordinate is suitable for a later current-exhibition map; it does not create a Mapbox resource.
