export const restaurants = [
  {
    id: 'brasa-roma',
    name: 'Brasa Roma',
    category: 'Parrilla italiana',
    description:
      'Carnes premium, pastas artesanales y un ambiente elegante para una cena especial.',
    location: 'Zona 10, Ciudad de Guatemala',
    phone: '+502 2456-7810',
    schedule: 'Lun - Dom | 12:00 PM - 10:00 PM',
    deliveryFee: 18,
    eta: '25 - 35 min',
    rating: 4.8,
    accent: 'linear-gradient(135deg, #7a0d16 0%, #c1121f 100%)',
    reviews: [
      {
        id: 1,
        user: 'AndreaM',
        stars: 5,
        comment: 'Excelente servicio y la pasta trufada estaba espectacular.',
      },
      {
        id: 2,
        user: 'Luis_GT',
        stars: 4,
        comment: 'Muy buen sabor, el lugar se siente elegante y moderno.',
      },
    ],
    menuItems: [
      {
        id: 101,
        name: 'Ribeye a la brasa',
        description: 'Corte premium acompañado de vegetales rostizados.',
        price: 145,
      },
      {
        id: 102,
        name: 'Pasta trufada',
        description: 'Fettuccine en salsa cremosa con aceite de trufa.',
        price: 89,
      },
      {
        id: 103,
        name: 'Limonada de frutos rojos',
        description: 'Bebida fresca con toque cítrico y frutos del bosque.',
        price: 24,
      },
    ],
  },
  {
    id: 'casa-roja-bistro',
    name: 'Casa Roja Bistro',
    category: 'Bistro contemporáneo',
    description:
      'Platos creativos, hamburguesas gourmet y postres artesanales con presentación cuidada.',
    location: 'Antigua Guatemala, Sacatepéquez',
    phone: '+502 2298-5544',
    schedule: 'Mar - Dom | 1:00 PM - 11:00 PM',
    deliveryFee: 15,
    eta: '20 - 30 min',
    rating: 4.6,
    accent: 'linear-gradient(135deg, #8b1e2d 0%, #d62839 100%)',
    reviews: [
      {
        id: 3,
        user: 'NatyR',
        stars: 5,
        comment: 'La hamburguesa ahumada y el cheesecake son una locura.',
      },
      {
        id: 4,
        user: 'Carlos17',
        stars: 4,
        comment: 'Muy bonito diseño del lugar y la comida llegó caliente.',
      },
    ],
    menuItems: [
      {
        id: 201,
        name: 'Hamburguesa ahumada',
        description: 'Carne artesanal, queso cheddar, tocino y salsa de la casa.',
        price: 68,
      },
      {
        id: 202,
        name: 'Papas bistro',
        description: 'Papas crujientes con parmesano y especias.',
        price: 28,
      },
      {
        id: 203,
        name: 'Cheesecake de frutos rojos',
        description: 'Postre cremoso con coulis casero.',
        price: 35,
      },
    ],
  },
  {
    id: 'nido-urbano',
    name: 'Nido Urbano',
    category: 'Comida fusión',
    description:
      'Sabores modernos con influencia asiática y latina, ideal para compartir.',
    location: 'Quetzaltenango, Guatemala',
    phone: '+502 3301-9922',
    schedule: 'Lun - Sáb | 11:30 AM - 9:30 PM',
    deliveryFee: 12,
    eta: '18 - 28 min',
    rating: 4.7,
    accent: 'linear-gradient(135deg, #5c0b14 0%, #9b111e 100%)',
    reviews: [
      {
        id: 5,
        user: 'FerP',
        stars: 5,
        comment: 'Los tacos coreanos tienen muchísimo sabor.',
      },
      {
        id: 6,
        user: 'maria_07',
        stars: 4,
        comment: 'Me gustó bastante el menú, está diferente y bien presentado.',
      },
    ],
    menuItems: [
      {
        id: 301,
        name: 'Tacos coreanos',
        description: 'Tortillas suaves con pollo glaseado y vegetales encurtidos.',
        price: 54,
      },
      {
        id: 302,
        name: 'Bowl dragón',
        description: 'Arroz jazmín, vegetales, proteína al gusto y salsa spicy.',
        price: 61,
      },
      {
        id: 303,
        name: 'Té frío de lychee',
        description: 'Bebida ligera con notas florales.',
        price: 22,
      },
    ],
  },
];

export function getRestaurantById(id) {
  return restaurants.find((restaurant) => restaurant.id === id);
}
