import "./import";
import { NEWS_TYPE, ENUM_NEWS_TYPE } from "../data";
import { getNewsList } from "../api/api";
import ComHeader from "../components/header";
import ComTabs from "../components/tabs";

((doc) => {
  const appDom = doc.querySelector("#app");

  async function getData() {
    const result = await getNewsList(ENUM_NEWS_TYPE.TOP);
    console.log(result);
  }

  const init = () => {
    render();
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

    /** 添加内容区 */
    /** 添加尾部区 */
  }
  

  init();
})(document);
