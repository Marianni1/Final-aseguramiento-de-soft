import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 100, 
  duration: '2m', 
};

export default function () {
 
  let loginResponse = http.post('https://recetas-del-campo1.odoo.com/web/login', {
    login: '',
    password: '', //se eliminó el usuario y el password por seguridad
  });

  check(loginResponse, {
    'Inicio de sesión exitoso': (res) => res.status === 200,
  });


    // Agregar producto al carrito 
    let addToCartResponse = http.post('https://recetas-del-campo1.odoo.com/shop/cart', {
      product_id: '1',
      add_qty: 1,
    }, { cookies: loginResponse.cookies });
  
    check(addToCartResponse, {
      'Producto agregado al carrito': (res) => res.status === 200,
    });
  
    // Realizar el pago
    let paymentResponse = http.post('https://recetas-del-campo1.odoo.com/shop/payment', {
      csrf_token: addToCartResponse.json('csrf_token'),
      payment_method: 'wire_transfer', 
    }, { cookies: loginResponse.cookies });
  
    check(paymentResponse, {
      'Pago realizado con éxito': (res) => res.status === 200,
    });
  

    sleep(3);
}
