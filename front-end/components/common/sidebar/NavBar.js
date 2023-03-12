import { useRouter } from 'next/router';
import Link from 'next/link';
export default function NavBar(props) {
  const router = useRouter();
  return (
    <div className="bom-navbar">
      <div className="bom-navbar-bom-logo">
        <h1>BOM</h1>
      </div>
      <ul className="bom-navbar-component">
        <li>
          <Link href={'/'}>
            <div>Trang chủ</div>
          </Link>
        </li>
        <li>
          <Link href={'/ticket'}>
            <div>Tra cứu vé</div>
          </Link>
        </li>
        <li>
          <Link href={'/about-us'}>
            <div>Về chúng tôi</div>
          </Link>
        </li>
        <li>
          <Link href={'/contact-us'}>
            <div>Liên hệ</div>
          </Link>
        </li>
        <li>
          <Link href={''}>
            <div onClick={props.handleShowLoginForm}>Đăng nhập</div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
