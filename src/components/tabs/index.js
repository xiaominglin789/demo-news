import tpl from "./tpl/index.tpl";
import itemTpl from "./tpl/item.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComTabs",
    activeTabIndex: 0,
    tpl(options) {
        const { tabs, childWidth } = options;
        let tabsDom = "";
        const childDomWidth = childWidth + "px";
        /** 先填充子项数据 */
        tabs.forEach(({ name, title }, index) => {
            tabsDom += templateReplace(itemTpl, {
                title, name, width: childDomWidth,
                tabIndex: index,
                active: this.activeTabIndex === index ? 'active' : '' });
        });

        return templateReplace(tpl, { tabsDom });
    },
    bindEvent(callback) {
        console.log("xxxxxxxxxxxxxxxxxxxxxxx");
        const tabChildDoms = document.querySelectorAll(".tab");
        const tabsDom = document.querySelector(".tabs");

        tabsDom.addEventListener('click', this.__setNav.bind(this, tabChildDoms, callback), false);
    },
    /** 切换tab选项 */
    __setNav(items, callback) {
        console.log("+++++++++++++++++++");
        const targetDom = arguments[2].target;

        if ("tab" === targetDom.className.trim()) {
            // 需要切换旧的tab状态和设置新的tab状态
            items[this.activeTabIndex].className = "tab";

            targetDom.className += " active";
            this.activeTabIndex = targetDom.dataset.index;

            // 后调执行, 点击项的dataset.name 传给外部调用方作处理、
            const tabName = targetDom.dataset.name;
            console.log("-----------------------");
            callback(tabName);
        }
    }
}
