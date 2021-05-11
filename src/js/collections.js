import "./import";
import ComCollectionList from "../components/list";
import ComHeader from "../components/header";
import HomeModule from "../api/home";

((doc) => {
  const state = {
    data: null,
    appDom: doc.querySelector("#app"),
    listParent: null
  }

  const init = async() => {
    state.data = await HomeModule.getFollowList();
    console.log(state.data);

    render();

    bindEvent();
  }

  const render = () => {
    const comHeaderStr = ComHeader.tpl({
      leftUrl: "/",
      title: "收藏列表",
      showLeftIcon: true,
      isFixed: true,
      top: 0,
      background: "#fff"
    })
    const comCollectionListParentStr = ComCollectionList.tplParent({
      top: 48
    });

    state.appDom.innerHTML += (comHeaderStr + comCollectionListParentStr);
    state.listParent = doc.querySelector(".com-list");

    if (state.data) {
      renderList(state.data);
    } {
      state.listParent.innerHTML = "<p class='com-tip' style='padding:12px;text-align:center;margin-top: 48px;'>你还未收藏</p>";
    }
  }

  const renderList = (data) => {
    if (!state.listParent) return;

    state.listParent.innerHTML = ComCollectionList.tpl({
      list: data,
      pageNum: 0
    })
    ComCollectionList.imageLazyLoad();
  }

  const bindEvent = () => {
    if (state.data) {
      ComCollectionList.bindEvent(state.listParent, clickCollectionsItem);
    }
  }

  const clickCollectionsItem = async (page, index) => {
    const current = state.data[index];
    await HomeModule.setHistoryCache(current.uniquekey, current);
  }

  init();
})(document);