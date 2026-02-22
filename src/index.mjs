import { template } from './template.mjs';

const resource = 'https://bookmarks.reviews/wp-admin/admin-ajax.php';
const options = [['action', 'lhbookmarkscat'], ['category_id', '6178']];

export const handler = async (event) => {
  const qs = new URLSearchParams(event.Records[0].cf.request.querystring);
  const offset = parseInt(qs.get('offset'), 10) || 0;
  const params = new URLSearchParams(options);
  params.append('offset', String(offset));
  const res = await fetch(resource, {
    body: params,
    method: 'POST'
  });
  const data = await res.json();
  const next = offset + data.length;
  const body = template({ data, offset, next });

  return {
    status: '200',
    statusDescription: 'OK',
    headers: {
      'cache-control': [{
        key: 'Cache-Control',
        value: 'max-age=300'
      }],
      'content-type': [{
        key: 'Content-Type',
        value: 'text/html; charset=utf-8'
      }]
    },
    body,
  };
};
