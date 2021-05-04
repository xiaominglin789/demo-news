import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComLoading",
    tpl(options) {
        const {top} = options;

        return templateReplace(tpl, {
            display: "none",
            top
        });
    },
    show() {
        console.log(document.querySelector(".loading-box"));
        document.querySelector(".loading-box").style.display = "block";
    },
    hidden() {
        document.querySelector(".loading-box").style.display = "none";
    }
}