import "./import";
import { NEWS_TYPE, ENUM_NEWS_TYPE } from "../data";
import LocalStorageHelper from "../utils/localStorage";
import { windowScrollToTop } from "../utils/utils";
import HomeModule from "../api/home";
import ComHeader from "../components/header";
import ComTabs from "../components/tabs";
import ComList from "../components/list";

((doc) => {
  const state = {
    config: {
      type: ENUM_NEWS_TYPE.TOP, // 当前切换的tab栏
      count: 10, // 每次请求10条,
      pageNum: 0, // 当前type-tab请求的页数
    },
    data: {}, // top: [],guonei: [] ...
    appDom: doc.querySelector("#app"), // 页面主节点
    listParentDom: null, // 列表父组件节点
  }

  const init = async () => {
    // 绑定系统级别的事件: 页面关闭时,清理一次有时效的记录缓存
    window.addEventListener('beforeunload', e => {
      LocalStorageHelper.clearHasExpiredCache();
      return 1;
    });

    // 渲染主骨架
    render();
    
    // 请求页面基础数据
    await setListData();

    // 绑定事件
    bindEvent();
  }

  /** 事件绑定处理 */
  const bindEvent = () => {
    ComTabs.bindEvent(changeTabCallback);
  }

  /** 渲染主骨架 */
  const render = () => {
    /** 添加头区 */
    const headerTplStr = ComHeader.tpl({
      leftUrl: "/",
      rightUrl: "/collections.html",
      title: "新闻列表",
      showLeftIcon: false,
      showRightIcon: true,
      isFixed: true,
      top: 0,
      background: "#fff"
    })
    
    /** tabs栏 */
    const tabsTplStr = ComTabs.tpl({
      tabs: NEWS_TYPE,
      childWidth: '80',
      isFixed: true,
      top: 48,
      background: "#fff"
    });

    const comListParent = ComList.tplParent({
      top: 48+32
    });
    
    // 子组件填充
    state.appDom.innerHTML += (headerTplStr + tabsTplStr + comListParent);

    // 找出列表父节点
    state.listParentDom = doc.querySelector(".com-list");
  }

  /** 渲染列表 */
  const renderNewsList = (data, pageNum) => {
    if (!state.listParentDom) return;

    // 添加列表元素
    state.listParentDom.innerHTML += ComList.tpl({
      list: data,
      pageNum
    })
    console.log(state.listParentDom);
    ComList.showListImg();
  }

  /** 数据请求 */
  const setListData = async () => {
    const { type, count } = state.config;
    const result = await HomeModule.getNewsList(type, count);
    
    if (state.data[type]) {
      return;
    } else {
      // 新项
      state.data[type] = result;
      console.log("数据: ", state.data);

      renderNewsList(state.data[type][0], 0);
    }
  }

  /**
   * tab栏切换事件回调
   * @param {*} tabName 
   * @returns 
   */
  const changeTabCallback = async (tabName) => {
    console.log("切换tab: ", tabName);
    windowScrollToTop();
  }

  
  init();
})(document);
