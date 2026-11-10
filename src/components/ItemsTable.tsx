import { Types } from 'mongoose'
import Link from 'next/link'
import QuantitySelector from '@/components/QuantitySelector'
import { formatPrice } from '@/lib/format'

export interface ItemLine {
  product: { _id: Types.ObjectId; name: string; img: string }
  qty: number
  price: number // price per unit
}

interface ItemsTableProps {
  items: ItemLine[]
  /** Shows the quantity buttons (cart page) */
  editable?: boolean
}

export function calcTotal(items: ItemLine[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

/** Shared by /cart, /checkout and /orders/[orderId] */
export default function ItemsTable({
  items,
  editable = false,
}: ItemsTableProps) {
  const th =
    'px-3 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase'

  return (
    <div className='overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-gray-200'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th scope='col' className={`${th} text-left`}>
              Product
            </th>
            <th scope='col' className={`${th} text-right`}>
              Quantity
            </th>
            <th scope='col' className={`${th} text-right`}>
              Price
            </th>
            <th scope='col' className={`${th} text-right`}>
              Total
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {items.map((item) => (
            <tr key={item.product._id.toString()}>
              <td className='px-3 py-3'>
                <Link
                  href={`/products/${item.product._id.toString()}`}
                  className='flex items-center gap-4 text-sm text-gray-900 hover:underline'
                >
                  <img
                    src={item.product.img}
                    alt=''
                    className='hidden h-14 w-24 shrink-0 rounded-md bg-white object-contain sm:block'
                  />

                  <span>{item.product.name}</span>
                </Link>
              </td>
              <td className='px-3 py-3 text-right text-sm whitespace-nowrap text-gray-900'>
                {editable ? <QuantitySelector qty={item.qty} /> : item.qty}
              </td>
              <td className='px-3 py-3 text-right text-sm whitespace-nowrap text-gray-900'>
                {formatPrice(item.price)}
              </td>
              <td className='px-3 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-900'>
                {formatPrice(item.price * item.qty)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className='bg-gray-50'>
          <tr>
            <th
              scope='row'
              colSpan={3}
              className='px-3 py-3 text-right text-sm font-semibold text-gray-900'
            >
              Total
            </th>
            <td className='px-3 py-3 text-right text-sm font-semibold whitespace-nowrap text-gray-900'>
              {formatPrice(calcTotal(items))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
