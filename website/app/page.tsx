/// <reference types="vite/client" />

'use client';

import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import chapterConfig from '../../data/interim/chapter_map_states.json';
import operationsGeoJson from '../../data/mapbox/cinema_operations.geojson?raw';
import { MAPBOX_PUBLIC_TOKEN, MAPBOX_STYLE_URI } from '../js/config.js';

export const dynamic = 'force-static';

type MapInstance = any;
type Feature = { id?: string | number; properties?: Record<string, unknown>; layer?: { id: string }; geometry?: { type?: string; coordinates?: number[] } };
type OperationProperties = Record<string, unknown> & {
  operation_id: string; site_id: string; cinema_name: string;
  opening_year: number | null; closing_year: number | null; mall_name: string | null;
};
const operationData = JSON.parse(operationsGeoJson) as { features: { properties: OperationProperties }[] };
const operations = operationData.features.map(({ properties }) => properties);
type LegendPalette = {
  opening: string[];
  venue: Record<string, string>;
  highlight: { fill: string; stroke: string };
  siteCount: Array<{ fill: string; radius: number }>;
  continuity: string;
  selectedCase: { fill: string; stroke: string };
  current: Record<string, string>;
};
declare global { interface Window { mapboxgl?: any; __cinemaMap?: any } }

const emptyPalette: LegendPalette = {
  opening: [], venue: {}, highlight: { fill: '', stroke: '' }, siteCount: [], continuity: '', selectedCase: { fill: '', stroke: '' }, current: {}
};

function caseOutputs(expression: unknown) {
  if (!Array.isArray(expression) || expression[0] !== 'case') return [];
  const outputs: unknown[] = [];
  for (let index = 2; index < expression.length - 1; index += 2) outputs.push(expression[index]);
  outputs.push(expression.at(-1));
  return outputs;
}

function matchOutput(expression: unknown, key: string | number) {
  if (!Array.isArray(expression) || expression[0] !== 'match') return undefined;
  for (let index = 2; index < expression.length - 1; index += 2) {
    const candidate = expression[index];
    if (candidate === key || (Array.isArray(candidate) && candidate.includes(key))) return expression[index + 1];
  }
  return expression.at(-1);
}

function paintString(value: unknown) { return typeof value === 'string' ? value : ''; }
function paintNumber(value: unknown) { return typeof value === 'number' ? value : 5; }

function readLegendPalette(map: MapInstance): LegendPalette {
  const opening = caseOutputs(map.getPaintProperty('01_basic', 'circle-color')).slice(0, 5).map(paintString);
  const venueExpression = map.getPaintProperty('02_operations_venue_type', 'circle-color');
  const siteColors = caseOutputs(map.getPaintProperty('04_sites_operation_count', 'circle-color'));
  const siteRadii = caseOutputs(map.getPaintProperty('04_sites_operation_count', 'circle-radius'));
  const currentExpression = map.getPaintProperty('07_basic', 'circle-color');
  return {
    opening,
    venue: {
      standalone: paintString(matchOutput(venueExpression, 'Standalone cinema')),
      community: paintString(matchOutput(venueExpression, 'Community / new-town commercial centre')),
      mixed: paintString(matchOutput(venueExpression, 'Mixed-use cinema complex')),
      mall: paintString(matchOutput(venueExpression, 'Mall-integrated cinema')),
      other: paintString(Array.isArray(venueExpression) ? venueExpression.at(-1) : venueExpression)
    },
    highlight: {
      fill: paintString(map.getPaintProperty('03_operations_highlight', 'circle-color')),
      stroke: paintString(map.getPaintProperty('03_operations_highlight', 'circle-stroke-color'))
    },
    siteCount: [0, 1, 2].map((index) => ({ fill: paintString(siteColors[index]), radius: paintNumber(siteRadii[index]) })),
    continuity: paintString(map.getPaintProperty('05_continuity_cases', 'circle-color')),
    selectedCase: {
      fill: paintString(map.getPaintProperty('06_basic', 'circle-color')),
      stroke: paintString(map.getPaintProperty('06_basic', 'circle-stroke-color'))
    },
    current: {
      commercial: paintString(matchOutput(currentExpression, 'commercial')),
      independent_curated: paintString(matchOutput(currentExpression, 'independent_curated')),
      heritage_hybrid: paintString(matchOutput(currentExpression, 'heritage_hybrid')),
      institutional_curated: paintString(matchOutput(currentExpression, 'institutional_curated'))
    }
  };
}

function broadMapPadding() {
  const width = window.innerWidth;
  if (width < 700) return { top: 0, right: 0, bottom: 0, left: 0 };
  const left = width < 1050 ? Math.round(Math.min(150, width * .14)) : Math.round(Math.min(260, Math.max(160, width * .18)));
  return { top: 0, right: 0, bottom: 0, left };
}

function chapterOneFitPadding() {
  const width = window.innerWidth;
  const safetyMargin = 16;
  if (width < 700) return { top: 72 + safetyMargin, right: 24 + safetyMargin, bottom: 32 + safetyMargin, left: 24 + safetyMargin };
  const activePanel = document.querySelector<HTMLElement>('.story-step.is-active');
  const panelEdge = activePanel?.getBoundingClientRect().right ?? width * .42;
  return {
    top: 92 + safetyMargin,
    right: (width < 1050 ? 32 : 52) + safetyMargin,
    bottom: 52 + safetyMargin,
    left: Math.round(Math.min(width * .5, panelEdge + (width < 1050 ? 28 : 44) + safetyMargin))
  };
}

const steps = [
  ['opening_island', 'Opening', 'Where Would You Go Tonight?', 'Choosing a cinema has always meant choosing a place: a landmark downtown, a neighbourhood hall, a town-centre outing. This map follows how those choices changed across generations.'],
  ['c1_early_openings', 'Chapter 1 · 1930s–1940s', 'A Different City Every Night', 'The earliest documented openings gather around the central city and southern edge. They are opening dates, not a count of every cinema available at the time.'],
  ['c1_midcentury_expansion', 'Chapter 1 · 1950s–1960s', 'The map begins to widen', 'Post-war openings add new sites beyond that early core. The geography broadens one documented opening at a time.'],
  ['c1_1970s_1980s_wave', 'Chapter 1 · 1970s–1980s', 'The strongest documented wave', 'The largest opening band in this dataset belongs to the 1970s and 1980s, when cinemas became part of a growing everyday geography beyond the city centre.'],
  ['c1_full_chronology', 'Chapter 1 · 1990s–2026', 'Regional nodes arrive', 'Later openings appear across commercial and transport-connected nodes. The map records changing locations of entry, not a single history of replacement.'],
  ['c2_new_town_overview', 'Chapter 2', 'The documented 1970s–1980s new-town cinema wave', 'Queenstown, Toa Payoh, Ang Mo Kio and Boon Lay make the strongest mapped cluster of this period. Each is a documented example, not a claim that every new town followed the same path.'],
  ['c2_queenstown', 'Chapter 2 · Queenstown', 'Queenstown', 'A 1977 cinema-and-bowling-centre operation marks an early satellite-town setting. Its coordinate is retained at medium confidence and therefore remains visually subdued.'],
  ['c2_toa_payoh', 'Chapter 2 · Toa Payoh', 'Toa Payoh', 'Several high-confidence operations make this town-centre cluster especially legible: cinema-going was folded into a dense, walkable commercial routine.'],
  ['c2_ang_mo_kio', 'Chapter 2 · Ang Mo Kio', 'Ang Mo Kio', 'One high-confidence and two medium-confidence records point to a documented cluster at the town centre—evidence of a local cinema geography, with its uncertainty kept visible.'],
  ['c2_boon_lay', 'Chapter 2 · Boon Lay', 'Boon Lay', 'Savoy Cinema provides a high-confidence western example. Its address anchors this wave in another developing town, rather than only in the established centre.'],
  ['c2_new_town_return', 'Chapter 2 · pull back', 'A connected set of towns', 'Pulling back reconnects four documented clusters. The pattern supports a new-town wave without claiming that cinema-going was completely decentralised.'],
  ['c3_venue_type_overview', 'Chapter 3', 'Changing urban settings of cinema-going', 'Cinemas occupied more than one kind of setting: standalone theatres, community centres, mixed-use complexes and malls. These categories overlap rather than line up as a simple sequence.'],
  ['c3_standalone_focus', 'Chapter 3 · standalone settings', 'Changing urban settings of cinema-going', 'Cinemas occupied more than one kind of setting: standalone theatres, community centres, mixed-use complexes and malls. These categories overlap rather than line up as a simple sequence.'],
  ['c3_community_new_town_focus', 'Chapter 3 · community settings', 'Close to home', 'Community and new-town commercial centres are especially visible in the documented mid- to late-century records, placing a night at the movies within ordinary neighbourhood routines.'],
  ['c3_mixed_mall_focus', 'Chapter 3 · mixed-use and malls', 'New combinations of leisure', 'Later records include mall-integrated cinemas, alongside mixed-use formats. The pattern suggests changing emphasis, not the disappearance of every earlier setting.'],
  ['c3_venue_type_coexistence', 'Chapter 3 · return', 'More than one cinema geography', 'Seen together, the categories show coexistence: different building types and commercial settings carried cinema-going through different periods.'],
  ['c4_site_count_overview', 'Chapter 4', 'One Address, Many Lives', 'The map now groups documented cinema operations by physical address. Each point represents one site; its size shows how many distinct cinema operations are associated with that address.'],
  ['c4_repeated_sites_focus', 'Chapter 4 · repeated sites', 'Addresses that return', 'Most mapped sites have one documented operation. A smaller group have several; their larger points mark addresses whose cinema use can be followed through changing names, operators or configurations.'],
  ['c4_continuity_context', 'Chapter 4 · continuity cases', 'Cases with evidence to follow', 'This selected high-confidence subset supports closer reading of repeated or transformed cinema use—through a new entity, operator change, reopening, redevelopment or reconfiguration. It does not imply uninterrupted operation.'],
  ['c4_golden_mile_transition', 'Chapter 4 · one address', 'One address to follow', 'Golden Mile Tower (SGC-S-011) brings the citywide pattern down to one physical site. Golden Theatre, The Projector and Filmhouse are three distinct documented operations here—the sequence Chapter 5 follows next.'],
  ['c5_golden_mile_entry', 'Chapter 5 · Golden Mile Tower', 'One address, three cinema lives', 'From the citywide pattern, the map settles at 6001 Beach Road. Golden Mile Tower makes change legible at the scale of one building: the sequence that follows tracks three distinct operations at the same site, with changes in identity, operator, programming model and use of its cinema spaces.'],
  ['c5_golden_theatre', 'Chapter 5 · 1973', 'A cinema built into the tower', 'Golden Theatre opened with Golden Mile Tower’s podium in 1973. Developed by Chong Gay Theatres, its original single large auditorium formed part of a mixed-use complex; later subdivision created the spaces inherited by subsequent cinemas. This is the site’s first documented cinema operation, not the start of one uninterrupted entity.'],
  ['c5_the_projector', 'Chapter 5 · 2014/2015–2025', 'Old halls, a new curatorial model', 'The Projector was a distinct independent cinema operation in two former fifth-floor Golden Theatre halls. Its history records a 2014 founding or soft launch, while BiblioAsia places regular opening in January 2015; both claims remain in the project evidence. Original signs, floor lettering and repaired flip-up seats made adaptation visible until the operation closed on 19 August 2025.'],
  ['c5_filmhouse', 'Chapter 5 · 2026', 'Another operation enters the same rooms', 'Filmhouse opened on 3 February 2026 in The Projector’s former three-screen Level 5 premises. Its own FAQ identifies a new business entity under different ownership and management. The address and cinema space recur, but Filmhouse is not a rename of The Projector.'],
  ['ending_tonight', 'Ending', 'Where Would You Go Tonight?', 'Today’s 33 mapped exhibition spaces are the latest layer of a geography repeatedly rewritten: through new locations of entry, new-town expansion, changing building types and addresses that return to cinema in different forms. The routes now lead to commercial, independent, heritage and institutional venues—but the question is still spatial as much as cinematic: where would you go tonight?']
] as const;
const layers = chapterConfig.layer_ids as string[];
type MediaItem = { src: string; alt: string; caption: string; credit: string; href: string; position?: string; license?: { label: string; href: string; changes?: string } };
type SupportingMediaItem = Pick<MediaItem, 'src' | 'alt' | 'position'>;
type CaseMediaItem = MediaItem & { supporting?: SupportingMediaItem[]; supportingCredit?: string };
const media: Record<string, MediaItem> = {
  c1_early_openings: { src: '/media/capitol-c1950.jpg', alt: 'Capitol Theatre and Namazie Mansions at Stamford Road, circa 1950', caption: 'Capitol Theatre and Namazie Mansions at Stamford Road, c.1950.', credit: 'National Archives of Singapore, via BiblioAsia.', href: 'https://biblioasia.nlb.gov.sg/all-sections/vol-21-issue-4-jan-mar-2026-history-singapore-cinemas/' },
  c1_midcentury_expansion: { src: '/media/lido-1960s.jpg', alt: 'Lido Theatre and Shaw House at Orchard Road and Scotts Road in the 1960s', caption: 'Lido Theatre and Shaw House at Orchard Road and Scotts Road, 1960s.', credit: 'National Archives of Singapore, via BiblioAsia.', href: 'https://biblioasia.nlb.gov.sg/all-sections/vol-21-issue-4-jan-mar-2026-history-singapore-cinemas/' },
  c1_1970s_1980s_wave: { src: '/media/jurong-drive-in-1971.png', alt: 'Vehicles at Jurong Drive-In Cinema on its opening night in 1971', caption: 'Vehicles at Jurong Drive-In Cinema on opening night, 14 July 1971.', credit: 'Ministry of Information and the Arts Collection, National Archives of Singapore, via BiblioAsia.', href: 'https://biblioasia.nlb.gov.sg/all-sections/vol-21-issue-4-jan-mar-2026-history-singapore-cinemas/' },
  c1_full_chronology: {
    src: '/media/gv-yishun-2025.jpg',
    alt: 'Street view of the GV Yishun multiplex with its rocket-shaped facade detail',
    caption: 'GV Yishun, opened as Yishun 10 in 1992. Photographed on 11 September 2025.',
    credit: 'S5A-0043, via Wikimedia Commons',
    href: 'https://commons.wikimedia.org/wiki/File:(SGP-Singapore)_GV_Yishun_2025-09-11.jpg',
    license: { label: 'CC BY 4.0', href: 'https://creativecommons.org/licenses/by/4.0/', changes: 'Resized for web.' }
  },
  c2_queenstown: { src: '/media/queenstown-venus-golden-city.png', alt: 'Former Venus and Golden City Theatres at Margaret Drive in Queenstown', caption: 'Former Venus and Golden City Theatres at Margaret Drive; image date not stated.', credit: 'National Heritage Board, via Roots.', href: 'https://www.roots.gov.sg/places/places-landing/Places/landmarks/my-queenstown-heritage-trail/former-venus-golden-city-theatres' },
  c2_toa_payoh: { src: '/media/toa-payoh-kong-chian.jpg', alt: 'The former Kong Chian Cinema building at 600 Lorong 4 Toa Payoh', caption: '600@Toa Payoh, the former Kong Chian Cinema building; image date not stated.', credit: 'National Heritage Board, via Roots.', href: 'https://www.roots.gov.sg/places/places-landing/Places/surveyed-sites/600-at-Toa-Payoh-Former-Kong-Chian-Cinema' },
  c2_ang_mo_kio: { src: '/media/jubilee-amk-1994.png', alt: 'Jubilee Theatre in Ang Mo Kio Town Centre, 1994', caption: 'Jubilee Theatre in Ang Mo Kio Town Centre, 1994.', credit: 'National Archives of Singapore, via BiblioAsia.', href: 'https://biblioasia.nlb.gov.sg/all-sections/vol-21-issue-4-jan-mar-2026-history-singapore-cinemas/' },
  c2_boon_lay: { src: '/media/savoy-cinema-boon-lay.jpg', alt: 'Savoy Cinema building at Boon Lay', caption: 'Savoy Cinema, Boon Lay.', credit: 'Image source: Flight Sixty Five (WordPress).', href: 'https://flightsixtyfive.wordpress.com/2014/01/06/former-savoy-cinema-%e5%9b%9b%e6%b5%b7%e6%88%8f%e9%99%a2/' },
  c3_standalone_focus: { src: '/media/rex-cinemas-mackenzie.jpg', alt: 'The standalone Rex Cinemas building at 2 Mackenzie Road', caption: 'Rex Cinemas at 2 Mackenzie Road; image date not stated.', credit: 'National Heritage Board, via Roots.', href: 'https://www.roots.gov.sg/places/places-landing/Places/surveyed-sites/Rex-Cinemas' },
  c3_community_new_town_focus: {
    src: '/media/queenstown-cinema-bowling-centre-2006.jpg',
    alt: 'Facade of the former Queenstown Cinema and Bowling Centre with the Queensway and Queenstown theatre signs',
    caption: 'Former Queenstown Cinema and Bowling Centre, opened in 1977. Photographed in August 2006.',
    credit: 'Terence Ong, via Wikimedia Commons',
    href: 'https://commons.wikimedia.org/wiki/File:Former_Queenstown_Cinema.JPG',
    position: '50% 84%',
    license: { label: 'CC BY 2.5', href: 'https://creativecommons.org/licenses/by/2.5/' }
  },
  c3_mixed_mall_focus: {
    src: '/media/cineleisure-orchard-2005.jpg',
    alt: 'Cathay sign above the glass facade of Cineleisure Orchard on Grange Road',
    caption: 'Cathay Cineleisure Orchard on Grange Road, December 2005. The complex combined cinema screens, shops and dining.',
    credit: 'Sengkang, via Wikimedia Commons',
    href: 'https://commons.wikimedia.org/wiki/File:Cineleisure_Orchard,_Dec_05.JPG',
    position: '50% 55%',
    license: { label: 'Copyrighted free use', href: 'https://commons.wikimedia.org/wiki/File:Cineleisure_Orchard,_Dec_05.JPG#Licensing' }
  }
};
const caseMedia: Record<string, CaseMediaItem> = {
  c5_golden_mile_entry: { src: '/media/golden-mile-tower-darren-soh.jpg', alt: 'Golden Mile Tower and its distinctive cinema block', caption: 'Golden Mile Tower’s cinema block; image date not stated.', credit: 'Photograph by Darren Soh, via Docomomo Singapore.', href: 'https://www.docomomo.sg/modernist-100/golden-mile-tower', position: '50% 54%' },
  c5_golden_theatre: { src: '/media/golden-theatre-auditorium-1976.jpg', alt: 'Interior views of the original Golden Theatre auditorium in 1976', caption: 'Interior views of the Golden Theatre auditorium, 1976.', credit: 'Building Materials & Equipment, via Docomomo Singapore.', href: 'https://www.docomomo.sg/modernist-100/golden-mile-tower', position: '50% 48%' },
  c5_the_projector: { src: '/media/the-projector-redrum-2022.jpg', alt: 'An audience watching a screening in The Projector Redrum at Golden Mile Tower', caption: 'A screening in The Projector’s Redrum; image published 2022.', credit: 'The Projector, via CNA Lifestyle.', href: 'https://cnalifestyle.channelnewsasia.com/entertainment/projector-golden-mile-cathay-singapore-cinema-karen-tan-323951', position: '50% 50%' },
  c5_filmhouse: {
    src: '/media/filmhouse-foyer-2026.jpg',
    alt: 'Filmhouse foyer at Golden Mile Tower with retained Golden cinema signs',
    caption: 'Filmhouse foyer at Golden Mile Tower; image published August 2026.',
    credit: 'Filmhouse.',
    href: 'https://filmhouse.sg/details/',
    position: '50% 53%',
    supporting: [
      { src: '/media/filmhouse-author-photo01.jpg', alt: 'Entrance to a Filmhouse auditorium beneath the retained Golden cinema sign', position: '50% 38%' },
      { src: '/media/filmhouse-author-photo02.jpg', alt: 'Filmhouse corridor with restored red, blue and chrome interior details', position: '50% 52%' },
      { src: '/media/filmhouse-author-photo03.jpg', alt: 'Interior detail photographed at Filmhouse in Golden Mile Tower', position: '50% 50%' }
    ],
    supportingCredit: 'Additional photographs by author.'
  }
};

function clean(value: unknown, fallback = 'Not documented') {
  if (typeof value === 'number') return String(value);
  if (typeof value !== 'string' || value === '') return fallback;
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function operationPopup(p: Record<string, unknown>) {
  return `<h3>${clean(p.cinema_name)}</h3><p><b>Opening year:</b> ${clean(p.opening_year)}</p><p><b>Status:</b> ${clean(p.operation_status)}</p><p><b>Venue setting:</b> ${clean(p.venue_type_display)}</p><p><b>Operator:</b> ${clean(p.operator)}</p><p><b>Address:</b> ${clean(p.site_address)}</p><p class="confidence">Coordinate confidence: ${clean(p.geocode_confidence)}</p>`;
}

function popupHtml(feature: Feature, caseOperationId?: string) {
  const p = feature.properties ?? {};
  const layer = feature.layer?.id ?? '';
  const confidence = `<p class="confidence">Coordinate confidence: ${clean(p.geocode_confidence)}</p>`;
  if (p.space_id) return `<h3>${clean(p.name)}</h3><p><b>Current category:</b> ${clean(p.category)}</p><p><b>Operator / institution:</b> ${clean(p.operator_or_institution)}</p><p><b>Address:</b> ${clean(p.address)}</p>${confidence}`;
  if (p.operation_id) return operationPopup(p);

  if (layer === '06_basic' || layer === '06_glow') {
    const history = operations.filter((operation) => operation.site_id === p.site_id)
      .sort((a, b) => (a.opening_year ?? Infinity) - (b.opening_year ?? Infinity));
    const selectedOperation = history.find((operation) => operation.operation_id === caseOperationId);
    if (selectedOperation) return operationPopup(selectedOperation);
    const siteName = history.find((operation) => operation.mall_name)?.mall_name;
    const sequence = history.map((operation) => {
      const years = [operation.opening_year, operation.closing_year].filter((year) => year !== null).join('–');
      return years ? `${clean(operation.cinema_name)} (${years})` : clean(operation.cinema_name);
    }).join('<br>');
    return `<h3>${clean(siteName ?? p.site_name)}</h3><p><b>Address:</b> ${clean(p.address)}</p><p><b>Documented cinema operations (${clean(p.documented_operations_per_site)})</b><br>${sequence || clean(p.operation_names_summary)}</p>${confidence}`;
  }

  if (p.case_id) return `<h3>${clean(p.site_address)}</h3><p><b>Documented sequence</b><br>${clean(p.operation_sequence)}</p><p>${clean(p.continuity_note)}</p>${confidence}`;
  return `<h3>${clean(p.site_name, clean(p.address))}</h3><p><b>Documented cinema operations:</b> ${clean(p.documented_operations_per_site)}</p><p><b>Earliest opening year:</b> ${clean(p.earliest_verified_opening_year)}</p><p><b>Address:</b> ${clean(p.address)}</p><p>${clean(p.operation_names_summary)}</p><p>${clean(p.continuity_note, '')}</p>${confidence}`;
}

function LegendDot({ color, stroke, radius }: { color: string; stroke?: string; radius?: number }) {
  const style = {
    '--legend-color': color || 'transparent',
    '--legend-stroke': stroke || 'rgba(255,255,255,.42)',
    '--legend-size': radius ? `${Math.max(9, radius * 2)}px` : '10px'
  } as CSSProperties;
  return <i className="legend-dot" style={style} aria-hidden="true" />;
}

function LegendItem({ color, label, stroke, radius }: { color: string; label: string; stroke?: string; radius?: number }) {
  return <span className="legend-item"><LegendDot color={color} stroke={stroke} radius={radius} />{label}</span>;
}

function Legend({ name, palette }: { name: string; palette: LegendPalette }) {
  if (name.startsWith('venue_type')) return <><strong>Venue setting</strong><LegendItem color={palette.venue.standalone} label="Standalone" /><LegendItem color={palette.venue.community} label="Community / new-town" /><LegendItem color={palette.venue.mixed} label="Mixed-use" /><LegendItem color={palette.venue.mall} label="Mall-integrated" /><LegendItem color={palette.venue.other} label="Other / not classified" /></>;
  if (name.startsWith('new_town_wave')) return <><strong>Documented 1970s–1980s wave</strong><LegendItem color={palette.highlight.fill} stroke={palette.highlight.stroke} label="Highlighted new-town/community operation" /><small>Medium-confidence coordinates remain subdued.</small></>;
  if (name.startsWith('documented_operations')) return <><strong>Documented operations at this address</strong>{palette.siteCount.map((item, index) => <LegendItem key={index} color={item.fill} radius={item.radius} label={index === 2 ? '3+' : String(index + 1)} />)}</>;
  if (name === 'continuity_cases') return <><strong>Documented continuity cases</strong><LegendItem color={palette.continuity} label="Seven repeated-site cases" /></>;
  if (name === 'continuity_case_selected') return <><strong>Selected continuity case</strong><LegendItem color={palette.continuity} label="Golden Mile Tower" /></>;
  if (name === 'golden_mile_case') return <><strong>Selected continuity case</strong><LegendItem color={palette.selectedCase.fill} stroke={palette.selectedCase.stroke} label="Golden Mile Tower" /></>;
  if (name === 'current_exhibition_category') return <><strong>Current film exhibition</strong><LegendItem color={palette.current.commercial} label="Commercial" /><LegendItem color={palette.current.independent_curated} label="Independent curated" /><LegendItem color={palette.current.heritage_hybrid} label="Heritage hybrid" /><LegendItem color={palette.current.institutional_curated} label="Institutional curated" /></>;
  return <><strong>Documented opening year</strong><LegendItem color={palette.opening[0]} label="1930–1949" /><LegendItem color={palette.opening[1]} label="1950–1969" /><LegendItem color={palette.opening[2]} label="1970–1989" /><LegendItem color={palette.opening[3]} label="1990–2009" /><LegendItem color={palette.opening[4]} label="2010–2026" /><small>Medium-confidence coordinates use lower opacity.</small></>;
}

function ArchivalMedia({ item }: { item: MediaItem }) {
  return <figure className="archival-media">
    <img src={item.src} alt={item.alt} loading="lazy" style={{ objectPosition: item.position }} />
    <figcaption>
      <span>{item.caption}</span>
      <span>
        <a href={item.href} target="_blank" rel="noreferrer">{item.credit}</a>
        {item.license && <> · <a href={item.license.href} target="_blank" rel="noreferrer">{item.license.label}</a>{item.license.changes && ` · ${item.license.changes}`}</>}
      </span>
    </figcaption>
  </figure>;
}

function CaseMedia({ item }: { item: CaseMediaItem }) {
  const hasSupportingImages = Boolean(item.supporting?.length);
  return <figure className={`case-media ${hasSupportingImages ? 'has-gallery' : ''}`}>
    {hasSupportingImages ? <div className="case-media-gallery">
      <img className="case-media-primary" src={item.src} alt={item.alt} style={{ objectPosition: item.position }} />
      <div className="case-media-supporting">
        {item.supporting?.map((image) => <img key={image.src} src={image.src} alt={image.alt} style={{ objectPosition: image.position }} />)}
      </div>
    </div> : <img className="case-media-single" src={item.src} alt={item.alt} style={{ objectPosition: item.position }} />}
    <figcaption><span>{item.caption}</span><a href={item.href} target="_blank" rel="noreferrer">{item.credit}</a>{item.supportingCredit && <span>{item.supportingCredit}</span>}</figcaption>
  </figure>;
}

export default function Home() {
  const node = useRef<HTMLDivElement>(null); const mapRef = useRef<MapInstance | null>(null); const popupRef = useRef<any>(null); const hoveredFeatureRef = useRef('');
  const caseOperationIdRef = useRef<string | undefined>(undefined);
  const [ready, setReady] = useState(false); const [activeId, setActiveId] = useState('cover_island'); const [error, setError] = useState(''); const [legendPalette, setLegendPalette] = useState<LegendPalette>(emptyPalette); const [viewportWidth, setViewportWidth] = useState(0);
  const state = useMemo(() => chapterConfig.states.find((item) => item.id === activeId) as any, [activeId]);
  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth(); window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  useEffect(() => {
    const initialise = () => {
      if (!node.current || !window.mapboxgl || mapRef.current) return;
      window.mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;
      const map = new window.mapboxgl.Map({ container: node.current, style: MAPBOX_STYLE_URI, center: [103.825, 1.35], zoom: 10.5, padding: broadMapPadding(), attributionControl: true });
      map.addControl(new window.mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
      map.on('load', () => {
        const missing = layers.filter((id) => !map.getLayer(id));
        if (missing.length) setError(`Published style is missing configured layer${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`);
        else setLegendPalette(readLegendPalette(map));
        popupRef.current = new window.mapboxgl.Popup({ closeButton: false, closeOnClick: false, maxWidth: '280px', offset: 12 });
        mapRef.current = map; window.__cinemaMap = map; setReady(true);
      });
      map.on('error', (event: any) => {
        const message = event?.error?.message || 'The map could not load.';
        if (!/terrain|cutoff/i.test(message)) setError(message);
      });
      const closePopup = () => { popupRef.current?.remove(); hoveredFeatureRef.current = ''; map.getCanvas().style.cursor = ''; };
      const handlePointerMove = (event: any) => {
        const visible = layers.filter((id) => map.getLayer(id) && map.getLayoutProperty(id, 'visibility') !== 'none');
        if (!visible.length || !popupRef.current) { closePopup(); return; }
        const features = map.queryRenderedFeatures(event.point, { layers: visible }) as Feature[];
        const feature = features.find((item) => !item.layer?.id.endsWith('_glow')) ?? features[0];
        if (!feature) { closePopup(); return; }
        map.getCanvas().style.cursor = 'pointer';
        const properties = feature.properties ?? {};
        const recordId = properties.operation_id ?? properties.space_id ?? properties.case_id ?? properties.site_id ?? feature.id;
        const identity = `${feature.layer?.id ?? ''}:${clean(recordId, 'feature')}`;
        if (hoveredFeatureRef.current === identity) return;
        const coordinates = feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates) ? feature.geometry.coordinates.slice(0, 2) : [event.lngLat.lng, event.lngLat.lat];
        popupRef.current.setLngLat(coordinates).setHTML(popupHtml(feature, caseOperationIdRef.current)).addTo(map);
        hoveredFeatureRef.current = identity;
      };
      map.on('mousemove', handlePointerMove);
      map.on('mouseout', closePopup);
      map.getCanvasContainer().addEventListener('mouseleave', closePopup);
    };
    if (window.mapboxgl) initialise(); else { const timer = window.setInterval(() => { if (window.mapboxgl) { window.clearInterval(timer); initialise(); } }, 120); return () => window.clearInterval(timer); }
  }, []);
  useEffect(() => { if (ready && mapRef.current) { const map = mapRef.current; try {
    caseOperationIdRef.current = state.popup_operation_id;
    popupRef.current?.remove(); hoveredFeatureRef.current = ''; map.getCanvas().style.cursor = '';
    const active = new Set(state.active_layers as string[]);
    layers.forEach((id) => {
      if (!map.getLayer(id)) return;
      const hasStateFilter = Object.prototype.hasOwnProperty.call(state.filters ?? {}, id);
      const filterName = hasStateFilter ? state.filters[id] : (chapterConfig.default_filters as Record<string, string>)[id] ?? null;
      map.setFilter(id, filterName ? (chapterConfig.filters as any)[filterName] : null);
    });
    layers.forEach((id) => { if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', active.has(id) ? 'visible' : 'none'); });
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : state.transition.duration_ms;
    if (activeId.startsWith('c1_') && Array.isArray(state.bounds)) {
      map.fitBounds(state.bounds, { padding: chapterOneFitPadding(), bearing: state.bearing, pitch: state.pitch, duration, essential: false });
    } else {
      const isBroadMap = state.pitch === 0 && state.zoom <= 10.5;
      const camera = { center: state.center, zoom: state.zoom, bearing: state.bearing, pitch: state.pitch, padding: isBroadMap ? broadMapPadding() : { top: 0, right: 0, bottom: 0, left: 0 }, duration, essential: false };
      if (camera.duration === 0) map.jumpTo(camera); else if (state.transition.method === 'flyTo') map.flyTo(camera); else map.easeTo(camera);
    }
  } catch (reason: any) { setError(reason?.message || 'A chapter state could not be applied.'); } } }, [ready, state, viewportWidth]);
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-state-id]'));
    const chooseNearestStep = () => {
      const readingLine = window.innerHeight * .47;
      const visible = nodes.filter((el) => { const rect = el.getBoundingClientRect(); return rect.bottom > 0 && rect.top < window.innerHeight; });
      const nearest = visible.sort((a, b) => {
        const ar = a.getBoundingClientRect(); const br = b.getBoundingClientRect();
        return Math.abs(((ar.top + ar.bottom) / 2) - readingLine) - Math.abs(((br.top + br.bottom) / 2) - readingLine);
      })[0];
      if (nearest?.dataset.stateId) setActiveId(nearest.dataset.stateId);
    };
    const observer = new IntersectionObserver(chooseNearestStep, { threshold: [0, .16, .45, .72], rootMargin: '-10% 0px -18% 0px' });
    nodes.forEach((el) => observer.observe(el)); window.addEventListener('resize', chooseNearestStep); chooseNearestStep();
    return () => { observer.disconnect(); window.removeEventListener('resize', chooseNearestStep); };
  }, []);
  const label = state.map_label ?? '';
  const isCover = activeId === 'cover_island';
  const isTownSequenceLabel = activeId === 'c2_new_town_overview' || activeId === 'c2_new_town_return';
  const activeCaseMedia = caseMedia[activeId];
  return <main>
    <div className="map-shell" aria-label="Interactive map of documented Singapore cinema operations" data-active-state={activeId} data-active-layers={state.active_layers.join(',')}>
      <div ref={node} id="map" />
      <div className="cover-veil" aria-hidden="true" />
      <aside className={`legend ${isCover || !ready ? 'is-hidden' : ''}`} aria-hidden={isCover || !ready} aria-live="polite"><Legend name={state.legend} palette={legendPalette} /></aside>
      <div className={`map-label ${label ? 'is-visible' : ''} ${isTownSequenceLabel ? 'town-sequence-label' : ''} ${activeId.startsWith('c5_') ? 'case-label' : ''}`} aria-hidden={!label}>{label}</div>
      {activeCaseMedia && <CaseMedia key={activeId} item={activeCaseMedia} />}
      {error && <div className="map-error" role="alert">{error}</div>}
    </div>
    <div className="top-fade" aria-hidden="true" />
    <header className="masthead"><span>Singapore cinema geography</span><span className={`status ${ready ? 'is-ready' : ''}`}>{ready ? 'Documented sites and operations' : 'Loading map'}</span></header>
    <section className="intro" data-state-id="cover_island">
      <p className="eyebrow">A visual study of cinema, place and time</p>
      <h1>Singapore cinema geography</h1>
      <span>Where would you go tonight?</span>
      <p className="intro-copy">Follow documented cinema openings through changing urban settings, new-town clusters, and returning addresses.</p>
      <div className="scroll-cue" aria-hidden="true"><i />Scroll to begin</div>
    </section>
    <div className="story" aria-label="Scrollytelling chapters">
      {steps.map(([id, kicker, title, copy]) => <Fragment key={id}>
        <article className={`story-step ${activeId === id ? 'is-active' : ''} ${id.startsWith('c1_') ? 'chapter-one' : ''} ${id.startsWith('c2_') ? 'chapter-two' : ''} ${id.startsWith('c3_') ? 'chapter-three' : ''} ${id.startsWith('c4_') || id.startsWith('c5_') ? 'chapter-four' : ''} ${id === 'ending_tonight' ? 'ending-step' : ''}`} data-state-id={id} tabIndex={0}>
          <p className="kicker">{kicker}</p><h2>{title}</h2><p>{copy}</p>
          {media[id] && <ArchivalMedia item={media[id]} />}
        </article>
        {id === 'ending_tonight' && <aside className="ending-methodology" aria-label="Project scope, methodology and sources">
          <p className="methodology-label">About this map</p>
          <h3>Scope and sources</h3>
          <p className="closing-note">This project maps documented cinema operations at physical sites with high- or medium-confidence coordinates, and maps opening chronology where evidence permits. It is not a complete census. Unresolved sites are excluded from mapped analysis; medium-confidence coordinates remain explicitly uncertain. Current exhibition status reflects sources checked on 8 September 2026.</p>
          <div className="source-credits"><p>Sources and data credits</p><a href="https://biblioasia.nlb.gov.sg/all-sections/vol-21-issue-4-jan-mar-2026-history-singapore-cinemas/" target="_blank" rel="noreferrer">National Library Board · BiblioAsia and NewspaperSG</a><a href="https://www.roots.gov.sg/" target="_blank" rel="noreferrer">National Heritage Board · Roots</a><a href="https://www.nas.gov.sg/archivesonline/" target="_blank" rel="noreferrer">National Archives of Singapore</a><a href="https://shaw.sg/" target="_blank" rel="noreferrer">Official operator histories · Shaw Theatres</a><span>Specialist secondary sources are acknowledged in the research register.</span><span>Map data © Mapbox © OpenStreetMap</span></div>
        </aside>}
      </Fragment>)}
    </div>
  </main>;
}
