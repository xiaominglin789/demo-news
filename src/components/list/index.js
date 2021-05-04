import tpl from "./tpl/index.tpl";
import item0Tpl from "./tpl/item_0.tpl";
import item1Tpl from "./tpl/item_1.tpl";
import item2Tpl from "./tpl/item_2.tpl";
import item3Tpl from "./tpl/item_3.tpl";
import { lazyImageLoader, templateReplace } from "../../utils/utils";
import "./index.scss";

export default {
    name: "ComList",
    tpl(options) {
        const { list, pageNum } = options
        let listChildsStr = "";
        let tplVar = item0Tpl;

        list.forEach(({
            thumbnail_pic_s,
            thumbnail_pic_s02,
            thumbnail_pic_s03,
            author_name: author,
            date,
            title,
            url,
            uniquekey
          }, index) => {
            if (!thumbnail_pic_s) {
                tplVar = item0Tpl;
            } else if (thumbnail_pic_s && !thumbnail_pic_s02) {
                tplVar = item1Tpl;
            } else if (thumbnail_pic_s && thumbnail_pic_s02 && !thumbnail_pic_s03) {
                tplVar = item2Tpl;
            } else if (thumbnail_pic_s03) {
                tplVar = item3Tpl;
            }

            listChildsStr += templateReplace(tplVar, {
                thumbnail_pic_s,
                thumbnail_pic_s02,
                thumbnail_pic_s03,
                author,
                date,
                title,
                url,
                index,
                uniquekey,
                pageNum,
            })
        });

        return listChildsStr
    },
    tplParent(options) {
        const { top } = options
        return templateReplace(tpl, { listDomStr: "", top })
    },
    bindEvent(callback) {
    },
    showListImg() {
        const imgsDom = document.querySelectorAll(".list-img");
        console.log("imgsDom ", imgsDom);

        // const dateDom = document.querySelectorAll("date");
        // console.log("dateDom ", dateDom);

        // const infoDom = document.querySelectorAll("info");
        // console.log("infoDom ", infoDom);
        // [...imgsDom].forEach((child, index) => {
        //     lazyImageLoader(child, child.dataset.img);
        // })
    }
}