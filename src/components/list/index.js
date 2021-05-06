import tpl from "./tpl/index.tpl";
import item0Tpl from "./tpl/item_0.tpl";
import item1Tpl from "./tpl/item_1.tpl";
import item2Tpl from "./tpl/item_2.tpl";
import item3Tpl from "./tpl/item_3.tpl";
import { lazyImageLoader, templateReplace, __getClientViewHeight } from "../../utils/utils";
import "./index.scss";

export default {
    name: "ComList",
    toTopDom: null,
    tpl(options) {
        const { list, pageNum } = options
        let listChildsStr = "";
        let tplVar = item0Tpl;
        
        if (!list || !list.length) return "";
        
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
    /**
     * 滚动可见区域,才显示图片
     */
    showListImg(clientViewHeight) {
        if (!clientViewHeight) { 
            clientViewHeight = __getClientViewHeight();
        }

        const imgsDom = document.querySelectorAll(".list-img");

        // 监听可见区域, 控制 imgsDom 的 opacity 即可
        [...imgsDom].forEach((child) => {
            // 图片可视边界
            const curRect = child.getBoundingClientRect();
            if (curRect.top < clientViewHeight && curRect.bottom > 0) {
                // 满足可视区域内才加载对应的图片
                const temp = new Image();
                temp.src = child.dataset.img;
                temp.onload = () => {
                    child.src = temp.src;
                }
            }
        })
        
    }
}