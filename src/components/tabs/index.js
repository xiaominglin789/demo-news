import tpl from "./tpl/index.tpl";
import itemTpl from "./tpl/item.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComTabs",
    tpl(options) {
        const { tabs, childWidth } = options;
        let tabsDom = "";
        const childDomWidth = childWidth + "px";
        /** 先填充子项数据 */
        tabs.forEach(({ name, title }, index) => {
            const activeTabIndex = 0;
            tabsDom += templateReplace(itemTpl, {
                title, name, width: childDomWidth,
                tabIndex: index,
                active: activeTabIndex === index ? 'active' : '' });
        });

        return templateReplace(tpl, { tabsDom });
    },
}
