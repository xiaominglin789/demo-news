import tpl from "./tpl/index.tpl";
import itemTpl from "./tpl/item.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComTabs",
    activeTabIndex: 0,
    tabsClassName: "com-tabs",
    tabsChildClassName: "tab",
    /** 子组件渲染 */
    tpl(options) {
        const { tabs, childWidth, isFixed, top, background } = options;
        let tabsDom = "";
        const childDomWidth = childWidth + "px";
        /** 先填充子项数据 */
        tabs.forEach(({ name, title }, index) => {
            tabsDom += templateReplace(itemTpl, {
                title, name, width: childDomWidth,
                tabIndex: index,
                active: this.activeTabIndex === index ? 'active' : '' });
        });

        let fixedStyle = "";
        /** 是否开启头部定位 */
        if (isFixed) {
            if (isFixed) {
                fixedStyle = "position: fixed; top: " + (top||0) + "px;";
            }
        }
        if (background) {
            fixedStyle += ";background-color: " + background;
        }

        return templateReplace(tpl, { tabsDom, fixedStyle });
    },
    /** 子组件事件处理 */
    bindEvent(changeTabName) {
        const tabChildDoms = document.querySelectorAll("." + this.tabsChildClassName);
        const tabsDom = document.querySelector("." + this.tabsClassName);

        tabsDom.addEventListener('click', this.__setNavTab.bind(this, tabChildDoms, changeTabName), false);
    },
    /** 切换tab选项 */
    __setNavTab(items, changeTabName) {
        const targetDom = arguments[2].target;
        
        // 对点击当前激活的tab 由于已激活的tab.class = "tab active" 是不会触发切换逻辑的
        if (this.tabsChildClassName === targetDom.className.trim()) {
            // 需要切换旧的tab状态和设置新的tab状态
            items[this.activeTabIndex].className = this.tabsChildClassName;

            targetDom.className += " active";
            this.activeTabIndex = targetDom.dataset.index;

            // 后调执行, 点击项的dataset.name 传给外部调用方作处理、
            const tabName = targetDom.dataset.name;
            // 执行切换回调
            changeTabName(tabName);
        }
    }
}
