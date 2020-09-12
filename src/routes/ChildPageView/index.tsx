import React from 'react'
import { Switch, Route } from 'react-router-dom'

export interface RenderPageNode {
  path: string
  component: () => JSX.Element
  exact?: boolean
}

export interface PropType {
  data: RenderPageNode[]
}

const RenderChildViews = (props: PropType) => {
  return (
    <Switch>
      {props.data.map((item, index) => (
        <Route
          exact={item.exact ? true : false}
          path={item.path}
          component={item.component}
          key={index}
        />
      ))}
    </Switch>
  )
}

export default RenderChildViews
