# Stage 6A — final narrative, qualitative content and editorial integration

## Final story structure

1. **Opening — Where Would You Go Tonight?**
2. **Chapter 1 — A Different City Every Night**
3. **Chapter 2 — Changing urban settings of cinema-going**
4. **Chapter 3 — The documented 1970s–1980s new-town cinema wave**
5. **Chapter 4 — One Address, Many Lives**
6. **Ending — Return to Where Would You Go Tonight?**

The site retains all 18 approved configuration-driven scroll states. Final copy
is concise and describes documented opening geographies and venue settings; it
does not claim a complete cinema census, a citywide decline, or a total
replacement of neighbourhood cinemas by malls.

## Approximate narrative word counts

| Section | Approximate words | Editorial role |
|---|---:|---|
| Opening | 55 | A present-day invitation into the historical map. |
| Chapter 1 | 110 | Documented opening geographies and the strongest opening wave. |
| Chapter 2 | 105 | Overlapping venue settings, not an ordinal progression. |
| Chapter 3 | 155 | The strongest mapped new-town finding and its confidence limits. |
| Chapter 4 | 75 | Address continuity and the Lido/Shaw House transformation. |
| Ending + methodology | 95 | Return to the opening question with a concise transparency note. |

## Chapter 4 case: Lido / Shaw House

Lido/Shaw House remains the appropriate primary case. It is the supported
two-operation sequence in the frozen dataset at 350 Orchard Road: a five-screen
Lido Cineplex in 1993 and the 2011 Shaw Theatres Lido reimagining. The latter
reopened after seven months with 11 halls and a 1,960-seat configuration. The
site narrative adds documented building context only: BiblioAsia records that
the original Lido Theatre and Shaw House were demolished in 1990 before the
present-day Shaw House and Lido cineplex were built.

## Integrated archival media

Three images are selectively embedded in story panels:

| Chapter | Image | Date | Institution / source |
|---|---|---|---|
| Chapter 1 | Capitol Theatre and Namazie Mansions at Stamford Road | c.1950 | National Archives of Singapore, presented by NLB BiblioAsia |
| Chapter 3 | Jubilee Theatre in Ang Mo Kio Town Centre | 1994 | National Archives of Singapore, presented by NLB BiblioAsia |
| Chapter 4 | Lido Theatre and Shaw House at Orchard Road and Scotts Road | 1960s | National Archives of Singapore, presented by NLB BiblioAsia |

The structured record, captions, source page and rights notes are in
`data/interim/qualitative_media_register.csv`.

## Source and attribution treatment

The ending contains reader-facing grouped credits for National Library Board /
BiblioAsia and NewspaperSG; National Heritage Board / Roots; National Archives
of Singapore; Shaw Theatres; specialist secondary sources; and Mapbox /
OpenStreetMap. Internal source IDs are not exposed.

Key pages used in the final copy:

- National Library Board, BiblioAsia, *A Century of Singapore's Cinemas*
  (2026): early cinema, new-town, Lido/Shaw House and archival-image context.
- Shaw Theatres, *Shaw Organisation, 1990*: Shaw House's 1993 completion and
  five-screen Lido Cineplex configuration.
- Shaw Theatres, *2011 Lido Theatre Reopen* (3 May 2011): seven-month
  reimagining, 11 halls, and 1,960 seats.
- National Heritage Board Roots records: site and venue context across the
  underlying verified dataset.

## Methodology and interface copy

The ending now states that the map uses verified cinema operations at physical
sites with high- or medium-confidence coordinates and maps opening chronology
where evidence permits. It states plainly that the dataset is not a complete
census, unresolved sites are excluded from mapped analysis, and medium
coordinates remain uncertain.

Chronological legend wording has changed from **2010–present** to **2010–2017**:
2017 is the latest mapped opening year in the frozen spatial subset. Popups now
use reader-facing labels such as **Opening year**, **Venue setting**, **Address**
and **Documented cinema operations**.

## Rights and deployment note

Each archival caption identifies the institution and links to its BiblioAsia
source page. The images are externally embedded for the local educational
prototype, not copied into the project. The displayed captions identify the
National Archives of Singapore as the courtesy source, but this is not itself a
licence grant: reproduction permission or the relevant institutional terms must
be confirmed before public deployment.

## Final-content validation

- The local build succeeds.
- Browser review confirms the Chapter 4 image, caption and source credit render
  within the narrative panel while the map remains visible.
- The Chapter 3/4 transitions, labels, legend changes and map cameras remain
  functional after content integration.
- No Mapbox tileset, style, state configuration or research dataset was changed.

## Deferred to the next stage

- Confirm public-use/reproduction permissions for all archival images.
- Final cross-device visual QA, including image crop checks on narrow screens.
- Any user-requested wording changes, citation format requirements or additional
  source-credit detail.
- Deployment.
