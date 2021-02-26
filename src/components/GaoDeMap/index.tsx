/*
 * @Description 高德地图组件
 * @Author bihongbin
 * @Date 2020-12-03 16:34:09
 * @LastEditors bihongbin
 * @LastEditTime 2021-01-07 10:06:49
 */

import React, {
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { v4 as uuidV4 } from 'uuid'
import useReactive from '@/hooks/useReactive'

interface PropType {
  className?: string
  style?: React.CSSProperties
  onChange?: (data: MapType) => void
}

export type positionType = [number, number]

export interface MapCallType {
  setMapCenter: (data: positionType, zoom?: number) => void
}

export interface MapType {
  adcode: string
  address: string
  city: any[]
  district: string
  id: string
  name: string
  typecode: string
  location: {
    KL: number
    className: string
    KT: number
    lat: number
    lng: number
    pos: positionType
  }
}

interface StateType {
  searchValue: string
  selectedRow: MapType | undefined
  searchResultList: MapType[]
}

const GaoDeMap = (props: PropType, ref: any) => {
  const mapRef = useRef<any>(null)
  const state = useReactive<StateType>({
    searchValue: '', // 关键字
    selectedRow: undefined, // 当前搜索选中的地址
    searchResultList: [], // 关键字查到的数据
  })

  /**
   * @Description 缓存生成的随机id
   * @Author bihongbin
   * @Date 2020-12-03 15:36:38
   */
  const uid = useMemo(() => uuidV4(), [])

  /**
   * @Description 关键字查询
   * @Author bihongbin
   * @Date 2020-12-03 17:03:30
   */
  const keywordSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    state.searchValue = e.target.value
    AMap.plugin('AMap.AutoComplete', () => {
      // 实例化Autocomplete
      let autoOptions = {
        city: '全国',
      }
      let autoComplete = new AMap.Autocomplete(autoOptions)
      autoComplete.search(e.target.value, (status: any, result: any) => {
        if (result.info === 'OK') {
          state.searchResultList = result.tips
        }
      })
    })
  }

  /**
   * @Description 设置地图中心位置和层级
   * @Author bihongbin
   * @Date 2020-12-04 09:57:32
   */
  const setMapCenterLocation = (location: positionType, zoom?: number) => {
    if (mapRef.current) {
      // 添加坐标图
      mapRef.current.add(
        new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: location,
        }),
      )
      mapRef.current.setZoom(zoom ? zoom : 18) // 设置地图层级
      mapRef.current.setCenter(location) // 设置地图中心点
    }
  }

  /**
   * @Description 选择地址
   * @Author bihongbin
   * @Date 2020-12-03 17:54:53
   */
  const selectedKeyWord = (item: MapType) => {
    if (props.onChange) {
      props.onChange(item)
    }
    setMapCenterLocation([item.location.lng, item.location.lat])
    state.selectedRow = item // 保存当前选中项
    state.searchValue = `${item.district}${item.name}`
    state.searchResultList = []
  }

  /**
   * @Description 加载地图文件
   * @Author bihongbin
   * @Date 2020-12-03 15:44:04
   */
  useEffect(() => {
    const loadMap = () => {
      mapRef.current = new AMap.Map(uid, {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        zoom: 11, // 初始地图级别
      })
    }
    if (document.getElementById('lbs')) {
      loadMap()
    } else {
      window.onLoad = function () {
        loadMap()
      }
      let url =
        'https://webapi.amap.com/maps?v=2.0&key=e16022916794d5fb8dbfd80b187b694d&callback=onLoad'
      let jsApi = document.createElement('script')
      jsApi.charset = 'utf-8'
      jsApi.src = url
      jsApi.id = 'lbs'
      document.head.appendChild(jsApi)
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy() // 销毁地图实例
      }
    }
  }, [uid])

  /**
   * @Description 暴露方法给父组件使用
   * @Author bihongbin
   * @Date 2020-12-04 10:02:19
   */
  useImperativeHandle<any, MapCallType>(ref, () => ({
    // 根据经纬度设置地图中心点 data=[longitude, latitude]
    setMapCenter: (data, zoom) => {
      setMapCenterLocation(data, zoom)
    },
  }))

  return (
    <div className={`gaoDe-container ${props.className}`}>
      <div
        id={uid}
        style={props.style ? props.style : { width: '100%', height: 365 }}
      />
      <div className="input-item-prepend">
        <span className="ant-input-group-wrapper">
          <span className="ant-input-wrapper ant-input-group">
            <span className="ant-input-group-addon">关键字</span>
            <span className="ant-input-affix-wrapper">
              <input
                className="ant-input"
                value={state.searchValue}
                type="text"
                placeholder="请输入关键字"
                onChange={keywordSearch}
              />
            </span>
          </span>
          {state.searchResultList.length ? (
            <ul className="gaoDe-search-result">
              {state.searchResultList.map((item, index) => (
                <li
                  key={index}
                  role="presentation"
                  onClick={() => {
                    selectedKeyWord(item)
                  }}
                >
                  {item.district}
                  {item.name}
                </li>
              ))}
            </ul>
          ) : null}
        </span>
      </div>
    </div>
  )
}

export default React.memo(forwardRef(GaoDeMap))
