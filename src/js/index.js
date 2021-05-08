import "./import";
import { NEWS_TYPE, ENUM_NEWS_TYPE } from "../data";
import LocalStorageHelper from "../utils/localStorage";
import {
  throttle,
  windowScrollTo,
  checkScrollOverBottom,
  getClientViewHeight,
  getScrollTop
} from "../utils/utils";
import HomeModule from "../api/home";
import ComHeader from "../components/header";
import ComTabs from "../components/tabs";
import ComList from "../components/list";
import ComLoading from "../components/loading";
import ComToTop from "../components/totop";
import ComLoadMore from "../components/loadmore";
import ComEmpty from "../components/empty";

((doc) => {
  const state = {
    /** 显示回到顶部拖的最小高度，300px */
    showToTopMinHeight: 300,
    /** 配置选项 */
    config: {
      /** 当前切换的tab栏 */
      type: ENUM_NEWS_TYPE.TOP,
      /** 默认:每次请求10条 */
      count: 10,
      /** 当前type-tab请求的页数, 默认 0 */
      pageNum: 0
    },
    /** 缓存列表数据 map: top: [[..],[..],[..]],guonei: [].. */
    data: {}, 
    /** 页面主节点 id=app */
    appDom: doc.querySelector("#app"),
    /** 列表父组件节点 */
    listParentDom: null,
    /** 是否正在加载,处理加载更多时的状态 */
    loadingStatus: false,
    /** 加载更多的定时器 */
    loadMoreTimer: null,
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
    windowScrollTo(0, 2);

    // 绑定事件
    bindEvent();
  }

  /** 事件绑定处理 */
  const bindEvent = () => {
    ComTabs.bindEvent(changeTabCallback);
    ComToTop.bindEvent(windowScrollTo);
    ComList.bindEvent(state.listParentDom, clickNewDetailCallbackOldBeta);
    ComHeader.bindEvent(headerRightIconClick);

    // window滚动事件
    window.onscroll = throttle(scrollEvent, 500);
  }

  /** 滚动事件 */
  const scrollEvent = async() => {
    ComList.showListImg(getClientViewHeight());

    // 控制回到顶部的图标显示隐藏
    if (getScrollTop() > state.showToTopMinHeight) {
      ComToTop.showToTopIcon();
    } else {
      ComToTop.hideToTopIcon();
    }

    checkScrollOverBottom(getMoreList);
  }

  /** top-bar 右侧按钮被点击 */
  const headerRightIconClick = (dom) => {
    window.location.href = "./collections.html"
  }

  /** 渲染主骨架 */
  const renderOnceInit = () => {
    /** 添加头区 */
    const headerTplStr = ComHeader.tpl({
      leftUrl: "/",
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

    /** 到顶部组件 */
    const comToTopStr = ComToTop.tpl();

    /** empty组件 */
    // const comEmptyStr = ComEmpty.tpl();

    // 子组件填充
    state.appDom.innerHTML += (headerTplStr + tabsTplStr + comListParent + comLoadingStr + comToTopStr);

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
  }

  /** 设置列表数据 */
  const setListData = async () => {
    const { type, count } = state.config;

    // 主动触发细微滚动事件,切换tab过程的初始化可见视口内的图片有限加载出来

    if (state.data[type]) {
      // 已有项
      console.log("已有项", state.data[type]);
      renderNewsList(state.data[type][state.config.pageNum], state.config.pageNum);
      return;
    }

    // 新tab项: 加载中图片-展示, 渲染
    resetStateConfig(type);
    ComLoading.show();

    try {
      const result = await HomeModule.getNewsList(type, count);
      if (result) {
        removeTip();

        // 加载中图片 隐藏
        ComLoading.hidden();
        state.data[type] = result;
        renderNewsList(state.data[type][state.config.pageNum], state.config.pageNum);
      }
    } catch (error) {
      // 加载中图片 隐藏
      ComLoading.hidden();
      addTip(error);
    }
  }

  /** 添加 */
  const addTip = (text) => {
    if (!state.listParentDom.querySelector(".com-tip")) {
      state.listParentDom.innerHTML += "<p class='com-tip' style='padding:12px;text-align:center;margin-top: 48px;'>"+ text +"</p>"
    }
  }

  /** 移除提示 */
  const removeTip = () => {
    const has = state.listParentDom.querySelector(".com-tip");
    if (has) {
      state.listParentDom.reomveChildren(has);
    }
  }

  /**
   * 获取更多
   */
  const getMoreList = async() => {
    if (!state.data[state.config.type]) return;

    if (!state.loadingStatus) {
      clearTimeout(state.loadMoreTimer);
      // 开锁
      state.loadingStatus = true;
      // 
      state.config.pageNum++;
      const { pageNum, type} = state.config;
      // 判断是否已加载到最大页数了
      if (pageNum >= state.data[type].length) {
        ComLoadMore.add(state.listParentDom, true);
      } else {
        //可以加载更多
        const newData = state.data[type][pageNum];
        // 展示加载更多提示
        ComLoadMore.add(state.listParentDom);
        // TODO 控制延迟
        state.loadMoreTimer = setTimeout(() => {
          // 关锁
          state.loadingStatus = false;
          // 到达最大页数
          // 执行渲染
          renderNewsList(newData, state.config.pageNum);
          ComLoadMore.remove(state.listParentDom);
        }, 1000);
      }
    }
  }

  /**
   * 重置请求记录状态配置
   * @param {String} type 默认 "top"
   */
  const resetStateConfig = (type) => {
    state.config.type = type || ENUM_NEWS_TYPE.TOP;
    state.config.count = 10;
    state.config.pageNum = 0;
    state.loadingStatus = false;
  }

  /**
   * tab栏切换事件回调
   * @param {*} tabName 
   * @returns 
   */
  const changeTabCallback = async (tabName) => {
    // 切换新tab-1.重置旧的数据配置 2.listParent的内容清空
    resetStateConfig(tabName);
    state.listParentDom.innerHTML = "";

    // 滚动条回顶部
    windowScrollTo();

    // 尝试重新设置列表数据
    setListData();
    windowScrollTo(0, 2);
  }

  /**
   * 点击到某项新闻
   * @param {*} uniquekey 
   */
  // const clickNewDetailCallbackNewBeta = (uniquekey) => {
  //   // 新版 api 有新闻详情的接口,但是避免接口调用次数限制。
  //   // 扔使用iframe套url新闻详情页的方法来处理。
  //   if (uniquekey) {
  //     console.log("点击到： ", uniquekey)
  //     location.href = "./detail.html?uniquekey=" + uniquekey;
  //   } 
  // }

  /**
   * 点击到某项新闻-old
   * 缓存该项新闻数据,跳转详情页,通过iframe,渲染数据里的url
   */
  const clickNewDetailCallbackOldBeta = async (page, index) => {
    const current = state.data[state.config.type][page][index];
    await HomeModule.setHistoryCache(current.uniquekey, current);
  }

  init();
})(document);
