export const INTRO_STORAGE_KEY = "rr-intro-seen";

// Se ejecuta en línea al inicio de <body>, antes de pintar el contenido:
// decide si toca intro y lo marca en <html data-intro>, de modo que el
// overlay (renderizado en servidor y oculto por CSS) ya se ve en el primer
// pintado, sin parpadeo de la web.
// sessionStorage es por pestaña: el intro sale una vez en cada pestaña
// nueva, pero no al recargar ni al navegar dentro de la misma pestaña.
// No se muestra en las demos (/demo/* y /en/demo/*).
// Vive fuera de IntroSplash.tsx porque los layouts son Server Components y
// no pueden leer valores de un módulo "use client".
export const INTRO_BOOT_SCRIPT = `(function(){try{if(/^\\/(en\\/)?demo(\\/|$)/.test(location.pathname))return;if(!sessionStorage.getItem("${INTRO_STORAGE_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="pending";sessionStorage.setItem("${INTRO_STORAGE_KEY}","1")}}catch(e){}})();`;
