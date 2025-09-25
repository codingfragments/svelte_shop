<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Chatbot from '$lib/components/Chatbot.svelte';
	// import posthog from 'posthog-js';
	// import { browser } from '$app/environment';
	let { children } = $props();

	// export const load = async () => {
	// 	console.log('TTT');
	// 	if (browser) {
	// 		posthog.init('phc_VlI1NVz75X7jNWjYCOLjbprR2TBkVa6UOsT6omlu5io', {
	// 			api_host: 'https://us.i.posthog.com',
	// 			defaults: '2025-05-24'
	// 		});
	// 		console.log('PostHog initialized');
	// 	}
	//
	// 	return;
	// };
</script>

<svelte:head>
	<script>
		!(function (t, e) {
			var o, n, p, r;
			e.__SV ||
				((window.posthog = e),
				(e._i = []),
				(e.init = function (i, s, a) {
					function g(t, e) {
						var o = e.split('.');
						(2 == o.length && ((t = t[o[0]]), (e = o[1])),
							(t[e] = function () {
								t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
							}));
					}
					(((p = t.createElement('script')).type = 'text/javascript'),
						(p.crossOrigin = 'anonymous'),
						(p.async = !0),
						(p.src =
							s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js'),
						(r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r));
					var u = e;
					for (
						void 0 !== a ? (u = e[a] = []) : (a = 'posthog'),
							u.people = u.people || [],
							u.toString = function (t) {
								var e = 'posthog';
								return ('posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e);
							},
							u.people.toString = function () {
								return u.toString(1) + '.people (stub)';
							},
							o =
								'init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug'.split(
									' '
								),
							n = 0;
						n < o.length;
						n++
					)
						g(u, o[n]);
					e._i.push([i, s, a]);
				}),
				(e.__SV = 1));
		})(document, window.posthog || []);
		posthog.init('phc_VlI1NVz75X7jNWjYCOLjbprR2TBkVa6UOsT6omlu5io', {
			api_host: 'https://us.i.posthog.com',
			defaults: '2025-05-24'
		});
	</script>
	{#if import.meta.env.MODE === 'staging'}
		<script
			data-recording-token="4c0XuAryTtycpLIrOIgASje0d1LlMb355Qz6qwDo"
			data-is-production-environment="false"
			src="https://snippet.meticulous.ai/v1/meticulous.js"
		></script>
	{/if}
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-bg-primary text-text-primary">
	<Header />

	<main class="flex-1">
		{@render children?.()}
	</main>

	<Footer />

	<Chatbot />
</div>
