import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import PageTitle from '@/components/PageTitle'
import QuantitySelector from '@/components/QuantitySelector'
import { getSession } from '@/lib/auth'
import { formatPrice } from '@/lib/format'
import { getCart, getProduct } from '@/lib/handlers'

export default async function Product({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  if (!Types.ObjectId.isValid(productId)) {
    notFound()
  }

  const product = await getProduct(productId)
  if (product === null) {
    notFound()
  }

  // Cart buttons are only enabled for signed-in users
  const session = await getSession()

  // Quantity of this product currently in the cart (0 if it is not in the cart)
  let qty = 0
  if (session) {
    const cart = await getCart(session.userId)
    qty =
      cart?.cartItems.find((i) => i.product?._id.toString() === productId)
        ?.qty ?? 0
  }

  const specs: [string, string][] = [
    ['Brand', product.brand],
    ['Model', product.model],
    ['Year', product.year.toString()],
    ['Mileage', product.kilometers.toLocaleString('en-US') + ' km'],
    ['Fuel', product.fuelType],
    ['Transmission', product.transmission],
    ['Power', product.powerHp + ' hp'],
    ['Body type', product.bodyType],
    ['Colour', product.color],
    ['Doors', product.doors.toString()],
    ['Seats', product.seats.toString()],
    ['Previous owners', product.numberOfOwners.toString()],
    ['Accident-free', product.accidentFree ? 'Yes' : 'No'],
    ['Condition', product.used ? 'Used' : 'New'],
  ]

  return (
    <div className='flex flex-col'>
      <PageTitle>{product.name}</PageTitle>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div>
          <div className='aspect-3/2 w-full overflow-hidden rounded-lg bg-white'>
            <img
              src={product.img}
              alt={product.name}
              className='h-full w-full object-contain'
            />
          </div>

          <p className='mt-4 text-3xl font-medium text-red-700'>
            {formatPrice(product.price)}
          </p>
          <div className='mt-3'>
            <QuantitySelector qty={qty} disabled={!session} />
            {!session && (
              <p className='mt-2 text-xs text-gray-500'>
                Sign in to add this car to your cart.
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className='text-sm font-semibold text-gray-900'>
            Product details
          </h3>
          {product.description && (
            <p className='mt-2 text-sm text-gray-700'>{product.description}</p>
          )}
          <dl className='mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm'>
            {specs.map(([label, value]) => (
              <div key={label} className='border-b border-gray-200 pb-2'>
                <dt className='text-xs text-gray-500'>{label}</dt>
                <dd className='text-gray-900'>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
