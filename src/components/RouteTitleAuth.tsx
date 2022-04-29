import { RouteTypeProps } from '@/types/routes-types';
import RouteAuth from './RouteAuth';
import HelmetComp from "@/components/HelmetComp";
import React, { useMemo } from 'react';

export default RouteTitleAuth

function FuncComponent(Component: React.FunctionComponent, title: string) {
  return () => ( 
    <div>
      <HelmetComp title={title} />
      <Component />
    </div>
  )
}

function RouteTitleAuth(props: RouteTypeProps) {
  const component = props.component as React.FunctionComponent

  return useMemo(() =>
    <RouteAuth path={props.path} component={FuncComponent(component, props.title)} />
  , [])
}