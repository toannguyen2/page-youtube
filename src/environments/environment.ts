// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	API_HOST: 'http://127.0.0.1:9899',
	API_SUGGEST: '/tools/youtube/suggest',
	API_SEARCH: '/tools/youtube/search',
	API_WATCH: '/tools/youtube/watch',
	API_LIST_RELATED: '/tools/youtube/list-related',
	API_DOWNLOAD: '/api/v1/tools/youtube/download',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
