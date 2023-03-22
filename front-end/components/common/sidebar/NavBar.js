import { useRouter } from 'next/router';
import Link from 'next/link';
export default function NavBar(props) {
  const router = useRouter();
  return (
    <div className="bom-navbar" style={router.pathname != '/' ? { borderBottom: "2px solid #d9d9d9" } : {}}>
      <div className="bom-navbar-bom-logo">
        <h1 style={router.pathname != '/' ? { color: '#F26A4C' } : {}}>BOM</h1>
      </div>
      <ul className="bom-navbar-component">
        <li>
          <Link href={'/'}>
            <div style={router.pathname != '/' ? { color: '#F26A4C' } : {}}>Trang chủ</div>
          </Link>
        </li>
        <li>
          <Link href={'/ticket'}>
            <div style={router.pathname != '/' ? { color: '#F26A4C' } : {}}>Tra cứu vé</div>
          </Link>
        </li>
        <li>
          <Link href={'/about-us'}>
            <div style={router.pathname != '/' ? { color: '#F26A4C' } : {}}>Về chúng tôi</div>
          </Link>
        </li>
        <li>
          <Link href={'/contact-us'}>
            <div style={router.pathname != '/' ? { color: '#F26A4C' } : {}}>Liên hệ</div>
          </Link>
        </li>
        <li>
          <div onClick={props.handleShowLoginForm}>Đăng nhập</div>
        </li>
      </ul>
    </div>
  );
}
