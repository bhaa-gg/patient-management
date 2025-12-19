import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  isLoading?: boolean
}

const SubmitButton = ({ isLoading = false, className, children, ...props }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn(' bg-green-500 text-white w-full', className)}
      key={isLoading ? 'loading' : 'loaded'}
      {...props}
    >
      {isLoading ? (
        <div key={isLoading ? 'loading' : 'loaded'} className="flex items-center gap-3">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={20}
            height={20}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

export default SubmitButton
