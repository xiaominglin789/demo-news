import "./import";
import HomeModule from "../api/home";
import ComHeader from "../components/header";
import ComDetail from "../components/detail";

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
      
      renderOnceInit();

      await initFollowStatus();

      bindEvent();
    }
  }

  /** 初始化当前新闻的点赞状态 */
  const initFollowStatus = async () => {
    const { has } = await HomeModule.checkFollowRecord(state.data["uniquekey"]);
    console.log("新闻的初始状态: ", has);
    state.isFollow = has;
    // 设置dom样式
    state.followDom.style.color = state.isFollow ? "red" : "#333333";
  }

  /** 修改当前新闻的点赞状态 */
  const changeFollowStatus = async () => {
    const bool = await HomeModule.setFollowRecord(state.data);
    if (bool) {
      state.isFollow = !state.isFollow;
      // 设置dom样式
      state.followDom.style.color = state.isFollow ? "red" : "#333333";
    }
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
    // 取到右侧收藏图标节点
    state.followDom = document.querySelector(".btn.right");
  }

  const bindEvent = () => {
    ComHeader.bindEvent(headerRightIconClick);
  }

  /** top-bar 右侧按钮被点击 */
  const headerRightIconClick = async() => {
    // 修改缓存池的收藏记录
    await changeFollowStatus();
  }

  init();
})(document);