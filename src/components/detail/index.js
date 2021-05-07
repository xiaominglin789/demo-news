import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComDetail",
    tpl({ url }) {
        return templateReplace(tpl, { url });
    }
}