import { template } from './template.mjs';

const resource = 'https://bookmarks.reviews/wp-admin/admin-ajax.php';
const options = [['action', 'lhbookmarkscat'], ['category_id', '6178']];

const errorResponse = (statusCode, error) => ({
  statusCode,
  headers: {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/html; charset=utf-8'
  },
  body: template({ error })
});

export const handler = async (event) => {
  const offset = parseInt(event.queryStringParameters?.offset, 10) || 0;
  const params = new URLSearchParams(options);
  params.append('offset', String(offset));

  let res;
  try {
    res = await fetch(resource, { body: params, method: 'POST' });
  } catch (err) {
    console.error('Upstream fetch failed:', err);
    return errorResponse(502, 'Upstream unreachable');
  }

  if (!res.ok) {
    console.error(`Upstream returned ${res.status} ${res.statusText}`);
    return errorResponse(502, `Upstream error (${res.status})`);
  }

  let items;
  try {
    items = await res.json();
  } catch (err) {
    console.error('Failed to parse upstream JSON:', err);
    return errorResponse(502, 'Invalid upstream response');
  }

  const next = offset + items.length;
  const body = template({ items, next, offset });

  return {
    statusCode: 200,
    headers: {
      'Cache-Control': 'max-age=300',
      'Content-Type': 'text/html; charset=utf-8'
    },
    body,
  };
};
