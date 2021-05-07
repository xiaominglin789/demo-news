import "./import";
import HomeModule from "../api/home";
import ComHeader from "../components/header";
import ComDetail from "../components/detail";

((doc) => {

  const state = {
    /** 页面主节点 */
    appDom: doc.querySelector("#app"),
    /** 当前新闻简介数据 */
    data: HomeModule.getCurrentNewDetail(),
    /** 点赞dom */
    followDom: null,
    /** 是否已收藏 */
    isFollow: false
  }

  const init = async () => {
    if (state.data) {
      state.data = await HomeModule.getCurrentNewDetail();
      console.log(state.data);
      
      renderOnceInit();
      bindEvent();
      await setFollowStatus();
    }
  }

  /** 设置当前新闻的点赞状态 */
  const setFollowStatus = async () => {
    const index = await HomeModule.checkFollowRecord(state.data["uniquekey"]);
    state.isFollow = index !== -1 ? true : false;
    state.followDom.style.color = state.isFollow === true ? "red" : "#333333";
  }

  const renderOnceInit = () => {
    const comHeaderStr = ComHeader.tpl({
      leftUrl: window.location.search.match(/(?<=from=).*?((?=&)|$)/)[0],
      title: "",
      showLeftIcon: true,
      showRightIcon: true,
      rightIcon: "icon-shoucang",
      isFixed: true,
      top: 0,
      background: "#fff"
    })

    const comDetailStr = ComDetail.tpl({ url: state.data.url })
    
    state.appDom.innerHTML += (comHeaderStr + comDetailStr);
    state.followDom = document.querySelector(".btn.right");
  }

  const bindEvent = () => {
    ComHeader.bindEvent(headerRightIconClick);
  }

  /** top-bar 右侧按钮被点击 */
  const headerRightIconClick = async() => {
    // 修改缓存池的收藏记录
    await HomeModule.setFollowRecord(state.data["uniquekey"]);
    await setFollowStatus();
  }

  init();
})(document);