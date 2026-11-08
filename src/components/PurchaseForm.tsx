'use client'

import { FormEvent } from 'react'

const inputClasses =
  'mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-800 focus:outline-hidden focus:ring-1 focus:ring-gray-800'
const labelClasses = 'block text-sm font-medium text-gray-700'

/**
 * Checkout form. Client Component only so that the submit does not reload the
 * page: no purchase is made yet in this practice.
 */
export default function PurchaseForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
      <div>
        <label htmlFor='address' className={labelClasses}>
          Shipping address
        </label>
        <input
          id='address'
          name='address'
          type='text'
          required
          autoComplete='street-address'
          className={inputClasses}
        />
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div>
          <label htmlFor='cardHolder' className={labelClasses}>
            Card holder
          </label>
          <input
            id='cardHolder'
            name='cardHolder'
            type='text'
            required
            autoComplete='cc-name'
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor='cardNumber' className={labelClasses}>
            Card number
          </label>
          <input
            id='cardNumber'
            name='cardNumber'
            type='text'
            inputMode='numeric'
            required
            pattern='[0-9 ]{13,23}'
            placeholder='0000 0000 0000 0000'
            autoComplete='cc-number'
            className={inputClasses}
          />
        </div>
      </div>
      <div className='flex justify-center pt-2'>
        <button
          type='submit'
          className='rounded-md bg-gray-800 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:outline-hidden'
        >
          Purchase
        </button>
      </div>
    </form>
  )
}
