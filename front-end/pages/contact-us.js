import ContactUs from "@/components/common/ContactUs";
import ContactUsDecor from "@/components/common/ContactUsDecor";
import LoginForm from "../components/home/login";

export default function ContactUsHTML() {
	const ContactUsHTML = <ContactUs />;
	const ContactUsDecorHTML = <ContactUsDecor />;
	const LoginFormHTML = <LoginForm />;
	return (
		<header style={{ backgroundColor: "#000" }}>
			{LoginFormHTML}
			{ContactUsHTML}
			{ContactUsDecorHTML}
		</header>
	);
}
