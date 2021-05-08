import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";
import _url from "../../assets/img/default.gif";

export default {
    name: "ComEmpty",
    block: false,
    target: null,
    className: "com-empty",
    tpl(title, url) {
        return templateReplace(tpl, {
            title: title || "Empty",
            url:  url || _url,
            styleStr: "display: none;"
        });
    },
    bindEvent() {
        this.target = document.querySelector("." + this.className);
    },
    hidden() {
        if (this.target) {
            this.target.style.display = "none";
        }
    },
    show() {
        if (this.target) {
            this.target.style.display = "block";
        }
    },
}