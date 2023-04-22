import ContactUs from "@/src/components/common/ContactUs";
import ContactUsDecor from "@/src/components/common/ContactUsDecor";
import LoginForm from "@/src/components/home/login";

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
