import React from "react";
import { blogType } from "../../Common/global";

export default function Main(props: {
  visible: boolean;
  showData: Array<blogType>;
}) {
  return (
    <div>
      {props.visible &&
        props.showData.map((item: blogType, _key: number) => {
          return (
            <div key={_key}>
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
