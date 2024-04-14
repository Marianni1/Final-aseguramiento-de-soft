import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 100, 
  duration: '1m',
};

export default function () {
  let response = http.get('https://recetas-del-campo1.odoo.com/');
  check(response, {
    'Status is 200': (r) => r.status === 200,
  });

  sleep(3);
}
