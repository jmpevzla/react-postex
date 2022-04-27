import { Helmet } from 'react-helmet-async'

export default HelmetComp

function HelmetComp({ title }: { title: string }) {
  return (
    <Helmet>
      <title>Postex.io - { title }</title>
    </Helmet>
  )
}