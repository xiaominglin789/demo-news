import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComToTop",
    block: false,
    target: null,
    tpl() {
        return templateReplace(tpl, {
            styleStr: "display: " + (this.block ? "block;" : "none;")
        });
    },
    bindEvent(callback) {
        this.target = document.querySelector(".com-totop");
        this.target.addEventListener("click", this.__setToTop.bind(this, callback), false);    
    },
    hideToTopIcon() {
        this.target.style.display = "none";
    },
    showToTopIcon() {
        this.target.style.display = "block";
    },
    __setToTop(callback) {
        callback();
    },
}