import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

/** 解析 tpl */
export default {
    name: "ComHeader",
    tpl(options) {
        const { leftUrl, rightUrl, title, showLeftIcon, showRightIcon, isFixed, top, background } = options;
        
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
            rightUrl,
            title,
            showLeftIcon: showLeftIcon ? "block" : "none",
            showRightIcon: showRightIcon ? "block" : "none",
            fixedStyle,    
        });
    }
}
