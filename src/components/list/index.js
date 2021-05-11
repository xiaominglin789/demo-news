import tpl from "./tpl/index.tpl";
import item0Tpl from "./tpl/item_0.tpl";
import item1Tpl from "./tpl/item_1.tpl";
import item2Tpl from "./tpl/item_2.tpl";
import item3Tpl from "./tpl/item_3.tpl";
import { templateReplace, getClientViewHeight, getScrollTop } from "../../utils/utils";
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
                defualtImgSrc: '../../../assets/img/default.gif',
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
    imageLazyLoad(clientViewHeight) {
        if (!clientViewHeight) { 
            // 没传入,重新取可视高度
            clientViewHeight = getClientViewHeight();
        }

        const imgsDom = document.querySelectorAll("."+this.listItemImgClassName);
        let tempChild; // 临时变量
        let flagCount = 0; // 计数器
        for (let i=flagCount; i < imgsDom.length; i++) {
            tempChild = imgsDom[i];
            // 图片的距离顶部高度 小于 当前可视区的滚动距离 表示在可视区内
            if (tempChild.offsetTop < (clientViewHeight + getScrollTop())) {
                if (tempChild.getAttribute("data-img")) {
                    tempChild.src = tempChild.getAttribute("data-img");
                    // 移除 data-img 属性
                    tempChild.removeAttribute("data-img");
                    flagCount++;
                }
            }
        }
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