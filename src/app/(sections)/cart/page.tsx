import Link from 'next/link'
import { redirect } from 'next/navigation'
import ItemsTable from '@/components/ItemsTable'
import PageTitle from '@/components/PageTitle'
import { getSession } from '@/lib/auth'
import { getCart } from '@/lib/handlers'

export default async function Cart() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const cart = await getCart(session.userId)
  if (!cart) {
    redirect('/auth/signin')
  }

  // Cart price = current price of the product
  const items = cart.cartItems
    .filter((cartItem) => cartItem.product) // product may have been deleted
    .map((cartItem) => ({
      product: cartItem.product,
      qty: cartItem.qty,
      price: cartItem.product.price,
    }))

  return (
    <div className='flex flex-col'>
      <PageTitle>My Shopping Cart</PageTitle>
      {items.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
          <ItemsTable items={items} editable />
          <div className='mt-6 flex justify-center'>
            <Link
              href='/checkout'
              className='rounded-md bg-gray-800 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:outline-hidden'
            >
              Check out
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
