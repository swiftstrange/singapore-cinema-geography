# Pilot workflow

1. Select 12–15 deliberately varied operations; do not build the full candidate list.
2. Establish name, operation-era textual address, chronology, and type from Tier 1 sources where available, then Tier 2.
3. Record routine citations in source-ID columns and material/contested evidence in `evidence.csv`.
4. Do not geocode. Leave `latitude`, `longitude`, and geocoding fields blank/not started.
5. Produce `data/processed/pilot_coverage_report.csv` after validation. Counts distinguish verified, conflicting, and missing values.
6. Stop for review before expanding the dataset or producing Mapbox resources.

Preferred future numeric tileset candidates are time-aware seats and screens. If coverage is inadequate, use directly mappable numeric fields: years operating, documented-operation count per site, and active-cinema count by spatial unit/time slice. The database can later yield at least three tilesets: operation points, site points with operation count, and spatial/time-slice aggregates; none are created at this stage.
