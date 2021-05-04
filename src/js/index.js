import "./import";
import { NEWS_TYPE, ENUM_NEWS_TYPE } from "../data";
import LocalStorageHelper from "../utils/localStorage";
import { windowScrollToTop } from "../utils/utils";
import HomeModule from "../api/home";
import ComHeader from "../components/header";
import ComTabs from "../components/tabs";
import ComList from "../components/list";
import ComLoading from "../components/loading";

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
    renderOnceInit();
    
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
  const renderOnceInit = () => {
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

    /** 列表父容器 */
    const comListParent = ComList.tplParent({
      top: 48+32
    });

    /** 加载中的组件 */
    const comLoadingStr = ComLoading.tpl({
      top: 48+32
    });

    // 子组件填充
    state.appDom.innerHTML += (headerTplStr + tabsTplStr + comListParent + comLoadingStr);

    // 设置列表父节点
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
    // 展示图片
    ComList.showListImg();
  }

  /** 设置列表数据 */
  const setListData = async () => {
    const { type, count } = state.config;
    
    if (state.data[type]) {
      // 已有项
      console.log("已有项", state.data[type]);
      renderNewsList(state.data[type][state.config.pageNum], state.config.pageNum);
      return;
    }

    // 新项
    resetStateConfig(type);
    
    // 加载中图片 展示
    ComLoading.show();
    const result = await HomeModule.getNewsList(type, count);
    if (result) {
      // 加载中图片 隐藏
      ComLoading.hidden();
      state.data[type] = result;
      renderNewsList(state.data[type][state.config.pageNum], state.config.pageNum);
    }
  }

  /**
   * 重置请求记录状态配置
   * @param {String} type 默认 "top"
   */
  const resetStateConfig = (type) => {
    state.config.type = type || ENUM_NEWS_TYPE.TOP
    state.config.count = 10
    state.config.pageNum = 0
  }

  /**
   * tab栏切换事件回调
   * @param {*} tabName 
   * @returns 
   */
  const changeTabCallback = async (tabName) => {
    console.log("切换tab: ", tabName);

    // 切换新tab-1.重置旧的数据配置 2.listParent的内容清空
    resetStateConfig(tabName);
    state.listParentDom.innerHTML = "";

    // 滚动条回顶部
    windowScrollToTop();

    // 尝试重新设置列表数据
    setListData();
  }

  init();
})(document);
