import tpl from "./tpl/index.tpl";
import itemTpl from "./tpl/item.tpl";
import { templateReplace } from "../../utils/utils";
import "./index.scss";

export default {
    name: "ComList",
    tpl(options) {
        const { list } = options
        let listDom = "";

        list.forEach(({
            thumbnail_pic_s: img,
            author_name: author,
            date,
            title,
            url
          }, index) => {
            listDom += templateReplace(itemTpl, {
                img,
                author,
                date,
                title,
                url,
                index
            })
        });

        return templateReplace(tpl, { listDom })
    },
    bindEvent(callback) {
    },
}