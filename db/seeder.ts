import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import Users, { User } from '@/models/User'
import Products, { Product } from '@/models/Product'
import Orders from '@/models/Order'

dotenv.config({ path: '.env.local', override: true })

const MONGODB_URI = process.env.MONGODB_URI

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }

  const opts = { bufferCommands: false }
  const conn = await mongoose.connect(MONGODB_URI, opts)

  if (!conn.connection.db) {
    throw new Error('Could not connect')
  }

  // 1) Clear the database and recreate the (empty) collections
  await conn.connection.db.dropDatabase()

  await Products.createCollection()
  await Users.createCollection()
  await Orders.createCollection()

  // 2) Products
  const products: Product[] = [
    {
      name: 'Volkswagen Golf 8 GTI 2.0 TSI',
      brand: 'Volkswagen',
      model: 'Golf GTI',
      price: 32990,
      year: 2022,
      kilometers: 28500,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      powerHp: 245,
      bodyType: 'Hatchback',
      color: 'Pure White',
      doors: 5,
      seats: 5,
      numberOfOwners: 1,
      accidentFree: true,
      used: true,
      img: '/img/cars/vw-golf-8-gti.jpg',
      description:
        'Sporty compact hatchback with a 2.0 TSI petrol engine (245 hp) and a 7-speed DSG automatic gearbox. ' +
        'One owner, full service history at an authorised Volkswagen dealer and no accidents. ' +
        'Equipment includes LED Matrix headlights, the digital cockpit, adaptive cruise control, ' +
        'heated sports seats, a parking camera and 18-inch alloy wheels.',
    },
    {
      name: 'Renault Clio 5 TCe 90',
      brand: 'Renault',
      model: 'Clio',
      price: 10000,
      year: 2021,
      kilometers: 50000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      powerHp: 90,
      bodyType: 'Hatchback',
      color: 'Valencia Orange',
      doors: 5,
      seats: 5,
      numberOfOwners: 1,
      accidentFree: true,
      used: true,
      img: '/img/cars/renault-clio-5.jpg',
      description:
        'Economical city car with a 1.0 TCe turbo petrol engine (90 hp) and a 5-speed manual gearbox. ' +
        'Average consumption of about 5.3 l/100 km, ideal for daily driving and beginners. ' +
        'One owner, accident-free, regularly serviced. ' +
        'Equipment includes a 7-inch touchscreen with Apple CarPlay and Android Auto, ' +
        'air conditioning, cruise control and rear parking sensors.',
    },
    {
      name: 'Tesla Model 3 RWD',
      brand: 'Tesla',
      model: 'Model 3',
      price: 42990,
      year: 2023,
      kilometers: 15000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      powerHp: 283,
      bodyType: 'Sedan',
      color: 'Pearl White',
      doors: 4,
      seats: 5,
      numberOfOwners: 1,
      accidentFree: true,
      used: true,
      img: '/img/cars/tesla-model-3.jpg',
      description:
        'Fully electric sedan with rear-wheel drive (283 hp) and a WLTP range of over 500 km. ' +
        'Supercharger fast charging, battery health checked and in excellent condition. ' +
        'Equipment includes Autopilot, a 15-inch touchscreen, a panoramic glass roof, ' +
        'heated front and rear seats and over-the-air software updates. One owner, accident-free.',
    },
    {
      name: 'BMW 320d Touring',
      brand: 'BMW',
      model: '3 Series Touring',
      price: 47500,
      year: 2021,
      kilometers: 62000,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      powerHp: 190,
      bodyType: 'Estate',
      color: 'Mineral Grey',
      doors: 5,
      seats: 5,
      numberOfOwners: 2,
      accidentFree: true,
      used: true,
      img: '/img/cars/bmw-320d-touring.jpg',
      description:
        'Spacious diesel estate with a 2.0 diesel engine (190 hp) and an 8-speed Steptronic automatic gearbox, ' +
        'ideal for families and long trips. Boot capacity of 500 litres, up to 1,510 litres with the rear seats folded. ' +
        'Equipment includes the Luxury Line package, navigation, LED headlights, an electric tailgate ' +
        'and a towbar. Two owners, accident-free, full BMW service history.',
    },
    {
      name: 'Volkswagen Golf 4 Variant 1.9 TDI',
      brand: 'Volkswagen',
      model: 'Golf 4 Variant',
      price: 400,
      year: 2005,
      kilometers: 251730,
      fuelType: 'Diesel',
      transmission: 'Manual',
      powerHp: 101,
      bodyType: 'Estate',
      color: 'Candy White',
      doors: 5,
      seats: 5,
      numberOfOwners: 3,
      accidentFree: false,
      used: true,
      img: '/img/cars/vw-golf-4-variant.webp',
      description:
        'Reliable older estate with the well-known 1.9 TDI diesel engine (101 hp) and a 5-speed manual gearbox. ' +
        'High mileage and three previous owners; the car had a minor accident that was repaired. ' +
        'Drives well but needs some work (new tyres and a service), which is why the price is so low. ' +
        'Good option as a cheap second car or for spare parts.',
    },
  ]

  const insertedProducts = await Products.insertMany(products)

  // 3) Sample users. Passwords are stored hashed (bcrypt), never in plain text.
  const users: User[] = [
    {
      email: 'johndoe@example.com',
      password: await bcrypt.hash('1234', 10),
      name: 'John',
      surname: 'Doe',
      address: '123 Main St, 12345 New York, United States',
      birthdate: new Date('1970-01-01'),
      cartItems: [
        { product: insertedProducts[0]._id, qty: 1 },
        { product: insertedProducts[1]._id, qty: 1 },
      ],
      orders: [],
    },
    {
      email: 'janesmith@example.com',
      password: await bcrypt.hash('5678', 10),
      name: 'Jane',
      surname: 'Smith',
      address: '45 Oak Avenue, 28001 Madrid, Spain',
      birthdate: new Date('1985-06-15'),
      cartItems: [{ product: insertedProducts[2]._id, qty: 1 }],
      orders: [],
    },
  ]

  const createdUsers = await Users.insertMany(users)

  console.log('DATABASE SEEDED')
  console.log(`  user:    ${createdUsers[0]._id} (johndoe@example.com / 1234)`)
  console.log(
    `  user:    ${createdUsers[1]._id} (janesmith@example.com / 5678)`
  )
  insertedProducts.forEach((p) =>
    console.log(`  product: ${p._id} (${p.name})`)
  )

  await conn.disconnect()
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
