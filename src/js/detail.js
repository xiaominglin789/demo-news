import "./import";
import HomeModule from "../api/home";
import ComHeader from "../components/header";
import ComDetail from "../components/detail";
import ComFollow from "../components/follow";

((doc) => {

  const state = {
    /** 页面主节点 */
    appDom: doc.querySelector("#app"),
    /** 当前新闻简介数据 */
    data: null,
    /** 点赞dom */
    followDom: null,
    /** 是否已收藏 */
    isFollow: false
  }

  const init = async () => {
    if (!state.data) {
      state.data = await HomeModule.getCurrentNewDetail();
      
      await renderOnceInit();

      bindEvent();
    }
  }

  /** 修改当前新闻的点赞状态 */
  const changeFollowStatus = async () => {
    const bool = await HomeModule.setFollowRecord(state.data);
    if (bool) {
      state.isFollow = !state.isFollow;
      // 设置dom样式
      state.isFollow ? ComFollow.tplFollow() : ComFollow.tplUnFollow() ;
    }
  }

  const renderOnceInit = async () => {
    const comHeaderStr = ComHeader.tpl({
      leftUrl: window.location.search.match(/(?<=from=).*?((?=&)|$)/)[0],
      title: "",
      showLeftIcon: true,
      isFixed: true,
      background: "#fff"
    })

    const comDetailStr = ComDetail.tpl({ url: state.data.url });
    
    const comFollowStr = await initRenderFollow();
    
    state.appDom.innerHTML += (comHeaderStr + comDetailStr + comFollowStr);
  }

  const initRenderFollow = async () => {
    if (state.data) {
      const { has } = await HomeModule.checkFollowRecord(state.data["uniquekey"]);
      console.log("点赞状态: ", has ? true : false);
      return has ? ComFollow.tplFollow() : ComFollow.tplUnFollow() ;
    }
    return "";
  }

  const bindEvent = () => {
    ComHeader.bindEvent();
    ComFollow.bindEvent(headerRightIconClick);
  }

  /** top-bar 右侧按钮被点击 */
  const headerRightIconClick = async() => {
    // 修改缓存池的收藏记录
    await changeFollowStatus();
  }

  init();
})(document);