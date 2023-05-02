import LoginForm from "@/src/components/home/login";
import { Box, Image, Button, Text } from "@chakra-ui/react";

export default function ContactUsHTML() {
	const utilityList = [
		{
			title: "Free Wifi",
			src: "https://xenamquynhanh.vn/wp-content/uploads/2021/12/71022731_124052662303249_2298149198073167872_n.jpg",
			description:
				"Tất cả các xe của BOM đều được trang bị wifi miễn phí tốc độ cao. Bạn có thể thư giãn bằng cách lướt web, mạng xã hội, kiểm tra email hoặc chat chit với bạn bè",
		},
		{
			title: "Cổng sạc điện thoại",
			src: "https://xenamquynhanh.vn/wp-content/uploads/2021/12/69601453_121772245864624_7430509128222507008_n.jpg",
			description:
				"Chúng tôi hiểu rằng hành trình của những hành khách hiện đại ngày nay không thể thiếu điện thoại thông minh. Hãy an tâm vì trên xe luôn có cổng sạc điện thoại ở vị trí thuận tiện nhất cho bạn.",
		},
		{
			title: "TV LED chất lượng cao",
			src: "https://xenamquynhanh.vn/wp-content/uploads/2022/01/270571517_699768968064946_2666577476690758782_n.png",
			description:
				"Để giúp khách hàng bớt nhàm chán khi trải nghiệm trên những chuyến xe đường dài, hiện các dòng xe giường nằm của BOM đều được trang bị TV LED ở mỗi phòng trên xe.",
		},
		{
			title: "Phòng riêng tư",
			src: "https://xenamquynhanh.vn/wp-content/uploads/2021/04/z2413227293972_889108b60e55a1fea58382140fa088a9.jpg",
			description:
				"Mỗi giường trên những xe do BOM cung cấp đều được ngăn cách bởi rèm tạo thành những phòng riêng tạm thời cho hành khách. Với không gian riêng thoải mái, đảm bảo sự riêng tư giúp cho hành trình của bạn thêm trọn vẹn.",
		},
	];
	const advantageList = [
		{
			title: "Hỗ trợ tận tình",
			src: "https://xenamquynhanh.vn/wp-content/uploads/2022/01/support.png",
			description: "Luôn tận tình hỗ trợ khách hàng 24/24",
		},
		{
			title: "Tiện ích hiện đại",
			src: "https://xenamquynhanh.vn/wp-content/uploads/2022/01/transportation.png",
			description: "Hệ thống xe giường nằm được trang bị tiện ích cao cấp hiện đại",
		},
		{
			title: "Nhân viên tận tâm",
			src: "https://xenamquynhanh.vn/wp-content/uploads/2022/01/health.png",
			description: "Được đào tạo bàn bản, phục vụ chuyên nghiệp, tận tâm và lịch sự",
		},
		{
			title: "Đặt vé tiện lợi",
			src: "https://xenamquynhanh.vn/wp-content/uploads/2022/01/payment.png",
			description: "Đặt vé online tiện lợi, đa dạng phương thức thanh toán",
		},
	];
	const LoginFormHTML = <LoginForm />;
	return (
		<div>
			{/* Navbar */}
			<header>{LoginFormHTML}</header>
			{/* Header */}
			<Box
				fontSize={"3xl"}
				fontWeight={"bold"}
				textAlign={"center"}
				marginY={"7"}
				marginX={["5", "10"]}
			>
				<Text>Dùng chữ "Tâm" để phục vụ - Dùng chữ "Tín" để phát triển</Text>
			</Box>
			{/* Main */}
			<Box marginX={["5", "10"]}>
				{/* Bref description */}
				<Box
					display={"flex"}
					flexWrap={["wrap", "wrap", "nowrap"]}
					marginBottom={"70px"}
				>
					<Box
						marginRight={[0, 0, 10]}
						marginBottom={["5"]}
					>
						<Text
							fontSize={"2xl"}
							fontWeight={"semibold"}
							color={"#F26A4C"}
						>
							Công ty vận tải hành khách BOM
						</Text>
						<Text>
							Thành lập từ năm 2019 cho đến nay, với hơn 4 năm kinh nghiệm trong lĩnh vực vận
							tải, công ty vận tải hành khách BOM đã phục vụ hơn hàng ngàn tuyến xe trên khu
							vực miền Bắc với mục tiêu chính ở các tỉnh thành Hà Nội, Nam Định, Quảng Ninh,
							Hưng Yên và Nghệ An.
						</Text>
						<Text>
							Luôn lấy sự hài lòng của khách hàng là thước đo cho sự phát triển của doanh
							nghiệp, công ty vận tải hành khách BOM không ngừng cải tiến chất lượng dịch vụ
							để cung cấp cho khách hàng những tiện ích tốt nhất.
						</Text>
					</Box>
					<Image
						src="https://phongnhalocals.com/wp-content/uploads/2020/09/Bus-Phong-Nha-To-Ha-Noi-Phong-Nha-Locals-Travel.jpg"
						alt="BOM passenger-carrier"
						width={["auto", "auto", "300px", "500px"]}
						height={"auto"}
					/>
				</Box>
				{/* Utilities */}
				<Box marginBottom={"50px"}>
					<Box>
						{/* Utility title */}
						<Text
							textAlign={"center"}
							fontSize={"2xl"}
							fontWeight={"bold"}
							marginBottom={"5"}
						>
							Tiện ích nhà xe
						</Text>
						{/* Utility list */}
						<Box
							display={"flex"}
							flexWrap={"wrap"}
						>
							{utilityList.map((utility, index) => (
								<Box
									key={index}
									marginBottom={"5"}
									display={"flex"}
									flexDirection={"column"}
									alignItems={"center"}
									width={["100%", "100%", "50%", "25%"]}
									paddingX={["0", "0", "10px"]}
								>
									<Image
										src={utility.src}
										alt="wifi utility"
										width={"auto"}
										height={"183px"}
										marginBottom={"3"}
									/>
									<Box>
										<Text
											fontSize={"xl"}
											fontWeight={"bold"}
										>
											{utility.title}
										</Text>
									</Box>
									<Text>{utility.description}</Text>
								</Box>
							))}
						</Box>
					</Box>
				</Box>
				{/* Advantages */}
				<Box marginBottom={"35px"}>
					{/* Advantage title */}
					<Text
						textAlign={"center"}
						fontSize={"2xl"}
						fontWeight={"bold"}
						marginBottom={"5"}
					>
						BOM cam kết
					</Text>
					{/* Advantages list */}
					<Box
						display={"flex"}
						flexWrap={"wrap"}
					>
						{advantageList.map((advantage, index) => (
							<Box
								key={index}
								marginBottom={"5"}
								display={"flex"}
								flexDirection={"column"}
								alignItems={"center"}
								width={["50%", "50%", "25%"]}
								paddingX={"10px"}
							>
								<Image
									src={advantage.src}
									alt="wifi utility"
									width={"80px"}
									height={"80px"}
									marginBottom={"1"}
								/>
								<Text
									fontSize={"lg"}
									fontWeight={"semibold"}
								>
									{advantage.title}
								</Text>
								<Text textAlign={"center"}>{advantage.description}</Text>
							</Box>
						))}
					</Box>
				</Box>
				{/* Contact information */}
				<Box>
					<Box
						marginBottom={"50px"}
						marginX={["0", "0", "0", "100px"]}
						display={"flex"}
						alignItems={"center"}
						flexDirection={["column", "column", "row"]}
						justifyContent={"space-between"}
					>
						<Box marginRight={["0", "0", "100px"]}>
							<Text
								fontSize={["2xl", "2xl", "3xl"]}
								fontWeight={"bold"}
								color={"#F26A4C"}
								marginBottom={"10px"}
								textAlign={["center", "center", "left"]}
							>
								Tổng đài đặt vé
							</Text>
							<Text
								marginBottom={"10px"}
								textAlign={["center", "center", "left"]}
							>
								Nếu bạn cần tư vấn hay đặt chỗ, chúng tôi luôn có mặt để hỗ trợ
							</Text>
							<Box
								marginBottom={"10px"}
								display={"flex"}
								flexDirection={"column"}
								textAlign={"center"}
							>
								<Box
									backgroundColor={"#F26A4C"}
									width={"100%"}
									height={"2px"}
								></Box>
								<Text
									fontSize={"4xl"}
									fontWeight={"bold"}
								>
									0945 555 266
								</Text>
								<Box
									backgroundColor={"#F26A4C"}
									width={"100%"}
									height={"2px"}
								></Box>
							</Box>
						</Box>
						<Box
							display={"flex"}
							justifyContent={"center"}
						>
							<Image
								src="https://xenamquynhanh.vn/wp-content/uploads/elementor/thumbs/image-49-p9c0jh1xqxlrs1099iyjhwjfy0etg4ydh13d0limcu.png"
								alt="Customer Service Staff"
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</div>
	);
}
