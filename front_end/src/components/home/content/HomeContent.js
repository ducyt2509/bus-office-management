import { Box, Text } from "@chakra-ui/react";

export default function HomeContent() {
	return (
		<div className="home-content">
			<h3 className="home-title">BOM - Chất lượng là danh dự</h3>
			<Box
				className="home-desc"
				ml={10}
			>
				<Text>Dùng chữ “Tâm” để phục vụ </Text>
				<Text mt={3}>Lấy chữ “Tín” để phát triển</Text>
			</Box>
		</div>
	);
}
