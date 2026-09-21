const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = document.querySelectorAll('.content section[id]');
const tocLinks = document.querySelectorAll('.toc a');

if (sections.length && tocLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Build the failure pie chart from the values in the legend.
const failurePie = document.querySelector('.pie');
const failureItems = document.querySelectorAll('.failure-legend li');

if (failurePie && failureItems.length) {
  const values = [...failureItems].map((item) => Number(item.dataset.value));
  const total = values.reduce((sum, value) => sum + value, 0);
  let boundary = 0;

  failureItems.forEach((item, index) => {
    const percentage = (values[index] / total) * 100;
    const formatted = `${percentage % 1 === 0 ? percentage : percentage.toFixed(1)}%`;
    item.querySelector('strong').textContent = formatted;
    boundary += percentage;
    if (index === 0) failurePie.style.setProperty('--theory-end', `${boundary}%`);
    if (index === 1) failurePie.style.setProperty('--scenario-end', `${boundary}%`);
  });

  failurePie.setAttribute(
    'aria-label',
    `Failed questions: ${failureItems[0].dataset.label} ${failureItems[0].querySelector('strong').textContent}, ${failureItems[1].dataset.label} ${failureItems[1].querySelector('strong').textContent}, ${failureItems[2].dataset.label} ${failureItems[2].querySelector('strong').textContent}`
  );
}

const scoreRows = document.querySelectorAll('.theory-row, .scenario-row');

scoreRows.forEach((row) => {
  const score = Number(row.dataset.score);
  const maximum = Number(row.dataset.max);
  const percentage = (score / maximum) * 100;
  const roundedPercentage = Number.isInteger(percentage) ? percentage : (Math.round((percentage + 0.000001) * 10) / 10).toFixed(1);
  row.style.setProperty('--score-percent', `${percentage}%`);
  row.querySelector('.theory-percent').textContent = `${roundedPercentage}%`;
  row.setAttribute('aria-label', `${row.querySelector('.theory-label strong').textContent}: ${row.dataset.score} out of ${row.dataset.max}, ${roundedPercentage}%`);
});
