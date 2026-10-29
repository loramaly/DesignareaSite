/* PostHog analytics - one file for the whole site, linked first in every page's <head>.
   Paste the project key (and the region, us or eu) from posthog-snippet.html below; until then it does nothing.
   No cookies (memory only), every input field masked in recordings.
   A page that sits inside another one (the demo cut into the case: the orbit, the timeline, the logo...) never starts
   PostHog - the visit is already counted on the case itself; only a demo opened as its own page is counted as a demo visit. */
(function () {
  var KEY = 'PASTE_POSTHOG_PROJECT_KEY';
  var REGION = 'us'; // 'us' or 'eu' - as in the snippet's api_host
  if (KEY.indexOf('PASTE') === 0) return;
  try { if (window.self !== window.top) return; } catch (e) { return; }
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://' + REGION + '-assets.i.posthog.com/static/array.js';
  s.onload = function () {
    if (!window.posthog || !window.posthog.init) return;
    window.posthog.init(KEY, {
      api_host: 'https://' + REGION + '.i.posthog.com',
      persistence: 'memory',
      person_profiles: 'identified_only',
      session_recording: { maskAllInputs: true }
    });
  };
  document.head.appendChild(s);
})();
