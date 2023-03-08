export default function NavBar(props) {
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
          <div>Liên hệ</div>
        </li>
        <li>
          <div onClick={props.handleShowLoginForm}>Đăng nhập</div>
        </li>
      </ul>
    </div>
  );
}
