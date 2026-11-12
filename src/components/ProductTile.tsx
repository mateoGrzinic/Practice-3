import { Types } from 'mongoose'
import Link from 'next/link'
import { Product } from '@/models/Product'
import { formatPrice } from '@/lib/format'

interface ProductTileProps {
  product: Product & { _id: Types.ObjectId }
}

export default function ProductTile({ product }: ProductTileProps) {
  return (
    <Link href={`/products/${product._id}`} className='group'>
      <div className='aspect-3/2 w-full overflow-hidden rounded-lg bg-white'>
        <img
          src={product.img}
          alt={product.name}
          className='h-full w-full object-contain group-hover:opacity-75'
        />
      </div>

      <h3 className='mt-4 text-sm text-gray-900'>{product.name}</h3>
      <p className='mt-1 text-lg font-medium text-gray-900'>
        {formatPrice(product.price)}
      </p>
    </Link>
  )
}
