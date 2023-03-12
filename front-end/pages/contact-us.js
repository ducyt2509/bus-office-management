import ContactUs from '@/components/common/ContactUs';
import ContactUsDecor from '@/components/common/ContactUsDecor';

export default function ContactUsHTML() {
  const ContactUsHTML = <ContactUs />;
  const ContactUsDecorHTML = <ContactUsDecor />;
  return (
    <header style={{backgroundColor: "#000"}}>
      {ContactUsHTML}
      {ContactUsDecorHTML}
    </header>
  );
}
