import tpl from "./index.tpl";
import "./index.scss";
import { templateReplace } from "../../utils/utils";

export default {
    name: "ComFollow",
    /** 渲染点赞 */
    iconName: "icon-shoucang",
    tplFollow(options) {
        if (options) {
            const { icon } = options;
            if (icon) {
                this.iconName = icon;
            }
        }

        return templateReplace(tpl, {
            icon: this.iconName,
            followClass: "follow"
        });
    },
    /** 渲染取消点赞 */
    tplUnFollow(options) {
        if (options) {
            const { icon } = options;
            if (icon) {
                this.iconName = icon;
            }
        }
        
        return templateReplace(tpl, {
            icon: this.iconName,
            followClass: "unfollow"
        });
    },
    bindEvent(callback) {
        const ofollow = document.querySelector(".com-follow");
        ofollow.addEventListener("click", this.__setFollow.bind(this, ofollow, callback), false);
    },
    __setFollow(ofollow, callback) {
        const className = ofollow.className;
        // 样式改变
        switch(className) {
            case "com-follow iconfont "+ this.iconName +" follow":
                // 点赞状态 => 取消点赞
                ofollow.className = "com-follow iconfont "+ this.iconName +" unfollow";
                break;
            case "com-follow iconfont "+ this.iconName +" unfollow":
                // 取消点赞状态 => 点赞状态
                ofollow.className = "com-follow iconfont "+ this.iconName +" follow";
                break;
            default:
                break;
        }
        callback();
    }
}