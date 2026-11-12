import {
  CalendarIcon,
  CreditCardIcon,
  HashtagIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { Types } from 'mongoose'
import { notFound, redirect } from 'next/navigation'
import InfoList from '@/components/InfoList'
import ItemsTable from '@/components/ItemsTable'
import PageTitle from '@/components/PageTitle'
import { getSession } from '@/lib/auth'
import { formatDateTime } from '@/lib/format'
import { getOrder } from '@/lib/handlers'

export default async function Order({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  if (!Types.ObjectId.isValid(orderId)) {
    notFound()
  }

  // Orders of other users are also reported as not found by the handler
  const order = await getOrder(session.userId, orderId)
  if (order === 'USER_NOT_FOUND') {
    // Valid session, but the user no longer exists (e.g. after re-seeding)
    redirect('/auth/signin')
  }
  if (typeof order === 'string') {
    notFound()
  }

  const items = order.orderItems
    .filter((orderItem) => orderItem.product)
    .map((orderItem) => ({
      product: orderItem.product,
      qty: orderItem.qty,
      price: orderItem.price, // price at the moment of the purchase
    }))

  return (
    <div className='flex flex-col'>
      <PageTitle>Order Details</PageTitle>
      <div className='mb-6'>
        <InfoList
          items={[
            { icon: HashtagIcon, label: 'Order ID', value: orderId },
            {
              icon: MapPinIcon,
              label: 'Shipping address',
              value: order.address,
            },
            {
              icon: CreditCardIcon,
              label: 'Payment information',
              value: `${order.cardHolder}, ${order.cardNumber}`,
            },
            {
              icon: CalendarIcon,
              label: 'Date of purchase',
              value: formatDateTime(order.date),
            },
          ]}
        />
      </div>
      <ItemsTable items={items} />
    </div>
  )
}
