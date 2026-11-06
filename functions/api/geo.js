export function onRequestGet({ request }) {
  const country = String(request.cf?.country || '').toUpperCase();
  return new Response(JSON.stringify({ country }), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'private, max-age=86400',
    },
  });
}
