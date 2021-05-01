import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

/** 解析 tpl */
export default {
    name: "ComHeader",
    tpl(options) {
        const { leftUrl, rightUrl, title, showLeftIcon, showRightIcon } = options;
        return templateReplace(tpl, {
            leftUrl,
            rightUrl,
            title,
            showLeftIcon: showLeftIcon ? "block" : "none",
            showRightIcon: showRightIcon ? "block" : "none",
        });
    }
}
