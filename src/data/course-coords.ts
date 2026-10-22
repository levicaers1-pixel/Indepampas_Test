/**
 * Pre-computed coordinates for the rated courses, keyed by course id.
 *
 * The map used to geocode every rated course in each new visitor's browser (one
 * Google Places request per course, cached only in that browser's localStorage).
 * These coordinates make that unnecessary. Courses that are not listed here still
 * fall back to geocoding in the browser (see CoursesMap.tsx), so a newly rated
 * course keeps working; add its id and coordinates below to make it free as well.
 *
 * Generated 2026-10-22 from the live site's geocode cache and checked against the
 * database (the same 78 rated courses) and rough country bounding boxes.
 */
export type CourseCoord = { lat: number; lng: number };

export const COURSE_COORDS: Record<string, CourseCoord> = {
  "9b85a35d-cd55-46af-88d1-742513db2b17": { lat: 51.296221, lng: 4.516873 }, // Brasschaat Open Golf & Country Club
  "55f7d270-663f-4090-929a-b3e80b4f7115": { lat: 51.138281, lng: 4.363924 }, // Cleydael Golf & Country Club
  "ea2facb4-3a51-44ec-b3f2-076c1117587c": { lat: 51.154757, lng: 4.417349 }, // Edegemse Golfclub - Drie Eycken
  "a9c240e8-f60e-4df3-a244-e71898f3cbcd": { lat: 50.346459, lng: 5.349848 }, // Five Nations Golf Club
  "9b439be6-36a7-48a0-a8ef-77af126d1748": { lat: 50.934912, lng: 4.57519 }, // Golf & Business Club Kampenhout
  "fbc5f2c1-b6a1-4042-844d-8ee9a758382d": { lat: 50.622329, lng: 4.296073 }, // Golf Château de la Tournette
  "6eba5f5e-2450-4aac-9468-afbb160cdb6a": { lat: 51.262416, lng: 4.282701 }, // Golf Club Beveren
  "23eefb3e-b80a-48a2-909d-78e58b87b3db": { lat: 50.937869, lng: 5.37287 }, // Golf Club Hasselt
  "c7dd31e7-a197-42e2-949f-7078684c2167": { lat: 50.545479, lng: 4.499098 }, // Golf Club La Bruyère
  "57e4c4eb-4bb0-41a6-9c57-368508b3442e": { lat: 51.129534, lng: 4.838844 }, // Golf Club Witbos
  "b3d35330-3b6e-46a5-860b-d56dc514c3fa": { lat: 50.684907, lng: 4.047612 }, // Golf Club d'Enghien
  "90fd5826-6e52-40ce-bad9-072148e151b3": { lat: 50.682557, lng: 4.61157 }, // Golf Club de Louvain-la-Neuve
  "497427c6-8a0b-4d8a-bd7a-63f7ddaf796b": { lat: 50.551515, lng: 4.437827 }, // Golf Club de Pierpont
  "d5f849b0-8b70-4ea5-bb94-0f17e9925876": { lat: 50.385864, lng: 4.8666 }, // Golf Club de Rougemont
  "629d929e-179a-432b-95a1-44bbea46a35d": { lat: 50.719399, lng: 4.34385 }, // Golf Club de Sept Fontaines
  "e3757d62-e8e5-46d0-ae47-01b8b6f2ce7c": { lat: 50.339612, lng: 5.500725 }, // Golf de Durbuy
  "016b5cc5-b928-4242-884e-936c3c6ada9b": { lat: 50.503601, lng: 4.670381 }, // Golf de Falnuée
  "2e4cf7a5-3707-4883-bf98-06e2a77d7054": { lat: 50.566552, lng: 4.527866 }, // Golf de Rigenée
  "7126111a-87af-4723-87f4-ce1db74e19a5": { lat: 50.633585, lng: 4.476924 }, // Golf de l'Empereur
  "df2bbd6b-7a34-42d5-b58f-908ef950fa2c": { lat: 50.198333, lng: 5.014266 }, // Golf du Château Royal d'Ardenne
  "c9572382-ceaa-425e-89f3-dcbad1be1a98": { lat: 50.730909, lng: 4.599451 }, // Golf du Château de la Bawette
  "e8d7b6a2-3f16-468f-be37-10e9d5a9e58e": { lat: 50.633804, lng: 4.389957 }, // Hulencourt Golf Club
  "d262dd23-ca94-42ba-9ac2-5530da16bfb0": { lat: 51.115002, lng: 2.69725 }, // Koksijde Golf ter Hille
  "890159b4-d3c2-4a8a-935d-eebd473951bb": { lat: 51.05212, lng: 5.149856 }, // Millenium Golf
  "fb2fc397-29e3-4867-b5fb-5db5b7908209": { lat: 51.281363, lng: 4.576202 }, // Rinkven Golf & Country Club
  "d28b2ad5-046f-4691-8965-e334cb01b9e7": { lat: 51.345852, lng: 4.460888 }, // Royal Antwerp Golf Club
  "f3001a49-7a72-47c1-be47-3fedd77e001a": { lat: 50.813846, lng: 4.486291 }, // Royal Golf Club Belgium Ravenstein
  "9aa48f7b-0c36-41b3-8be6-f952a8096387": { lat: 50.718574, lng: 4.674832 }, // Royal Golf Club Bercuit
  "3b6cc937-a112-480f-8765-688bcfd50bb5": { lat: 51.002642, lng: 4.669534 }, // Royal Golf Club Keerbergen
  "0ad290ad-2491-47d0-af6a-10efaa4570c5": { lat: 50.8244, lng: 3.55432 }, // Royal Golf Club Oudenaarde
  "63fd6af5-8766-43e8-a13a-a463cc2a1a24": { lat: 50.506205, lng: 3.927951 }, // Royal Golf Club du Hainaut
  "a06e0a82-68f9-4890-b341-0c7b28766687": { lat: 51.014997, lng: 3.6182 }, // Royal Latem Golf Club
  "41559ec3-77a0-41f7-9c36-608927fd6651": { lat: 51.022228, lng: 5.434639 }, // Royal Limburg Golf Club
  "3a2b8503-3956-4920-a891-879f96b3c728": { lat: 51.269167, lng: 3.014167 }, // Royal Ostend Golf Club
  "e2bfc633-8acf-4c47-b560-b85e98bbf598": { lat: 51.21269, lng: 4.502254 }, // Royal Ternesse Golf Club
  "c342e3a7-a460-485b-b541-e4e2c50f55dc": { lat: 50.692263, lng: 4.447631 }, // Royal Waterloo Golf Club
  "0a2a2161-c058-426c-b93e-5e57231162f2": { lat: 51.344111, lng: 3.3052 }, // Royal Zoute Golf Club
  "048e51f3-c218-4bfd-854d-ae387866ed50": { lat: 50.970066, lng: 5.555723 }, // Spiegelven Golf Club
  "16d5692e-11cf-4910-9f29-5404d5b36e9c": { lat: 51.287765, lng: 5.220828 }, // Steenhoven Golf & Country Club
  "f18f5108-c59d-4b6e-988c-38fdced96e18": { lat: 50.841541, lng: 4.512874 }, // The National Golf Brussels
  "8e9f64b6-3a6b-4928-9462-a54e735840eb": { lat: 46.506702, lng: -0.339728 }, // Golf Bluegreen Mazières-en-Gâtine
  "1533a472-e9bf-47b0-b9b7-55375ec83bc7": { lat: 47.272401, lng: 4.48976 }, // Golf Château de Chailly
  "c1956514-21e5-49c6-bf98-a5fa2c22a816": { lat: 45.677972, lng: -0.248502 }, // Golf Du Cognac
  "6a441208-af71-4557-b245-c0ffac603bde": { lat: 43.960361, lng: 4.886913 }, // Golf Grand Avignon
  "bcfff0cd-f006-4aa7-9a0a-f84e3414d87c": { lat: 43.706163, lng: 5.209978 }, // Golf International Pont Royal
  "34354085-937f-40ea-97ab-cb89848928f0": { lat: 43.657477, lng: -1.425261 }, // Golf d'Hossegor
  "d690fad0-f853-4b4d-8e35-c0fc86c7fc16": { lat: 49.704416, lng: 0.198991 }, // Golf d'Ètretat
  "a94098cb-6497-424c-8ee4-f8c233d08665": { lat: 43.513117, lng: -1.52443 }, // Golf de Chiberta
  "7f5d7cd9-63e0-4977-83e1-bf0d8d0619b4": { lat: 46.220689, lng: -1.152969 }, // Golf de La Prée La Rochelle
  "702899cb-6825-49a8-898f-e14075d9b8f7": { lat: 43.844581, lng: -1.383996 }, // Golf de Moliets
  "ae2b2eca-ff37-4a0b-a624-424f514290cb": { lat: 43.923518, lng: 5.096251 }, // Golf de Saumane
  "5f427e14-f6f9-4711-b238-d6898ebd90fc": { lat: 43.690298, lng: -1.415585 }, // Golf de Seignosse
  "7f84388a-48b0-45f6-996e-80c11c71449c": { lat: 43.705891, lng: 4.865701 }, // Golf de Servanes
  "2298a728-f4af-4652-b982-e7bded7d017b": { lat: 43.441612, lng: -1.489657 }, // Makila Golf Club
  "fa948888-3e61-4e58-a943-42676e46354f": { lat: 51.665211, lng: 5.229785 }, // Bernardus Golf
  "a6bcf565-d9e2-4420-8f91-1aa3e8970f6a": { lat: 51.561507, lng: 3.489535 }, // Domburgsche Golfclub
  "ee0be585-ed65-4af6-a13d-575fd778b423": { lat: 51.521531, lng: 3.911231 }, // Golf & Country Club De Goese Golf
  "a23a085d-61ad-4d5d-a2c6-a29bf87c8ccc": { lat: 51.548061, lng: 4.873569 }, // Golf & Country Club Princenbosch
  "131f9231-a13b-4221-abb1-4aae238835cf": { lat: 52.114653, lng: 4.988399 }, // Golf Club De Haar
  "ddc8a4b8-fa57-43e8-a527-16f9214a1f7c": { lat: 51.513543, lng: 5.759166 }, // Golfbaan De Stippelberg
  "4f06a340-1f22-4558-adb1-cc78fdd28209": { lat: 51.366068, lng: 5.775367 }, // Golfbaan Het Woold
  "5a4cc87f-e527-4c9f-923d-14d8bc7b8cde": { lat: 51.373668, lng: 5.668005 }, // Golfbaan de Swinkelsche
  "e9ef72a7-7849-4126-8b64-f3b60f4aea13": { lat: 51.334778, lng: 5.58389 }, // Golfclub Haviksoord
  "353e4e92-6f72-4755-a425-0cc054dd3974": { lat: 51.389851, lng: 4.238988 }, // Golfclub Reymerswael
  "57b4724d-29b6-48d0-b411-7c953e2e25b2": { lat: 51.582161, lng: 4.887476 }, // Golfclub Toxandria
  "de68dd40-cc65-4bfc-913e-b4d92a5ab118": { lat: 51.256582, lng: 3.90045 }, // Golfvereniging De Woeste Kop
  "b96b424a-6aef-444b-becf-14c3535b0f87": { lat: 52.132906, lng: 4.368983 }, // Koninklijke Haagsche Golf & Country Club
  "5fd68d97-67d0-4f82-a86c-786ec85a61b1": { lat: 36.513534, lng: -4.711753 }, // Calanova Golf Club
  "82691176-6b68-41b3-b065-afad2bdfc78b": { lat: 39.317239, lng: -0.301066 }, // Campo de golf de El Saler
  "7275dd4a-33c5-4c85-8ef9-01510e1021be": { lat: 39.44877, lng: -0.622734 }, // El Bosque Golf Club
  "6e1bb738-73f4-4f22-98de-b40e6b2ff088": { lat: 36.513769, lng: -4.660896 }, // El Chaparral Golf Club
  "da2309a6-33b8-461a-866a-2bc4cf77da78": { lat: 42.01377, lng: 3.139334 }, // Emporda Golf (Dunes)
  "7aa47dfa-ef65-4711-8172-598232e74dfd": { lat: 42.01377, lng: 3.139334 }, // Emporda Golf (Forest)
  "1c1633d7-e90d-4244-ab51-f170ae511ac3": { lat: 39.588056, lng: 2.597539 }, // Golf Son Vida
  "ffaa9ffa-ec7f-4576-b714-f121059a0eb5": { lat: 39.669596, lng: 2.659825 }, // Golf de Son Termes
  "cc039b96-91bc-44d5-9f03-11e970ba9926": { lat: 36.512381, lng: -4.994773 }, // La Quinta Golf & Country Club
  "af190188-049c-4dbf-bc1f-20f7ee9ab7e9": { lat: 39.54777, lng: 2.584183 }, // Real Golf de Bendinat
  "74fadcc4-20ae-45ba-8de6-96fc07c059ba": { lat: 51.39392, lng: 0.429256 }, // Rochester & Cobham Park Golf Club
};
