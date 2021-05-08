import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComEmpty",
    tpl({ title, url }) {
        return templateReplace(tpl, {
            title: title || "Empty",
            url: url || "<%= require('../../assets/img/loading.gif') %>"
        });
    }
}