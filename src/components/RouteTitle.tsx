import { Route } from 'wouter'
import HelmetComp from "@/components/HelmetComp";
import { RouteTypeProps } from '@/types/routes-types';

export default RouteTitle

function RouteTitle(props: RouteTypeProps) {
  const Component = props.component as React.FunctionComponent

  return (
    <Route path={props.path}>
      <div>
        <HelmetComp title={props.title} />
        <Component />
      </div>
    </Route>
  )
}