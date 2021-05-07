import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComLoadMore",
    _tpl({ finished }) {
        return templateReplace(tpl, {
            text: finished ? "没有更多的数据了" : "正在加载中..."
        })
    },
    add(listParentDom, finished=false) {
        if (listParentDom) {
            const comLoadMoreDom = listParentDom.querySelector(".com-loadmore");
            // 没有找到才追加
            if (!comLoadMoreDom) {
                listParentDom.innerHTML += this._tpl({ finished });
            }
        }
    },
    remove(listParentDom) {
        if (listParentDom) {
            const comLoadMoreDom = listParentDom.querySelector(".com-loadmore");
            // 自身移除掉
            comLoadMoreDom && comLoadMoreDom.remove();
        }
    },
}