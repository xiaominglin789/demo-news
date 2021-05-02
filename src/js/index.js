import "./import";
import { NEWS_TYPE, ENUM_NEWS_TYPE } from "../data";
import { getNewsList } from "../api/api";
import ComHeader from "../components/header";
import ComTabs from "../components/tabs";
import ComList from "../components/list";
import LocalStorageHelper from "../utils/localStorage";

((doc) => {
  const state = {
    currentTabName: NEWS_TYPE[0].name,
    data: {}, // type: { list, page, size }
    page: 1,
    size: 30,
  }
  const appDom = doc.querySelector("#app");

  const init = async () => {
    await initListData();

    render();
    
    bindEvent();
  }

  /** 事件绑定处理 */
  const bindEvent = () => {
    ComTabs.bindEvent(changeTabCallback);

    // 页面关闭时,清理一次有时效的记录缓存
    window.addEventListener('beforeunload', e => {
      LocalStorageHelper.clearHasExpiredCache();
      return 1;
    })
  }

  const render = () => {
    /** 添加头区 */
    const headerTplStr = ComHeader.tpl({
      leftUrl: "/",
      rightUrl: "/collections.html",
      title: "新闻列表",
      showLeftIcon: false,
      showRightIcon: true,
    })
    appDom.innerHTML += headerTplStr;
    
    /** tabs栏 */
    const tabsTplStr = ComTabs.tpl({
      tabs: NEWS_TYPE,
      childWidth: '80'
    });
    appDom.innerHTML += tabsTplStr;

    console.log("数据: ", state.data[state.currentTabName]);
    
    /** 添加内容区 */
    if (!state.data[state.currentTabName]) return;
    
    if (state.data[state.currentTabName]["list"].length > 0) {
      const listStr = ComList.tpl({
        list: state.data[state.currentTabName]["list"],
      });
      appDom.innerHTML += listStr;
    }

    /** 添加尾部区 */
  }

  /** 页面数据请求初始化 */
  const initListData = async () => {
    const res = await getNewsList(state.currentTabName, state.page, state.size);

    if (res.error_code === 0) {
      state.data[state.currentTabName] = {
        list: [],
        page: 0,
        size: 0,
      };
      state.data[state.currentTabName].list = res.result.data;
      state.data[state.currentTabName].page = parseInt(res.result.page || 1);
      state.data[state.currentTabName].size = parseInt(res.result.pageSize || 30);
    }
  }

  /**
   * tab栏切换事件回调
   * @param {*} tabName 
   * @returns 
   */
  const changeTabCallback = async (tabName) => {
    console.log("触发 tabName : ", tabName);
    if (!tabName || tabName === state.currentPage) return;

    // 切换tab栏
    state.currentTabName = tabName;
    console.log("tab name: ", state.currentTabName);

    // 页面scroll滚动重置
    setTimeout(()=>{
        window.scrollTo(0, 0);
    }, 0);
    
    // return;

    // 请求
    const has = Object.keys(state.data).includes(tabName);
    if (!has) {
      // 新选项-初始化
      state.data[tabName] = {
        list: [],
        page: 0,
        size: 0,
      };
    }

    const res = await getNewsList(state.currentTabName, state.data[tabName].page + 1, state.size);
    if (res.error_code === 0) {
      state.data[tabName].list = [...res.result.data, ...state.data[tabName].list];
      state.data[tabName].page = parseInt(res.result.page);
      state.data[tabName].size = parseInt(res.result.pageSize);
      
      // 数据加载重新完毕-重新渲染list子页面
      resetListRender();
    }
  }

  /** 重新渲染list */
  const resetListRender = () => {
    /** 添加内容区 */
    const oldListDom = document.querySelector(".com-list");
    console.log("旧节点: ", oldListDom);
    appDom.removeChild(oldListDom);

    if (!state.data[state.currentTabName]) return;

    if (state.data[state.currentTabName]["list"].length > 0) {
      const listStr = ComList.tpl({
        list: state.data[state.currentTabName]['list'],
      });
      appDom.innerHTML += listStr;
    }

    /** 为何旧的列表节点被删除后, tabs点击回调失效了？ 他们有什么关联的地方??? */
    /** 重新绑定 tabs 点击事件才用? */
    ComTabs.bindEvent(changeTabCallback);
  }
  
  init();
})(document);
