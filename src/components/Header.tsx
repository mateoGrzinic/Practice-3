export default function Header() {
  return (
    <header className='mx-auto w-full bg-red-900 px-6 pt-24 pb-16 text-center sm:pt-28 sm:pb-20 lg:px-8 lg:pt-32 lg:pb-24'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='text-6xl font-bold text-white sm:text-7xl lg:text-8xl'>
          DriveDeal
        </h1>
        <p className='mt-4 text-sm leading-8 text-white sm:mt-6 sm:text-base lg:text-lg'>
          The car marketplace created by drivers for drivers
        </p>
      </div>
    </header>
  )
}
