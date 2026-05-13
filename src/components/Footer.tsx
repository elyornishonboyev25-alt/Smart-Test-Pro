import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="panel-surface w-full overflow-hidden border-t border-red-100/80 bg-white/95">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">SmartTest Pro</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Advanced testing platform for SAT and IELTS students with measurable, competitive progress.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-red-700">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link to="/tests" className="transition-colors hover:text-red-700">Practice Tests</Link></li>
            <li><Link to="/mock" className="transition-colors hover:text-red-700">Mock Arena</Link></li>
            <li><Link to="/speaking-community" className="transition-colors hover:text-red-700">Speaking Community</Link></li>
            <li><Link to="/profile" className="transition-colors hover:text-red-700">Performance</Link></li>
            <li><Link to="/account" className="transition-colors hover:text-red-700">Profile Center</Link></li>
            <li><Link to="/ielts" className="transition-colors hover:text-red-700">IELTS Modules</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-red-700">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link to="/about" className="transition-colors hover:text-red-700">About</Link></li>
            <li><Link to="/login" className="transition-colors hover:text-red-700">Sign In</Link></li>
            <li><Link to="/sat" className="transition-colors hover:text-red-700">SAT Track</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-red-700">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>elyornishonboyev000@gmail.com</li>
            <li>+998 77 481 30 60</li>
            <li>Uzb, Jizzax, Zomin</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-red-100 py-4 text-center text-sm text-slate-500">
        (c) {currentYear} SmartTest Pro. All rights reserved.
      </div>
    </footer>
  )
}
