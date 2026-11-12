/* Ei full films: user-activated, lazy, accessible playback. No previews are
   represented as complete films. Import after loading full-film-viewer.css. */
const secondsLabel = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
function assetURL(value, base) {
  if (!value) return null;
  const url = new URL(value, new URL(base, document.baseURI));
  if (!['http:', 'https:', 'file:'].includes(url.protocol)) throw new Error('Unsupported film URL');
  return url.href;
}
export function mountFullFilmViewer(catalog, options = {}) {
  const works = Array.isArray(catalog) ? catalog : catalog.works;
  const byId = new Map(works.map(work => [work.id, work]));
  const dialog = document.createElement('dialog');
  dialog.className = 'ei-film-dialog';
  dialog.setAttribute('aria-label', 'Full film');
  const shell = document.createElement('div'); shell.className = 'ei-film-shell';
  const header = document.createElement('header'); header.className = 'ei-film-header';
  const heading = document.createElement('h2');
  const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close ×'; close.className = 'ei-film-close'; close.setAttribute('aria-label', 'Close full film');
  header.append(heading, close);
  const video = document.createElement('video');
  video.controls = true; video.playsInline = true; video.preload = 'metadata';
  const caption = document.createElement('p'); caption.className = 'ei-film-caption';
  const status = document.createElement('p'); status.className = 'ei-film-status'; status.setAttribute('role', 'status');
  const alternative = document.createElement('a'); alternative.className = 'ei-film-external'; alternative.textContent = 'Watch on YouTube ↗'; alternative.target = '_blank'; alternative.rel = 'noopener noreferrer';
  shell.append(header, video, caption, status, alternative); dialog.append(shell); document.body.append(dialog);
  let active = null, previousFocus = null, previousOverflow = '';
  const notify = (type, work) => {
    document.dispatchEvent(new CustomEvent(`ei-film:${type}`, {detail: work}));
    options[type === 'open' ? 'onOpen' : 'onClose']?.(work);
  };
  const finish = () => {
    if (!active) return;
    const work = active; active = null; video.pause(); video.removeAttribute('src'); video.load();
    document.body.style.overflow = previousOverflow;
    notify('close', work);
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll: true});
  };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {if (!dialog.open) finish();});
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = shell.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  video.addEventListener('error', () => {
    if (active) status.textContent = active.fullUrl ? 'This copy could not load. You can use the full-film link below.' : 'The full film could not load. Please try again.';
  });
  video.addEventListener('loadedmetadata', () => {status.textContent = '';});
  return {
    open(id) {
      const work = byId.get(id);
      if (!work) return false;
      if (active) {dialog.close(); finish();}
      const local = assetURL(work.fullSrc, options.assetBase || './');
      const external = assetURL(work.fullUrl, options.assetBase || './');
      if (!local && !external) return false;
      previousFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      document.querySelectorAll('video,audio').forEach(media => media.pause());
      active = work; heading.textContent = work.fullTitle || work.title;
      dialog.setAttribute('aria-label', `${work.fullTitle || work.title} — full film`);
      caption.textContent = `Full film · ${secondsLabel(work.durationSeconds)}`;
      status.textContent = local ? '' : 'Open the full film using the link below.';
      alternative.hidden = !external;
      if (external) alternative.href = external; else alternative.removeAttribute('href');
      video.hidden = !local;
      if (local) {
        video.src = local; video.setAttribute('aria-label', `${work.fullTitle || work.title} — full film`);
        video.poster = assetURL(work.poster, options.assetBase || './') || '';
      }
      document.body.style.overflow = 'hidden'; dialog.showModal(); close.focus(); notify('open', work);
      if (local) video.play().catch(() => {status.textContent = 'Press play to watch the full film with sound.';});
      return true;
    },
    close() {if (dialog.open) dialog.close();},
    destroy() {if (dialog.open) dialog.close(); finish(); dialog.remove();},
    get activeId() {return active?.id || null;}
  };
}
/* Attach to existing .work figures by preview source, never by array order. */
export function bindFullFilmIndex(root, viewer, catalog) {
  const works = Array.isArray(catalog) ? catalog : catalog.works;
  const cleanups = [];
  for (const work of works) {
    const preview = [...root.querySelectorAll('.work video')].find(video => {
      const src = video.querySelector('source')?.getAttribute('src') || video.getAttribute('src') || '';
      return src.split('/').pop() === `${work.id}.mp4`;
    });
    if (!preview) continue;
    const figure = preview.closest('.work');
    if (figure.querySelector('[data-full-film]')) continue;
    const action = document.createElement('button'); action.type = 'button'; action.className = 'ei-full-film-button'; action.dataset.fullFilm = work.id;
    const available = Boolean(work.fullSrc || work.fullUrl);
    action.textContent = available ? `Watch full film · ${secondsLabel(work.durationSeconds)} ↗` : 'Full film unavailable';
    action.disabled = !available; action.setAttribute('aria-label', `Watch ${work.fullTitle || work.title}, full film`);
    const open = () => viewer.open(work.id); action.addEventListener('click', open); figure.append(action);
    const label = document.createElement('p'); label.className = 'ei-preview-label'; label.textContent = 'Gallery excerpt'; preview.parentElement.append(label);
    cleanups.push(() => {action.removeEventListener('click', open); action.remove(); label.remove();});
  }
  return () => cleanups.forEach(fn => fn());
}
