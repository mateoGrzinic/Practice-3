import {
  CakeIcon,
  EnvelopeIcon,
  HomeIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import InfoList from '@/components/InfoList'
import PageTitle from '@/components/PageTitle'
import { getSession } from '@/lib/auth'
import { formatDate } from '@/lib/format'
import { getOrders, getUser } from '@/lib/handlers'

export default async function Profile() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const [user, ordersData] = await Promise.all([
    getUser(session.userId),
    getOrders(session.userId),
  ])
  if (!user || !ordersData) {
    redirect('/auth/signin')
  }

  const orders = ordersData.orders
  const th =
    'px-3 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase'

  return (
    <div className='flex flex-col'>
      <PageTitle>User Profile</PageTitle>
      <InfoList
        items={[
          {
            icon: UserIcon,
            label: 'Full name',
            value: `${user.name} ${user.surname}`,
          },
          { icon: EnvelopeIcon, label: 'E-mail address', value: user.email },
          { icon: HomeIcon, label: 'Address', value: user.address },
          {
            icon: CakeIcon,
            label: 'Birthdate',
            value: formatDate(user.birthdate),
          },
        ]}
      />

      <h3 className='pt-8 pb-4 text-2xl font-bold text-gray-900'>Orders</h3>
      {orders.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>
            You have not made any purchase yet
          </span>
        </div>
      ) : (
        <div className='overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-gray-200'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th scope='col' className={`${th} text-left`}>
                  Order ID
                </th>
                <th scope='col' className={`${th} text-left`}>
                  Shipment address
                </th>
                <th scope='col' className={`${th} text-left`}>
                  Payment information
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {orders.map((order) => {
                const id = order._id.toString()
                return (
                  <tr key={id} className='hover:bg-gray-50'>
                    <td className='px-3 py-3 text-sm font-medium break-all text-gray-900'>
                      <Link href={`/orders/${id}`} className='hover:underline'>
                        {id}
                      </Link>
                    </td>
                    <td className='px-3 py-3 text-sm text-gray-700'>
                      {order.address}
                    </td>
                    <td className='px-3 py-3 text-sm whitespace-nowrap text-gray-700'>
                      {order.cardHolder}
                      <br />
                      <span className='text-xs text-gray-500'>
                        {order.cardNumber}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
