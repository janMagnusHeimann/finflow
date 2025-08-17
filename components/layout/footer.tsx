import { Coffee } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ by the FinFlow team. Open source and free forever.
          </p>
        </div>
        <a
          href={`https://buymeacoffee.com/${process.env.NEXT_PUBLIC_BMC_USERNAME || 'finflow'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
        >
          <Coffee className="mr-2 h-4 w-4" />
          Buy Me a Coffee
        </a>
      </div>
    </footer>
  )
}