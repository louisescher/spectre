import css from '../../styles/giscus.css?raw';

export async function ALL() {
  const res = new Response(css);

  res.headers.set('Content-Type', 'text/css');
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  return res;
}
