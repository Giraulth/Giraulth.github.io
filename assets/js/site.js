const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');

const updateThemeLabel = () => {
	const isDark = root.dataset.theme === 'dark';
	themeToggle.setAttribute('aria-label', isDark ? 'Activer le thème clair' : 'Activer le thème sombre');
};

updateThemeLabel();
themeToggle.addEventListener('click', () => {
	root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
	updateThemeLabel();
	try {
		localStorage.setItem('theme', root.dataset.theme);
	} catch {
		// Storage may be blocked (private browsing); the theme still applies for this visit.
	}
});

document.getElementById('print-resume').addEventListener('click', () => window.print());

const navLinks = new Map([...document.querySelectorAll('.nav-links a')].map((link) => [link.hash.slice(1), link]));
const sections = [...document.querySelectorAll('main > section[id]')];
let navUpdateQueued = false;

const updateCurrentSection = () => {
	navUpdateQueued = false;
	const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
	const current = atBottom
		? sections.at(-1)
		: sections.findLast((section) => section.getBoundingClientRect().top <= innerHeight * 0.4);
	navLinks.forEach((link, id) => {
		if (id === current?.id) link.setAttribute('aria-current', 'true');
		else link.removeAttribute('aria-current');
	});
};

addEventListener('scroll', () => {
	if (navUpdateQueued) return;
	navUpdateQueued = true;
	requestAnimationFrame(updateCurrentSection);
}, { passive: true });
updateCurrentSection();

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
	const revealItems = document.querySelectorAll('.reveal');
	// Elements already on screen skip the animation to avoid a flash on load.
	revealItems.forEach((item) => {
		if (item.getBoundingClientRect().top < innerHeight) item.classList.add('is-visible');
	});
	root.classList.add('reveal-ready');

	const revealObserver = new IntersectionObserver((entries, observer) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			entry.target.classList.add('is-visible');
			observer.unobserve(entry.target);
		}
	}, { rootMargin: '0px 0px -8% 0px' });
	revealItems.forEach((item) => revealObserver.observe(item));
}
