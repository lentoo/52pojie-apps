import { View, Text, Image } from "@tarojs/components";
import React, { memo } from "react";
import "./index.scss";

export interface IPlateItem {
  id: string;
  type: string;
  title: string;
  link: string;
  author: string;
  post_date: string;
  commentNum: string;
  viewNum: string;
  hasHot: boolean;
  hasNew: boolean;
  hasRecommend: boolean;
  money: string | number;
  hasResolve: boolean;
}
type PlateItemProps = {
  item: IPlateItem;
  handleItemClick: (item: IPlateItem) => void;
};
function PlateItem(props: PlateItemProps) {
  const { item, handleItemClick } = props;

  return (
    <View className="com-item" onClick={() => handleItemClick(item)}>
      <View className="com-top">
        <View className="com-item-username">{item.author}</View>
        {item.type && (
          <View className="com-item-type">
            {item.money !== -1 && (
              <Text className="money">悬赏 {item.money} CB吾爱币</Text>
            )}
            {item.hasResolve && <Text className="resolve">已解决</Text>}
            {item.type.startsWith("『") ? item.type : ` [${item.type}] `}
          </View>
        )}
      </View>

      <View className="com-item-title">
        <Text>{item.title}</Text>

        {
          // item.hasNew && <Image className='icon-new' src={ICON_NEW} />
        }
      </View>

      <View className="com-bottom">
        <View className="com-item-date">{item.post_date}</View>
        <View className="com-item-commend">
          <Image
            className="com-item-icon com-item-icon-comment"
            lazyLoad
            src='cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/icon-comment.png'
          />
          <Text>{item.commentNum}</Text>
        </View>
        <View className="com-item-views">
          <Image
            className="com-item-icon"
            lazyLoad
            src='cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/icon-views.png' />
          <Text>{item.viewNum}</Text>
        </View>
      </View>
    </View>
  );
}
export default memo(PlateItem)