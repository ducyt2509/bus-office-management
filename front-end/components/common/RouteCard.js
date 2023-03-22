import React from "react";

const RouteCard = ({ key, item }) => {
	return (
		<div
			className="popular-route__item"
			index={key}
		>
			<div className="popular-route__item-content">
				<span className="popular-route__item-title">{item?.route || "Hà Nội - Hải Phòng"}</span>
				<p className="popular-route__item-desc">Từ {item?.price || "250.000"} đồng</p>
			</div>
		</div>
	);
};

export default RouteCard;
