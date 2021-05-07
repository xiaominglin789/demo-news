import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComLoading",
    loadingDom: null,
    loadingClassName: "loading-box",
    tpl(options) {
        const {top} = options;
        return templateReplace(tpl, {
            display: "none",
            top
        });
    },
    show() {
        if (!this.loadingDom) {
            this.loadingDom = document.querySelector("."+this.loadingClassName);
        }
        this.loadingDom.style.display = "block";
    },
    hidden() {
        if (!this.loadingDom) {
            this.loadingDom = document.querySelector("."+this.loadingClassName);
        }
        this.loadingDom.style.display = "none";
    }
}