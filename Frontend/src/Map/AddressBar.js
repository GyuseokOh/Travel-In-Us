import React from "react";
const AddressBar = ({ onAddressChange, address, onClick }) => {
  return (
    <div className={"AddressBar"}>
      <input
        style={{display:'inline', width:'90%', textAlign:'center'}}
        className={"AddressBar__input"}
        onChange={onAddressChange}
        value={address}
        placeholder={"검색어나 주소를 입력하세요 ex)아주대학교"}
      />
      <button onClick={onClick} style={{display:'inline',width:'10%'}}>검색</button>
    </div>
  );
};

export default AddressBar;