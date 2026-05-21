const initArticleToc = () => {
  const tocList = document.querySelector('[data-article-toc-list]');
  if (!tocList) {
    return;
  }

  const headings = Array.from(document.querySelectorAll('.article-body h2[data-toc-heading]'));
  if (!headings.length) {
    return;
  }

  tocList.innerHTML = '';

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `article-toc-heading-${index + 1}`;
    }

    const li = document.createElement('li');
    const link = document.createElement('a');

    link.href = `#${heading.id}`;
    link.textContent = heading.textContent?.trim() ?? '';

    link.addEventListener('click', (evt) => {
      evt.preventDefault();

      const header = document.querySelector('.header');
      const headerOffset = header ? header.getBoundingClientRect().height : 0;
      const targetTop = heading.getBoundingClientRect().top + window.scrollY - headerOffset - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });

    li.append(link);
    tocList.append(li);
  });
};

initArticleToc();
