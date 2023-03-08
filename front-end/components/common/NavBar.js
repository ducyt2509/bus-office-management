import { useRouter } from "next/router";
export default function NavBar(props) {
	const router = useRouter();
	const handleRouterContactUs = () => {
		router.push("/contact");
	};
	return (
		<div className="bom-navbar">
			<div className="bom-navbar-bom-logo">
				<h1>BOM</h1>
			</div>
			<ul className="bom-navbar-component">
				<li>
					<div>Trang chủ</div>
				</li>
				<li>
					<div>Tra cứu vé</div>
				</li>
				<li>
					<div>Về chúng tôi</div>
				</li>
				<li>
					<div onClick={handleRouterContactUs}>Liên hệ</div>
				</li>
				<li>
					<div onClick={props.handleShowLoginForm}>Đăng nhập</div>
				</li>
			</ul>
		</div>
	);
}
