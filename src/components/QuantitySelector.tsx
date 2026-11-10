import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface QuantitySelectorProps {
  qty: number
  disabled?: boolean
}

const buttonClasses =
  'rounded-md border border-red-200 bg-white p-1.5 text-gray-700 hover:bg-red-50 focus:outline-hidden focus:ring-2 focus:ring-red-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white'

/**
 * Add / remove an item or remove the product from the cart.
 * No functionality yet (Practice 3): the buttons do not change anything.
 */
export default function QuantitySelector({
  qty,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className='inline-flex items-center gap-2'>
      <button
        type='button'
        className={buttonClasses}
        disabled={disabled || qty <= 0}
        aria-label='Remove one item'
      >
        <MinusIcon className='h-4 w-4' aria-hidden='true' />
      </button>
      <span className='min-w-8 text-center text-sm font-medium text-gray-900'>
        {qty}
      </span>
      <button
        type='button'
        className={buttonClasses}
        disabled={disabled}
        aria-label='Add one item'
      >
        <PlusIcon className='h-4 w-4' aria-hidden='true' />
      </button>
      <button
        type='button'
        className={`${buttonClasses} text-red-700`}
        disabled={disabled || qty <= 0}
        aria-label='Remove product from the cart'
      >
        <TrashIcon className='h-4 w-4' aria-hidden='true' />
      </button>
    </div>
  )
}
