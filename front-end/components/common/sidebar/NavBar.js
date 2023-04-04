import { useRouter } from "next/router";
import Link from "next/link";
import { Box } from "@chakra-ui/react";
export default function NavBar(props) {
	const router = useRouter();
	return (
		<div
			className="bom-navbar"
			style={
				router.pathname != "/" && !router.pathname.includes("/contact-us")
					? { borderBottom: "2px solid #d9d9d9" }
					: {}
			}
		>
			<div className="bom-navbar-bom-logo">
				<Link href={"/"}>
					<h1
						style={
							router.pathname != "/" && !router.pathname.includes("/contact-us")
								? { color: "#F26A4C" }
								: {}
						}
					>
						BOM
					</h1>
				</Link>
			</div>
			<ul className="bom-navbar-component">
				<li>
					<Link href={"/ticket"}>
						<div
							style={
								router.pathname != "/" && !router.pathname.includes("/contact-us")
									? { color: "#F26A4C" }
									: {}
							}
						>
							Tra cứu vé
						</div>
					</Link>
				</li>
				<li>
					<Link href={"/about-us"}>
						<div
							style={
								router.pathname != "/" && !router.pathname.includes("/contact-us")
									? { color: "#F26A4C" }
									: {}
							}
						>
							Về chúng tôi
						</div>
					</Link>
				</li>
				<li>
					<Link href={"/contact-us"}>
						<div
							style={
								router.pathname != "/" && !router.pathname.includes("/contact-us")
									? { color: "#F26A4C" }
									: {}
							}
						>
							Liên hệ
						</div>
					</Link>
				</li>
				<li>
					<Box
						backgroundColor={"#F26A4C"}
						borderRadius={"md"}
						onClick={props.handleShowLoginForm}
					>
						Đăng nhập
					</Box>
				</li>
			</ul>
		</div>
	);
}
