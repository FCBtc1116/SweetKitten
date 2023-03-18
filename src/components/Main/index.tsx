import React from "react";
import { BlogType } from "../../common/global";

export default function Main(props: {
  visible: boolean;
  blogDatas: BlogType[];
}) {
  return (
    <div>
      {props.visible &&
        props.blogDatas.map((item: BlogType, _key: number) => {
          return (
            <div key={item.title}>
              <label style={{ marginRight: "20px" }}>{item.title}</label>
              <label>
                <b>{item.user}</b>
              </label>
            </div>
          );
        })}
    </div>
  );
}
