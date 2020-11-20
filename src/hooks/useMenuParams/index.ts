import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { RootStateType } from '@/store/rootReducer'
import { queryCurrentMenuObject } from '@/utils'

/**
 * @Description 查找当前路由对象
 * @Author bihongbin
 * @Param { Boolean } congruent url判断是否使用全等判断 true全等
 * @Date 2020-10-15 18:24:52
 */
function useMenuParams(congruent?: boolean) {
  const location = useLocation()
  const { tabLayout } = useSelector((state: RootStateType) => state.auth)

  return queryCurrentMenuObject(tabLayout.tabList, location.pathname, congruent)
}

export default useMenuParams
