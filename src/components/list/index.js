import tpl from "./tpl/index.tpl";
import item0Tpl from "./tpl/item_0.tpl";
import item1Tpl from "./tpl/item_1.tpl";
import item2Tpl from "./tpl/item_2.tpl";
import item3Tpl from "./tpl/item_3.tpl";
import { templateReplace, __getClientViewHeight } from "../../utils/utils";
import "./index.scss";

export default {
    name: "ComList",
    childItemClassName: "com-list-item",
    listItemImgClassName: "list-img",
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
        return templateReplace(tpl, { listDomStr: "", top: top||0 })
    },
    /**
     * 滚动可见区域,才显示图片
     */
    showListImg(clientViewHeight) {
        const imgsDom = document.querySelectorAll("."+this.listItemImgClassName);
        if (!clientViewHeight) { 
            [...imgsDom].forEach((child) => {
                    // 满足可视区域内才加载对应的图片
                    const temp = new Image();
                    temp.src = child.dataset.img;
                    temp.onload = () => {
                        child.src = temp.src;
                    }
                    temp.onerror = (e) => {
                        // 处理图片加载失败, 切换成加载失败的图片
                    }
            })
            return;
        }

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
                temp.onerror = (e) => {
                    // 处理图片加载失败, 切换成加载失败的图片
                }
            }
        })
    },
    bindEvent(listParentDom, callback) {
        if (listParentDom) {
            listParentDom.addEventListener("click", this.__showNewDetail.bind(this, callback), false);
        }
    },
    /** 点击某个新闻实现跳转 */
    __showNewDetail(callback) {
        let target = arguments[1].target;
        while(target) {
            if (target.className.split(" ")[0] === this.childItemClassName) {
                // 找到点击到新闻列表的项,
                // 新版api可以 直接通过 uniquekey 获取新闻详情
                // callback(uniquekey);
                // 旧api
                const uniquekey= target.dataset.uniquekey;
                const page = target.dataset.page;
                const index = target.dataset.index;
                this.__oldBetaDoing(page, index, uniquekey, callback);
                break;
            }
            target = target.parentNode; // 递归父节点
        }
    },
    __newBetaDoing() {
        // TODO
    },
    __oldBetaDoing(page, index, uniquekey, callback) {
        callback(page, index);
        window.location.href = "./detail.html?from=" + window.location.pathname + "&uniquekey=" + uniquekey;
    }
}