import { notFound } from 'next/navigation'
import Home from '../page'

export const dynamic = 'force-dynamic'

export default function DatePage({ params }) {
  var date = params.date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound()
  var d = new Date(date + 'T12:00:00')
  if (isNaN(d.getTime())) notFound()
  return <Home />
}
