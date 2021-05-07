import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComHeader",
    /** tpl文本 */
    tpl(options) {
        const { leftUrl, rightUrl, title, showLeftIcon, showRightIcon, rightIcon, isFixed, top, background } = options;
        
        let fixedStyle = "";
        /** 是否开启头部定位 */
        if (isFixed) {
            fixedStyle = "position: fixed; top: " + (top||0) + "px;";
        }
        if (background) {
            fixedStyle += ";background-color: " + background;
        }

        return templateReplace(tpl, {
            leftUrl,
            title,
            showLeftIcon: showLeftIcon ? "block" : "none",
            showRightIcon: showRightIcon ? "block" : "none",
            rightIcon: rightIcon ? rightIcon : "icon-yanchurili",
            fixedStyle,    
        });
    },
    bindEvent(callback) {
        const rightIconDom = document.querySelector(".btn.right");
        if (rightIconDom) {
            rightIconDom.addEventListener("click", this.__clickRightEvent.bind(this, callback), false);
        }
    },
    __clickRightEvent(callback) {
        callback();
    }
}
